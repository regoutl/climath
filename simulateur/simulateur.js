import ProductionComponent from './productioncomponent.js';
import MapComponent from './mapcomponent.js';
import { quantityToHuman as valStr} from '../plot.js';
import * as Yearly from "../timevarin.js";

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
    this.year = 2020;
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
    return this._year;
  }
  set year(val){
    this._year = val;
    this.valChangedCallbacks.year(this._year);
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


    //try to execute it, and on success
    this.cProd.execute(this._currentBuild);
    //save the modif on the grid
    this.cMap.build(this._bm.state,
      {shape:'circle', center:this._bm.curPos, radius:this._bm.radius});

    //record some stats
    let action = this._currentBuild.build || this._currentBuild.demolish;

    this.co2Produced.addAt(this.year, action.co2);
    this.costs.addAt(this.year, action.cost);

    //and modify the actual value
    this.money -= action.cost;

    this._currentBuild = undefined;
  }

  //run
  run(){
    console.log(this.year);

    let y = {co2:0, cost: 0};

    //taxes
		y.cost -= this._computeTaxIncome();

    // O & M (fixed & variable)
    this.cProd.run(this.year, y);


    // save the computed result
		this.co2Produced.addAt(this.year,  y.co2);
		this.costs.addAt(this.year, y.cost);
		this.money -= y.cost;

    this.totalCo2 +=
      this.co2Produced.at(this.year - 1);

    this.year ++;

    this.valChangedCallbacks.lastYearCo2(this.co2Produced.at(this.year - 1));
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

  _computeTaxIncome(){
    return this.cProd.countries.belgium.pop.at(this.year)
            * this.cProd.countries.belgium.gdpPerCap.at(this.year)
            * (this.taxRate - this.minTaxRate);
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

/// load all data needed for a simulater & return a promise when its ready
export function promiseSimulater(valChangedCallbacks){
  return Promise.all(
    [fetch('res/parameters.json').then((response) => {return response.json();}),
    // loadImage('res/landUse.png'),
    // loadImage('res/popDensity.png'),
    fetch('res/landUse.bin').then((response) => {return response.arrayBuffer();})
    ])
  .then(function(values){ //called when all simu related res are loaded
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
