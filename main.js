/*
This file is part of Benergy. Benergy is free software: you can redistribute it and/or modify
 it under the terms of the GPL-3.0-only.

Copyright 2020, louis-amedee regout, charles edwin de brouwer
*/

"use strict";

// import * as BuildMenu from './ui/build/buildmenu.js';
// import * as CentralArea from './ui/src/centralArea.js';
// import * as StatDock from './ui/src/oldstatdock.js';
// import {Plot, canvasEnablePloting, quantityToHuman as valStr} from './ui/build/plot.js';
import {tr, setLang} from './tr/tr.js';

import App from './ui/build/app.js';

//window.location.hash : get anchor

//REACT TEST


setLang().then(() => {
    ReactDOM.render(
      React.createElement(App),
      document.getElementById("root")
      // document.body
    );
	// console.log(tr('%d little kitten', 'test', 2));
})


//END OF REACT TEST


// function docEl(id){
// 	return document.getElementById(id);
// }
//
//
// $(function(){
//
// 	$('.vCountryName').text("Belgique");
//
// 	let simu;
//
// 	/// set of small functions that update screen text when some values changes
// 	let valChangedCallbacks={
// 		money: function(money){
// 			$('.vMoney').text(valStr(money, '€'));
// 		},
// 		year: function(year){
// 			$('.vYear').text(year);
// 			if(simu){
// 				StatDock.update();
// 				BuildMenu.notifyStateChanged();
// 			}
// 		},
// 		totalCo2: function(co2){
// 			let strco2Total = valStr(co2, 'C');
// 	    strco2Total = strco2Total.substr(0, strco2Total.length - 6);
// 	    $('.vTotalCo2').text(strco2Total);
// 		},
// 		lastYearCo2: function(co2){
// 			let strco2Total = valStr(co2, 'C');
// 	    strco2Total = strco2Total.substr(0, strco2Total.length - 6);
// 	    $('.vLastYearCo2').text(strco2Total);
// 		},
// 		taxRate: function(rate){
// 			$('.vTaxRate').text(Math.round(rate * 100) + '%');
// 		}
// 	}
//
//
// 	promiseSimulater(valChangedCallbacks)
// 	.then((s) => { //when the simulater is ready
// 		simu = s;
//
//
//
//
// 		$('#bRunSimu').on('click', simu.run.bind(simu));
//
// 		$('#iTaxRate').val(simu.taxRate);
//
//
// 		CentralArea.setSimu(simu);
// 		StatDock.setSimu(simu);
// 		BuildMenu.setSimu(simu);
// 	})
// 	.catch(function(err){//sth failed for the ini of simulater
// 		alert(err);
// 	});
//
// 	$('#bConfigure').on("click", leftDockCoefs);
// 	$('#bStats').on("click", StatDock.show);
//
//
// 	$('#iTaxRate').on('input', function(e){
// 		simu.taxRate = this.value;
// 	});
//
//
//
//
// 	let gameStarted = false;
//
//
// 	let promptUseDockCoef;
//
//
//
// 	function leftDockCoefs(){
// 		if(promptUseDockCoef !== undefined){
// 				promptUseDockCoef.remove();
// 				localStorage.setItem('doNotShowAgainPersonlizeCoefsTest', 1);
// 		}
//
// 		$('#dLeftDock').show();
// 		$('#dCoefs').show();
// 		$('#dStats').hide();
// 		$('#bMaskLeftDock').show();
//
// 		let txt = '';
//
// 		simu.primaryDataList().forEach(yearly => {
// 			txt += '<div class="bShowPlot" data-target="';
// 			//add a data target
// 			txt += '"">';
// 			txt += tr(yearly.label, "plot title") + ' ';
// 			txt += '<span>';
// 			let unit = yearly.unit;
// 			if(unit == '')
// 				unit = '%';
//
// 			txt += valStr(yearly.at(simu.year), unit);
// 			txt += '</span></div>';
// 		});
//
// 		$('#dCoefs').html(txt);
//
// 		$('.bShowPlot').on('click', CentralArea.tabPlot);
// 	}
//
//
//
// 	// $('#bStartGame').on('click', () => {
// 	// 	gameStarted = true;
// 	// 	CentralArea.tabGame();
// 	// 	$('#bStats').css('display', 'block');
// 	// });
// 	// //skip click tmp todo : remove
// 	// gameStarted = true;
// 	CentralArea.tabGame();
// 	$('#bStats').css('display', 'block');
//
// 	if(false &&!localStorage.getItem('doNotShowAgainPersonlizeCoefs')){
// 			promptUseDockCoef = $('<div>Vous pouvez modifier les coefficients avant de commencer !</div>');
//
// 			promptUseDockCoef.css({
// 				position:'absolute',
// 				'z-index': 10000,
// 				top: '10px',
// 				left: '50px',
// 				padding: '7px 13px',
// 				background: 'white',
// 				'border-radius':'5px',
// 				'box-shadow':'0px 0px 5px black',
// 			});
//
// 			let arrow = $('<div></div>');
//
// 			arrow.css({
// 					position: 'absolute',
// 					'z-index': 10001,
// 					width: '10px',
// 					height: '10px',
// 					background: 'white',
// 					transform: 'translate(-18px, 5px) rotate(45deg)',
// 					'box-shadow':'0px 0px 5px black',
// 			});
// 			promptUseDockCoef.prepend(arrow);
//
// 			let arrowCache = $('<div></div>');
// 			arrowCache.css({
// 					position: 'absolute',
// 					'z-index': 10002,
// 					width: '13px',
// 					height: '22px',
// 					background: 'white',
// 					transform: 'translate(-13px, -1px) ',
// 			});
// 			promptUseDockCoef.prepend(arrowCache);
//
// 			let dismiss = $('<input type="button" value="ok" />');
//
// 			dismiss.css({
// 					'margin-left': '10px'
// 			});
//
// 			dismiss.on('click', () => {
// 					promptUseDockCoef.remove();
// 					localStorage.setItem('doNotShowAgainPersonlizeCoefsTest', 1);
// 			});
//
// 			promptUseDockCoef.append(dismiss);
//
//
// 			$('#dCentralArea').prepend(promptUseDockCoef);
// 	}
//
// 	$(document).on('keydown', function(e){
// 	  if(e.keyCode == 27)
// 	    CentralArea.closeTabPlot();
// 	});
//
// 	$('#bClosePlot').on('click', CentralArea.closeTabPlot);
//
// 	$('#bMaskLeftDock').on('click', () =>{
// 		$('#bMaskLeftDock').hide();
// 		$('#dLeftDock').hide();
// 	});
//
// });
