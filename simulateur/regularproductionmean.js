import AbstractProductionMean from './abstractproductionmean.js';

/// fossil, ccgt and nuke
export default class RegularProductionMean extends AbstractProductionMean {
  constructor(parameters, label) {
    super(parameters, label);
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
    out.co2.perWh[this.label] += energyOut * this._currentYear.perWh.co2;
    out.cost.perWh[this.label] += energyOut * this._currentYear.perWh.cost;
  }

  happyNY(yStats){
    // output.co2.perYear[this.label] +=
    //      this.capacity
    //    * this.perYear.co2.at(year-1);

    //fixed o&m
    yStats.cost.perYear[this.label] +=
        this.capacity
      * this.perYear.cost.at(yStats.year-1);

    this._currentYear =
    {perWh:
      {co2:this.perWh.co2.at(yStats.year),
      cost:this.perWh.cost.at(yStats.year)}};
  }

  capacityAt(t){
    return this.capacity * this._capacityFactor;
  }

}
