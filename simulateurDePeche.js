
class CstCapaFact{
	constructor(value){
		this.v = value;
	}

	/// for concistency with SolarCapaFact, have the unused hour param
	at(hour){
		return this.v;
	}
	
	//check ths has loaded all the needed data
	isReady(){
		return true;
	}
}

class SolarCapaFact{
	constructor(){
		//load pv capacity factor
		let oReq = new XMLHttpRequest();
		oReq.open("GET", "res/pvcapfactAll365.bin", true);
		oReq.responseType = "arraybuffer";
		
		let self = this;
		
		oReq.onload = function(oEvent) {
			var arrayBuffer = oReq.response;
			self.pvCapaFact = new Uint8Array(arrayBuffer);
			if(self.pvCapaFact.length % (365*24) != 0){
				throw 'all years must have 365 days (got ' + self.pvCapaFact.length + ' days total)';
				self.pvCapaFact = undefined;
			}
		};
		oReq.send();
	}
	
	/// get the historical capacity factor at the given hour.
	/// hour 0 is from 0 to 1am of the 1st year of the data
	/// hour 365*24 is the first hour of the second year
	/// no need to bound check ; values wrap around
	at(hour){
		hour = hour % this.pvCapaFact.length;
		
		return this.pvCapaFact[hour] / 255.0;
	}
	
	//check ths has loaded all the needed data
	isReady(){
		return this.pvCapaFact != undefined;
	}
}

/// note : all years are assumed to be 365 days long
class Simulateur{
	constructor(){
		this.params = {};
		
		this.productionMeansOrder = ['pv', 'nuke', 'ccgt'];
		
		// production means, sorted by priority (higher production mean will produce at max capa first)
		this.productionMeans = {
		pv:{
			co2PerW: new Constant(0), /// g co2 eq / watt
			capacity:0, /// W installed
			capacityFactor: new SolarCapaFact,
			
			/// store pv with same stat. only used for yearly capacity update
			/// store, for each (powerDeclinePerYears) the installed capacity
			groups: new Map(),  
		},
		nuke:{
//defined in params			co2PerW:200, /// g co2 eq / watt
			capacity:0, /// W installed
			capacityFactor: new CstCapaFact(0.9)
		},
		ccgt:{
			co2PerW:new Constant(0.2), /// g co2 eq / watt
			capacity:100000000000, /// W installed
			capacityFactor: new CstCapaFact(1.0)
		}};
		
		this.year = 2019;
		
		this.co2Produced = new TimeVaryingInput(0.0);
		this.co2Produced.unit = 'C';
		
		this.costs = new TimeVaryingInput(0.0);
		this.costs.unit = '€';
	}
	
	/// load all the constants.
	/// calls onParamLoaded when loaded
	loadParams(){
		var self = this;
		
		// load coefficients
		$.ajax('res/parameters.json', {
			success: function (data, status, xhr) {
				let jsCoefs = data;
				
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
				
				
				
				self.productionMeans.nuke.co2PerW = self.params.nukeFootprint;
				
				if(self.onParamLoaded)
					self.onParamLoaded();
						
				//http://www.wiki-solar.org/map/world.html
			},
		
			error: function (request, status, error) {
				alert("failed to load the parameters");
			}
		});

	}
	
	/** @param what.type : pv or nuke. required.
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
	 * @return cost of the installation
	 */
	capex(what){
//		this.productionMeans[what.type].capacity += what.capa;
		let co2 = 0, cost = 0;
		if(what.type=='pv'){
			if(what.area === undefined)
				throw 'must define an area';
			
			if(what.effiMul === undefined)
				what.effiMul = 1;
			if(what.madeIn === undefined)
				what.madeIn = 'china';
			if(what.powerDecline === undefined)
				what.powerDecline = 1;
			if(what.priceMul === undefined)
				what.priceMul = 1;
			
			let capacity = what.area * this.params.pvEnergyDensity.at(this.year) * what.effiMul;
			this.productionMeans.pv.capacity += capacity;
			
			co2 = what.area * // m2
					this.params.pvCapexEnergy.at(this.year) *  // wH / m2
					this.params[what.madeIn + 'ElecFootprint'].at(this.year); // C / Wh
			cost  = what.area * what.priceMul * // m2
					this.params.pvFarmCapexCost.at(this.year);  // eur/m2
			
			if(!this.productionMeans.pv.groups.has(what.powerDecline))
				this.productionMeans.pv.groups.set(what.powerDecline, capacity);
			else
				this.productionMeans.pv.groups.set(what.powerDecline, this.productionMeans.pv.groups.get(what.powerDecline) + capacity);
		}
		else if(what.type=='nuke'){
			if(what.capa === undefined)
				throw 'must define a capa';
			co2 = 0;
			cost  = what.capa * // N
					this.params.nukeCapexCost.at(this.year) /  // eur/N
					this.params.pvEnergyDensity.at(this.year);	 // N / m2
		}
		else
			throw 'je connais pas ce genre d energie la';
		
		this.co2Produced.setAt(this.year, this.co2Produced.at(this.year) + co2);//679781166396
		this.costs.setAt(this.year, this.costs.at(this.year) + cost);

		return cost;
	}
	
	doPowerDecline(){
		this.productionMeans.pv.capacity = 0;
		
		this.productionMeans.pv.groups.forEach( (value, key, map) => {
			value *= key;
			map.set(key, value);
			this.productionMeans.pv.capacity += value;
		});
	}
	
	/// simulate using the coefs for the given year
	/// simulation is done hour by hour
	/// battery lvx is resumed from last run.
	run(){
		//check all async loads are complete
		if(this.params == undefined ||
		   !this.productionMeans['pv'].capacityFactor.isReady()){
			alert('1 sec, on charge la page');
			return;
		}
		
		
		let conso = this.params.conso.at(this.year);//watt
		console.log(this.year);
		let co2 = 0;//grammes
		let cost = 0;
		
		let yearForTheCapaFactor = rand() % 100; //chooses a random year to sample the capacity factors from
		let capaFactHour = yearForTheCapaFactor * 365*24;
		
		for(let i = 0; i < 8760; i++){
			let toProduce = conso;
			
			//for each prod mean in order
			for(let prodMeanIndex = 0; prodMeanIndex < this.productionMeansOrder.length; prodMeanIndex++){
				let prodMeanLabel = this.productionMeansOrder[prodMeanIndex];//get label
				
				let prodMean = this.productionMeans[prodMeanLabel];//get data for that prod mean
				let realProd = Math.min(toProduce, 
										prodMean.capacity * prodMean.capacityFactor.at(capaFactHour));
				
				toProduce -= realProd;
				co2 += realProd * prodMean.co2PerW.at(this.year);// this function call returns 8760 time the same value
			}
			
			capaFactHour ++;
		}
		
		this.co2Produced.setAt(this.year, this.co2Produced.at(this.year) + co2);
		this.costs.setAt(this.year, this.costs.at(this.year) + cost);
		
		console.log("co2 produced " + quantityToHuman(this.co2Produced.at(this.year), "C"));
		
		this.doPowerDecline();
		
		
		this.year ++;
		this.onNewYear();
		
	}
}
