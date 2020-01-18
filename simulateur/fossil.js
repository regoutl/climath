import RegularProductionMean from './regularproductionmean.js';


/// in fact extends AbstractProductionMean. but much simplified
export default class Fossil/* extends AbstractProductionMean*/{
  constructor(parameters){
    this.footprint = parameters.footprint;
  }

  produce(energyOut, out){
    out.co2.perWh.fossil += energyOut * this.footprint;
  }

  capacityAt(t){
    return Infinity;
  }

  //do nothing
  happyNY(yStats){}

}
