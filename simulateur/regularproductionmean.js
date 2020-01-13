import AbstractProductionMean from './abstractproductionmean.js';

/// fossil, ccgt and nuke
export default class RegularProductionMean extends AbstractProductionMean {
  constructor(parameters) {
    super(parameters);
    if (new.target === RegularProductionMean) {
      throw new TypeError("Cannot construct RegularProductionMean instances directly");
    }


    //note : fossil fuel have unlimited installed capacity
    this.capacity = parameters.init.capacity *
                      parameters.init._capacityvalMul; //W installed

    //capacity factor
    if(parameters.capacityFactor === undefined)
      this._capacityFactor = 1.0;
    this._capacityFactor = parameters.capacityFactor;
  }

  produce(energyOut, out){
    out.co2 += energyOut * this._currentYear.perWh.co2;
    out.cost += energyOut * this._currentYear.perWh.cost;
  }

  happyNY(year, simulateur, output){
    output.co2 +=
         this.capacity
       * this.perYear.co2.at(year-1);
    output.cost +=
        this.capacity
      * this.perYear.cost.at(year-1);

    this._currentYear =
    {perWh:
      {co2:this.perWh.co2.at(year),
      cost:this.perWh.cost.at(year)}};
  }

  capacityAt(t){
    return this.capacity * this._capacityFactor;
  }

}
