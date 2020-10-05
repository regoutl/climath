// Copyright 2020, ASBL Math for climate, All rights reserved.
"use strict";

import * as Yearly from "../timevarin.js";
import Pv from './pv.js';
// import Fossil from './fossil.js';
import Storage from './storage.js';
// import Nuke from './nuke.js';
// import Ccgt from './ccgt.js';
import Wind from './wind.js';

import ThermicCentral from './thermiccentral.js';


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
	constructor(parameters, simu){
		let params = parameters.parameters;
		this._initCountries(params.countries);

		//sorted by priority (higher production mean will produce at max capa first)
		//note : fossil means 'ppl use a fossil engine/ heater/wathever' aka, things that never use electricity
		this.productionMeansOrder = ['pv', 'wind', 'storage', 'centrals'];


		this.productionMeans = {
			pv: new Pv(params.energies.pv, parameters.pvCapFact, simu),
			wind: new Wind(params.energies.wind, parameters.windCapFact, simu),
		  // nuke: new Nuke(parameters.energies.nuke, simu),
			storage: new Storage(params.energies.storage, simu),
			// ccgt: new Ccgt(parameters.energies.ccgt, simu),
		  // fossil: new Fossil(parameters.energies.fossil, simu),
			centrals : new ThermicCentral(params.energies, simu),
		};
	}

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

			if(!fillingBatteries && prodMeanLabel != 'centrals')
				out.consumedEnergy.origin[prodMeanLabel] += production;

			prodMean.produce(production, out, out._capaFactHour % 8760);

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

				// alert('bat');

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
