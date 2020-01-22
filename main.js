/*
This file is part of Benergy. Benergy is free software: you can redistribute it and/or modify
 it under the terms of the GPL-3.0-only.

Copyright 2020, louis-amedee regout, charles edwin de brouwer
*/

"use strict";

import * as BuildMenu from './ui/buildmenu.js';

import {Simulateur, promiseSimulater, objSum} from './simulateur/simulateur.js';
import * as CentralArea from './ui/centralArea.js';
import * as StatDock from './ui/statdock.js';
import {Plot, canvasEnablePloting, quantityToHuman as valStr} from './ui/plot.js';






function docEl(id){
	return document.getElementById(id);
}



$(function(){

	$('.vCountryName').text("Belgique");

	let simu;

	/// set of small functions that update screen text when some values changes
	let valChangedCallbacks={
		money: function(money){
			$('.vMoney').text(valStr(money, '€'));
		},
		year: function(year){
			$('.vYear').text(year);
			if(simu){
				StatDock.update();
				BuildMenu.notifyStateChanged();
			}
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


	promiseSimulater(valChangedCallbacks)
	.then((s) => { //when the simulater is ready
		simu = s;




		$('#bRunSimu').on('click', simu.run.bind(simu));

		$('#iTaxRate').val(simu.taxRate);


		CentralArea.setSimu(simu);
		StatDock.setSimu(simu);
		BuildMenu.setSimu(simu);
	})
	.catch(function(err){//sth failed for the ini of simulater
		alert(err);
	});

	$('#bConfigure,#bMenuConfigure').on("click", leftDockCoefs);
	$('#bStats').on("click", StatDock.show);


	$('#iTaxRate').on('input', function(e){
		simu.taxRate = this.value;
	});




	let gameStarted = false;



	function leftDockCoefs(){
		$('#dLeftDock').show();
		$('#dCoefs').show();
		$('#dStats').hide();
		$('#bMaskLeftDock').show();

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

		$('#dCoefs').html(txt);

		$('.bShowPlot').on('click', CentralArea.tabPlot);
	}



	$('#bStartGame').on('click', () => {
		gameStarted = true;
		CentralArea.tabGame();
		$('#bStats').css('display', 'block');
	});
	//skip click tmp todo : remove
	gameStarted = true;
	CentralArea.tabGame();
	$('#bStats').css('display', 'block');

	$(document).on('keydown', function(e){
	  if(e.keyCode == 27)
	    CentralArea.closeTabPlot();
	});

	$('#bClosePlot').on('click', CentralArea.closeTabPlot);

	$('#bMaskLeftDock').on('click', () =>{
		$('#bMaskLeftDock').hide();
		$('#dLeftDock').hide();
	});

});
