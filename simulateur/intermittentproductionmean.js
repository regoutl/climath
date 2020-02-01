
import AbstractProductionMean from './abstractproductionmean.js';
import * as Yearly from "../timevarin.js";


function _base64ToUint8Array(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

/** PV and wind : 0 co2 per wh, variable capacity factor
*/
export default class IntermittentProductionMean extends AbstractProductionMean{
  constructor(parameters, meanName){
    super(parameters, meanName);

    this.capacity = parameters.init.capacity *
                      parameters.init._capacityvalMul; //W installed

    this.currentYear = {};
    this.currentYear.perWh = {};
    this.currentYear.perWh.co2= new Yearly.Constant(0); /// g co2 eq / watt
    this.currentYear.perWh.cost= new Yearly.Constant(0); //does not matter whether it produces or not


    this._capacityFactor = _base64ToUint8Array(parameters.capacityFactor);

    //capacity factor
    if(this._capacityFactor.length % (365*24) != 0){
      throw 'all years must have 365 days (got ' + this._capacityFactor.length + ' days total for pv )';
    }
  }

  //no cost, no co2
  produce(energyOut, out){}

  capacityAt (t){
    return this.capacity *
            this._capacityFactor[t % this._capacityFactor.length] / 255.0;
  }

  endOfBuild(build){
      return this.build.delay + build.info.build.begin;
  }
}
