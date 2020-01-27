// import RegularProductionMean from './regularproductionmean.js';
// import * as Yearly from "../timevarin.js";
//
//
// export default class Ccgt extends RegularProductionMean{
//   constructor(parameters){
//     super(parameters, 'ccgt');
//
//
//     // co2PerWh:new Yearly.Constant(0.2), /// g co2 eq / watt
//
//   }
//
//   prepareCapex(build, countries){
//     build.pm = this;
//
//     let parameters = build.parameters;
//     let info = build.info;
//
//     info.build.end = this.build.delay + info.build.begin;
//
//
//
//     let nameplate;
//     //check for parameters
//     if(parameters.nameplate === undefined)
// //      throw 'must define a nameplate';
//         nameplate = 1.6e9;
//         // console.log('set default nameplate');
//
//     info.nameplate = new Yearly.Raw(nameplate);
//     info.nameplate.unit = 'N';
//
//     info.build.co2 = nameplate // m2
//         * this.build.co2.at(info.build.begin);
//
//     info.build.cost  = nameplate * // w
//         this.build.cost.at(info.build.begin);  // eur/w
//
//
//     info.pm = this;
//
//     info.perYear = {cost: this.perYear.cost.at(info.build.end) * nameplate, co2: 0};
//     info.perWh = {
//       cost: this.perWh.cost.at(info.build.end),
//       co2:  this.perWh.co2.at(info.build.end)};
//     info.avgCapacityFactor = this._capacityFactor;
//
//     info.primEnergyEffi = this.primEnergyEffi;
//   }
//
//   //note : must be called when simu.year = cmd.build.end
//   capex(build){
//     if(build.info.type != 'ccgt')
//       throw 'ccgt.capex; build.info.type != ccgt';
//
//     let nameplate = build.info.nameplate.at(build.info.build.end);
//
//     this.capacity += nameplate;
//   }
//
// }
