/*
This file is part of Benergy. Benergy is free software: you can redistribute it and/or modify
 it under the terms of the GPL-3.0-only.

Copyright 2020, louis-amedee regout, charles edwin de brouwer
*/

"use strict";

import * as BuildMenu from './buildmenu.js';

import Simulateur from './simulateur/simulateur.js';
import * as mapNav from './moveIt.js';
import {Plot, canvasEnablePloting, quantityToHuman, plainTextEuro} from './plot.js';



$(function(){

	$('.vCountryName').text("Belgique");

	let simu = new Simulateur;

	BuildMenu.setStateChangedCallback(simu.onBuildMenuStateChanged.bind(simu));

	//on click on the grid
	$('#top').on('click', simu.confirmCurrentBuild.bind(simu));

	let co2Total = 0;
	$('#bRunSimu').on('click', simu.run.bind(simu));

	$('#iTaxRate').on('input', function(e){
		simu.taxRate = this.value;

		$('.vTaxRate').text(Math.round(simu.taxRate * 100) + '%');
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
