import ProductionComponent from './productioncomponent.js';
import MapComponent from './mapcomponent.js';
import HydroComponent from './hydrocomponent.js';
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
    constructor(createInfo){
        this.cMap = new MapComponent(createInfo.map, this);
        this.cHydro = new HydroComponent(createInfo.hydro);
        this.cProd = new ProductionComponent(createInfo.production, this);


        // they would pay 30% if all spending were only for other purposes
        /// WARNING TODO check this number
        // minimum tax level. const.
        this.minTaxRate = createInfo.gameplay.minTaxRate;


        this.newGame(createInfo);
        // this.cMap.drawer.on('click',this.confirmCurrentBuild.bind(this));
    }// END OF Simulateur.constructor()

    newGame(createInfo){
        this.money  = createInfo.gameplay.initMoney;

        // Player controlled
        this.taxRate = this.minTaxRate + 0.05;

        //statistics of the previous years
        this.stats = [];
        //static (maybe partial) of the current year. see struc in _clearYearStats
        this.yStats = {};

        this.cMap.clearEnergies();

        //like if we just finished another year
        this._clearYearStats();
        this.yStats.year= 2018;
        this._newYear();
        this.stats = [];//remove the empty stat
        this.run(); //run 2019
    }

    get taxRate(){return this._taxRate;}
    set taxRate(val){
        this._taxRate = Number(val);
        if(isNaN(this._taxRate))
            throw new TypeError('NaN !!!!');

        // this.valChangedCallbacks.taxRate(this._taxRate);
    }

    get money(){return this._money;}
    set money(val){
        if(isNaN(val))
          throw 'nan';
        this._money = val;
        // this.valChangedCallbacks.money(this._money);
    }

    get year(){return this.yStats.year;}

    _getBuildMenuStateParameters(buildMenuState){
        //copy the build menu state (bc obj is modified )   NOTE : is copy desirable ?
        // add year
        return {...buildMenuState, year:this.year};
    }

    _getBuildMenuStateZone(buildMenuState){
        return {center:buildMenuState.pos, radius:buildMenuState.radius};
    }

    /// return the build info associated with a build menu state.
    // return a BuildInfo object or null if build invalid
    buildInfo(buildMenuState){
        let a  =this._buildAllInfo(buildMenuState);
        return a && a.info;
    }

    _buildAllInfo(buildMenuState){
        // nothin to build, skip
        if(!buildMenuState || !buildMenuState.type)
            return null;

        let parameters = this._getBuildMenuStateParameters(buildMenuState);

        let area = this._getBuildMenuStateZone(buildMenuState);


        let info = this._c(buildMenuState.type).buildInfo(parameters, area);

        if(info.build.cost > this._money){
            info.theorical = "cash";
        }

        if(info.build.begin != this.year){
            info.theorical = "present";
        }

        return {info: info, parameters: parameters, zone: area};
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

    //build stuff
    build(buildMenuState){
        let {info, parameters, zone} = this._buildAllInfo(buildMenuState);


        /// STEP 1 : check the build is valid-----------------------------------

        if(!info){
            return;
        }

        // dirty fix for click on buttons part of central area
        if(!zone.center)
            return false;

        if(info.theorical){
            return false;
        }


        /// do the build-----------------------------------
        this._c(buildMenuState.type).build(info, parameters);


        //draw it

        this.cMap.build(parameters, info, zone);



        //record some stats
        let action = info.build /*|| cBuild.demolish*/;

        let recorder = parameters.type;
        if(recorder == 'battery')
            recorder = 'storage';
        this.yStats.co2.build[recorder] += action.co2;
        this.yStats.cost.build[recorder] += action.cost;

        //and modify the actual value
        this.money -= action.cost;
    }

    //run
    run(){
        // console.log(this.cMap.testBoom());
        // O & M (fixed & variable)
        this.cProd.run(this.year, this.yStats);

        this._newYear();
    }

    //return current year gdp of current region
    get gdp(){
        let yStats = this.yStats;

        return this.cProd.countries.belgium.pop.at(yStats.year)
                * this.cProd.countries.belgium.gdpPerCap.at(yStats.year);
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
        // this.cScheduler.happyNYEve(this.yStats);

        //warning : year -- todo correct
        this._lotsOfSavingOfStatisticsAboutLastYearAndCallbacks();

        this.money -= objSum(this.yStats.cost.perWh) +
                        objSum(this.yStats.cost.perYear);
        this.money += this.yStats.taxes.in;

        // the new year initialization------------------------

        //prepare stats for the new year
        this._clearYearStats();
    }

    /*return the cost of demolition of the area*/
    demolishCost(zone){
        if(!zone || !zone.center)
            return;

        let cost = 0;
        let energies = this.cMap.energiesInArea(zone); //gimme everything in the area

        for(let building of energies){
            // console.log(building.type);
            if(building.type=='central'){
                cost += this.cProd.productionMeans.centrals.centrals[building.id].demolishCost;
            }
            else{
                cost += this._c(building.type) //get the prod mean
                              .demolishCost(building.buildParameters,  //ask it the demolish cost
                                            building.area);
            }
        }

        return cost;
    }

    //demolish
    demolish(zone){
        if(!zone || !zone.center)
            return 0;
        let pm = this.cProd.productionMeans;

        let cost = 0;
        let energies = this.cMap.energiesInArea(zone); //gimme everything in the area


        for(let building of energies){
            // console.log(building.type);
            if(building.type=='central'){
                cost += pm.centrals.centrals[building.id].demolishCost;
                delete pm.centrals.centrals[building.id] ;
                this.cMap.demolishCentral(building.id);
            }
            else{
                // console.log(building.buildParameters.madeIn);

                cost += this._c(building.type) //get the prod mean
                              .demolishCost(building.buildParameters,  //ask it the demolish cost
                                            building.area);


                this._c(building.type).demolish(this.year, building.buildParameters, building.area, building[building.extraDataLabel]);
                this.cMap.demolishEnergyInArea(building.buildParametersIndex, zone);
            }
        }

        this.money -= cost;
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
        // this.valChangedCallbacks.year(this.year);
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




/** @brief check if any nuclear central explode.
    @details : if a central explode, must reallocate surounding pop,
                    and estimate cost
*/
function testBoom(){
    let stat = this._centrals.reduce((tot, central, i) => {
        if(central.type === 'nuke'){
            if(rand()%nukeExplosionPeriod === 0){
                let expl = this._simulateBoom({
                    center:central.loc,
                    radius:central.dangerRadius
                }, true);
                tot.cost += expl.cost;
                tot.pop_affected += expl.pop_affected;
            }
        }
        return tot;
    }, {cost:0, pop_affected:0});
    this._centrals.filter(e => e !== -1)
    return stat;
}

function _simulateBoom(area, set){
    set = set || false;
    let topay = cleaningcost;
    let pop_affected = 0;
    let affected_central = 0;
    area.radius = nuclearDisasterRadius;
    this._forEach(area, (x,y) => {
        let sameloc = v => v !== -1 && v.loc.x === x && v.loc.y === y;
        let central_id = this._centrals.findIndex(sameloc);
        pop_affected += this.getPopDensity(x,y);
        if(set){
            this.setPx(x, y, {
                baseLandUse:0,
                nrj:0,
                pop:0,
            })
            if(central_id !== -1){
                this._rmCentral(central_id);
            }
        } else{
            affected_central += central_id !== -1 ? 1:0;
        }
    })
    if(set){
        ['energy','groundUse','popDensity'].forEach((layer, i) => {
            // this.drawer.update(layer);
        });
        // this.drawer.draw();
    }
    topay += pop_affected * meanCostToRelocate
    // TODO reallocate pop
    return {
        pop_affected: pop_affected,
        cost: topay,
        affected_central: affected_central,
    };
}

/** @brief load all data needed for a simulater
@param mapView is as defined in MapComponent's constructor
@return a promise that is resolved when ready.
**/
export function promiseSimulater(parameters, countryCode){

  return Promise.all([
        fetch('data/' + countryCode + '/gameRdy/landUse.bin')
            .then((response) => response.arrayBuffer()),
        fetch('data/' + countryCode + '/gameRdy/pvcapfactAll365.bin')
            .then((response) => response.arrayBuffer()),
        fetch('data/' + countryCode + '/gameRdy/windOnshoreCapaFact.bin')
            .then((response) => response.arrayBuffer()),
        fetch('data/' + countryCode + '/gameRdy/poolStations.bin')
            .then((response) => response.arrayBuffer()),
        fetch('data/' + countryCode + '/gameRdy/pools.json')
            .then((response) => response.json()),
        fetch('data/' + countryCode + '/gameRdy/poolMap.bin')
            .then((response) => response.arrayBuffer()),
        fetch('data/' + countryCode + '/gameRdy/popDensity.bin')
            .then(response => response.arrayBuffer()),
        fetch('data/' + countryCode + '/gameRdy/windPowDens50.bin')
            .then(response => response.arrayBuffer()),
        // fetch('data/' + countryCode + '/gameRdy/flowdisplay.bin')
        //     .then(response => response.arrayBuffer()),
    ])
    //called when all simu related res are loaded
    .then((values) => {
        let simuCreateInfo = {};

        simuCreateInfo.production = {
            parameters: parameters,
            pvCapFact: new Uint8Array(values[1]),
            windCapFact: new Uint8Array(values[2]),
        };

        simuCreateInfo.map = {
            groundUse: new Uint8Array(values[0]),
            popDensity: new Uint8Array(values[6]),
            windPowDens:{at50:new Uint8Array(values[7])},
            pools: new Uint8Array(values[5]),
            // riverDisplay: new Uint8Array(values[8]),
        };

        simuCreateInfo.hydro = {
            stations: new Float32Array(values[3]),
            pools:{links:values[4]},
        };

        simuCreateInfo.gameplay = {
            "minTaxRate": 0.398,
            "initMoney":10000000000,
        };

        return new Simulateur(simuCreateInfo);
    })
    .catch(err => alert('loading error ' + err)) ;
}
