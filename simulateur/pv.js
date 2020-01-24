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
    build.build.end = this.build.delay + build.build.begin;



    let a = this.simu.cMap.reduceIf(['area', 'radiantFlux'],
                                    {center: build.input.curPos, radius: build.input.radius},
                                    ['buildable']);
    let area = a[0];
    build.area = area;
    let radiantFlux  = a[1];

    if(build.input.effiMul === undefined)
      build.input.effiMul = 1;
    if(build.input.madeIn === undefined)
      build.input.madeIn = 'china';
    if(build.input.installedIn === undefined)
      build.input.installedIn = 'belgium';
    if(build.input.powerDecline === undefined)
      build.input.powerDecline = 1;
    if(build.input.priceMul === undefined)
      build.input.priceMul = 1;


    let initNameplate
        = radiantFlux
          * this.efficiency.at(build.build.begin)
          * build.input.effiMul;
    build.nameplate = new Yearly.Expo(build.build.end,
                                    initNameplate,
                                    build.input.powerDecline);
    build.nameplate.unit = 'N';


    build.build.co2 = area // m2
        * this.build.energy.at(build.build.begin)  // wH / m2
        * countries[build.input.madeIn].elecFootprint.at(build.build.begin); // C / Wh
    build.build.cost  = area * build.input.priceMul * // m2
        this.build.cost.at(build.build.begin);  // eur/m2

    build.pm = this;

    build.perYear = {cost: this.perYear.cost.at(build.build.end) * area, co2: 0};
    build.perWh = {cost: 0, co2: 0};
    build.avgCapacityFactor = 0.12; //todo : do a real computation ?
  }

  //note : must be called when simu.year = cmd.build.end
  capex(buildInfo){
    if(buildInfo.type != 'pv')
      throw 'PV.capex; buildInfo.type != pv';

    this.area += buildInfo.area;

    let nameplate = buildInfo.nameplate.at(buildInfo.build.end);

    this.capacity += nameplate;

  	let powerDecline = buildInfo.nameplate.rate;

  	if(!this.groups.has(powerDecline))
  		this.groups.set(powerDecline, nameplate);
  	else
  		this.groups.set(powerDecline,
                      this.groups.get(powerDecline) + nameplate);
  }


}
