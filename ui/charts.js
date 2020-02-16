import { quantityToHuman as valStr } from './quantitytohuman.js';
import {tr} from "../tr/tr.js";


/** draw a legend at 0 0.
@param  items : array of obj {color: '', text: ''}
*/
function printlegend(ctx, items, {fontColor='black'}){
    items.forEach((item, index) => {
        ctx.fillStyle = item.color;

        ctx.fillRect(0, 18 * index, 8, 8);
        ctx.fillStyle = fontColor;

        ctx.fillText(tr(item.text, 'Legend'), 15, 8 + 18 * index);
    });
}


/*
options :
    fontColor : text font color (default black)
    legend :    'text' : only the text
                'percent' : 'percatage : text'
                'hide' : no legend
*/
export function pieChart(ctx, values, palette, {fontColor= 'black', legend= 'percent'}) {
  var defaultColors = ['red', 'green', 'blue', 'yellow', 'pink'];

  var vals = Object.entries(values);

  vals.sort(function (a, b) {
    return b[1] - a[1];
  });

  //compute sum
  var sum = 0;
  vals.forEach(function (it) {
    sum += it[1];
  });

  // ctx.strokeStyle = 'white';
  // ctx.lineWidth = '2';
  ctx.font = "14px Arial";

  var angle = -3.14 / 2;

  let legendItems = [];

  vals.forEach(function (it, index) {
    var importance = it[1] / sum * 2 * Math.PI;
    ctx.beginPath();

    var a = angle;
    var b = angle + importance - 0.01;
    b = Math.max(b, a);
    ctx.arc(0, 0, 50, a, b);
    ctx.lineTo(0, 0);
    angle += importance;
    if (palette === undefined) ctx.fillStyle = defaultColors[index];else ctx.fillStyle = palette[it[0]];
    ctx.fill();

    if(legend != 'hide'){
        var perc = Math.round(it[1] / sum * 100);
        if (index < 4 && perc >= 1) {
          perc = String(perc);
          if (perc.length < 2) perc = " " + perc;

          let txt = '';
          if(legend == 'text')
            txt = it[0];
          else if(legend == 'percent')
            txt = perc + " % : " + it[0];
          else {
              throw 'unknown legend';
          }

          legendItems.push({color: ctx.fillStyle, text: txt});
        }

    }
  });

  ctx.save();
  ctx.translate(60, -38);
  printlegend(ctx, legendItems, {fontColor: fontColor});
  ctx.restore();
}



/** @brief draws a stacked line chart on the ctx
@param values : array of objects. length > 0. all objects must have the same keys. all values must be numbers. might be modified by this function
@param palette : a mapping values keys to string (colors or rgb).  null = default palette
@param unit : string. unit of the values. null = no y axis grading
@param from : number. Year of value 0. null = no x axis grading.
@param to : number. Year of last value. null = no x axis grading
@param width : Number. display width
@param height : Number. display height
@param order : array of string. order of the lines. (fist name in the array will be the bottom). undefined = undefined order
*/
export function stackedLineChart(ctx, values, {palette= null, unit='', from=null, to=null, width=300, height=200, order=undefined}){
    if(order === undefined){
        order = Object.keys(values[0]);
    }

    if(palette === null){
        palette = {};
        let colors = ['red', 'green', 'blue', 'black', 'yellow', 'white', 'orange', 'pink'];
        order.forEach((label, i) => {
            palette[label] = colors[i];
        });
    }

    const hAxisSpace = 150;
    const vAxisSpace = 30;

    ctx.save();
    ctx.translate(0, 8);

    //some room for the axes
    width -= hAxisSpace;
    height -= vAxisSpace;

    //compute the max
    let max = 0;
    values.forEach((time) => {
        let thisPointValue = 0;
        order.forEach((label) => {
            thisPointValue += time[label];
        });
        max = Math.max(max, thisPointValue);
    });

    const vScale = height / max; // max must match height
    const hScale = width / (values.length ); //last pt must be at width


    //0 everywhere
    let base = new Float32Array(values.length);

    ctx.save();

    ctx.scale(1, -1);
    ctx.translate(0, -height)

    order.forEach((label) => {
        ctx.beginPath();
        ctx.moveTo(0, base[0] * vScale);
        for(let i = 0; i < values.length; i++){ //draw the baseline
            ctx.lineTo((i + 0.1) * hScale, base[i] * vScale);
            ctx.lineTo((i + 0.9) * hScale, base[i] * vScale);
        }

        ctx.lineTo(values.length * hScale, base[values.length-1] * vScale);
        ctx.lineTo(values.length * hScale, (base[values.length-1] + values[values.length-1][label])  * vScale);

        for(let i = values.length -1; i >= 0; i--){ //draw the top line and update the baseline
            base[i] += values[i][label];
            ctx.lineTo((i + 0.9) * hScale, base[i] * vScale);
            ctx.lineTo((i + 0.1) * hScale, base[i] * vScale);
        }
        ctx.lineTo((0) * hScale, base[0] * vScale);

        ctx.fillStyle = palette[label];
        ctx.fill();
    });


    ctx.restore();

    xAxis(ctx, width, height, values, hScale, from, to);

    yAxis(ctx, width, height, max, unit);

    ctx.restore();


    //print legend--------------
    ctx.save();

    ctx.translate(width + 50, 40);
    let yolo = [];
    order.forEach((label) => {
        yolo.push({color: palette[label], text: label});
    });


    printlegend(ctx, yolo, {fontColor: 'white'});

    ctx.restore();

    width += hAxisSpace;
    height += vAxisSpace;
}



function xAxis(ctx, width, height, values, hScale, from, to){
    ctx.save();
    ctx.translate(0, height);

    ctx.strokeStyle = 'grey';
    ctx.strokeWidth = 1;
    ctx.textAlign= 'center';
    ctx.fillStyle = 'grey';

    let widthPerYear = width / (values.length);
    let mod;

    if(widthPerYear > 40)
        mod = 1;
    else if(widthPerYear > 20)
        mod = 2;
    else if(widthPerYear > 8)
        mod = 5;
    else
        mod = 10;

    //the x axis gradings
    values.forEach((item, i) => {
        let year = (to - from) / (values.length-1) * i + from;
        if(values.length == 1)
            year = from;
        if(mod != 10 || year % 2 == 0){
            ctx.beginPath();
            ctx.moveTo((i + 0.0)*hScale, 4);
            ctx.lineTo((i + 0.0)*hScale, 0);
            ctx.stroke();

        }


        if(year%mod == 0){

            ctx.fillText(year, (i + 0.5)*hScale, 15);
        }
    });

    ctx.restore();

}

//return the closest rount value. a round value is defined as {1, 2, 5}. 10^k (k integer)
function roundRound(val){
    let log10 = Math.log10(val);

    let k = Math.floor(log10);
    let order = Math.pow(10, k);

    let rest = log10 - k;
    let a = Math.pow(10, rest);

    if(a < 1.5)
        return order;
    else if(a < 2.5)
        return 2*order;
    else
        return 5*order;
}

function yAxis(ctx, width, height, max, unit){
    ctx.save();
    ctx.translate(width, 0);

    //axis itself
    ctx.strokeWidth = 1;
    ctx.strokeStyle = 'grey';
    ctx.fillStyle = 'grey';
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.lineTo(2, height);

    ctx.stroke();

    const idealSpace = 40;

    //we want 1 grading every [16, 48] px, as round as possible
    let idealNGrating = height / idealSpace;

    let idealStepVal = max / idealNGrating;


    let maxTxt = valStr(max, unit);

    //unit as it would be displayed
    let humanUnit = maxTxt.substr(maxTxt.search(/[a-zA-Z]/));


    //round the step

    let stepVal = roundRound(idealStepVal);
    let stepHeight = idealSpace *  stepVal / idealStepVal;

    let offset = height;
    for(let i = 0; offset > 0; i++){
        ctx.beginPath();
        ctx.moveTo(2, offset);
        ctx.lineTo(6, offset);
        ctx.stroke();

        let wololo = valStr(i * stepVal, unit);
        ctx.fillText(wololo.substr(0, wololo.search(/[a-zA-Z]/)), 8, offset + 4);

        offset = height - (i+1) * stepHeight;
    }

    ctx.translate(40, height / 2);
    ctx.rotate(- 3.1415 / 2);
    ctx.textAlign = 'center';
    ctx.fillText(humanUnit, 0, 0);

    ctx.restore();

}
