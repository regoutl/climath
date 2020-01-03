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
		

	}
	
	/// load all the constants.
	/// calls onParamLoaded when loaded
	loadParams(){
		var self = this;
		
		/// load coefficients
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
				self.params['conso'].label = "consommation annuelle totale";
				self.params['conso'].source = "population * consommation annuelle par habitant";

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
	
	
	install(){
		
	}
}
