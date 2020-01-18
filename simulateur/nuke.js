import RegularProductionMean from './regularproductionmean.js';
import * as Yearly from "../timevarin.js";


/// in fact extends AbstractProductionMean. but much simplified
export default class Nuke extends RegularProductionMean{
  constructor(parameters){
    super(parameters);


  }

  prepareCapex(what, beginBuildYear, countries){
    let ans = {};
    ans.type = 'nuke';
    ans.build = {};
    ans.build.begin = beginBuildYear;
    ans.build.end = this.build.delay + beginBuildYear;

    //check for parameters
    if(what.nameplate === undefined)
      throw 'must define a nameplate';

    ans.nameplate = new Yearly.Raw(what.nameplate);
    ans.nameplate.unit = 'N';

    ans.build.co2 = what.nameplate // m2
        * this.build.co2.at(ans.build.begin);

    ans.build.cost  = what.nameplate * // w
        this.build.cost.at(ans.build.begin);  // eur/w

    ans.pm = this;

    ans.perYear = {cost: this.perYear.cost.at(ans.build.end) * what.nameplate, co2: 0};
    ans.perWh = {
      cost: this.perWh.cost.at(ans.build.end),
      co2:  this.perWh.co2.at(ans.build.end)};
    ans.avgCapacityFactor = this._capacityFactor;

    return ans;
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.type != 'nuke')
      throw 'Nuke.capex; build.type != nuke';

    let nameplate = build.nameplate.at(build.build.end);

    this.capacity += nameplate;
  }

}
