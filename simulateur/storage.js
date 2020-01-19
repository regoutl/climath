import AbstractProductionMean from './abstractproductionmean.js';
import * as Yearly from "../timevarin.js";


/// technically subclass of AbstractProductionMean
export default class Storage /*extends AbstractProductionMean*/{
  constructor(parameters){

    /** array (sorted by priority) of storage means
     * struct StorageMeanSpec{()
     * 	storageCapacity: R wh
     *  stored : R wh
     *  storageCapaDecline:   [0-1] yearly storage capacity evolution
     *  loadCoef		    [0-1] 'energy actually Stored'/'energy injected'
                            := 'energy output'/'actual discharge'
                            := sqrt( roundtrip )
     *  invloadCoef	    := 1/ loadCoef
     *  selfDischarge [0-1] hourly stored energy evolution (note : prec is enough, I checked)
     * }*/
    this.devices = [];

    this.solutions = {};

    this.solutions.battery = {};

    this.solutions.battery.build = {};
    this.solutions.battery.build.delay = parameters.battery.build.time;
    this.solutions.battery.build.energy
      = new Yearly.Raw(parameters.battery.build.energy);
    this.solutions.battery.build.cost
      = new Yearly.Raw(parameters.battery.build.cost);
    this.solutions.battery.deconstructionRatio
      = parameters.battery.deconstructionRatio;

    this.solutions.battery.perYear = {};
    this.solutions.battery.perYear.cost
      = new Yearly.Raw(parameters.battery.onm);

    this.solutions.battery.energyDensity
      = new Yearly.Raw(parameters.battery.energyDensity);
  }

  //Output the requested energy. energyOut <= capacityAt
  // todo : check unload order
  produce(energyOut, out){
    // out.cost += 0;//todo : check this value
    // out.co2 += 0;//todo : check this value

    let devices = this.devices;
    for(let i = 0; i < devices.length; i++){
      let available =  devices[i].stored * devices[i].loadCoef;
      if(available == 0)
        continue;

      let used= Math.min(available, energyOut);
      energyOut -= used;
      devices[i].stored -= used * devices[i].invloadCoef;
      if(energyOut == 0)
        break;
    }
  }

  //return the enery the bat can output right now
  capacityAt(t){
    let ans = 0;
    let devices = this.devices;
    for(let i = 0; i < devices.length; i++){
      ans += devices[i].stored * devices[i].loadCoef;
    }

    return ans;
  }

  happyNYEve(yStats){
    let devices = this.devices;

    let sumCapa = 0;
    for(let i = 0; i < devices.length; i++){
      sumCapa += devices[i].storageCapacity;
      devices[i].storageCapacity *= devices[i].storageCapaDecline;
      devices[i].stored = Math.min(devices[i].stored, devices[i].storageCapacity);
    }

    //todo : check O & M : here, it decreases every year
    yStats.cost.perYear.storage += sumCapa * this.solutions.battery.perYear.cost.at(yStats.year);
  }

  // return the maximum amount of energy we can store
  maxInput(){
    let devices = this.devices;
    let ans = 0;

    for(let i = 0; i < devices.length; i++){
      let missing = devices[i].storageCapacity - devices[i].stored;
      ans += missing * devices[i].invloadCoef;
    }

    return ans;
  }

  runHour(energyIn){
    let devices = this.devices;
    let i = 0;
    for(; i < devices.length; i++){
      let missing = devices[i].storageCapacity - devices[i].stored;

      let toInject = Math.min(missing * devices[i].invloadCoef, energyIn );

      devices[i].stored += toInject *  devices[i].loadCoef;
      energyIn -= toInject;

      devices[i].stored *= devices[i].selfDischarge;

      //skip this expensive loop if nothing to load
      if(energyIn == 0)
        break;
    }

    for(; i < devices.length; i++){
      devices[i].stored *= devices[i].selfDischarge;
    }
  }

/**
  @param what.type. must be == 'battery'
  @param what.capacity : the capacity to install
  @param what.roundTrip : the round trip efficiency. ('energy out'/'energy in')
  @param what.selfDischarge1Month : charge lvx after 1 month
  @param what.capaDecline10Years
  @param what.madeIn
  @param what.priceMul

  @return ans.type = 'storage'
  @return ans.
*/
  prepareCapex(what, beginBuildYear, countries){
    let ans = {};

    if(what.type != 'battery')
      throw 'only bat supported';
    if(what.volume === undefined)
      throw 'need volume';

    what.storageCapacity
      = what.volume * this.solutions.battery.energyDensity.at(beginBuildYear);

    if(what.priceMul === undefined)
      what.priceMul = 1;
    if(what.madeIn === undefined)
      what.madeIn = 'china';
    if(what.roundTrip === undefined)
      what.roundTrip = 0.9;
    if(what.capaDecline10Years === undefined)
      what.capaDecline10Years = 0.75;
    if(what.selfDischarge1Month === undefined)
      what.selfDischarge1Month = 0.98;

    ans.storageCapacity = what.storageCapacity;
    ans.type = what.type;

    ans.capaDecline10Years = what.capaDecline10Years;
    ans.selfDischarge1Month = what.selfDischarge1Month;
    ans.roundTrip = what.roundTrip;

    ans.build = {};
    ans.build.begin = beginBuildYear;
    ans.build.end = beginBuildYear + this.solutions.battery.build.delay;
    ans.build.co2 = what.storageCapacity // S
        * this.solutions.battery.build.energy.at(ans.build.begin)  // wH / S
        * countries[what.madeIn].elecFootprint.at(ans.build.begin); // C / Wh

    ans.build.cost = what.storageCapacity // S
        * this.solutions.battery.build.cost.at(ans.build.begin)
        * what.priceMul;

    ans.pm = this;

    ans.perYear = {cost: this.solutions.battery.perYear.cost.at(ans.build.end) * ans.storageCapacity, co2: 0};

    return ans;
  }

  //note : must be called when simu.year = cmd.build.end
  capex(build){
    if(build.type != 'battery')
      throw 'storage.capex; build.type != battery';


    let hourlySelfDischarge = Math.pow( build.selfDischarge1Month, 1/730.0);
    let yearlyCapaDecl = Math.pow( build.capaDecline10Years, 1/10.0);

    let loadCoef = Math.sqrt(build.roundTrip);

    //find a suitable devices
    let i = 0;
    for(; i < this.devices.length; i++){
      if(this.devices[i].storageCapaDecline == yearlyCapaDecl
        && this.devices[i].selfDischarge == hourlySelfDischarge
        && this.devices[i].loadCoef == loadCoef)
        break;
    }

    if(i == this.devices.length)
      this.devices.push({ storageCapacity: 0,
                          stored:0,
                          storageCapaDecline: yearlyCapaDecl,
                          'loadCoef': loadCoef,
                          invloadCoef: 1/loadCoef,
                          selfDischarge: hourlySelfDischarge});

    this.devices[i].storageCapacity += build.storageCapacity;
  }

}
