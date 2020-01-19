
import {pieChart} from './piechart.js';
import { objSum} from '../simulateur/simulateur.js';
import { quantityToHuman as valStr} from '../plot.js';

//increment every field in target by the value of the same field in source
function incrementEach(target, source){
  for (var k in target){
    if(source[k] === undefined)
      throw 'pas equivalent';

    if(typeof target[k] == 'number')
      target[k] += source[k];
    else if(typeof target[k] == 'object')
      incrementEach(target[k], source[k]);
    else
      throw 'ni obj ni nombre ?';
  }
}

function multiplyEach(target, coef){
  for (var k in target){
    if(typeof target[k] == 'number')
      target[k] *= coef;
    else if(typeof target[k] == 'object')
      multiplyEach(target[k], coef);
    else
      throw 'ni obj ni nombre ?';
  }
}

export function setSimu(s){
  simu = s;
}

export function update(){
  if(simu.stats.length == 0)
    return;

  //assume simu.stats.length > 0
  let n = Number($('#dStats select').val()); // assume n >= 1

  const beginStatIndex = Math.max(simu.stats.length - n, 0);

  let sumStat = JSON.parse(JSON.stringify(simu.stats[beginStatIndex]));

  for(let i = beginStatIndex + 1; i < simu.stats.length; i++){
    incrementEach(sumStat, simu.stats[i]);
  }

  n = simu.stats.length - beginStatIndex;
  //if(average)
  multiplyEach(sumStat, 1/n); //average


  updateOri(sumStat);

  updateFootprint(sumStat);

  updateBudget(sumStat);
}

export function show(){
  $('#dLeftDock').show();
  $('#dCoefs').hide();
  $('#dStats').show();

  update();
}


let cStatEnergyOri , cStatFootprint, cStatBudget;

$(function(){
  cStatEnergyOri = document.getElementById('cStatEnergyOri');
  cStatFootprint = document.getElementById('cStatFootprint');
  cStatBudget = document.getElementById('cStatBudget');

  $('#dStats select').on('change', update);

  $('#dStats').css({
    padding: '10px'
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

let simu;



function updateOri(stat){
  //electricity origin
  let ctx = cStatEnergyOri.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(50, 50);
  const consumed = stat.consumedEnergy;
  $('#dStats p')[0].innerHTML = 'Demande moyenne : ' + valStr(consumed.total, 'Wh');
  pieChart(ctx, consumed.origin,
    {nuke: 'yellow',
    pv:'blue',
    fossil:'rgb(255, 124, 84)',
    storage:'rgb(0, 255, 250)'});
  ctx.translate(-50, -50);
}

function updateFootprint(stat){
  let ctx = cStatFootprint.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(50, 50);
  const co2 = stat.co2;

  $('#dStats p')[1].innerHTML = 'Emissions moyennes : ' + valStr(co2.total, 'C');

  pieChart(ctx, {
  	"constructions":objSum(co2.build),
  	"nuke":co2.perYear.nuke + co2.perWh.nuke,
  	"pv":co2.perYear.pv + co2.perWh.pv,
  	"fossil":co2.perYear.fossil + co2.perWh.fossil,
  	"storage":co2.perYear.storage + co2.perWh.storage,
  }, {
  	constructions:'red',
  	nuke: 'yellow',
  	pv:'blue',
    fossil:'rgb(255, 124, 84)',
  	storage:'rgb(0, 255, 250)'
  });
  ctx.translate(-50, -50);
}

function   updateBudget(stat){
  let ctx = cStatBudget.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.translate(50, 50);
  const cost = stat.cost;

  $('#dStats p')[2].innerHTML = 'Depenses moyennes : ' + valStr(cost.total, '€') +
    '<br />Taxes moyennes : '  + valStr(stat.taxIn, '€');

  pieChart(ctx, {
  	"constructions":objSum(cost.build),
  	"nuke":cost.perYear.nuke + cost.perWh.nuke,
  	"pv":cost.perYear.pv + cost.perWh.pv,
  	"fossil":cost.perYear.fossil + cost.perWh.fossil,
  	"storage":cost.perYear.storage + cost.perWh.storage,
  }, {
  	constructions:'red',
  	nuke: 'yellow',
  	pv:'blue',
    fossil:'rgb(255, 124, 84)',
  	storage:'rgb(0, 255, 250)'
  });
  ctx.translate(-50, -50);

}
