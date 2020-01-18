import * as mapNav from './moveIt.js';
import {Plot, canvasEnablePloting, quantityToHuman as valStr} from './plot.js';

export function tabPlot(e){
  if(tabPlot.cPlot === undefined){
    tabPlot.cPlot = $("#cPlot")[0];
    canvasEnablePloting(tabPlot.cPlot);/// make cPlot ready for ploting (call cPlot.setPlot(myPlot))
  }
  let cPlot = tabPlot.cPlot;

  baseSetTab('dPlotDisplay');

  let elem = e.currentTarget;
  let index = Array.from(elem.parentNode.children).indexOf(elem);


  var dataToPlot, title, src = '', suffix = undefined;

  dataToPlot = simu.primaryDataList()[index];

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

export function tabMainMenu(){
  baseSetTab('dMainMenu');

}

export function tabGame(){
  baseSetTab('dMovable');
  mapNav.enableAreaMoving();
  $('#dRightDock').css('display', 'block');
}

export function closeTabPlot(){
  if(prev == 'dMainMenu')
    tabMainMenu();
  else
    tabGame();
}

export function setSimu(s){
  simu = s;
}


let current = 'dMainMenu';
let prev;
let simu;


function baseSetTab(id){
  if(id == current)
    return;
  $('#dRightDock').css('display', 'none');
  prev = current;
  mapNav.disableAreaMoving();
  $('#' + current).css('display', 'none');
  current = id;
  $('#' + current).css('display', 'block');
}
