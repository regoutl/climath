
import AbstractProductionMean from './abstractproductionmean.js';
import * as Yearly from "../timevarin.js";
import BuildInfo from './buildinfo.js';


/// technically subclass of AbstractProductionMean
export default class Storage /*extends AbstractProductionMean*/{
  constructor(parameters, simu){
    this.simu = simu;

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
            devices[i].storageCapacity += devices[i].nowBuilding;
            devices[i].nowBuilding = 0;

            devices[i].stored = Math.min(devices[i].stored, devices[i].storageCapacity);
        }

        // console.log(sumCapa);

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

    buildInfo(parameters, zone){
        if(parameters.type != 'battery')
          throw 'only bat supported';

        if(parameters.height === undefined)
            parameters.height = 5;//5 is a coef that should be controllable by the user. height of the battery

        let a = this.simu.cMap.reduceIf(['area'], zone,
                                        ['buildable']);

        if(parameters.priceMul === undefined)
          parameters.priceMul = 1;
        if(parameters.madeIn === undefined)
          parameters.madeIn = 'china';
        if(parameters.roundTrip === undefined)
          parameters.roundTrip = 0.9;
        if(parameters.capaDecline10Years === undefined)
          parameters.capaDecline10Years = 0.75;
        if(parameters.selfDischarge1Month === undefined)
            parameters.selfDischarge1Month = 0.98;

        return this._buildInfo(parameters, a[0]);
    }

    _buildInfo(parameters, area){
        let info = new BuildInfo(parameters);

        info.build.end = info.build.begin + this.solutions.battery.build.delay;

        let volume = area * parameters.height;

        const initStorageCapa = volume * this.solutions.battery.energyDensity.at(info.build.begin);

        const yearlyCapaDecl = Math.pow( parameters.capaDecline10Years, 1/10.0);

        info.storageCapacity   =   new Yearly.Expo(info.build.end,
                                            initStorageCapa,
                                            yearlyCapaDecl);

        let countries = this.simu.cProd.countries;

        info.build.end = info.build.begin + this.solutions.battery.build.delay;
        info.build.co2 = initStorageCapa // S
          * this.solutions.battery.build.energy.at(info.build.begin)  // wH / S
          * countries[parameters.madeIn].elecFootprint.at(info.build.begin); // C / Wh

        info.build.cost = this._buildCost(parameters, area);


        info.perYear = {cost: this.solutions.battery.perYear.cost.at(info.build.end) * initStorageCapa, co2: 0};
        return info;
    }

    _buildCost(parameters, area){
        let volume = area * parameters.height;
        const initStorageCapa = volume * this.solutions.battery.energyDensity.at(parameters.year);

        return initStorageCapa // S
          * this.solutions.battery.build.cost.at(parameters.year)
          * parameters.priceMul;
    }

    build(info, parameters){
        if(info.type != 'battery')
            throw 'storage.capex; build.type != battery';

        let deviceGroupIndex = this._findSuitableDeviceGroup(parameters, true);

        this.devices[deviceGroupIndex].nowBuilding += info.storageCapacity.at(info.build.end);
    }

    //find a device group suitable for the build specified. (same selfDischarge, capa decline and round trip)
    //if none found -> creates one if in can, else throw
    _findSuitableDeviceGroup(buildParameters, canCreate){
        if(canCreate === undefined)
            throw 'plz specify this';

        let hourlySelfDischarge = Math.pow( buildParameters.selfDischarge1Month, 1/730.0);
        let yearlyCapaDecl = Math.pow( buildParameters.capaDecline10Years, 1/10.0);

        let loadCoef = Math.sqrt(buildParameters.roundTrip);

        //find a suitable devices
        let i = 0;
        for(; i < this.devices.length; i++){
        if(this.devices[i].storageCapaDecline == yearlyCapaDecl
              && this.devices[i].selfDischarge == hourlySelfDischarge
              && this.devices[i].loadCoef == loadCoef)
            return i;
        }

        if(!canCreate)
            throw 'no suitable device group found';

        this.devices.push({ storageCapacity: 0,
                            stored:0,
                            storageCapaDecline: yearlyCapaDecl,
                            'loadCoef': loadCoef,
                            invloadCoef: 1/loadCoef,
                            selfDischarge: hourlySelfDischarge,
                            nowBuilding: 0,
                        });
        return this.devices.length - 1;
    }

    /** @brief return the cost of demolition. Dont apply the demoliton*/
    demolishCost(parameters, area){
        return this._buildCost(parameters, area) * this.solutions.battery.deconstructionRatio;
    }

    /** same as pv.demolish BUT demolish.reductions.extra is undefined
    */
    demolish(demolishYear, parameters, area){
        //get all the build informations
        let buildInfo = this._buildInfo(parameters, area);

        let devGrp = this._findSuitableDeviceGroup(parameters, false);

        //not build yet -> this a job for the scheduled build queue
        if(buildInfo.build.end > demolishYear){
            this.devices[devGrp].nowBuilding -= buildInfo.storageCapacity.at(demolishYear);

            if(this.devices[devGrp].nowBuilding < 0)
                throw 'check non consistent';
        }
        else{ //dev was build
            this.devices[devGrp].storageCapacity -= buildInfo.storageCapacity.at(demolishYear);
            this.devices[devGrp].stored = Math.min(this.devices[devGrp].stored, this.devices[devGrp].storageCapacity);

            if(this.devices[devGrp].storageCapacity < 0)
                throw 'check non consistent';
        }
    }

}
