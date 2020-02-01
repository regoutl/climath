import IntermittentProductionMean from './intermittentproductionmean.js';
import * as Yearly from "../timevarin.js";


export default class Wind extends IntermittentProductionMean{
  constructor(parameters, simu) {
    super(parameters, 'wind');

    this.simu = simu;

    this.efficiency = new Yearly.Raw(0);
    this.efficiency.fromJSON(parameters.efficiency);

    this.density =new Yearly.Raw( parameters.density);

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

  @warning do not directly modify build.info in this function (leave it to _prepareCapex)
**/
  prepareCapex(build){
    build.pm = this;

    let parameters = build.parameters;

    if(parameters.height === undefined){
        parameters.height = 50;
        // console.log('set default height');
    }

    parameters.extraSumDemolish = 'windPower50';

    let a = this.simu.cMap.reduceIf(['area', 'windPower50'], build.area,
                                    ['buildable']);
    let area = a[0];
    let windPower = a[1];

    this._prepareCapex(build, area, windPower);

  }

  //same spec as pv._prepareCapex
  _prepareCapex(build, area, windPower){
      const parameters = build.parameters; //leave this const alone !
      let info = build.info;
      info.area = area;

      info.build.end = this.endOfBuild(build);

      let windPowerDensity = windPower / area;
      if(area == 0)
          windPowerDensity = 0;

      //src : https://en.wikipedia.org/wiki/Belwind (offshore, @95m  :/)
      const maxWindTurbinePerSquareMeter = this.density.at(info.build.begin); //todo : check for onshore

      const rotorRadius = 45.0;

      let count = area * maxWindTurbinePerSquareMeter;

      let section = count * rotorRadius * rotorRadius * 3.14; //m2

      let initNameplate
          = section * windPowerDensity
            * this.efficiency.at(info.build.begin);
      info.nameplate = new Yearly.Raw(initNameplate);
      info.nameplate.unit = 'N';


      info.build.co2 = 0; // C / Wh
      info.build.cost  = count * // item
          this.build.cost.at(info.build.begin);  // eur/item


      info.perYear = {cost: this.perYear.cost.at(info.build.end) * initNameplate, co2: 0};
      info.perWh = {cost: 0, co2: 0};
      info.avgCapacityFactor = 0.229; //todo : do a real computation ?
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.info.type != 'wind')
      throw 'wind.capex; build.info.type != wind';

    let nameplate = build.info.nameplate.at(build.info.build.end);

    this.capacity += nameplate;

  }

  costOfDemolish(demolish){
      //get all the build informations
      this._prepareCapex(demolish, demolish.reductions.area, demolish.reductions.extra);

      return demolish.info.build.cost * this.demolishRatio;
  }

  /** same as pv.demolish BUT demolish.reductions.extra is 'the wind power'
  */
  demolish(demolish){
      //get all the build informations
      this._prepareCapex(demolish, demolish.reductions.area, demolish.reductions.extra);

      //not build yet -> this a job for the scheduled build queue
      /** reflexion : as (pv, wind, storage) are build in a year,
      why not pre-remove the surface, and let the scheduled build happend normally ?

      To investigate
      */
      if(demolish.info.build.end < demolish.year)
          return 0;

      //get the current nameplate :
      let nameplate = demolish.info.nameplate.at(demolish.year);

      //diminish the area
      this.capacity -= nameplate;


      return demolish.info.build.cost * this.demolishRatio;
  }

}
