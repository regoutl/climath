import * as Yearly from "../timevarin.js";


/**struct{()
  float co2PerWh
  float onmPerWh
  int buildDelay

  float capacityAt (int hour)
  float deconstructionRatio
  void produce(float amount, output:{co2, cost})
  void happyNY(year, simul);
}
*/
export default class AbstractProductionMean{
  constructor(parameters){
    if (new.target === AbstractProductionMean) {
      throw new TypeError("Cannot construct AbstractProductionMean instances directly");
    }

    this._currentYear = {};

    this.build = {};
    this.build.delay = parameters.build.time;
    this.build.cost = new Yearly.Raw(0);
    this.build.cost.fromJSON(parameters.build.cost);

    this.deconstructionRatio = parameters.deconstructionRatio;

    this.fixedOnM = new Yearly.Raw(0.0);
    this.fixedOnM.fromJSON(parameters.onm);
  }

  /// return the amount that this can produce at current time t
  capacityAt(t){throw 'pure virtual';}

  /// produces the given energy amount.
  /// update output : incease output.co2 and output.cost
  produce(amount, output){throw 'pure virtual';}

  //O & M
  happyNY(year, simulater, output){throw 'pure virtual';}

  /// expand capacity
  capex(param){throw 'pure virtual';  }


  prepareCapex(param, beginBuildYear, countries){throw 'pure virtual';  }
}
