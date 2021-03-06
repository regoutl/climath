// Copyright 2020, ASBL Math for climate, All rights reserved.

import * as Yearly from "../timevarin.js";


/**struct{()
  float co2PerWh
  float onmPerWh
  int buildDelay

  float capacityAt (int hour)
  float deconstructionRatio
  void produce(float amount, year stat)
  void happyNY(yearStat);
}
*/
export default class AbstractProductionMean{
  constructor(parameters, label){
    if (new.target === AbstractProductionMean) {
      throw new TypeError("Cannot construct AbstractProductionMean instances directly");
    }
    if(label === undefined)
      throw 'nononno';

    this.label = label;

    this._currentYear = {};

    this._build = {co2: new Yearly.Raw(0)};
    this._build.delay = parameters.build.time;
    this._build.cost = new Yearly.Raw(parameters.build.cost);

    this.deconstructionRatio = parameters.deconstructionRatio;

    this.perWh = {cost:  new Yearly.Raw(0), co2:  new Yearly.Raw(0)};
    this.perYear = {cost:  new Yearly.Raw(0),
                    co2:  new Yearly.Raw(0)};
    if(parameters.perYear){
      if(parameters.perYear.cost)
        this.perYear.cost =  new Yearly.Raw(parameters.perYear.cost);
      if(parameters.perYear.co2)
        this.perYear.co2 =  new Yearly.Raw(parameters.perYear.co2);
    }
    if(parameters.perWh){
      if(parameters.perWh.cost)
        this.perWh.cost =  new Yearly.Raw(parameters.perWh.cost);
      if(parameters.perWh.co2)
        this.perWh.co2 =  new Yearly.Raw(parameters.perWh.co2);
    }

    if(parameters.deconstructionRatio)
        this.demolishRatio = parameters.deconstructionRatio;
    else {
        throw 'need a deconstructionRatio';
    }
  }

  /// return the amount that this can produce at current time t
  capacityAt(t){throw 'pure virtual';}

  /// produces the given energy amount.
  /// update output : incease output.co2 and output.cost
  produce(amount, output){throw 'pure virtual';}

  //O & M. Called right after the new year, for the previous year
  happyNYEve(yStats){throw 'pure virtual';}

  /// expand capacity
  capex(param){throw 'pure virtual';  }

  /** @brief delete the given amount of this energy, that was build with the buildInfo */
  delete(buildInfo, amount){throw 'pure virtual';  }

  prepareCapex(param, countries){throw 'pure virtual';  }
}
