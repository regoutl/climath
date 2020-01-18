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

import {pieChart} from './ui/piechart.js';

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
			if(simu)
				leftDockStats();
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

		BuildMenu.setStateChangedCallback(simu.onBuildMenuStateChanged.bind(simu));


		//on click on the grid
		$('#dCentralArea').on('click', function(){
			if($(this).data('moving'))
				return;
			simu.confirmCurrentBuild();
		});

		$('#bRunSimu').on('click', simu.run.bind(simu));

		$('#iTaxRate').val(simu.taxRate);


		CentralArea.setSimu(simu);

	})
	.catch(function(err){//sth failed for the ini of simulater
		alert(err);
	});

	$('#bConfigure,#bMenuConfigure').on("click", leftDockCoefs);
	$('#bStats').on("click", leftDockStats);


	$('#iTaxRate').on('input', function(e){
		simu.taxRate = this.value;
	});




	let gameStarted = false;



	function leftDockCoefs(){
		$('#dLeftDock').show();

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

		$('.bShowPlot').on('click', CentralArea.tabPlot);
	}

	function leftDockStats(){
		$('#dLeftDock').show();
		let txt = '';

		// //consumed energy origin :
		// //spendings
		// //co2
		//
		// txt += valStr( consumed.total, 'Wh');
		//
		//
		// ['fossil', 'pv', 'nuke', 'storage'].forEach(e =>{
		// 	txt += '<br />' + e + valStr(consumed.origin[e], 'Wh');
		// });
		// txt += '<br />';
		//
		// txt += '<br />co2 : ' + valStr( simu.lastYeatStats.co2.total, 'C');
		//
		// txt += '<br />';
		//
		// let costs =  simu.lastYeatStats.cost;
		// txt += '<br />cost : ' + valStr(costs.total, '€');
		// ['fossil', 'pv', 'nuke', 'storage'].forEach(e =>{
		// 	if(costs.perWh[e] > 0)
		// 		txt += '<br />Frais variables ' + e + ' ' + valStr(costs.perWh[e], '€');
		// 	if(costs.perYear[e] > 0)
		// 		txt += '<br />Frais fixes ' + e + ' ' + valStr(costs.perYear[e], '€');
		// 	if(costs.build[e] > 0)
		// 		txt += '<br />Construction ' + e + ' ' + valStr(costs.build[e], '€');
		// });

		$('#dLeftDock').html(txt);

		//electricity origin
		let myPie = $('<canvas width="100" height="100"></canvas>');

		let ctx = myPie[0].getContext("2d");
		ctx.translate(50, 50);
		const consumed = simu.lastYeatStats.consumedEnergy;
		pieChart(ctx, consumed.origin, {nuke: 'yellow', pv:'blue', fossil:'red', storage:'rgb(0, 255, 250)'});

		$('#dLeftDock').append('<h2>Origine de l energie</h2>');
		$('#dLeftDock').append(myPie);

		$('#dLeftDock').append('<h2>Empreinte carbonne</h2>');

		$('#dLeftDock').append('<h2>Budget</h2>');
		//should do a function
		// myPie = $('<canvas width="100" height="100"></canvas>');
		//
		// let ctx = myPie[0].getContext("2d");
		// ctx.translate(50, 50);
		// pieChart(ctx, consumed.origin, {nuke: 'yellow', pv:'blue', fossil:'red', storage:'rgb(0, 255, 250)'});
		//
		// $('#dLeftDock').append('<h2>Origine de l energie</h2>');
		// $('#dLeftDock').append(myPie);
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

});
