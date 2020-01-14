import LogicalComponent from './logicalcomponent.js';
import MapComponent from './mapcomponent.js';
import { quantityToHuman, plainTextEuro} from '../plot.js';

/** @brief manages all data, but DOM unaware
@details coordinates MapComponent and LogicalComponent
store general values
*/
export default class Simulateur{
  constructor(){
    this.co2Total = 0;

    this.cMap = new MapComponent();
    let self = this;

  	Promise.all(
  		[fetch('res/parameters.json').then((response) => {return response.json();}), //async load parameters.json, and interpred data as json
  // now encoded in parameters itself    	 fetch('res/pvcapfactAll365.bin').then((response) => {return response.arrayBuffer();})//interpret as arraybuf
  		])
  	.then(function(values){ //called when all simu related res are loaded
  		self.cLogic = new LogicalComponent({	parameters: values[0],
  								valChangedCallbacks:{
  									money: function(money){
  										$('.vMoney').text(plainTextEuro(money));
  									},
  									year: function(year){
  										$('.vYear').text(year);
  									},
  									totalCo2: function(co2){
  										$('.vTotalCo2').text(quantityToHuman(co2, 'C'));
  									}
  								}});
        // //print the values in the appropriates blocks
    		// for(let k in simu.params){
    		// 	$('.v' + k.charAt(0).toUpperCase() +  k.slice(1)).text(	quantityToHuman(simu.params[k].at(simu.year), simu.params[k].unit, true));
    		// }
    		// $('.vPvEffi').text(quantityToHuman(simu.params['pvEffi'].at(simu.year), '%', true));


    		$('#iTaxRate').val( self.cLogic.taxRate);
    		$('.vTaxRate').text(Math.round(self.cLogic.taxRate * 100) + '%');
    	});

  }

  /// called for each change in what to build, or where to
  onBuildMenuStateChanged(state, curPos, radius){
    // nothin to build, skip
    if(state === undefined)
      return;


    this._bm = {state:state, curPos:curPos, radius:radius};

    //ask the grid about ground usage aso
    let build = this.cMap.prepareBuild(state,
      {shape:'circle', center:curPos, radius:radius});

    //ask the simu what would happend on build
    this._currentBuild = this.cLogic.prepareCapex(build);

    return this._currentBuild;
  }

  //called on click on the map
  confirmCurrentBuild(){
    //try to execute it, and on success
    if(this.cLogic.execute(this._currentBuild))
      //save the modif on the grid
      this.cMap.build(this._bm.state,
        {shape:'circle', center:this._bm.curPos, radius:this._bm.radius});

  }

  //run
  run(){
    this.cLogic.run();

    this.co2Total +=
      this.cLogic.co2Produced.at(this.cLogic.year - 1);

    let lastYearCo2 = quantityToHuman(this.cLogic.co2Produced.at(this.cLogic.year - 1), 'C');
    lastYearCo2 = lastYearCo2.substr(0, lastYearCo2.length - 6);
    $('.vLastYearCo2').text(lastYearCo2);

    let strco2Total = quantityToHuman(this.co2Total, 'C');
    strco2Total = strco2Total.substr(0, strco2Total.length - 6);
    $('.vTotalCo2').text(strco2Total);
  }
}
