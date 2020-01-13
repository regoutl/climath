import { quantityToHuman, plainTextEuro} from './plot.js';

/** @brief all the infos about what to build except radius and curPos
@field type  in ('pv') : what to build
**/
export let state = undefined;
/** @brief radius : Number (unit : pixel ( switch to meters ?) of the build*/
export let radius = 50;
/** @brief curPos : {x, y} (unit : pixel (switch meters ?)).
@note if cursor is out of the map, undefined
*/
export let curPos = undefined;

let stateChangedCallback = undefined;

/** @brief set the callback function to be called each time
            the state or radius changes
*/
export function setStateChangedCallback(callback){
  stateChangedCallback = callback;
}


$(function(){

  $('.bBuild').on('click', function(e){
    let t = e.currentTarget.getAttribute("data-target");

    state = {};
    state.type = t;
    if(stateChangedCallback)
      stateChangedCallback();

    // $('.buildDetail').css('display', 'none');
    // $('#' + t + 'BuildDetails').css('display', 'block');

  });

  $('#BMRange').on('change', function(e){
    radius = this.value;
    if(stateChangedCallback)
      stateChangedCallback();
  });


  $('#top').on('mousemove', function(evt){
    curPos = {x: evt.offsetX, y: evt.offsetY};

    if(stateChangedCallback)
      stateChangedCallback();
  });

  $('#top').on('pointerleave', function(evt){
    curPos = undefined;

    if(stateChangedCallback)
      stateChangedCallback();
  });

});


export function displayStat(cmd){
  $('.vBMBuildCost').text(plainTextEuro(cmd.build.cost));
  $('.vBMBuildCo2').text(quantityToHuman(cmd.build.co2, 'C'));

  if(cmd.area){
    $('.vBMArea').text(quantityToHuman(cmd.area, 'm2'));
  }
}
