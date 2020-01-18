import ProductionComponent from './productioncomponent.js';
import MapComponent from './mapcomponent.js';
import { quantityToHuman as valStr} from '../plot.js';
import * as Yearly from "../timevarin.js";


function objSum(object){
  if(typeof object == 'number')
    return object;
  else if(typeof object == 'object'){
    let ans = 0;
    for (var k in object){
        if (object.hasOwnProperty(k)) {
          ans += objSum(object[k]);
        }
    }
    return ans;
  }
  else {
    throw 'pfff';object
  }
}

/** @brief manages all data, but DOM unaware
@details coordinates MapComponent and LogicalComponent
store general values
*/
export class Simulateur{
  constructor(parameters, mapImgs, valChangedCallbacks){
    this.cMap = new MapComponent(mapImgs);
		this.cProd = new ProductionComponent(parameters);

    this.valChangedCallbacks = valChangedCallbacks;

    this.totalCo2 = 0;
    //note : will we incremented at th end of this constructor
    this.yStats= {year: 2019};
    this.money  = parameters.gameplay.initMoney;
    // they would pay 30% if all spending were only for other purposes
		/// WARNING TODO check this number
		// minimum tax level. const.
		this.minTaxRate = parameters.gameplay.minTaxRate;
		// Player controlled
		this.taxRate = this.minTaxRate + 0.05;


    this.co2Produced = new Yearly.Raw(0.0);
    this.co2Produced.unit = 'C';

    this.costs = new Yearly.Raw(0.0);
    this.costs.unit = '€';



    //like if we just finished another year
    this._clearYearStats();
    this._newYear();
  }

  get taxRate(){
    return this._taxRate;
  }
  set taxRate(val){
    this._taxRate = val;
    this.valChangedCallbacks.taxRate(this._taxRate);
  }

  get money(){
    return this._money;
  }
  set money(val){
    this._money = val;
    this.valChangedCallbacks.money(this._money);
  }

  get year(){
    return this.yStats.year;
  }

  get totalCo2(){
    return this._totalCo2;
  }
  set totalCo2(val){
    this._totalCo2 = val;
    this.valChangedCallbacks.totalCo2(this._totalCo2);
  }

  /// called for each change in what to build, or where to
  onBuildMenuStateChanged(state, curPos, radius){
    // nothin to build, skip
    if(state === undefined)
      return;

    state.year = this.year;

    this._bm = {state:state, curPos:curPos, radius:radius};

    //ask the grid about ground usage aso
    let build = this.cMap.prepareBuild(state,
      {shape:'circle', center:curPos, radius:radius});

    //ask the simu what would happend on build
    this._currentBuild = this.cProd.prepareCapex(build, this.year);

    if(this._currentBuild.build){
			this._currentBuild.build.can = this._currentBuild.build.cost < this._money;
		}

    return this._currentBuild;
  }

  //called on click on the map
  confirmCurrentBuild(){
    if(this._currentBuild === undefined)
      return;

    if(this._currentBuild.build.begin != this.year){ // only build in present
      console.log('can only build in present');
      return;
    }

    if(this._currentBuild.build.cost > this._money){
      console.log('no enough cash');
      return false;
    }


    this.cProd.execute(this._currentBuild);
    this.cMap.build(this._bm.state,
      {shape:'circle', center:this._bm.curPos, radius:this._bm.radius});

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
    // O & M (fixed & variable)
    this.cProd.run(this.year, this.yStats);

    this._newYear();
  }

  //return a list of all the primary (yearly coefs) data there are
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

    let countries = this.cProd.countries;

    ans.push(countries.belgium.pop);
    ans.push(countries.belgium.gdpPerCap);
    ans.push(countries.belgium.consoPerCap);

    ans.push(countries.china.elecFootprint);
//    ans.push(countries.usa.elecFootprint);

    return ans;
  }

  /** @brief compute the tax income of the previous year (called on new year)*/
  _computeTaxIncome(){
    let yStats = this.yStats;

    yStats.taxIn = this.cProd.countries.belgium.pop.at(yStats.year - 1)
            * this.cProd.countries.belgium.gdpPerCap.at(yStats.year - 1)
            * (this.taxRate - this.minTaxRate);
  }

  /**@brief go to next year.
  compute o&m, taxes of the last year
  save stats
  calls happy new year
  */
  _newYear(){
    this.yStats.year ++;

    //taxes of last year
		this._computeTaxIncome();

    //wish a happy new year to everybody
    this.cProd.happyNY(this.yStats);

    this._lotsOfSavingOfStatisticsAboutLastYearAndCallbacks();

    this.money -= objSum(this.yStats.cost.perWh) + objSum(this.yStats.cost.perYear);
    this.money += this.yStats.taxIn;



    // the new year initialization------------------------

    //prepare stats for the new year
    this._clearYearStats();
  }

  _clearYearStats(){
    let y = this.yStats.year;
    this.yStats = {
      year: y,
      consumedEnergy: {//stat about energy consumtion
        total: 0,
        origin:{fossil: 0, pv: 0, nuke:0, storage: 0}
      },
      co2:{//stat about co2 emission
  			total: 0,
  			build:{fossil: 0, pv: 0, nuke:0, storage: 0},
  			perWh:{fossil: 0, pv: 0, nuke:0, storage: 0}
  		},
      cost:{//stat about costs
        total: 0,
        build:{fossil: 0, pv: 0, nuke:0, storage: 0},
  			perWh:{fossil: 0, pv: 0, nuke:0, storage: 0},
        perYear:{fossil: 0, pv: 0, nuke:0, storage: 0}
      },
      taxIn:0
    };

  }

  _lotsOfSavingOfStatisticsAboutLastYearAndCallbacks(){
    let yStats = this.yStats;

    //compute totals
    yStats.consumedEnergy.total = objSum(yStats.consumedEnergy);
    yStats.co2.total = objSum(yStats.co2);
    yStats.cost.total = objSum(yStats.cost);



    this.lastYeatStats = yStats;

    // save the computed result
    this.co2Produced.addAt(this.year - 1,  yStats.co2.total);

    let cost = yStats.cost.total - yStats.taxIn;
    this.costs.addAt(this.year - 1, cost);

    this.totalCo2 +=
      this.co2Produced.at(this.year - 1);


    this.valChangedCallbacks.lastYearCo2(
      this.co2Produced.at(this.year - 1));
    this.valChangedCallbacks.year(this.year);
  }
}


function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
		img.crossOrigin = '';
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", err => reject(err));
    img.src = src;
  });
}

/// load all data needed for a simulater &
/// return a promise when its ready
export function promiseSimulater(valChangedCallbacks){
  return Promise.all(
    [fetch('res/parameters.json')
        .then((response) => {return response.json();}),
    // loadImage('res/landUse.png'),
    // loadImage('res/popDensity.png'),
    fetch('res/landUse.bin')
        .then((response) => {return response.arrayBuffer();})
    ])
    //called when all simu related res are loaded
  .then(function(values){
    let parameters = values[0];

    let mapImgs = {
      // groundUse:values[1],
      // popDensity:values[2],
      groundUse: new Uint8Array(values[1])
    };

    return new Simulateur(parameters, mapImgs, valChangedCallbacks);
  })
  .catch(err => {
    alert('loading error ' + err);
  }) ;
}
