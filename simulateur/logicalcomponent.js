"use strict";

import * as Yearly from "../timevarin.js";
import {quantityToHuman} from "../plot.js";
import PriorityQueue from '../res/priorityqueue.js';
import Pv from './pv.js';
import Fossil from './fossil.js';
import Storage from './storage.js';
import Nuke from './nuke.js';

/// note : all years are assumed to be 365 days long
export default class LogicalComponent{
	/// build a simulator with the given
	/** @param data.parameters : obj, the content of parameters.json
	 *  @param data.capaFactor.{prod mean name} : Uint8Array or Number or undefined. \
	 *					capacity factor of an energy. if number : cst.
	 * 					if uint8Array, value will be divided by 255. length must be a multiple of 8760 (hourly data)
	 * 					if undefined, set to 1.0
	 */
	constructor(data){
		this.valChangedCallbacks = data.valChangedCallbacks;

		this.money  = data.parameters.gameplay.initMoney;
		// they would pay 30% if all spending were only for other purposes
		/// WARNING TODO check this number
		// minimum tax level. const.
		this.minTaxRate = data.parameters.gameplay.minTaxRate;
		// Player controlled
		this.taxRate = this.minTaxRate + 0.05;


		this._initParams(data.parameters);

		//sorted by priority (higher production mean will produce at max capa first)
		//note : fossil means 'ppl use a fossil engine/ heater/wathever' aka, things that never use electricity
		this.productionMeansOrder = ['pv', 'nuke', 'storage'/*, 'ccgt'*/, 'fossil'];

		// top := next to be finished build
		this.pendingBuilds = new PriorityQueue((a, b) => a.build.end < b.build.end);

		this.productionMeans = {
			pv: new Pv(data.parameters.energies.pv),
		  nuke: new Nuke(data.parameters.energies.nuke),
			storage: new Storage(data.parameters.energies.storage),
			// ccgt: new Ccgt(data.parameters),
		  fossil: new Fossil(data.parameters.energies.fossil),
		};


		this.year = 2020;

		this.co2Produced = new Yearly.Raw(0.0);
		this.co2Produced.unit = 'C';

		this.costs = new Yearly.Raw(0.0);
		this.costs.unit = '€';
	}

/*
	_initCCGT(){
		this.productionMeans.ccgt={
			co2PerWh:new Yearly.Constant(0.2), /// g co2 eq / watt
			onmPerWh: this.params.ccgtOnM, /// todo: check this value
		};
	}
*/

	/// simulate using the coefs for the given year
	/// simulation is done hour by hour
	/// battery lvx is resumed from last run.
	run(){
		console.log(this.year);

		//init a few things------------------------------------
		let y = {co2:0, cost: 0};
		y.conso=  this.countries.belgium.pop.at(this.year) *    //watt
							this.countries.belgium.consoPerCap.at(this.year);

		//taxes
		y.cost -= this._computeTaxIncome();

		for(let prodMeanIndex = 0;
				prodMeanIndex < this.productionMeansOrder.length;
				prodMeanIndex++){
			let prodMeanLabel = this.productionMeansOrder[prodMeanIndex];//get label

			let prodMean = this.productionMeans[prodMeanLabel];//get data for that prod mean
			prodMean.happyNY(this.year, this, y);
		}


		//capacity factor sampling hour
		let yearForTheCapaFactor = rand() % 100; //chooses a random year to sample the capacity factors from
		y.capaFactHour = yearForTheCapaFactor * 365*24;
		y.storageIndex = this.productionMeansOrder.indexOf('storage');

		//simulate hour by hour------------------------------------
		for(let i = 0; i < 8760; i++){
			this._runHour(y);
		}

		// save the computed result
		this.co2Produced.addAt(this.year,  y.co2);
		this.costs.addAt(this.year, y.cost);
		this.money -= y.cost;


		console.log("co2 produced " + quantityToHuman(this.co2Produced.at(this.year), "C"));

		this.year ++;

		this._processPendingBuilds();
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


	/** @brief get the data about an installation
	 * @param what.type : pv or nuke. required.
	 * IF what.type == pv => check PV.prepareCapex
	 * IF what.type == batter => check Storage.prepareCapex
	 *
	 * @param beginBuildYear year of the build (of the click). default value : current year.
	 * @note for demolish, still pass the year of the beginning of the construction.
	 *
	 * @returns : check the specialized functions. but always returns
	 * IF nameplate > 0
	 * 			{build.co2  	  : co2 for the build
	 * 			build.cost      : cost of the build
	 * 			build.begin		: year of the beginning of the build (@see param startBuildYear)
	 * 			build.end		: year of the 1st production
	 * 			}
	 * ELSE
	 * 			{demolish.co2  	  : co2 for the demolish
	 * 			demolish.cost      : cost of the demolish
	 * 			nameplate : (Yearly value) peak watt production (will be negative)
	 * 			}
	 * ENDIF
	 */
	prepareCapex(what, beginBuildYear = undefined){
		if(beginBuildYear === undefined)
			beginBuildYear = this.year;

		let ans;
		if(what.type == 'battery')
			ans = this.productionMeans.storage.prepareCapex(what, beginBuildYear, this.countries);
		else
			ans = this.productionMeans[what.type]
						.prepareCapex(what, beginBuildYear, this.countries);

		if(ans.build){
			ans.build.can = ans.build.cost < this._money;
		}

		Object.freeze(ans);

		return ans;

		// //~ else if(what.type=='nuke'){
		// 	//~ if(what.capa === undefined)
		// 		//~ throw 'must define a capa';
		// 	//~ ans.co2 = 0;
		// 	//~ ans.cost  = what.capa * // N
		// 			//~ this.params.nukeCapexCost.at(this.year);  // eur/N
		// 	//~ ans.nameplate = what.capa;
		// //~ }
		//
		//
		// //modify the ans if unbuild
		// if(ans.nameplate.at(ans.build.end) < 0){
		// 	ans.demolish = {};
		//
		// 	ans.demolish.co2 = 0; //unbuild produces no co2
		// 	ans.demolish.cost =   -ans.build.cost * this.productionMeans[ans.type].deconstructionRatio;
		//
		// 	ans.build = undefined;
		// }
		//
		//
		// //no modif on the ans plz (garante no compute mistake)
		// Object.freeze(ans);
		// return ans;
	}

	/** @brief build stuff. vals is the object returned by capexStat
	 *  @ex capex(prepareCapex({type:pv, area:10})) // build 10 m2 of pv
	 * @note : the build begin year must be the current one
	 @return true on success.
	 */
	execute(cmd){
		if(cmd.build){
			if(cmd.build.begin !== this.year){
				console.log('can only build in present');
				return false;
			}
			if(cmd.build.cost > this._money){
				console.log('no enough cash');
				return false;
			}

			this.pendingBuilds.push(cmd);
		}
		else if(cmd.demolish)
			this._processBuild(cmd);

		//record some stats
		let action = cmd.build || cmd.demolish;

		this.co2Produced.addAt(this.year, action.co2);
		this.costs.addAt(this.year, action.cost);

		//and modify the actual value
		this.money -= action.cost;

		return true;
	}

	// ///wrapper around eval. usage ex : evaluate('pop * gdpPerCap')
	// /// if year is ommited, uses the current year
	// /// only work with parameters
	// evaluate(expr, year = undefined){
	// 	if(year === undefined)
	// 		year = this.year;
	//
	// 	let replaced = expr.replace(/\w*/g, 'this.params.$&.at(' + year + ')');
	// 	return eval(replaced);
	// }

	_computeTaxIncome(){
		return this.countries.belgium.pop.at(this.year)
		 				* this.countries.belgium.gdpPerCap.at(this.year)
					  * (this.taxRate - this.minTaxRate);
	}


	/**
	* @brief simulate a hour in a year : compute co2 and cost; tries to load the storage
	*/
	_runHour(y){
		let toProduce = y.conso;
		let fillingBatteries = false;
		let produceUntill = this.productionMeansOrder.length;

		//for each prod mean in order
		for(let prodMeanIndex = 0;
				prodMeanIndex < produceUntill;
				prodMeanIndex++){
			let prodMeanLabel
			 		= this.productionMeansOrder[prodMeanIndex];//get label

			let prodMean = this.productionMeans[prodMeanLabel];//get data for that prod mean

			//maximum amound that this production mean can produce at this hour
			let canProduce = prodMean.capacityAt(y.capaFactHour);
			if(canProduce == 0)//this energy is useless
				continue;

			//amount that this prod mean should produce
			let production = Math.min(toProduce, canProduce);

			prodMean.produce(production, y);

			// decrease the leftover envergy needed by how much this enegry produces
			toProduce -= production;

			// if we produced everything we needed, start to load batteries or break
			if(toProduce == 0){
				//we are done filling the batteries => stop
				if(fillingBatteries)
					break;

				//if we passed the storage unloading, dont try to load the storage
				if(prodMeanIndex >= y.storageIndex)
					break;

				//we will stop the prod mean loop just before unloading the batteries
				produceUntill = y.storageIndex;

				// try to produce energy so that all batteries are full
				toProduce = this.productionMeans.storage.maxInput();
				fillingBatteries = true;

				//finishes the production of current energy mean
				canProduce = canProduce - production;

				production = Math.min(toProduce, canProduce);
				prodMean.produce(production, y);
				toProduce -= production;
			}
		}

		let batIn = 0;
		if(fillingBatteries)
			batIn = this.productionMeans.storage.maxInput() - toProduce;

		this.productionMeans.storage.runHour(batIn);

		y.capaFactHour ++;
	}



	_processPendingBuilds(){
		let a =this.pendingBuilds.peek();
		while(a && a.build.end == this.year){
			this._processBuild(this.pendingBuilds.pop());

			a =this.pendingBuilds.peek();
		}
	}

	_processBuild(build){

		build.pm.capex(build);

	}

	/// private function. init a lot of thing based on parametesr.json
	_initParams(jsCoefs){
		this.countries = {belgium:{}, china:{}};

		let be = this.countries.belgium;
		be.pop = new Yearly.Raw(0);
		be.pop.fromJSON(jsCoefs.countries.belgium.pop);
		be.gdpPerCap = new Yearly.Raw(0);
		be.gdpPerCap.fromJSON(jsCoefs.countries.belgium.gdpPerCap);
		be.consoPerCap = new Yearly.Raw(0);
		be.consoPerCap.fromJSON(jsCoefs.countries.belgium.consoPerCap);

		be.irradiance = jsCoefs.countries.belgium.irradiance;

		// be.conso = new Yearly.Mult(be.pop, be.consoPerCap);
		// be.conso.label = "consommation totale";
		// be.conso.source = "population * consommation par habitant";

		let china = this.countries.china;
		china.elecFootprint = new Yearly.Raw(0);
		china.elecFootprint.fromJSON(jsCoefs.countries.china.elecFootprint);



/*		let self = this;

		self.params = {};
		// all the coefs

		for(let attrN in jsCoefs.tvi){
			self.params[attrN] = new Yearly.Raw(0);
			self.params[attrN].fromJSON(jsCoefs.tvi[attrN]);
		}

		// some derived quantities, might change
		self.params['pvEnergyDensity'] = new Yearly.Mult(self.params['pvEffi'], new Yearly.Constant(1000 * 63 / 210));//wh/m2
		self.params['pvEnergyDensity'].label = "Densite energetique des panneaux solaires";
		self.params['pvEnergyDensity'].source = "Estime via les stats des fermes solaires allemandes de berlin (irradiance similaire a la belgique)";
		self.params['pvEnergyDensity'].unit = 'N/m2';

		self.params['conso'] = new Yearly.Mult(self.params['pop'], self.params['consoPerCap']);
		self.params['conso'].label = "consommation totale";
		self.params['conso'].source = "population * consommation par habitant";

		self.params['nukeDeco'] = new Yearly.Mult(self.params['nukeCapexCost'], new Yearly.Constant(jsCoefs.nuke.decommissioningRatio));
		self.params['nukeDeco'].label = "Couts de démantèlement du nucleaire";
		self.params['nukeDeco'].source = "https://www.oecd-nea.org/ndd/pubs/2010/6819-projected-costs.pdf";

		self.params['pvDeco'] = new Yearly.Mult(self.params['pvFarmCapexCost'], new Yearly.Constant(jsCoefs.pv.decommissioningRatio));
		self.params['pvDeco'].label = "Couts de démantèlement du photovoltaique";
		self.params['pvDeco'].source = "https://www.oecd-nea.org/ndd/pubs/2010/6819-projected-costs.pdf";*/
	}

}
