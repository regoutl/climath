var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import { pieChart } from './piechart.js';
import { objSum } from '../simulateur/simulateur.js';
import { quantityToHuman as valStr } from './plot.js';

/// shoud be called after simu was constructed. Setup a few things
export function setSimu(s) {
  simu = s;
}

/// should be called each new year.
export function update() {
  if (simu.stats.length == 0) return;

  //assume simu.stats.length > 0
  var n = Number($('#dStats select').val()); // assume n >= 1

  var beginStatIndex = Math.max(simu.stats.length - n, 0);

  var sumStat = JSON.parse(JSON.stringify(simu.stats[beginStatIndex]));

  for (var i = beginStatIndex + 1; i < simu.stats.length; i++) {
    incrementEach(sumStat, simu.stats[i]);
  }

  n = simu.stats.length - beginStatIndex;
  //if(average)
  multiplyEach(sumStat, 1 / n); //average


  updateOri(sumStat);

  updateFootprint(sumStat);

  updateBudget(sumStat);
}

/// show the dock
export function show() {
  $('#dLeftDock').show();
  $('#dCoefs').hide();
  $('#dStats').show();
  $('#bMaskLeftDock').show();

  update();
}

//increment every field in target object by the value of the same field in source
function incrementEach(target, source) {
  for (var k in target) {
    if (source[k] === undefined) throw 'pas equivalent';

    if (typeof target[k] == 'number') target[k] += source[k];else if (_typeof(target[k]) == 'object') incrementEach(target[k], source[k]);else throw 'ni obj ni nombre ?';
  }
}

function multiplyEach(target, coef) {
  for (var k in target) {
    if (typeof target[k] == 'number') target[k] *= coef;else if (_typeof(target[k]) == 'object') multiplyEach(target[k], coef);else throw 'ni obj ni nombre ?';
  }
}

var cStatEnergyOri = void 0,
    cStatFootprint = void 0,
    cStatBudget = void 0;

$(function () {
  cStatEnergyOri = document.getElementById('cStatEnergyOri');
  cStatFootprint = document.getElementById('cStatFootprint');
  cStatBudget = document.getElementById('cStatBudget');

  $('#dStats select').on('change', update);

  $('#dStats').css({
    padding: '10px',
    background: 'rgb(245, 245, 245)'
  });

  $('#dStats p').css({
    'font-size': '11px',
    position: 'relative',
    bottom: '10px',
    left: '5px'
  });

  $('#dStats h2').css({
    padding: '10px 0',
    'text-decoration': 'underline'
  });

  $('#dStats canvas').attr({
    width: 250,
    height: 100
  });
});

var simu = void 0;

var palette = { nuke: 'yellow',
  pv: 'rgb(70, 85,180)',
  fossil: 'rgb(255, 124, 84)',
  storage: 'rgb(0, 255, 250)',
  constructions: 'red',
  ccgt: 'rgb(169, 202, 250)',
  wind: 'white',
  fusion: 'green'
};

function updateOri(stat) {
  //electricity origin
  var ctx = cStatEnergyOri.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(50, 50);
  var consumed = stat.consumedEnergy;
  $('#dStats p')[0].innerHTML = 'Demande moyenne : ' + valStr(consumed.total, 'Wh');
  pieChart(ctx, consumed.origin, palette);
  ctx.translate(-50, -50);
}

function updateFootprint(stat) {
  var ctx = cStatFootprint.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(50, 50);
  var co2 = stat.co2;

  var firstYearCo2 = simu.stats[0].co2;

  var diminution = Math.round(100 * (1 - co2.total / firstYearCo2.total));
  var word = '<span style="color:green">moins</span>';
  if (diminution < 0) {
    diminution *= -1;
    word = '<span style="color:red">plus</span>';
  }
  var dimTxt = diminution + ' % de ' + word;
  if (diminution == 0) dimTxt = 'autant';

  $('#dStats p')[1].innerHTML = 'Emissions moyennes : ' + valStr(co2.total, 'C') + '<br />Soit ' + dimTxt + ' que ' + simu.stats[0].year;

  pieChart(ctx, {
    "constructions": objSum(co2.build),
    "nuke": co2.perYear.nuke + co2.perWh.nuke,
    "pv": co2.perYear.pv + co2.perWh.pv,
    "fossil": co2.perYear.fossil + co2.perWh.fossil,
    "storage": co2.perYear.storage + co2.perWh.storage,
    "ccgt": co2.perYear.ccgt + co2.perWh.ccgt,
    "wind": co2.perYear.wind + co2.perWh.wind,
    "fusion": co2.perYear.fusion + co2.perWh.fusion
  }, palette);
  ctx.translate(-50, -50);
}

function updateBudget(stat) {
  var ctx = cStatBudget.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.translate(50, 50);
  var cost = stat.cost;

  $('#dStats p')[2].innerHTML = 'Depenses moyennes : ' + valStr(cost.total, '€') + '<br />Taxes moyennes : ' + valStr(stat.taxes.in, '€') + ' (' + Math.round(stat.taxes.rate * 100) + ' %)';

  pieChart(ctx, {
    "constructions": objSum(cost.build),
    "nuke": cost.perYear.nuke + cost.perWh.nuke,
    "pv": cost.perYear.pv + cost.perWh.pv,
    "fossil": cost.perYear.fossil + cost.perWh.fossil,
    "storage": cost.perYear.storage + cost.perWh.storage,
    "ccgt": cost.perYear.ccgt + cost.perWh.ccgt,
    "wind": cost.perYear.wind + cost.perWh.wind,
    "fusion": cost.perYear.fusion + cost.perWh.fusion
  }, palette);
  ctx.translate(-50, -50);
}