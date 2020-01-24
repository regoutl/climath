import IntermittentProductionMean from './intermittentproductionmean.js';
import * as Yearly from "../timevarin.js";


export default class Wind extends IntermittentProductionMean{
  constructor(parameters, simu) {
    super(parameters, 'wind');

    this.simu = simu;

    this.efficiency = new Yearly.Raw(0);
    this.efficiency.fromJSON(parameters.efficiency);

    // this.build.energy = new Yearly.Raw(0);
    // this.build.energy.fromJSON(parameters.build.energy);
  }

  happyNYEve(yStats){
    //compute fixed o & M
    yStats.cost.perYear.wind +=
          this.capacity * this.perYear.cost.at(yStats.year); // wind
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
  prepareCapex(buildInfo, countries){
    buildInfo.build.end = this.build.delay + buildInfo.build.begin;

    if(buildInfo.input.height === undefined){
        buildInfo.input.height = 50;
        console.log('set default height');
    }

    let a = this.simu.cMap.reduceIf(['area', 'windPower50'],
                                    {center: buildInfo.input.curPos, radius: buildInfo.input.radius},
                                    ['buildable']);
    let area = a[0];
    let windPower = a[1];
    let windPowerDensity = windPower / area;
    if(area == 0)
        windPowerDensity = 0;

    //src : https://en.wikipedia.org/wiki/Belwind (offshore, @95m  :/)
    const maxWindTurbinePerSquareMeter = 4.23e-6; //todo : check for onshore

    const rotorRadius = 45.0;

    let count = area * maxWindTurbinePerSquareMeter;

    let section = count * rotorRadius * rotorRadius * 3.14; //m2

    let initNameplate
        = section * windPowerDensity
          * this.efficiency.at(buildInfo.build.begin);
    buildInfo.nameplate = new Yearly.Raw(initNameplate);
    buildInfo.nameplate.unit = 'N';


    buildInfo.build.co2 = 0; // C / Wh
    buildInfo.build.cost  = initNameplate * // W
        this.build.cost.at(buildInfo.build.begin);  // eur/W

    buildInfo.pm = this;

    buildInfo.perYear = {cost: this.perYear.cost.at(buildInfo.build.end) * initNameplate, co2: 0};
    buildInfo.perWh = {cost: 0, co2: 0};
    buildInfo.avgCapacityFactor = 0.229; //todo : do a real computation ?
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.type != 'wind')
      throw 'wind.capex; build.type != wind';

    let nameplate = build.nameplate.at(build.build.end);

    this.capacity += nameplate;
  }


}
