import IntermittentProductionMean from './intermittentproductionmean.js';
import * as Yearly from "../timevarin.js";
import BuildInfo from './buildinfo.js';


export default class Wind extends IntermittentProductionMean{
    constructor(parameters, capaFact, simu) {
        super(parameters, capaFact, 'wind');

        this.simu = simu;

        this.efficiency = new Yearly.Raw(0);
        this.efficiency.fromJSON(parameters.efficiency);

        this.density =new Yearly.Raw( parameters.density);

        // this._build.energy = new Yearly.Raw(0);
        // this._build.energy.fromJSON(parameters.build.energy);

        //capex to add next year
        this.nowBuilding = 0;
    }

    happyNYEve(yStats){
        //compute fixed o & M
        yStats.cost.perYear.wind +=
            this.capacity * this.perYear.cost.at(yStats.year); // wind

        //add constructions (bc 1 year)
        this.capacity += this.nowBuilding;
        this.nowBuilding = 0;
    }

    /** @brief compute info associated with the build.  Build is NOT executed.
    @param parameters {
        year : build begin year,
    }.
    @param zone.  a valid map area (see mapcomponent)
    @return  info as defined in Simulateur.buildInfo.  BUT theorical is never set

    @important parameters is modified
    */
    buildInfo(parameters, zone){
        if(parameters.height === undefined){
            parameters.height = 50;
        }

        parameters.extraSumDemolish = 'windPower50';

        let [area, windPower] = this.simu.cMap.reduceIf(
                                        ['area', 'windPower50'],
                                        zone,
                                        ['buildable']);

        return this._buildInfo(parameters, area, windPower);
    }

  //same spec as pv._prepareCapex
  _buildInfo(parameters, area, windPower){
      let info = new BuildInfo(parameters);

      info.build.end = this.endOfBuild(info);

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
      info.build.cost  =  this._buildCost(parameters, area);


      info.perYear.cost = this.perYear.cost.at(info.build.end) * initNameplate;
      info.avgCapacityFactor = 0.229; //todo : do a real computation ?

      return info;
  }

    _buildCost(parameters, area){
        const maxWindTurbinePerSquareMeter = this.density.at(parameters.year); //todo : check for onshore

        let count = area * maxWindTurbinePerSquareMeter;

        return count * // item
            this._build.cost.at(parameters.year);  // eur/item
    }

    build(buildInfo){
        if(buildInfo.type != 'wind')
            throw 'wind.capex; build.info.type != wind';

        let nameplate = buildInfo.nameplate.at(buildInfo.build.end);

        this.nowBuilding += nameplate;
    }

    /** @brief return the cost of demolition. Dont apply the demoliton*/
    demolishCost(parameters, area){
        return this._buildCost(parameters, area) * this.demolishRatio;
    }

    /** same as pv.demolish BUT demolish.reductions.extra is 'the wind power'
    */
    demolish(demolishYear, parameters, area, windPowerDensity){
        //get all the build informations
        let buildInfo = this._buildInfo(parameters, area, windPowerDensity);

        //get the current nameplate :
        let nameplate = buildInfo.nameplate.at(demolishYear);

        //not build yet -> this a job for the scheduled build queue
        if(buildInfo.build.end > demolishYear){
            this.nowBuilding -= nameplate;
            if(this.nowBuilding < 0)
                throw 'check failed';
        }
        else{
            //diminish the area
            this.capacity -= nameplate;
            if(this.capacity < 0)
                throw 'check failed';
        }


    }

}
