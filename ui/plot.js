"use strict";

import * as Yearly from "../timevarin.js"
import {unitToHuman} from './quantitytohuman.js'

const PlotLeftMargin = 60.5;



export class Plot{

	constructor(timeVar, width, height){
		this.data= timeVar;
		this.width  =width;
		this.height = height;

		this.vScale  = 1;
		this.vOffset = 0;
		this.min = undefined;
		this.max = undefined;

		this.updateScale();

		this.grabIndex = 0;//1 : ctrl1, 2 : ctrl2, 3 : endval
	}

	updateScale(){
		var max = Number.NEGATIVE_INFINITY, min = Number.POSITIVE_INFINITY;
		for(var y = 2000; y <= 2050; y++){
			var tmp = this.data.at(y);
			max = Math.max(max, tmp);
			min = Math.min(min, tmp);
		}
		var rawMin = min;

		var tmpDelta = (max-min);
		max += tmpDelta * 0.25;
		min -= tmpDelta * 0.25;

		if((max - min)/ min < 0.1){
			max *= 1.05;
			min /= 1.05;
		}

		if(rawMin > 0 && min < 0)
			min = 0;


		var minLabelDiff = (max-min) / (this.height - 60) * 20;//min 20 px between lines

		var magOrder = Math.log10(minLabelDiff);

		var p = Math.floor(magOrder);
		var fract = magOrder - p;

		var stepVal;
		if(fract > Math.log10(5)){
			stepVal = Math.pow(10, p + 1);
		}
		else if(fract > Math.log10(2))
			stepVal = 5*Math.pow(10, p);
		else
			stepVal = 2*Math.pow(10, p);

		this.stepVal = stepVal;

		min = Math.floor(min / stepVal) * stepVal;//set min/max to next boundary
		max = Math.ceil(max / stepVal) * stepVal;

		this.min = min;
		this.max = max;

		this.vScale = -(this.height - 60)/(max-min);
		this.vOffset = this.height - 30.5 - min * this.vScale;


		//~ var stepCount = (this.height - 60) / 35; //45px per step
		//~ var idealValPerStep = max / stepCount;

		//~ var magOrder = Math.floor(Math.log10(2*idealValPerStep));
		//~ var valPerStep = Math.pow(10, magOrder);
		//~ if(valPerStep < idealValPerStep){
			//~ if(2*valPerStep < idealValPerStep)
				//~ valPerStep *= 5;
			//~ else
				//~ valPerStep *= 2;
		//~ }

		//~ this.stepVal = valPerStep;
		//~ this.stepPx = 35;
	}

	mapYearToX(year){
		return PlotLeftMargin + (this.width - 20 - PlotLeftMargin) * (year - 2000) / 50;
	}

	mapValToY(val){
		return this.vOffset + this.vScale * val;
//		return (this.height - 30.5) - this.stepPx*val/this.stepVal;
	}

	mapXtoYear(x){
		return (x - PlotLeftMargin) / (this.width - 20 - PlotLeftMargin) * 50 + 2000;
	}
	mapYtoVal(y){
		return (y - this.vOffset) / this.vScale;
//		return (-y + this.height - 30.5) * this.stepVal / this.stepPx;
	}


	draw(ctx){
		var width = this.width, height = this.height;

		ctx.beginPath();
		ctx.moveTo(PlotLeftMargin, height - 30.5);
		ctx.lineTo(width - 10.5, height - 30.5);
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'gray';
		ctx.stroke();


		///left axis
		ctx.fillStyle = "gray";
 		ctx.textAlign = "end";
 		ctx.font = "10px Arial";
		var divider = Math.pow(1000, Math.floor(Math.log(this.max) / Math.log(1000)));
		var suffix = '';
		switch(Math.floor(Math.log(this.max) / Math.log(1000))){
			case 0: break;
			case 1: suffix = 'k'; break;
			case 2: suffix = 'M'; break;
			case 3: suffix = 'G'; break;
			case 4: suffix = 'T'; break;
			case -1: suffix = 'm'; break;
			case -2: suffix = 'μ'; break;
			case -3: suffix = 'ν'; break;
		}

		if(this.data.unit == '' && this.max <= 1 && this.min >= 0){
			divider = 0.01;
			suffix = '%';
		}

		if(this.data.unit)
			suffix += this.data.unit;

		if(suffix.length > 1){
			ctx.save();

			ctx.font = "14px Arial";
			 ctx.translate(30, height / 2);
			 ctx.rotate(-Math.PI/2);
			 ctx.textAlign = "center";
			 ctx.fillText(unitToHuman(suffix), 0, 0);

			ctx.restore();
			suffix = '';
		}

		var stepCount = (this.max - this.min) / this.stepVal;
		var prevVal = Number.NEGATIVE_INFINITY;
		for(var i = 0; i <= stepCount; i++){
			var y = this.mapValToY(i * this.stepVal + this.min);
			var n =  Math.round((i * this.stepVal + this.min) / divider * 100) / 100;
//			if(n != prevVal)
				ctx.fillText(n + suffix, PlotLeftMargin - 5, y + 2.5);
			prevVal = n;

			ctx.beginPath();
			ctx.moveTo(PlotLeftMargin, y);
			ctx.lineTo(width - 10.5, y);
			ctx.lineWidth = 0.5;

			ctx.stroke();
		}


		///bottom axis
		var nYCut = 1;

		if(width > 200)
			nYCut = 5;
		ctx.textAlign = 'center';

		for(var i = 0; i <= nYCut; i++){
			ctx.beginPath();
			ctx.moveTo(PlotLeftMargin + i * (width - 20 - PlotLeftMargin) / nYCut, height - 26);
			ctx.lineTo(PlotLeftMargin + i * (width - 20 - PlotLeftMargin) / nYCut, (height - 30.5));

			ctx.stroke();

			ctx.fillText(2000 + i * 50 / nYCut, PlotLeftMargin - 0.5 + i * (width - 20 - PlotLeftMargin) / nYCut, height - 15);
		}

		/// values
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'blue';
		ctx.beginPath();
		ctx.moveTo(PlotLeftMargin, this.mapValToY(this.data.at(2000)));
		for(var i = 2000; i <= this.data.lastHistoricalYear(); i++)
			ctx.lineTo(this.mapYearToX(i), this.mapValToY(this.data.at(i)));
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.mapYearToX(this.data.lastHistoricalYear()), this.mapValToY(this.data.at(this.data.lastHistoricalYear())));
		for(var i = this.data.lastHistoricalYear()+1; i <= 2050; i++)
			ctx.lineTo(this.mapYearToX(i), this.mapValToY(this.data.at(i)));

		ctx.setLineDash([5, 5]);
		ctx.stroke();
		ctx.setLineDash([]);

	}

	drawCursor(ctx, curPos){
		var width = this.width, height = this.height;
		//draw cursor

		if(curPos.x >= 0 && curPos.x < width && curPos.y < height && curPos.y > 0){
			//map x to a year
			var year = Math.floor((curPos.x - PlotLeftMargin) * 50 / (width - 20 - PlotLeftMargin))+2000;
			year = Math.max(Math.min(year, 2050), 2000);

			//get y
			var val = this.data.at(year);




			ctx.beginPath();
			ctx.moveTo(this.mapYearToX(year), this.mapValToY(this.min)+0.5);
			ctx.lineTo(this.mapYearToX(year), this.mapValToY(val));
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'gray';
			ctx.setLineDash([1, 1]);
			ctx.stroke();
			ctx.setLineDash([]);

			ctx.beginPath();
			ctx.arc(this.mapYearToX(year), this.mapValToY(val), 5, 0, 2 * Math.PI);
			ctx.fillStyle = 'blue';
			ctx.fill();
		}

	}

	ctrl1Pos(){
		return {x: this.mapYearToX(this.data.nowCtrl.x), y: this.mapValToY(this.data.nowCtrl.y)};
	}
	ctrl2Pos(){
		return {x: this.mapYearToX(this.data.endCtrl.x), y: this.mapValToY(this.data.endCtrl.y)};
	}

	endPos(){
		return {x: this.mapYearToX(2050), y: this.mapValToY(this.data.endVal)};
	}

	hasCtrlPts(){
		return this.data.nowCtrl != undefined;
	}
}


function plotEditDraw(plot, ctx){
	ctx.clearRect(0, 0, plot.width, plot.height);
//	ctx.fillStyle='red';
//	ctx.fillRect(0, 0, plot.width, plot.height);

	plot.draw(ctx);

	if(plot.hasCtrlPts()){

		ctx.fillStyle = 'gray';
		ctx.beginPath();
		ctx.arc(plot.ctrl1Pos().x, plot.ctrl1Pos().y, 5, 0, 2 * Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.arc(plot.ctrl2Pos().x, plot.ctrl2Pos().y, 5, 0, 2 * Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.arc(plot.endPos().x, plot.endPos().y, 5, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function plotOnClick(evt){
	var canvas = evt.currentTarget;
	var plot = canvas.plotTarget;
	if(plot == undefined)
		return;

	plotEditDraw(plot, canvas.getContext("2d"));

	var curPos = {x: evt.clientX  - canvas.getBoundingClientRect().left,
				 y: evt.clientY  - canvas.getBoundingClientRect().top};

	const grabSize  =10;
	if(plot.grabIndex > 0)
		plot.grabIndex = 0;
	else if(Math.abs(curPos.x - plot.ctrl1Pos().x) < grabSize &&
		Math.abs(curPos.y - plot.ctrl1Pos().y) < grabSize)
		plot.grabIndex = 1;
	else if(Math.abs(curPos.x - plot.ctrl2Pos().x) < grabSize &&
		Math.abs(curPos.y - plot.ctrl2Pos().y) < grabSize)
		plot.grabIndex = 2;
	else if(Math.abs(curPos.x - plot.endPos().x) < grabSize &&
		Math.abs(curPos.y - plot.endPos().y) < grabSize)
		plot.grabIndex = 3;

//	plot.stop(canvas);
}

function plotOnMove(evt){
	var canvas = evt.currentTarget;

	var plot = canvas.plotTarget;
	if(plot == undefined)
		return;

		var curPos = {x: evt.clientX  - canvas.getBoundingClientRect().left,
					 y: evt.clientY  - canvas.getBoundingClientRect().top};
	if(plot.grabIndex > 0){

		if(plot.grabIndex  == 1 && plot.mapXtoYear(curPos.x) > plot.data.histoUntill)
			plot.data.nowCtrl = {x: plot.mapXtoYear(curPos.x), y: plot.mapYtoVal(curPos.y)};
		else if(plot.grabIndex  == 2 && plot.mapXtoYear(curPos.x) <= 2050)
			plot.data.endCtrl = {x: plot.mapXtoYear(curPos.x), y: plot.mapYtoVal(curPos.y)}
		else if(plot.grabIndex  == 3)
			plot.data.endVal = plot.mapYtoVal(curPos.y);

		plot.data.updatePredi();
		plotEditDraw(plot, canvas.getContext("2d"));
	}
	else{
		plotEditDraw(plot, canvas.getContext("2d"));

		var ctx = canvas.getContext("2d");

		plot.drawCursor(ctx, curPos);
	}
}

export function canvasEnablePloting(canvas){
	canvas.addEventListener("click", plotOnClick);
	canvas.addEventListener("mousemove", plotOnMove);
	canvas.setPlot = function(plot){
		this.plotTarget  = plot;
		if(plot != undefined)
			plotEditDraw(plot, this.getContext("2d"));
	}
}

export function canvasDisablePloting(canvas){
	canvas.removeEventListener("click", plotOnClick);
	canvas.removeEventListener("mousemove", plotOnMove);
	canvas.setPlot = undefined;
	canvas.plotTarget = undefined;
}
