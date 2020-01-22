import RegularProductionMean from './regularproductionmean.js';
import * as Yearly from "../timevarin.js";
import HydroComponent from './hydrocomponent.js';


/// in fact extends AbstractProductionMean. but much simplified
export default class Nuke extends RegularProductionMean{
  constructor(parameters, hydroComponent){
    super(parameters, 'nuke');


    this.primEnergyEffi = parameters.primEnEfficiency;

    if(hydroComponent === undefined || ! hydroComponent instanceof HydroComponent)
      throw "need one ";

    this.cHydro = hydroComponent;

    //add the 'existing centrals'
    // => we dont have hydro data about it => mark it as 'under sea level'
    // -> will be ignored in all hydro computation but still produces
    this.cHydro.flowsIndependentCapacity += this._capacityFactor * this.capacity;
  }


  produce(energyOut, out){
    super.produce(energyOut, out);

    this._todayMaxWh -= energyOut;
  }
  capacityAt(t){
    if(t % 24 == 0){
      // compute capa
      this._todayMaxWh = this.cHydro.getNukeCapaLimitForDay(t / 24);
     // this._todayMaxWh = Infinity;
    }

    return  Math.min(this._todayMaxWh, super.capacityAt(t));
  }

  prepareCapex(what, countries){
    let ans = what;
    ans.build.end = this.build.delay + ans.build.begin;

    //check for parameters
    if(what.nameplate === undefined)
      throw 'must define a nameplate';

    let nameplate = what.nameplate;
    ans.nameplate = new Yearly.Raw(what.nameplate);
    ans.nameplate.unit = 'N';

    ans.build.co2 = nameplate // m2
        * this.build.co2.at(ans.build.begin);

    ans.build.cost  = nameplate * // w
        this.build.cost.at(ans.build.begin);  // eur/w


    ans.pm = this;

    ans.perYear = {cost: this.perYear.cost.at(ans.build.end) * nameplate, co2: 0};
    ans.perWh = {
      cost: this.perWh.cost.at(ans.build.end),
      co2:  this.perWh.co2.at(ans.build.end)};
    ans.avgCapacityFactor = this._capacityFactor;

    ans.primEnergyEffi = this.primEnergyEffi;

    this.cHydro.prepareBuild(ans);
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.type != 'nuke')
      throw 'Nuke.capex; build.type != nuke';

    let nameplate = build.nameplate.at(build.build.end);

    this.capacity += nameplate;
    this.cHydro.capex(build);

    // this.cHydro.getNukeCapaLimitForDay(0);
  }

}
