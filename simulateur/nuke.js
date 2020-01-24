import RegularProductionMean from './regularproductionmean.js';
import * as Yearly from "../timevarin.js";
import HydroComponent from './hydrocomponent.js';


const nuclearDisasterRadius = 50/*pix*/;

/// in fact extends AbstractProductionMean. but much simplified
export default class Nuke extends RegularProductionMean{
  constructor(parameters, simu){
    super(parameters, 'nuke');


    // if(hydroComponent === undefined || ! hydroComponent instanceof HydroComponent)
    //   throw "need one ";

    this.simu = simu;

    //add the 'existing centrals'
    // => we dont have hydro data about it => mark it as 'under sea level'
    // -> will be ignored in all hydro computation but still produces
    this.simu.cHydro.addCentral(254,
                                this.capacity * this._capacityFactor,
                                0);
  }


  produce(energyOut, out){
    super.produce(energyOut, out);

    this._periodMaxWh -= energyOut;
  }
  capacityAt(t){
    if(t % (24*5) == 0){
      // compute capa
        this._periodMaxWh = this.simu.cHydro.getNukeCapaLimitForPeriod(t / (24*5));
    }

    return  Math.min(this._periodMaxWh, super.capacityAt(t));
  }

  prepareCapex(buildInfo, countries){
    buildInfo.build.end = this.build.delay + buildInfo.build.begin;

    let nameplate;
    //check for parameters
    if(buildInfo.input.nameplate === undefined)
//      throw 'must define a nameplate';
        nameplate = 3e9;

    buildInfo.nameplate = new Yearly.Raw(nameplate);
    buildInfo.nameplate.unit = 'N';

    buildInfo.build.co2 = nameplate // m2
        * this.build.co2.at(buildInfo.build.begin);

    buildInfo.build.cost  = nameplate * // w
        this.build.cost.at(buildInfo.build.begin);  // eur/w


    buildInfo.pm = this;

    buildInfo.perYear = {cost: this.perYear.cost.at(buildInfo.build.end) * nameplate, co2: 0};
    buildInfo.perWh = {
      cost: this.perWh.cost.at(buildInfo.build.end),
      co2:  this.perWh.co2.at(buildInfo.build.end)};
    buildInfo.avgCapacityFactor = this._capacityFactor;

    buildInfo.primEnergyEffi = this.primEnergyEffi;



    //cooling rate
    const waterVapoNrg = 2250; // J / g
    const waterTCapa = 4185; // J/ kg / K
    const waterInitTemp = 20;
    const jToVapM3 = (100 - waterInitTemp) * 1000 *waterTCapa + waterVapoNrg * 1000000;
    // let whToVapM3 = jToVapM3 / 3600;//wh/m3

    const primEnergyPerProduced = 1 / buildInfo.primEnergyEffi;
    const heatPerEnProduced = primEnergyPerProduced * (1 - buildInfo.primEnergyEffi); //

    buildInfo._m3PerJ = heatPerEnProduced / jToVapM3;
    buildInfo.coolingWaterRate = nameplate * buildInfo.avgCapacityFactor * buildInfo._m3PerJ;


    buildInfo.pop_affected = this.simu.cMap.reduceIf(['population'],
                                                    {center: buildInfo.input.curPos, radius: nuclearDisasterRadius});

    if(buildInfo.input.curPos !== undefined)    {
        let pool = this.simu.cMap.poolIndexAt(buildInfo.input.curPos);

        if(pool == null){
            buildInfo.theorical = true;
        }
        else{
            buildInfo._poolIndex = pool;
            buildInfo.river = this.simu.cHydro.poolName(pool);
        }

        if(!this.simu.cMap.isInCountry(buildInfo.input.curPos.x, buildInfo.input.curPos.y))
            buildInfo.theorical = true;
    }
  }

  //note : must be called when simu.year = buildInfo.build.end
  capex(buildInfo){
      if(buildInfo.type != 'nuke')
        throw 'Nuke.capex; build.type != nuke';

      let nameplate = buildInfo.nameplate.at(buildInfo.build.end);

      this.capacity += nameplate;
      this.simu.cHydro.addCentral(buildInfo._poolIndex,
                                  nameplate * this._capacityFactor,
                                  buildInfo._m3PerJ);

  }

}
