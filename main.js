/*
This file is part of Benergy. Benergy is free software: you can redistribute it and/or modify
 it under the terms of the GPL-3.0-only.

Copyright 2020, louis-amedee regout, charles edwin de brouwer
*/

"use strict";

import * as BuildMenu from './buildmenu.js';

import {Simulateur, promiseSimulater} from './simulateur/simulateur.js';
import * as mapNav from './moveIt.js';
import {Plot, canvasEnablePloting, quantityToHuman as valStr} from './plot.js';



$(function(){

	$('.vCountryName').text("Belgique");

	let valChangedCallbacks={
		money: function(money){
			$('.vMoney').text(valStr(money, '€'));
		},
		year: function(year){
			$('.vYear').text(year);
		},
		totalCo2: function(co2){
			let strco2Total = valStr(co2, 'C');
	    strco2Total = strco2Total.substr(0, strco2Total.length - 6);
	    $('.vTotalCo2').text(strco2Total);
		},
		lastYearCo2: function(co2){
			let strco2Total = valStr(co2, 'C');
	    strco2Total = strco2Total.substr(0, strco2Total.length - 6);
	    $('.vLastYearCo2').text(strco2Total);
		},
		taxRate: function(rate){
			$('.vTaxRate').text(Math.round(rate * 100) + '%');
		}
	}

	let simu;

	promiseSimulater(valChangedCallbacks)
	.then((s) => { //when the simulater is ready
		simu = s;

		BuildMenu.setStateChangedCallback(simu.onBuildMenuStateChanged.bind(simu));


		//on click on the grid
		$('#dCentral').on('click', function(){
			if($(this).data('moving'))
				return;
			simu.confirmCurrentBuild();
		});

		$('#bRunSimu').on('click', simu.run.bind(simu));

		$('#iTaxRate').val(simu.taxRate);

		// //print the values in the appropriates blocks
		// for(let k in simu.params){
		// 	$('.v' + k.charAt(0).toUpperCase() +  k.slice(1)).text(	valStr(simu.params[k].at(simu.year), simu.params[k].unit, true));
		// }
		// $('.vPvEffi').text(valStr(simu.params['pvEffi'].at(simu.year), '%', true));


	})
	.catch(function(err){//sth failed for the ini of simulater
		alert(err);
	});




	$('#iTaxRate').on('input', function(e){
		simu.taxRate = this.value;

	});



  var cPlot = $("#cPlot")[0];
  canvasEnablePloting(cPlot);/// make cPlot ready for ploting (call cPlot.setPlot(myPlot))


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



/*	$('.bShowPlot').on('click', tabPlot);
	$(document).on('keydown', function(e){
		if(e.keyCode == 27)
			tabGroundUsage();
	});
*/


});
