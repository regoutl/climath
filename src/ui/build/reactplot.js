var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copyright 2020, ASBL Math for climate, All rights reserved.

import { tr } from "../../tr.js";
import { Raw } from '../../timevarin.js';
import { AppContext } from './appcontext.js';
import { unitToHuman } from '../quantitytohuman.js';

var PlotLeftMargin = 60.5;

var Plot = function () {
	function Plot(timeVar, width, height) {
		_classCallCheck(this, Plot);

		this.data = timeVar;
		this.width = width;
		this.height = height;

		this.vScale = 1;
		this.vOffset = 0;
		this.min = undefined;
		this.max = undefined;

		this.updateScale();

		this.grabIndex = 0; //1 : ctrl1, 2 : ctrl2, 3 : endval
	}

	_createClass(Plot, [{
		key: 'updateScale',
		value: function updateScale() {
			var max = Number.NEGATIVE_INFINITY,
			    min = Number.POSITIVE_INFINITY;
			for (var y = 2000; y <= 2050; y++) {
				var tmp = this.data.at(y);
				max = Math.max(max, tmp);
				min = Math.min(min, tmp);
			}
			var rawMin = min;

			var tmpDelta = max - min;
			max += tmpDelta * 0.25;
			min -= tmpDelta * 0.25;

			if ((max - min) / min < 0.1) {
				max *= 1.05;
				min /= 1.05;
			}

			if (rawMin > 0 && min < 0) min = 0;

			var minLabelDiff = (max - min) / (this.height - 60) * 20; //min 20 px between lines

			var magOrder = Math.log10(minLabelDiff);

			var p = Math.floor(magOrder);
			var fract = magOrder - p;

			var stepVal;
			if (fract > Math.log10(5)) {
				stepVal = Math.pow(10, p + 1);
			} else if (fract > Math.log10(2)) stepVal = 5 * Math.pow(10, p);else stepVal = 2 * Math.pow(10, p);

			this.stepVal = stepVal;

			min = Math.floor(min / stepVal) * stepVal; //set min/max to next boundary
			max = Math.ceil(max / stepVal) * stepVal;

			this.min = min;
			this.max = max;

			this.vScale = -(this.height - 60) / (max - min);
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
	}, {
		key: 'mapYearToX',
		value: function mapYearToX(year) {
			return PlotLeftMargin + (this.width - 20 - PlotLeftMargin) * (year - 2000) / 50;
		}
	}, {
		key: 'mapValToY',
		value: function mapValToY(val) {
			return this.vOffset + this.vScale * val;
			//		return (this.height - 30.5) - this.stepPx*val/this.stepVal;
		}
	}, {
		key: 'mapXtoYear',
		value: function mapXtoYear(x) {
			return (x - PlotLeftMargin) / (this.width - 20 - PlotLeftMargin) * 50 + 2000;
		}
	}, {
		key: 'mapYtoVal',
		value: function mapYtoVal(y) {
			return (y - this.vOffset) / this.vScale;
			//		return (-y + this.height - 30.5) * this.stepVal / this.stepPx;
		}
	}, {
		key: 'draw',
		value: function draw(ctx) {
			var width = this.width,
			    height = this.height;

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
			switch (Math.floor(Math.log(this.max) / Math.log(1000))) {
				case 0:
					break;
				case 1:
					suffix = 'k';break;
				case 2:
					suffix = 'M';break;
				case 3:
					suffix = 'G';break;
				case 4:
					suffix = 'T';break;
				case -1:
					suffix = 'm';break;
				case -2:
					suffix = 'μ';break;
				case -3:
					suffix = 'ν';break;
			}

			if (this.data.unit == '' && this.max <= 1 && this.min >= 0) {
				divider = 0.01;
				suffix = '%';
			}

			if (this.data.unit) suffix += this.data.unit;

			if (suffix.length > 1) {
				ctx.save();

				ctx.font = "14px Arial";
				ctx.translate(30, height / 2);
				ctx.rotate(-Math.PI / 2);
				ctx.textAlign = "center";
				ctx.fillText(unitToHuman(suffix), 0, 0);

				ctx.restore();
				suffix = '';
			}

			var stepCount = (this.max - this.min) / this.stepVal;
			var prevVal = Number.NEGATIVE_INFINITY;
			for (var i = 0; i <= stepCount; i++) {
				var y = this.mapValToY(i * this.stepVal + this.min);
				var n = Math.round((i * this.stepVal + this.min) / divider * 100) / 100;
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

			if (width > 200) nYCut = 5;
			ctx.textAlign = 'center';

			for (var i = 0; i <= nYCut; i++) {
				ctx.beginPath();
				ctx.moveTo(PlotLeftMargin + i * (width - 20 - PlotLeftMargin) / nYCut, height - 26);
				ctx.lineTo(PlotLeftMargin + i * (width - 20 - PlotLeftMargin) / nYCut, height - 30.5);

				ctx.stroke();

				ctx.fillText(2000 + i * 50 / nYCut, PlotLeftMargin - 0.5 + i * (width - 20 - PlotLeftMargin) / nYCut, height - 15);
			}

			/// values
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'blue';
			ctx.beginPath();
			ctx.moveTo(PlotLeftMargin, this.mapValToY(this.data.at(2000)));
			for (var i = 2000; i <= this.data.lastHistoricalYear(); i++) {
				ctx.lineTo(this.mapYearToX(i), this.mapValToY(this.data.at(i)));
			}ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.mapYearToX(this.data.lastHistoricalYear()), this.mapValToY(this.data.at(this.data.lastHistoricalYear())));
			for (var i = this.data.lastHistoricalYear() + 1; i <= 2050; i++) {
				ctx.lineTo(this.mapYearToX(i), this.mapValToY(this.data.at(i)));
			}ctx.setLineDash([5, 5]);
			ctx.stroke();
			ctx.setLineDash([]);
		}
	}, {
		key: 'drawCursor',
		value: function drawCursor(ctx, curPos) {
			var width = this.width,
			    height = this.height;
			//draw cursor

			if (curPos.x >= 0 && curPos.x < width && curPos.y < height && curPos.y > 0) {
				//map x to a year
				var year = Math.floor((curPos.x - PlotLeftMargin) * 50 / (width - 20 - PlotLeftMargin)) + 2000;
				year = Math.max(Math.min(year, 2050), 2000);

				//get y
				var val = this.data.at(year);

				ctx.beginPath();
				ctx.moveTo(this.mapYearToX(year), this.mapValToY(this.min) + 0.5);
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
	}, {
		key: 'ctrl1Pos',
		value: function ctrl1Pos() {
			return { x: this.mapYearToX(this.data.nowCtrl.x), y: this.mapValToY(this.data.nowCtrl.y) };
		}
	}, {
		key: 'ctrl2Pos',
		value: function ctrl2Pos() {
			return { x: this.mapYearToX(this.data.endCtrl.x), y: this.mapValToY(this.data.endCtrl.y) };
		}
	}, {
		key: 'endPos',
		value: function endPos() {
			return { x: this.mapYearToX(2050), y: this.mapValToY(this.data.endVal) };
		}
	}, {
		key: 'hasCtrlPts',
		value: function hasCtrlPts() {
			return this.data.nowCtrl != undefined;
		}
	}]);

	return Plot;
}();

function plotEditDraw(plot, ctx) {
	ctx.clearRect(0, 0, plot.width, plot.height);
	//	ctx.fillStyle='red';
	//	ctx.fillRect(0, 0, plot.width, plot.height);

	plot.draw(ctx);

	if (plot.hasCtrlPts()) {

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

//to be checked
function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

//update the json object (obj is edited). Copy control points
function updateTviJson(tvi, json) {
	var vm = json.valMul || 1;
	json.in2050 = tvi.endVal / vm;
	json.ctrlPts = [{ x: tvi.nowCtrl.x, y: tvi.nowCtrl.y / vm }, { x: tvi.endCtrl.x, y: tvi.endCtrl.y / vm }];
}

var ReactPlot = function (_React$Component) {
	_inherits(ReactPlot, _React$Component);

	/*valid props :
 width, height default : 300, 200 resp
 data
 */
	function ReactPlot(props) {
		_classCallCheck(this, ReactPlot);

		var _this = _possibleConstructorReturn(this, (ReactPlot.__proto__ || Object.getPrototypeOf(ReactPlot)).call(this, props));

		_this.tvi = new Raw(_this.props.data);
		_this.cCanvas = new React.createRef();
		_this.plot = new Plot(_this.tvi, _this.props.width || 300, _this.props.height || 200);

		return _this;
	}

	_createClass(ReactPlot, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.plot.draw(this.cCanvas.current.getContext('2d'));
		}
	}, {
		key: 'downloadAsCsv',
		value: function downloadAsCsv() {
			var csv = '';
			csv += this.tvi.label + '\n';

			if (this.tvi.unit) csv += 'unit,' + this.tvi.unit + '\n';
			csv += 'source,' + this.tvi.source + '\n';
			csv += 'source valid for, [2000-' + this.tvi.histoUntill + ']\n';
			csv += 'country,belgium\n';

			if (this.tvi.comment) csv += 'note,' + this.tvi.comment + '\n';

			var years = this.tvi.years;
			years.forEach(function (v, year) {
				csv += year + 2000 + ',' + v + '\n';
			});

			download('be_' + this.tvi.label + '.csv', csv);
		}
	}, {
		key: 'onClick',
		value: function onClick(evt) {
			var canvas = this.cCanvas.current;
			var plot = this.plot;
			if (plot == undefined) return;

			plotEditDraw(plot, canvas.getContext("2d"));

			var curPos = { x: evt.clientX - canvas.getBoundingClientRect().left,
				y: evt.clientY - canvas.getBoundingClientRect().top };

			var grabSize = 10;
			if (plot.grabIndex > 0) plot.grabIndex = 0;else if (Math.abs(curPos.x - plot.ctrl1Pos().x) < grabSize && Math.abs(curPos.y - plot.ctrl1Pos().y) < grabSize) plot.grabIndex = 1;else if (Math.abs(curPos.x - plot.ctrl2Pos().x) < grabSize && Math.abs(curPos.y - plot.ctrl2Pos().y) < grabSize) plot.grabIndex = 2;else if (Math.abs(curPos.x - plot.endPos().x) < grabSize && Math.abs(curPos.y - plot.endPos().y) < grabSize) plot.grabIndex = 3;
		}
	}, {
		key: 'onMouseMove',
		value: function onMouseMove(evt) {
			var canvas = this.cCanvas.current;

			var plot = this.plot;
			if (plot == undefined) return;

			var curPos = { x: evt.clientX - canvas.getBoundingClientRect().left,
				y: evt.clientY - canvas.getBoundingClientRect().top };
			if (plot.grabIndex > 0) {

				if (plot.grabIndex == 1 && plot.mapXtoYear(curPos.x) > plot.data.histoUntill) plot.data.nowCtrl = { x: plot.mapXtoYear(curPos.x), y: plot.mapYtoVal(curPos.y) };else if (plot.grabIndex == 2 && plot.mapXtoYear(curPos.x) <= 2050) plot.data.endCtrl = { x: plot.mapXtoYear(curPos.x), y: plot.mapYtoVal(curPos.y) };else if (plot.grabIndex == 3) plot.data.endVal = plot.mapYtoVal(curPos.y);

				plot.data.updatePredi();

				plotEditDraw(plot, canvas.getContext("2d"));

				updateTviJson(plot.data, this.props.data);
			} else {
				plotEditDraw(plot, canvas.getContext("2d"));

				var ctx = canvas.getContext("2d");

				plot.drawCursor(ctx, curPos);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'plotContainer', style: { width: this.props.width || 300 } },
				React.createElement('canvas', {
					ref: this.cCanvas,
					width: this.props.width || 300,
					height: this.props.height || 200,
					onClick: this.context.canEditParameters ? this.onClick.bind(this) : undefined,
					onMouseMove: this.context.canEditParameters ? this.onMouseMove.bind(this) : undefined
				}),
				React.createElement('img', {
					className: 'bDownloadPlotCsv',
					src: 'res/icons/download.png',
					width: '32',
					title: tr('Download as csv'),
					onClick: this.downloadAsCsv.bind(this) })
			);
		}
	}]);

	return ReactPlot;
}(React.Component);

export default ReactPlot;


ReactPlot.contextType = AppContext;