	var installed = {
		solar:[{//array start in 2020
				capacity: 0 //amount of solar panels installed in 2020 (W)
			}
		],
		nuke:{
			capacity: 0 // W
		},
		bat:[{//array start in 2020
			capacity: 0, //amount of bateries installed in 2020
			storage: 0 // chqrge level of those batteries
		},
		]
	};


class Simulateur{
	constructor(){
		this.params = {};
		
		// production means, sorted by priority (higher production mean will produce at max capa first)
		this.productionMeans = [{
			label:"pv",
			co2PerW:0, /// g co2 eq / watt
			capacity:0 /// W installed
		},
		{
			label:"ccgt",
			co2PerW:200, /// g co2 eq / watt
			capacity:100000000000 /// W installed
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
		var conso = this.params.conso.at(this.year);//watt
		console.log(this.year);
		var co2 = 0;//grammes
		
		for(let i = 0; i < 8760; i++){
			var toProduce = conso;
			
			this.productionMeans.forEach( prodMean =>{
				let realProd = Math.min(toProduce, prodMean.capacity);
				
				toProduce -= realProd;
				co2 += realProd * prodMean.co2PerW;
			});
		}
		
		this.year ++;
		this.onNewYear();
		
		console.log("co2 produced " + quantityToHuman(co2, "C") );
	}
}
