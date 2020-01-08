"use strict";



/// note : all years are assumed to be 365 days long
export default class Simulateur{
	/// build a simulator with the given 
	/** @param data.parameters : obj, the content of parameters.json
	 *  @param data.capaFactor.{prod mean name} : Uint8Array or Number or undefined. \
	 *					capacity factor of an energy. if number : cst. 
	 * 					if uint8Array, value will be divided by 255. length must be a multiple of 8760 (hourly data)
	 * 					if undefined, set to 1.0
	 */
	constructor(data){
		this.valChangedCallbacks = data.valChangedCallbacks;
		
		this.money  = 10000000000;
		//pop pay 35% of their gdp in tax. Player controlled
		this.taxRate = 0.35;  
		// they would pay 30% if all spending were only for other purposes
		/// WARNING TODO check this number
		// minimum tax level. const. 
		this.minTaxRate = 0.3; 
		
		
		this.initParams(data.parameters);
		
		//sorted by priority (higher production mean will produce at max capa first)
		//note : fossil means 'ppl use a fossil engine/ heater/wathever' aka, things that never use electricity
		this.productionMeansOrder = ['pv', 'nuke', 'ccgt', 'fossil'];
		
		// production means
		this.productionMeans = {
			pv:{
				co2PerWh: new Constant(0), /// g co2 eq / watt
				
				/// store pv with same stat. only used for yearly capacity update
				/// store, for each (powerDeclinePerYears) the installed capacity
				groups: new Map(),  
				area: 0, ///m2 installed. usefull for o&m compute
				onmPerWh: new Constant(0), //does not matter whether it produces or not
			},
			nuke:{
				co2PerWh: this.params.nukeFootprint,
				onmPerWh: this.params.nukeOnM,
			},
			ccgt:{
				co2PerWh:new Constant(0.2), /// g co2 eq / watt
				onmPerWh: this.params.ccgtOnM, /// todo: check this value
			},
			fossil:{ // this is the energy not event going through electric form
				//todo : check this number
				// todo : move those hard coded values to parameters.json
				co2PerWh:new Constant(0.3), /// g co2 eq / watt
					// O & M = 0 bc payed by the citizen directly. 
					//todo: take citizens saving into account for the tax system when they pay less fossil fuel
				onmPerWh: new Constant(0),  
			}
		};
		
		this.storageMeans = {
			/** array of batteries (map BatSpec => stored). 
			 * struct BatterySpec{
			 * 	storageCapacity: R wh
			 *  stored : 		 R wh
			 *  storageCapaDecline:   [0-1] yearly storage capacity evolution
			 *  loadCoef		[0-1] 'energy actually Stored'/'energy injected'
			 *  unloadCoef	    [0-1] 'energy output'/'actual discharge'
			 * 		note : loadCoef * unloadCoef = roundtrip efficiency
			 *  selfDischarge [0-1] hourly stored energy evolution (note : prec is enough, I checked)
			 * }
			 */
			bat:new Map() 
		};
		
		//load the capacity factors per prod mean
		for(let mean in this.productionMeans){
			//note : fossil fuel have unlimited installed capacity
			this.productionMeans[mean].capacity = data.parameters.initInstalledCapa[mean] * data.parameters.initInstalledCapa.valMul; //W installed
			
			if(data.capaFactor[mean] === undefined)
				data.capaFactor[mean] = 1.0;
			
			if(data.capaFactor[mean] instanceof Uint8Array){
				if(data.capaFactor[mean].length % (365*24) != 0){
					throw 'all years must have 365 days (got ' + data.capaFactor[mean].length + ' days total for tech ' + mean + ' )';
				}
				this.productionMeans[mean].capacityFactor = data.capaFactor[mean];
			}
			else
				this.productionMeans[mean].capacityFactor = [data.capaFactor[mean] * 255];
			
		}

		
		this.year = 2019;
		
		this.co2Produced = new TimeVaryingInput(0.0);
		this.co2Produced.unit = 'C';
		
		this.costs = new TimeVaryingInput(0.0);
		this.costs.unit = '€';
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
	
	/// private function. init a lot of thing based on parametesr.json
	initParams(jsCoefs){
		let self = this;
		
		self.params = {};
		// all the coefs
					
		for(let attrN in jsCoefs.tvi){
			self.params[attrN] = new TimeVaryingInput(0);
			self.params[attrN].fromJSON(jsCoefs.tvi[attrN]);
		}
					
		// some derived quantities, might change
		self.params['pvEnergyDensity'] = new Mult(self.params['pvEffi'], new Constant(1000 * 63 / 210));//wh/m2
		self.params['pvEnergyDensity'].label = "Densite energetique des panneaux solaires";
		self.params['pvEnergyDensity'].source = "Estime via les stats des fermes solaires allemandes de berlin (irradiance similaire a la belgique)";
		self.params['pvEnergyDensity'].unit = 'N/m2';
		
		self.params['conso'] = new Mult(self.params['pop'], self.params['consoPerCap']);
		self.params['conso'].label = "consommation totale";
		self.params['conso'].source = "population * consommation par habitant";

		self.params['nukeDeco'] = new Mult(self.params['nukeCapexCost'], new Constant(jsCoefs.nuke.decommissioningRatio));
		self.params['nukeDeco'].label = "Couts de démantèlement du nucleaire";
		self.params['nukeDeco'].source = "https://www.oecd-nea.org/ndd/pubs/2010/6819-projected-costs.pdf";

		self.params['pvDeco'] = new Mult(self.params['pvFarmCapexCost'], new Constant(jsCoefs.pv.decommissioningRatio));
		self.params['pvDeco'].label = "Couts de démantèlement du photovoltaique";
		self.params['pvDeco'].source = "https://www.oecd-nea.org/ndd/pubs/2010/6819-projected-costs.pdf";
	}
	
	/** @brief get the data about an installation 
	 * @param what.type : pv or nuke. required.
	 * IF what.type == pv 
	 * 		@param what.area : R. m^2 . required.
	 *      @param what.effiMul : [0-1], default val = 1
	 *      @param what.madeIn : {china, usa} , default val = china
	 *      @param what.powerDecline : [0, 1] , power decline per year. 
	 * 						nextYearCapa = thisYearCapa * powerDecline.   
	 * 						default val = 1.
	 *      @param what.priceMul : R, coef of price for installation. 
	 * 						default val = 1
	 * 
	 * todo:		@param what.seller : {sunPower ,Panasonic, JinkoSolar}. set above params (see parameters.json)
	 * ELSEIF what.type == nuke
	 * 		@param what.capa : R. Watt (nameplate) . required.
	 * ENDIF
	 * @param what.capa : watt nameplate installed. note : can be negative
	 * 
	 * @param buildYear year of the build. default value : current year. 
	 *
	 * returns {co2  	  : co2 for the build
	 * 			cost      : cost of the build
	 * 			nameplate : peak watt production
	 * 			otherStuff: pass internal data 
	 * 			}
	 */
	prepareCapex(what, buildYear = undefined){
		let ans = {co2: 0, cost: 0, nameplate: 0};
		ans.type = what.type;
		
		if(what.type=='pv'){
			if(what.area === undefined)
				throw 'must define an area';
			ans.area = what.area;
			
			if(what.effiMul === undefined)
				what.effiMul = 1;
			if(what.madeIn === undefined)
				what.madeIn = 'china';
			if(what.powerDecline === undefined)
				what.powerDecline = 1;
			if(what.priceMul === undefined)
				what.priceMul = 1;

			ans.powerDecline = what.powerDecline;
			
			ans.nameplate = what.area * this.params.pvEnergyDensity.at(this.year) * what.effiMul;
			
			ans.co2 = what.area * // m2
					this.params.pvCapexEnergy.at(this.year) *  // wH / m2
					this.params[what.madeIn + 'ElecFootprint'].at(this.year); // C / Wh
			ans.cost  = what.area * what.priceMul * // m2
					this.params.pvFarmCapexCost.at(this.year);  // eur/m2
		}
		else if(what.type=='nuke'){
			if(what.capa === undefined)
				throw 'must define a capa';
			ans.co2 = 0;
			ans.cost  = what.capa * // N
					this.params.nukeCapexCost.at(this.year);  // eur/N
			ans.nameplate = what.capa;
		}
		else
			throw 'je connais pas ce genre d energie la';
			
		return ans;
	}
	
	/** @brief build stuff. vals is the object returned by capexStat
	 *  @ex capex(prepareCapex({type:pv, area:10})) // build 10 m2 of pv
	 */
	capex(vals){
		if(vals.nameplate === undefined)
			throw 'plz call prepareCapex';
		
		this.productionMeans[vals.type].capacity += vals.nameplate;
		
		//some weird shit around pv
		if(vals.type=='pv'){
			this.productionMeans.pv.area += vals.area;
			
			if(!this.productionMeans.pv.groups.has(vals.powerDecline))
				this.productionMeans.pv.groups.set(vals.powerDecline, vals.nameplate);
			else
				this.productionMeans.pv.groups.set(vals.powerDecline, 
						this.productionMeans.pv.groups.get(vals.powerDecline) + vals.nameplate);
		}
		
		//record some stats
		this.co2Produced.setAt(this.year, this.co2Produced.at(this.year) + vals.co2);
		this.costs.setAt(this.year, this.costs.at(this.year) + vals.cost);

		//and modify the actual value
		this.money -= vals.cost;
	}
	
	/// decrease pv capex according to the power decline coef
	_doPowerDecline(){
		this.productionMeans.pv.capacity = 0;
		
		this.productionMeans.pv.groups.forEach( (value, key, map) => {
			value *= key;
			map.set(key, value);
			this.productionMeans.pv.capacity += value;
		});
	}
		
	///wrapper around eval. usage ex : evaluate('pop * gdpPerCap')
	/// if year is ommited, uses the current year
	/// only work with parameters
	evaluate(expr, year = undefined){
		if(year === undefined)
			year = this.year;
		
		let replaced = expr.replace(/\w*/g, 'this.params.$&.at(' + year + ')');
		return eval(replaced);
	}
	
	_computeTaxIncome(){
		return this.params.pop.at(this.year) * this.params.gdpPerCap.at(this.year) * (this.taxRate - this.minTaxRate);
	}
	
	_computeFixedOnM(){
		return  this.productionMeans.pv.area * this.params.pvOnM.at(this.year); // pv
	}
	
	/// simulate using the coefs for the given year
	/// simulation is done hour by hour
	/// battery lvx is resumed from last run.
	run(){
		let conso = this.params.conso.at(this.year);//watt
		console.log(this.year);
		let co2 = 0;//grammes
		let cost = 0;
		
		//taxes
		cost -= this._computeTaxIncome();
		//O & M
		cost += this._computeFixedOnM();
		
		let yearForTheCapaFactor = rand() % 100; //chooses a random year to sample the capacity factors from
		let capaFactHour = yearForTheCapaFactor * 365*24;
		
		for(let i = 0; i < 8760; i++){//for each hour
//			let res = this._run1Hour(i);
			let toProduce = conso;
			
			//for each prod mean in order
			for(let prodMeanIndex = 0; prodMeanIndex < this.productionMeansOrder.length; prodMeanIndex++){
				let prodMeanLabel = this.productionMeansOrder[prodMeanIndex];//get label
				
				let prodMean = this.productionMeans[prodMeanLabel];//get data for that prod mean
				let realProd = Math.min(toProduce, 
										prodMean.capacity * prodMean.capacityFactor[capaFactHour % prodMean.capacityFactor.length] / 255.0); //perf note : mod 1 a lot
				
				toProduce -= realProd;
				co2 += realProd * prodMean.co2PerWh.at(this.year);// perf note : this function call returns 8760 time the same value
				cost += realProd * prodMean.onmPerWh.at(this.year);
			}
			
			
			capaFactHour ++;
		}
		
		this.co2Produced.setAt(this.year, this.co2Produced.at(this.year) + co2);
		this.costs.setAt(this.year, this.costs.at(this.year) + cost);
		this.money -= cost;

		
		console.log("co2 produced " + quantityToHuman(this.co2Produced.at(this.year), "C"));
		
		this._doPowerDecline();
		
		
		this.year ++;
		
	}
}
