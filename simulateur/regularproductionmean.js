import AbstractProductionMean from './abstractproductionmean.js';

/// fossil, ccgt and nuke
export default class RegularProductionMean extends AbstractProductionMean {
  constructor(parameters, meanName) {
    super(parameters, meanName);
    if (new.target === RegularProductionMean) {
      throw new TypeError("Cannot construct RegularProductionMean instances directly");
    }


    //note : fossil fuel have unlimited installed capacity
    this.capacity = parameters.init.capacity *
                      parameters.init._capacityvalMul; //W installed

    //capacity factor
    if(parameters.capacityFactor === undefined)
      this._capacityFactor = 1.0;
    else if(typeof parameters.capacityFactor == 'number')
      this._capacityFactor = parameters.capacityFactor;
  }

  produce(energyOut, out){
    out.co2 += energyOut * this._currentYear.perWh.co2;
    out.cost += energyOut * this._currentYear.perWh.cost;
  }

/*  happyNY(year, simulateur, output){
    // out.co2 += energyOut * co2PerWh.at(this.year);// perf note : this function call returns 8760 time the same value
    // out.cost += energyOut * onmPerWh.at(this.year);
    this.currentYear = {perWh:{co2:0, cost:0}};
  }*/

  capacityAt(t){
    return this.capacity * this._capacityFactor;
  }

}
