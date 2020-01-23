import RegularProductionMean from './regularproductionmean.js';
import * as Yearly from "../timevarin.js";


export default class Ccgt extends RegularProductionMean{
  constructor(parameters){
    super(parameters, 'ccgt');


    // co2PerWh:new Yearly.Constant(0.2), /// g co2 eq / watt

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
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.type != 'ccgt')
      throw 'ccgt.capex; build.type != ccgt';

    let nameplate = build.nameplate.at(build.build.end);

    this.capacity += nameplate;
  }

}
