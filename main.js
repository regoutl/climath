"use strict";

import * as BuildMenu from './buildmenu.js';

import Simulateur from './simulateurDePeche.js';
import * as mapNav from './moveIt.js';
import {Plot, canvasEnablePloting, quantityToHuman, plainTextEuro} from './plot.js';



$(function(){

	$('.vCountryName').text("Belgique");


//	let loadParamsPromice = loadDataFile('res/parameters.json');

	let simu;
	Promise.all(
		[fetch('res/parameters.json').then((response) => {return response.json();}), //async load parameters.json, and interpred data as json
// now encoded in parameters itself    	 fetch('res/pvcapfactAll365.bin').then((response) => {return response.arrayBuffer();})//interpret as arraybuf
		])
	.then(function(values){ //called when all simu related res are loaded
		simu = new Simulateur({	parameters: values[0],
								valChangedCallbacks:{
									money: function(money){
										$('.vMoney').text(plainTextEuro(money));
									},
									year: function(year){
										$('.vYear').text(year);
									}
								}});


		// //print the values in the appropriates blocks
		// for(let k in simu.params){
		// 	$('.v' + k.charAt(0).toUpperCase() +  k.slice(1)).text(	quantityToHuman(simu.params[k].at(simu.year), simu.params[k].unit, true));
		// }
		// $('.vPvEffi').text(quantityToHuman(simu.params['pvEffi'].at(simu.year), '%', true));


	});

  var cPlot = $("#cPlot")[0];
  canvasEnablePloting(cPlot);/// make cPlot ready for ploting (call cPlot.setPlot(myPlot))



  /// load ground usage
  let grid = new Grid();


  /// switch to ground usage tab
  function tabGroundUsage(){
      // cGrUse.drawImage(groundUseMap, 0, 0); // TODO -> should be somewhere else

      mapNav.enableAreaMoving();

      $('#dMovable').css('display', 'block');
      $('#dPlotDisplay').css('display', 'none');
  }
  tabGroundUsage();

	/// switch to the pop plot tab
	function tabPlot(e){
		mapNav.disableAreaMoving();
		$('#dMovable').css('display', 'none');
		$('#dPlotDisplay').css('display', 'block');

		var targetLabel = e.currentTarget.getAttribute("data-target");
		var dataToPlot, title, src = '', suffix = undefined;

		dataToPlot = simu.params[targetLabel];

		if(dataToPlot.source)
			src = dataToPlot.source;

		$('#dPlotDisplay h2').text(dataToPlot.label);
		$('#dPlotDisplay .pSource').text('Source : ' + src);
		var plot = new Plot(dataToPlot, 400, 300)
		if(suffix == '%')
			plot.setPercentMode(true);
		cPlot.setPlot(plot);

		if(dataToPlot.comment)
			$('#dPlotDisplay .pComment').text(dataToPlot.comment);
		else
			$('#dPlotDisplay .pComment').text('');
	}

	function updatePreparedBuildData(){
		if(BuildMenu.state === undefined)
			return;


		let build = grid.prepareBuild(BuildMenu.state,
			{shape:'circle', center:BuildMenu.curPos, radius:BuildMenu.radius});

		let simuBuild = simu.prepareCapex(build);

		BuildMenu.displayStat(simuBuild);
	}

	BuildMenu.setStateChangedCallback(updatePreparedBuildData);


	$('#top').on('click', (evt) => {
		if(BuildMenu.state === undefined)
			return;

		let build = grid.prepareBuild(BuildMenu.state,
			{shape:'circle', center:BuildMenu.curPos, radius:BuildMenu.radius});

		let simuBuild = simu.prepareCapex(build);

		if(simu.execute(simuBuild))
			grid.build(BuildMenu.state,
				{shape:'circle', center:BuildMenu.curPos, radius:BuildMenu.radius});	});

/*	$('#bRunSimu').on('click', () => {
		simu.run();
	});
	$('#bAddLotPv').on('click', () => {
		let myPlan = simu.prepareCapex({type: 'pv', area: 10000000000, powerDecline: 0.9966});

		simu.execute(myPlan);
	});
	$('#bAddLotBat').on('click', () => {
		let myPlan = simu.prepareCapex({type: 'battery',
										storageCapacity: 10000000000000});

		simu.execute(myPlan);
	});



	$('.bShowPlot').on('click', tabPlot);
	$(document).on('keydown', function(e){
		if(e.keyCode == 27)
			tabGroundUsage();
	});


	$('#top').on('mousemove', function(evt){
		if(!nowBuilding)
			return;

		let curPos = {x: evt.offsetX,
					 y: evt.offsetY};

		if(nowBuilding == 'pv'){
            grid.drawCircle(curPos.x, curPos.y, $('#pvBuildRange').val());
		}
	});*/


});
