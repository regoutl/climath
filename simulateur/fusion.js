// import RegularProductionMean from './regularproductionmean.js';
// import * as Yearly from "../timevarin.js";
// import HydroComponent from './hydrocomponent.js';
//
//
// /// in fact extends AbstractProductionMean. but much simplified
// export default class Fusion extends RegularProductionMean{
//   constructor(parameters, simu){
//     super(parameters, 'fusion');
//
//     this.simu = simu;
//     this.available = false;
//   }
//
//
//   produce(energyOut, out){
//     throw '';
//     super.produce(energyOut, out);
//
//     this._periodMaxWh -= energyOut;
//   }
//   capacityAt(t){
//     throw '';
//     // if(t % (24*5) == 0){
//     //   // compute capa
//     //     this._periodMaxWh = this.simu.cHydro.getNukeCapaLimitForPeriod(t / (24*5));
//     // }
//     //
//     // return  Math.min(this._periodMaxWh, super.capacityAt(t));
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
//     let nameplate;
//     //check for parameters
//     if(parameters.nameplate === undefined)
// //      throw 'must define a nameplate';
//         nameplate = 3e9;
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
//
//
//
//     //cooling rate
//     const waterVapoNrg = 2250; // J / g
//     const waterTCapa = 4185; // J/ kg / K
//     const waterInitTemp = 20;
//     const jToVapM3 = (100 - waterInitTemp) * 1000 *waterTCapa + waterVapoNrg * 1000000;
//     // let whToVapM3 = jToVapM3 / 3600;//wh/m3
//
//     const primEnergyPerProduced = 1 / info.primEnergyEffi;
//     const heatPerEnProduced = primEnergyPerProduced * (1 - info.primEnergyEffi); //
//
//     info._m3PerJ = heatPerEnProduced / jToVapM3;
//     info.coolingWaterRate = nameplate * info.avgCapacityFactor * info._m3PerJ;
//
//
//     info.pop_affected = this.simu.cMap.reduceIf(['population'],
//                                                     {center: build.area.center, radius: nuclearDisasterRadius});
//
//     if(build.area.center !== undefined)    {
//         let pool = this.simu.cMap.poolIndexAt(build.area.center);
//
//         if(pool == null){
//             info.theorical = true;
//         }
//         else{
//             info._poolIndex = pool;
//             info.river = this.simu.cHydro.poolName(pool);
//         }
//
//         if(!this.simu.cMap.isInCountry(build.area.center.x, build.area.center.y))
//             info.theorical = true;
//     }
//   }
//
//   //note : must be called when simu.year = buildInfo.build.end
//   capex(build){
//       if(build.info.type != 'fusion')
//         throw 'fusion.capex; build.info.type != fusion';
//
//       let nameplate = build.info.nameplate.at(build.info.build.end);
//
//       this.capacity += nameplate;
//       this.simu.cHydro.addCentral(build.info._poolIndex,
//                                   nameplate * this._capacityFactor,
//                                   build.info._m3PerJ);
//
//   }
//
// }
