import IntermittentProductionMean from './intermittentproductionmean.js';
import * as Yearly from "../timevarin.js";


export default class Pv extends IntermittentProductionMean{
  constructor(parameters) {
    super(parameters, 'pv');

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

  happyNY(year, simulateur, output){
    //do power decline
    this.capacity = 0;

    this.groups.forEach( (value, key, map) => {
      value *= key;
      map.set(key, value);
      this.capacity += value;
    });


    //compute fixed o & M
    output.cost += this.area * this.fixedOnM.at(year); // pv
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
  prepareCapex(what, beginBuildYear, countries){
    let ans = {};
    ans.type = 'pv';
    ans.build = {};
    ans.build.begin = beginBuildYear;
    ans.build.end = this.build.delay + beginBuildYear;

    //check for parameters
    if(what.area === undefined)
      throw 'must define an area';

    if(what.effiMul === undefined)
      what.effiMul = 1;
    if(what.madeIn === undefined)
      what.madeIn = 'china';
    if(what.installedIn === undefined)
      what.installedIn = 'belgium';
    if(what.powerDecline === undefined)
      what.powerDecline = 1;
    if(what.priceMul === undefined)
      what.priceMul = 1;

    let initNameplate
        = what.area
          * this.efficiency.at(ans.build.begin)
          * countries[what.installedIn].irradiance
          * what.effiMul;
    ans.nameplate = new Yearly.Expo(ans.build.end,
                                    initNameplate,
                                    what.powerDecline);
    ans.nameplate.unit = 'N';


    ans.area = what.area;


    ans.build.co2 = what.area // m2
        * this.build.energy.at(ans.build.begin)  // wH / m2
        * countries[what.madeIn].elecFootprint.at(ans.build.begin); // C / Wh
    ans.build.cost  = what.area * what.priceMul * // m2
        this.build.cost.at(ans.build.begin);  // eur/m2

    ans.pm = this;

    ans.perYear = {cost: this.fixedOnM.at(ans.build.end) * what.area, co2: 0};
    ans.perWh = {cost: 0, co2: 0};
    ans.avgCapacityFactor = 0.12; //todo : do a real computation ?

    return ans;
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.type != 'pv')
      throw 'PV.capex; build.type != pv';

    this.area += build.area;

    let nameplate = build.nameplate.at(build.build.end);

    this.capacity += nameplate;

  	let powerDecline = build.nameplate.rate;

  	if(!this.groups.has(powerDecline))
  		this.groups.set(powerDecline, nameplate);
  	else
  		this.groups.set(powerDecline,
                      this.groups.get(powerDecline) + nameplate);
  }


}
