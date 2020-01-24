import RegularProductionMean from './regularproductionmean.js';
import * as Yearly from "../timevarin.js";


export default class Ccgt extends RegularProductionMean{
  constructor(parameters){
    super(parameters, 'ccgt');


    // co2PerWh:new Yearly.Constant(0.2), /// g co2 eq / watt

  }

  prepareCapex(build, countries){
    build.build.end = this.build.delay + build.build.begin;



    let nameplate;
    //check for parameters
    if(build.input.nameplate === undefined)
//      throw 'must define a nameplate';
        nameplate = 1.6e9;
        // console.log('set default nameplate');

    build.nameplate = new Yearly.Raw(nameplate);
    build.nameplate.unit = 'N';

    build.build.co2 = nameplate // m2
        * this.build.co2.at(build.build.begin);

    build.build.cost  = nameplate * // w
        this.build.cost.at(build.build.begin);  // eur/w


    build.pm = this;

    build.perYear = {cost: this.perYear.cost.at(build.build.end) * nameplate, co2: 0};
    build.perWh = {
      cost: this.perWh.cost.at(build.build.end),
      co2:  this.perWh.co2.at(build.build.end)};
    build.avgCapacityFactor = this._capacityFactor;

    build.primEnergyEffi = this.primEnergyEffi;
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.type != 'ccgt')
      throw 'ccgt.capex; build.type != ccgt';

    let nameplate = build.nameplate.at(build.build.end);

    this.capacity += nameplate;
  }

}
