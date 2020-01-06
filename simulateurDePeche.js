
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
		oReq.open("GET", "pvcapfactAll365.bin", true);
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
		
		// production means, sorted by priority (higher production mean will produce at max capa first)
		this.productionMeans = [{
			label:"pv",
			co2PerW:0, /// g co2 eq / watt
			capacity:0, /// W installed
			capacityFactor: new SolarCapaFact
		},
		{
			label:"ccgt",
			co2PerW:200, /// g co2 eq / watt
			capacity:100000000000, /// W installed
			capacityFactor: new CstCapaFact(1.0)
		}
		];
		
		this.year = 2019;
	}
	
	/// load all the constants.
	/// calls onParamLoaded when loaded
	loadParams(){
		var self = this;
		
		// load coefficients
		$.ajax('parameters.json', {
			success: function (data, status, xhr) {
				var jsCoefs = data;
				
				// all the coefs
							
				for(var attrN in jsCoefs.tvi){
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

				self.params['nukeDeco'] = new Mult(self.params['nukeCapex'], new Constant(jsCoefs.nuke.decommissioningRatio));
				self.params['nukeDeco'].label = "Couts de démantèlement du nucleaire";
				self.params['nukeDeco'].source = "https://www.oecd-nea.org/ndd/pubs/2010/6819-projected-costs.pdf";

				self.params['pvDeco'] = new Mult(self.params['pvFarmCapexCost'], new Constant(jsCoefs.pv.decommissioningRatio));
				self.params['pvDeco'].label = "Couts de démantèlement du photovoltaique";
				self.params['pvDeco'].source = "https://www.oecd-nea.org/ndd/pubs/2010/6819-projected-costs.pdf";
				
				
				if(self.onParamLoaded)
					self.onParamLoaded();
						
				//http://www.wiki-solar.org/map/world.html
			},
		
			error: function (request, status, error) {
				alert("failed to load the parameters");
			}
		});

	}
	
	
	addPv(capa){
		this.productionMeans[0].capacity += capa;
	}
	
	/// simulate using the coefs for the given year
	/// simulation is done hour by hour
	/// battery lvx is resumed from last run.
	run(){
		//check all async loads are complete
		if(this.params == undefined ||
		   !this.productionMeans[0].capacityFactor.isReady()){
			alert('1 sec, on charge la page');
			return;
		}
		
		
		let conso = this.params.conso.at(this.year);//watt
		console.log(this.year);
		let co2 = 0;//grammes
		
		let yearForTheCapaFactor = rand() % 100; //chooses a random year to sample the capacity factors from
		let capaFactHour = yearForTheCapaFactor * 365*24;
		
		for(let i = 0; i < 8760; i++){
			let toProduce = conso;
			
			this.productionMeans.forEach( prodMean => {
				let realProd = Math.min(toProduce, prodMean.capacity * prodMean.capacityFactor.at(capaFactHour));
				
				toProduce -= realProd;
				co2 += realProd * prodMean.co2PerW;
			});
			
			capaFactHour ++;
		}
		
		this.year ++;
		this.onNewYear();
		
		console.log("co2 produced " + quantityToHuman(co2, "C"));
	}
}
