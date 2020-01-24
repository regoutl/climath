import ProductionComponent from './productioncomponent.js';
import MapComponent from './mapcomponent.js';
import HydroComponent from './hydrocomponent.js';
import { quantityToHuman as valStr} from '../ui/plot.js';
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
        this.cMap = new MapComponent(createInfo.map);
        this.cHydro = new HydroComponent(createInfo.hydro);
        this.cProd = new ProductionComponent(createInfo.production, this);

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


        this.cMap.drawer.on('click',this.confirmCurrentBuild.bind(this));
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

        // this._bm = {state:buildMenuState, curPos:curPos, radius:radius};

        //reset the current build
        this._currentBuild = {};

        this._currentBuild.input = {state:buildMenuState, curPos:curPos, radius:radius};

        // this._currentBuild.currentYear = year;
        this._currentBuild.build= {begin: this.year};
        // this._currentBuild.pos = curPos;
        this._currentBuild.type = buildMenuState.type;

        //ask the grid about ground usage aso
//        this.cMap.prepareBuild(this._currentBuild, buildMenuState,
//            {shape:'circle', center:curPos, radius:radius});

        this.cMap.updateCursor(this._currentBuild.input);

        // console.log(this._currentBuild.nameplate.at(this._currentBuild.build.end));
        this.cProd.prepareBuild(this._currentBuild);

        return this._currentBuild;
    }

    //called on click on the map
    confirmCurrentBuild(){
        // only build in present
        if(this._currentBuild === undefined
            || this._currentBuild.build.begin != this.year){
                console.log('can only build in present');
                return;
        }

        if(this._currentBuild.build.cost > this._money){
          console.log('no enough cash');
          return false;
        }

        if(this._currentBuild.theorical){
          console.log('invalid');
          return false;
        }

        this.cProd.execute(this._currentBuild);

        this.cMap.build(this._currentBuild);

        //record some stats
        let action = this._currentBuild.build || this._currentBuild.demolish;

        let recorder = this._currentBuild.type;
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
        console.log(this.cMap.testBoom());
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
        ans.push(prodMeans.nuke.build.cost);
        ans.push(prodMeans.nuke.perWh.cost);
        ans.push(prodMeans.nuke.perWh.co2);

        const store = prodMeans.storage.solutions;
        ans.push(store.battery.build.energy);
        ans.push(store.battery.perYear.cost);

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
        this.cProd.happyNYEve(this.yStats);

        //warning : year -- todo correct
        this._lotsOfSavingOfStatisticsAboutLastYearAndCallbacks();

        this.money -= objSum(this.yStats.cost.perWh) +
                        objSum(this.yStats.cost.perYear);
        this.money += this.yStats.taxes.in;

        // the new year initialization------------------------

        //prepare stats for the new year
        this._clearYearStats();
    }

    _clearYearStats(){
        let y = this.yStats.year + 1;

        function nrgs(){
          return {fossil: 0, pv: 0, nuke:0, storage: 0, ccgt: 0, wind: 0};
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





/// load all data needed for a simulater &
/// return a promise when its ready
export function promiseSimulater(valChangedCallbacks){
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
    fetch('hydro/sea.bin')
        .then(response => response.arrayBuffer()),
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
            windPowDens:{at50:new Uint8Array(values[7])},
        };

        simuCreateInfo.hydro = {
            stations: new Float32Array(values[2]),
            pools:{map:new Uint8Array(values[4]), links:values[3]},
            sea:new Uint8Array(values[6]),
        };

        simuCreateInfo.gameplay = {
            "minTaxRate": 0.398,
            "initMoney":10000000000,
        };

        return new Simulateur(simuCreateInfo, valChangedCallbacks);
    })
    .catch(err => alert('loading error ' + err)) ;
}
