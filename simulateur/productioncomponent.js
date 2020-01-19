"use strict";

import * as Yearly from "../timevarin.js";
import PriorityQueue from '../res/priorityqueue.js';
import Pv from './pv.js';
import Fossil from './fossil.js';
import Storage from './storage.js';
import Nuke from './nuke.js';

/// note : all years are assumed to be 365 days long
/** @brief compute the hourly demand meeting and building*/
export default class ProductionComponent{
	/// build a simulator with the given
	/** @param parameters : obj, the content of parameters.json
	 *  @param capaFactor.{prod mean name} : Uint8Array or Number or undefined. \
	 *					capacity factor of an energy. if number : cst.
	 * 					if uint8Array, value will be divided by 255. length must be a multiple of 8760 (hourly data)
	 * 					if undefined, set to 1.0
	 */
	constructor(parameters){
		this._initCountries(parameters.countries);

		//sorted by priority (higher production mean will produce at max capa first)
		//note : fossil means 'ppl use a fossil engine/ heater/wathever' aka, things that never use electricity
		this.productionMeansOrder = ['pv', 'nuke', 'storage'/*, 'ccgt'*/, 'fossil'];

		// top := next to be finished build
		this.pendingBuilds = new PriorityQueue((a, b) => a.build.end < b.build.end);

		this.productionMeans = {
			pv: new Pv(parameters.energies.pv),
		  nuke: new Nuke(parameters.energies.nuke),
			storage: new Storage(parameters.energies.storage),
			// ccgt: new Ccgt(parameters),
		  fossil: new Fossil(parameters.energies.fossil),
		};
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
/** @note out.stats is reset to
out.stats.consumedEnergy := {
	origin:{ // note : sum = 1, energy used to load batteries not included
		fossil: float,
		pv: float,
		nuke: float,
		battery: float
	},
	total: float //wh consumed this year
}
	*/
	run(year, out){
		//init a few things------------------------------------
		out._conso=  this.countries.belgium.pop.at(year) *    //watt
							this.countries.belgium.consoPerCap.at(year);

		//capacity factor sampling hour
		let yearForTheCapaFactor = rand() % 100; //chooses a random year to sample the capacity factors from
		out._capaFactHour = yearForTheCapaFactor * 365*24;
		out._storageIndex = this.productionMeansOrder.indexOf('storage');

		//simulate hour by hour------------------------------------
		for(let i = 0; i < 8760; i++){
			this._runHour(out);
		}
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
	prepareCapex(what, beginBuildYear){

		let ans;
		if(what.type == 'battery')
			ans = this.productionMeans.storage.prepareCapex(what, beginBuildYear, this.countries);
		else
			ans = this.productionMeans[what.type]
						.prepareCapex(what, beginBuildYear, this.countries);

		ans.theorical = what.theorical;

		return ans;

		// //modify the ans if unbuild
		// if(ans.nameplate.at(ans.build.end) < 0){
		// 	ans.demolish = {};
		//
		// 	ans.demolish.co2 = 0; //unbuild produces no co2
		// 	ans.demolish.cost =   -ans.build.cost * this.productionMeans[ans.type].deconstructionRatio;
		//
		// 	ans.build = undefined;
		// }
	}

	/** @brief build stuff. vals is the object returned by capexStat
	 *  @ex capex(prepareCapex({type:pv, area:10})) // build 10 m2 of pv
	 * @note : the build begin year must be the current one
	 @return true on success.
	 */
	execute(cmd){
		if(!cmd)
			return;

		if(cmd.build){
			this.pendingBuilds.push(cmd);
		}
		else if(cmd.demolish)
			this._processBuild(cmd);


		return true;
	}

	happyNYEve(yStats){
		for (var prodMean in this.productionMeans) {
		    if (!this.productionMeans.hasOwnProperty(prodMean)) continue;

				this.productionMeans[prodMean].happyNYEve(yStats);
		}

		 this._processPendingBuilds(yStats.year);
	}

	/**
	* @brief simulate a hour in a year : compute co2 and cost; tries to load the storage
	*/
	_runHour(out){
		let toProduce = out._conso;
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
			let canProduce = prodMean.capacityAt(out._capaFactHour);
			if(canProduce == 0)//this energy is useless
				continue;

			//amount that this prod mean should produce
			let production = Math.min(toProduce, canProduce);

			if(!fillingBatteries)
				out.consumedEnergy.origin[prodMeanLabel] += production;

			prodMean.produce(production, out);

			// decrease the leftover envergy needed by how much this enegry produces
			toProduce -= production;

			// if we produced everything we needed, start to load batteries or break
			if(toProduce == 0){
				//we are done filling the batteries => stop
				if(fillingBatteries)
					break;

				//if we passed the storage unloading, dont try to load the storage
				if(prodMeanIndex >= out._storageIndex)
					break;

				//we will stop the prod mean loop just before unloading the batteries
				produceUntill = out._storageIndex;

				// try to produce energy so that all batteries are full
				toProduce = this.productionMeans.storage.maxInput();
				fillingBatteries = true;

				//finishes the production of current energy mean
				canProduce = canProduce - production;

				production = Math.min(toProduce, canProduce);
				prodMean.produce(production, out);
				toProduce -= production;
			}
		}

		let batIn = 0;
		if(fillingBatteries)
			batIn = this.productionMeans.storage.maxInput() - toProduce;

		this.productionMeans.storage.runHour(batIn);

		out._capaFactHour ++;
	}



	_processPendingBuilds(year){
		let a =this.pendingBuilds.peek();
		while(a && a.build.end == year+1){
			this._processBuild(this.pendingBuilds.pop());

			a =this.pendingBuilds.peek();
		}
	}

	_processBuild(build){

		build.pm.capex(build);

	}

	/// private function. init a lot of thing based on parametesr.json
	_initCountries(countries){
		this.countries = {belgium:{}, china:{}};

		let be = this.countries.belgium;
		be.pop = new Yearly.Raw(0);
		be.pop.fromJSON(countries.belgium.pop);
		be.gdpPerCap = new Yearly.Raw(0);
		be.gdpPerCap.fromJSON(countries.belgium.gdpPerCap);
		be.consoPerCap = new Yearly.Raw(0);
		be.consoPerCap.fromJSON(countries.belgium.consoPerCap);

		be.irradiance = countries.belgium.irradiance;

		// be.conso = new Yearly.Mult(be.pop, be.consoPerCap);
		// be.conso.label = "consommation totale";
		// be.conso.source = "population * consommation par habitant";

		let china = this.countries.china;
		china.elecFootprint = new Yearly.Raw(0);
		china.elecFootprint.fromJSON(countries.china.elecFootprint);



/*	// some derived quantities, might change
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
