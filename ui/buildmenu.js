import { quantityToHuman as valStr} from './plot.js';

/** @brief all the infos about what to build except radius and curPos
@field type  in ('pv') : what to build
**/
export let state = undefined;
/** @brief radius : Number (unit : pixel ( switch to meters ?) of the build*/
export let radius = 0;
/** @brief curPos : {x, y} (unit : pixel (switch meters ?)).
@note if cursor is out of the map, undefined
*/
export let curPos = undefined;

let stateChangedCallback = undefined;

let simu = null;

/** @brief set the callback function to be called each time
            the state or radius changes
*/
export function setSimu(s){
  simu = s;

  stateChangedCallback =  simu.onBuildMenuStateChanged.bind(simu);

  simu.cMap.drawer.on('mousemove',function(evt){
    curPos = {x: evt.offsetX, y: evt.offsetY};

    notifyStateChanged();
  });

  simu.cMap.drawer.on('pointerleave', function(evt){
    curPos = undefined;

    notifyStateChanged();
  });

}

export function notifyStateChanged(){
  if(stateChangedCallback)
    displayStat(stateChangedCallback(state, curPos, radius));
}


$(function(){
  radius = Number($('#BMRange').val());

  $('.bBuild').on('click', function(e){
    let t = e.currentTarget.getAttribute("data-target");

    //double click on same tab : close it
    if(state && state.type == t){
      state = undefined;
      $('#dBuildDetails').hide();

      notifyStateChanged();
      return;
    }


    if(t == 'pv'){
      $('#BMRange').attr({min:1, max:100});
    }
    else if(t == 'battery'){
      $('#BMRange').attr({min:1, max:50});
      if(radius > $('#BMRange').attr('max'))
        radius = $('#BMRange').attr('max');
    }

    state = {};
    state.type = t;
    notifyStateChanged();

    $('#dBuildDetails').show();
    // $('#' + t + 'BuildDetails').css('display', 'block');

  });


  $('#BMRange').on('change', function(e){
    radius = Number(this.value);
    notifyStateChanged();
  });
});

function setOrHide(selector, val, unit, opt){
    if(val){
        let txt = (unit) ? valStr(val, unit, opt) : val;

      $(selector).html(txt);

      $(selector).parent().show();
    }
    else {
      $(selector).parent().hide();
    }

}

export function displayStat(build){
  if(build === undefined)
    return;

    let cmd = build.info;

  ['build', 'perYear', 'perWh'].forEach( fieldName => {
    let cap = fieldName.substr(0, 1).toUpperCase() + fieldName.substr(1);
    let mul = 1;
    if(fieldName == 'perWh')
      mul = 1000;

    let lines = [];
    if(cmd[fieldName] ){
      if(cmd[fieldName].cost != 0)
        lines.push('<span class="vBM' + cap + 'Cost">' + valStr(cmd[fieldName].cost * mul, '€') + '</span>');
      if(cmd[fieldName].co2 != 0)
        lines.push(valStr(cmd[fieldName].co2 * mul, 'C'));

      if(fieldName == 'build'){
        let delay = cmd[fieldName].end - cmd[fieldName].begin;
        lines.push(delay + ' an' + ((delay > 1) ? 's':''));
      }

    }
    if(lines.length > 0){
      $('.vBM' + cap).parent().show();
      $('.vBM' + cap).html( lines.join('<br />'));
    }
    else {
      $('.vBM' + cap).parent().hide();
    }
  });

  // $('.vBMBuildCost').css('color', (cmd.build.can) ? 'black': 'red');


  if(cmd.nameplate){
    $('.vBMNameplate').parent().show();
    let lines = [];
    lines.push(valStr(cmd.nameplate.at(cmd.build.end), cmd.nameplate.unit));
    if(cmd.avgCapacityFactor)
      lines.push(valStr(cmd.nameplate.at(cmd.build.end) * cmd.avgCapacityFactor, 'W') + ' (en moyenne)');

    $('.vBMNameplate').html(lines.join('<br />'));
  }
  else {//  $('.vBMStorageCapacity').parent().toogle(cmd.storageCapacity);
    $('.vBMNameplate').parent().hide();
  }

  setOrHide('.vBMArea', cmd.area, 'm2');

    if(cmd.storageCapacity)
        setOrHide('.vBMStorageCapacity', cmd.storageCapacity.at(cmd.build.end), 'S');
    else
        setOrHide('.vBMStorageCapacity');


  setOrHide('.vBMPop', cmd.pop_affected, 'H', {compact: false});
  setOrHide('.vBMExplCost', cmd.expl_cost, '€');


  setOrHide('.vBMRiver', cmd.river);
  setOrHide('.vBMCoolingWaterRate', cmd.coolingWaterRate, "m3/s", {mag: 0});
  setOrHide('.vBMTheoReason', cmd.theorical);



  //maybe move it

  //defines a cursor
  let theorical = (build.area.center === undefined);

  if(!theorical){
      simu.cMap.drawer.drawCursor(build.parameters.type, build.area.center, build.area.radius);
  } else{
      //clear cursor
      simu.cMap.drawer.clearCursor();
  }
  // simu.cMap.drawer.updateCursor(build.input);
}
