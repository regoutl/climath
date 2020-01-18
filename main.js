/*
This file is part of Benergy. Benergy is free software: you can redistribute it and/or modify
 it under the terms of the GPL-3.0-only.

Copyright 2020, louis-amedee regout, charles edwin de brouwer
*/

"use strict";

import * as BuildMenu from './buildmenu.js';

import {Simulateur, promiseSimulater} from './simulateur/simulateur.js';
import * as CentralArea from './centralArea.js';
import {Plot, canvasEnablePloting, quantityToHuman as valStr} from './plot.js';

function docEl(id){
	return document.getElementById(id);
}



$(function(){

	$('.vCountryName').text("Belgique");

	/// set of small functions that update screen text when some values changes
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
		$('#dCentralArea').on('click', function(){
			if($(this).data('moving'))
				return;
			simu.confirmCurrentBuild();
		});

		$('#bRunSimu').on('click', simu.run.bind(simu));

		$('#iTaxRate').val(simu.taxRate);

		prepareConfiguration();

		CentralArea.setSimu(simu);

	})
	.catch(function(err){//sth failed for the ini of simulater
		alert(err);
	});

	$('#bConfigure,#bMenuConfigure').on("click", () => {
		$('#dLeftDock').toggle();
	});


	$('#iTaxRate').on('input', function(e){
		simu.taxRate = this.value;

	});




	let gameStarted = false;



	function prepareConfiguration(){
		let txt = '';

		simu.primaryDataList().forEach(yearly => {
			txt += '<div class="bShowPlot" data-target="';
			//add a data target
			txt += '"">';
			txt += yearly.label + ' ';
			txt += '<span>';
			let unit = yearly.unit;
			if(unit == '')
				unit = '%';

			txt += valStr(yearly.at(simu.year), unit, true);
			txt += '</span></div>';
		});

		$('#dLeftDock').html(txt);
		// //print the values in the appropriates blocks
		// for(let k in simu.params){
		// 	$('.v' + k.charAt(0).toUpperCase() +  k.slice(1)).text(	valStr(simu.params[k].at(simu.year), simu.params[k].unit, true));
		// }
		// $('.vPvEffi').text(valStr(simu.params['pvEffi'].at(simu.year), '%', true));


		$('.bShowPlot').on('click', CentralArea.tabPlot);

	}


	$('#bStartGame').on('click', () => {
		gameStarted = true;
		CentralArea.tabGame();
	});

	$(document).on('keydown', function(e){
	  if(e.keyCode == 27)
	    CentralArea.closeTabPlot();
	});

	$('#bClosePlot').on('click', CentralArea.closeTabPlot);

});
