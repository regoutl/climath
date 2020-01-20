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

import {solveCan, Matrix, simplex} from './simplex.js';


// let ans = simplex([1, 0, 0],
// 				[
// 					1, -1, 0, 1,
// 					1, 0, 1, 2
// 				]
// 			);
//
// console.log(ans);

/* solve (return p_i : production of central i)
max p_i
p_i < maxW_i
nominalFlow_j - p_i * m3PerJ_i * affect_ij > minFlow_j
p_i > 0
*/

function allocateFlows(
		m3PerJ /*array(i) : m3 per W of central i*/,
		maxW, /*array(i) : max output of central i*/
		affect, /*array(i, j) in {0, 1} : 1 iff activity of central i affect pool j */
		nominalFlow, /*array(j) : originL m3/s of pool j*/
		minFlow/*array(j) : MIN VAL m3/s of pool j*/
	){
	let nCentral = m3PerJ.length, nPools = minFlow.length;
	if(nominalFlow.length != nPools || maxW.length != nCentral || affect.length != nCentral * nPools)
		throw 'invalid size';

/* let x' = [p, s, t]
p_i + s_i = maxW_i
p_i * m3PerW_i * affect_ij + t_j = nominalFlow_j - minFlow_j
*/

	let nVar = 2*nCentral + nPools, nConstrains = (nCentral + nPools);

	let obj = new Float32Array(nVar + 1);
	obj.fill(1, 0, nCentral); // sum_i 1*p_i

	let constrains  = new Float32Array((nVar + 1) * nConstrains);
	for(let i = 0; i < nCentral; i ++) {
		let thisLineOffset = i * (nVar + 1);
		constrains[thisLineOffset + 0 + i] = 1;
		constrains[thisLineOffset + nCentral + i] = 1;
		constrains[thisLineOffset + nVar] = maxW[i];
	}

	for(let j = 0; j < nPools; j ++) {
		let thisLineOffset = (j + nCentral) * (nVar + 1);
		for(let i = 0; i < nCentral; i ++) {
			constrains[thisLineOffset + 0 + i] = m3PerJ[i] * affect[i * nPools +j]; //p_i * m3PerW_i * affect_ij
		}

		constrains[thisLineOffset + 2*nCentral + j] = 1;// + t_j
		constrains[thisLineOffset + nVar] = nominalFlow[j] - minFlow[j]; //= nominalFlow_j - minFlow_j
	}


	return simplex(obj, constrains);

}

let arr = allocateFlows(
	[1, 0.5],
	[10000, 20],
	[0, 1, 1,
	0, 0, 1],
	[10, 15, 20],
	[5, 15, 5]
);

alert(arr[0] + " " + arr[1]);


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
				StatDock.update();
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
