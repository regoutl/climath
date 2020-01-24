import IntermittentProductionMean from './intermittentproductionmean.js';
import * as Yearly from "../timevarin.js";


export default class Pv extends IntermittentProductionMean{
  constructor(parameters, simu) {
    super(parameters, 'pv');

    this.simu = simu;

    /// store pv with same stat. only used for yearly capacity update
    /// store, for each (powerDeclinePerYears) the installed capacity
    this.groups= new Map();
    this.area= parameters.init.area; ///m2 installed. usefull for o&m compute

    this.efficiency = new Yearly.Raw(0);
    this.efficiency.fromJSON(parameters.efficiency);

    this.build.energy = new Yearly.Raw(0);
    this.build.energy.fromJSON(parameters.build.energy);

    /// initial capacity is not null, create groups that match its spec
    this.groups.set(Math.pow(parameters.init.powerDecline25Years, 1/25.0),
                    this.capacity);
  }

  happyNYEve(yStats){
    //do power decline
    this.capacity = 0;

    this.groups.forEach( (value, key, map) => {
      value *= key;
      map.set(key, value);
      this.capacity += value;
    });


    //compute fixed o & M
    yStats.cost.perYear.pv +=
          this.area * this.perYear.cost.at(yStats.year); // pv
  }

/**
  * 		@param what.area : R. m^2 . required.
  *      @param what.effiMul : [0-1], default val = 1
  *      @param what.madeIn : {china, usa} , default val = china
  *      @param what.powerDecline : [0, 1] , power decline per year.
  * 						nextYearCapa = thisYearCapa * powerDecline.
  * 						default val = 1.
  *      @param what.priceMul : R, coef of price for installation.
  * 						default val = 1
  * @todo:		@param what.seller : {sunPower ,Panasonic, JinkoSolar}. set above params (see parameters.json)
**/
  prepareCapex(build, countries){
    build.pm = this;


    let parameters = build.parameters;
    let info = build.info;
    info.build.end = this.build.delay + info.build.begin;



    let a = this.simu.cMap.reduceIf(['area', 'radiantFlux'], build.area, ['buildable']);
    let area = a[0];
    info.area = area;
    let radiantFlux  = a[1];

    if(parameters.effiMul === undefined)
      parameters.effiMul = 1;
    if(parameters.madeIn === undefined)
      parameters.madeIn = 'china';
    if(parameters.installedIn === undefined)
      parameters.installedIn = 'belgium';
    if(parameters.powerDecline === undefined)
      parameters.powerDecline = 1;
    if(parameters.priceMul === undefined)
      parameters.priceMul = 1;


    let initNameplate
        = radiantFlux
          * this.efficiency.at(info.build.begin)
          * parameters.effiMul;
    info.nameplate = new Yearly.Expo(info.build.end,
                                    initNameplate,
                                    parameters.powerDecline);
    info.nameplate.unit = 'N';


    info.build.co2 = area // m2
        * this.build.energy.at(info.build.begin)  // wH / m2
        * countries[parameters.madeIn].elecFootprint.at(info.build.begin); // C / Wh
    info.build.cost  = area * parameters.priceMul * // m2
        this.build.cost.at(info.build.begin);  // eur/m2


    info.perYear = {cost: this.perYear.cost.at(info.build.end) * area, co2: 0};
    info.perWh = {cost: 0, co2: 0};
    info.avgCapacityFactor = 0.12; //todo : do a real computation ?
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.info.type != 'pv')
      throw 'PV.capex; build.Info.type != pv';

    this.area += build.info.area;

    let nameplate = build.info.nameplate.at(build.info.build.end);

    this.capacity += nameplate;

  	let powerDecline = build.info.nameplate.rate;

  	if(!this.groups.has(powerDecline))
  		this.groups.set(powerDecline, nameplate);
  	else
  		this.groups.set(powerDecline,
                      this.groups.get(powerDecline) + nameplate);
  }


}
