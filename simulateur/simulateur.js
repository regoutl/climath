import ProductionComponent from './productioncomponent.js';
import MapComponent from './mapcomponent.js';
import HydroComponent from './hydrocomponent.js';
import BuildScheduler from './buildScheduler.js';
import { quantityToHuman as valStr} from '../ui/quantitytohuman.js';
import * as Yearly from "../timevarin.js";


export function objSum(object){
    if(typeof object == 'number')
        return object;
    else if(typeof object == 'object'){
        return Object.values(object).reduce((a, value) => a+objSum(value), 0);
        // Object.entries(object).reduce( (a, [key,value]) =>
        //                          object.hasOwnProperty(key)?(a+value):a, 0);
    }
    else {
        throw new TypeError(
            'object sum impossible: Neither an object nor a number');
    }
}

/** @brief manages all data, but DOM unaware
@details coordinates MapComponent and LogicalComponent
store general values
*/
export class Simulateur{
    constructor(createInfo, valChangedCallbacks){
        this.cMap = new MapComponent(createInfo.map, this, createInfo.mapView);
        this.cHydro = new HydroComponent(createInfo.hydro);
        this.cProd = new ProductionComponent(createInfo.production, this);
        this.cScheduler = new BuildScheduler();

        this.valChangedCallbacks = valChangedCallbacks;


        this.money  = createInfo.gameplay.initMoney;
        // they would pay 30% if all spending were only for other purposes
        /// WARNING TODO check this number
        // minimum tax level. const.
        this.minTaxRate = createInfo.gameplay.minTaxRate;
        // Player controlled
        this.taxRate = this.minTaxRate + 0.05;

        //statistics of the previous years
        this.stats = [];
        //static (maybe partial) of the current year. see struc in _clearYearStats
        this.yStats = {};


        //like if we just finished another year
        this._clearYearStats();
        this.yStats.year= 2018;
        this._newYear();
        this.stats = [];//remove the empty stat
        this.run(); //run 2019


        // this.cMap.drawer.on('click',this.confirmCurrentBuild.bind(this));
    }// END OF Simulateur.constructor()

    get taxRate(){return this._taxRate;}
    set taxRate(val){
        this._taxRate = Number(val);
        if(isNaN(this._taxRate))
            throw new TypeError('NaN !!!!');

        this.valChangedCallbacks.taxRate(this._taxRate);
    }

    get money(){return this._money;}
    set money(val){
        if(isNaN(val))
          throw 'nan';
        this._money = val;
        this.valChangedCallbacks.money(this._money);
    }

    get year(){return this.yStats.year;}

    /// called for each change in what to build, or where to
    onBuildMenuStateChanged(buildMenuState, curPos, radius){
    // nothin to build, skip
        if(buildMenuState === undefined)
            return;

        buildMenuState.year = this.year;

        //reset the current build
        this._currentBuild = {};

        this._currentBuild.parameters = buildMenuState;
        this._currentBuild.area =  {center:curPos, radius:radius};

        this._currentBuild.info = {
            type: buildMenuState.type,
            build:{begin: this.year},
            perWh:{
                cost: 0,
                co2: 0
            },
            perYear:{
                cost: 0,
                co2: 0
            }
        };

        this._c(buildMenuState.type).prepareCapex(this._currentBuild);

        if(this._currentBuild.info.build.cost > this._money){
            this._currentBuild.info.theorical = "cash";
        }

        if(this._currentBuild.info.build.begin != this.year){
            this._currentBuild.info.theorical = "present";
        }

        return this._currentBuild;
    }

    /** @brief return requested component (ex : pv -> pv, battery -> storage) */
    _c(type){
        if(type == 'battery')
            return this.cProd.productionMeans.storage;
        else if(['nuke', 'fossil', 'ccgt', 'fusion'].includes(type))
            return this.cProd.productionMeans.centrals;
        else
            return this.cProd.productionMeans[type];
    }

    //called on click on the map
    confirmCurrentBuild(){
        /// STEP 1 : check the build is valid-----------------------------------

        // only build in present
        if(this._currentBuild === undefined){
            return;
        }

        // dirty fix for click on buttons part of central area
        if(this._currentBuild.area.center === undefined)
            return;

        if(this._currentBuild.info.theorical){
          return false;
        }


        /// do the build-----------------------------------

        //schedule an event to execute on completion
        this.cScheduler.push({
            year: this._currentBuild.info.build.end,
            action: 'build',
            data: this._currentBuild
        });

        //draw it
        this.cMap.build(this._currentBuild);

        //record some stats
        let action = this._currentBuild.info.build /*|| this._currentBuild.demolish*/;

        let recorder = this._currentBuild.parameters.type;
        if(recorder == 'battery')
            recorder = 'storage';
        this.yStats.co2.build[recorder] += action.co2;
        this.yStats.cost.build[recorder] += action.cost;

        //and modify the actual value
        this.money -= action.cost;

        this._currentBuild = undefined;
    }
    //run
    run(){
        // console.log(this.cMap.testBoom());
        // O & M (fixed & variable)
        this.cProd.run(this.year, this.yStats);

        this._newYear();
    }

    //return a list of all the primary (yearly coefs) data there are
    // todo ; check dirty
    primaryDataList(){
        let ans = [];

        const prodMeans = this.cProd.productionMeans;
        ans.push(prodMeans.pv.efficiency);
        ans.push(prodMeans.pv.build.energy);
        ans.push(prodMeans.pv.build.cost);
        ans.push(prodMeans.pv.perYear.cost);

        let nuke = prodMeans.centrals.nuke;
        ans.push(nuke.build.cost);
        ans.push(nuke.perWh.cost);
        ans.push(nuke.perWh.co2);

        let ccgt = prodMeans.centrals.ccgt;
        ans.push(ccgt.build.cost);
        ans.push(ccgt.perWh.cost);
        ans.push(ccgt.perWh.co2);

        const store = prodMeans.storage.solutions;
        ans.push(store.battery.build.energy);
        ans.push(store.battery.perYear.cost);

        const wind = prodMeans.wind;
        ans.push(wind.efficiency);
        ans.push(wind.build.cost);
        ans.push(wind.perYear.cost);
        ans.push(wind.density);

        const countries = this.cProd.countries;
        ans.push(countries.belgium.pop);
        ans.push(countries.belgium.gdpPerCap);
        ans.push(countries.belgium.consoPerCap);
        ans.push(countries.china.elecFootprint);
        // ans.push(countries.usa.elecFootprint);

        return ans;
    }

    /**
    @brief compute the tax income of the previous year (called on new years eve)
    */
    _computeTaxIncome(){
        let yStats = this.yStats;

        yStats.taxes.rate = this.taxRate;

        yStats.taxes.in = this.cProd.countries.belgium.pop.at(yStats.year)
                * this.cProd.countries.belgium.gdpPerCap.at(yStats.year)
                * (this.taxRate - this.minTaxRate);
    }

    /**@brief go to next year.
    compute o&m, taxes of the last year
    save stats
    calls happy new year
    */
    _newYear(){
        //taxes of last year
        this._computeTaxIncome();

        //wish a happy new year to everybody
        // this.cProd.happyNYEve(this.yStats);
      	for (let prodMean in this.cProd.productionMeans) {
			this.cProd.productionMeans[prodMean].happyNYEve(this.yStats);
		}
        this.cScheduler.happyNYEve(this.yStats);

        //warning : year -- todo correct
        this._lotsOfSavingOfStatisticsAboutLastYearAndCallbacks();

        this.money -= objSum(this.yStats.cost.perWh) +
                        objSum(this.yStats.cost.perYear);
        this.money += this.yStats.taxes.in;

        // the new year initialization------------------------

        //prepare stats for the new year
        this._clearYearStats();
    }


    /** @brief demolish prod means that were build via constructionParameters

    @param constructionParameters : {}.
        for non centrals : exactly build.parameters,
        for centrals : {type: 'central', id} id : central id
    @param deconstructionParameters : {} depends on the type
        for pv : {area, extra} area : area to demolish, extra : radiant flux on that area
        for wind : {area, extra} area : area to demolish, extra : wind power on that area
        for storage : {area}
        for centrals : undefined

    @return cost of the demolition.

    @note scheduledConstructions are also affected. demolishion of a partial construction still cost the full price
    */
    demolish(constructionParameters, deconstructionParameters){
        if(constructionParameters.type == 'central'){
            //check the schedule for the central
             //note that it's fine to iterate over a priority queue, as long as you dont modify the priority of an item
            for(let scheduled of this.cScheduler.pendingBuilds._heap){
                if(scheduled.type == 'build' && scheduled.action.centralId === constructionParameters.id){
                    //found the central !
                    scheduled.action = null; //cancel the build action
                    return this.cProd.productionMeans.centrals.costOfDemolish(scheduled.data);
                }
            }

            //the central was not in the schedule, pass it to the component
            return this.cProd.productionMeans.centrals.demolish(constructionParameters.id);
        }
        else if(['pv', 'storage', 'wind'].includes(constructionParameters.type)){
            let currentDemolish = {
                parameters: constructionParameters,
                reductions:deconstructionParameters,
                info:{type: constructionParameters.type, build:{begin: constructionParameters.year}},
                year: this.year,
                pm: this.cProd.productionMeans[constructionParameters.type]
            };

            let constructionFinishYear = currentDemolish.pm.endOfBuild(currentDemolish);

            if(this.year < constructionFinishYear){
                this.cScheduler.push({
                    year: constructionFinishYear + 0.5, //guarantee the demolish after the build
                    action: 'demolish',
                    data:currentDemolish
                });

                return currentDemolish.pm.costOfDemolish(currentDemolish);
            }
            else{
                return currentDemolish.pm.demolish(currentDemolish);

            }
        }
        else {
            throw 'to do';
        }
    }

    _clearYearStats(){
        let y = this.yStats.year + 1;

        function nrgs(){
          return {fossil: 0, pv: 0, nuke:0, storage: 0, ccgt: 0, wind: 0, fusion: 0};
        }

        this.yStats = {
            year: y,
            consumedEnergy: {//stat about energy consumtion
                total: 0,
                origin:nrgs(),
            },
            co2:{//stat about co2 emission
                total: 0,
                build:nrgs(),
                perWh:nrgs(),
                perYear:nrgs(),
            },
            cost:{//stat about costs
                total: 0,
                build:nrgs(),
                perWh:nrgs(),
                perYear:nrgs(),
            },
            taxes:{in: 0, rate:0},
        };
        this.valChangedCallbacks.year(this.year);
    }

    _lotsOfSavingOfStatisticsAboutLastYearAndCallbacks(){
        let yStats = this.yStats;


        // console.log('fossil ', valStr(yStats.co2.perWh.fossil, 'C'));
        // console.log('ccgt ', valStr(yStats.co2.perWh.ccgt, 'C'));

        //compute totals
        yStats.consumedEnergy.total = objSum(yStats.consumedEnergy);
        yStats.co2.total = objSum(yStats.co2);
        yStats.cost.total = objSum(yStats.cost);

        this.stats.push(yStats);
    }
}




/** @brief load all data needed for a simulater
@param mapView is as defined in MapComponent's constructor
@return a promise that is resolved when ready.
**/
export function promiseSimulater(valChangedCallbacks, mapView){
  return Promise.all([
    fetch('res/parameters.json')
        .then((response) => response.json()),
    fetch('res/landUse.bin')
        .then((response) => response.arrayBuffer()),
    fetch('hydro/poolStations.bin')
        .then((response) => response.arrayBuffer()),
    fetch('hydro/pools.json')
        .then((response) => response.json()),
    fetch('hydro/poolMap.bin')
        .then((response) => response.arrayBuffer()),
    fetch('res/popDensity.bin')
        .then(response => response.arrayBuffer()),
    // fetch('hydro/sea.bin')
    //     .then(response => response.arrayBuffer()),
    fetch('res/windPowDens50.bin')
        .then(response => response.arrayBuffer()),
    ])
    //called when all simu related res are loaded
    .then(function(values){
        let simuCreateInfo = {};

        simuCreateInfo.production = values[0];

        simuCreateInfo.map = {
            groundUse: new Uint8Array(values[1]),
            popDensity: new Uint8Array(values[5]),
            windPowDens:{at50:new Uint8Array(values[6])},
            pools: new Uint8Array(values[4]),
        };
        simuCreateInfo.mapView = mapView;

        simuCreateInfo.hydro = {
            stations: new Float32Array(values[2]),
            pools:{links:values[3]},
        };

        simuCreateInfo.gameplay = {
            "minTaxRate": 0.398,
            "initMoney":10000000000,
        };

        return new Simulateur(simuCreateInfo, valChangedCallbacks);
    })
    .catch(err => alert('loading error ' + err)) ;
}
