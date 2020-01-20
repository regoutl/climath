"use strict";

import MapDrawer from '../ui/mapdrawer.js';
import PaletteTexture from '../ui/palettetexture.js';

const GroundUsage = {
  out: 0,
  airport: 1,
  field:2,
  forest:3,
  industry:4,
  city:5,
  field2:6,
  water:7,
  forest2:8,
  unknown: 9
}

const PopDensitylegend = {
    4278190191:{min:5001, max:44973},
    4279314829:{min:2001, max:5000},
    4279979441:{min:1001, max:2000},
    4280710099:{min:501, max:1000},
    4281639415:{min:201, max:500},
    4282890747:{min:101, max:200},
    4284009982:{min:51, max:100},
    4285327102:{min:21, max:50},
    4286709503:{min:0, max:20},
}
const countDensity = {
  "0": 763983,
  "4279314829": 23421,
  "4279979441": 37733,
  "4280710099": 49076,
  "4281639415": 44879,
  "4282890747": 116199,
  "4284009982": 162670,
  "4285327102": 191224,
  "4286709503": 236257
}//Not sure it is correct?


const PopDensity = {
};

/** @note : not DOM aware, defer all DOM interractions to MapDrawer */
export default class MapComponent{
	constructor(mapImgs){

    this.energyGrid = new Uint16Array(1374 * 1183);
    this.groundUse = mapImgs.groundUse;

    this.drawer = new MapDrawer({
      energy:this.energyGrid,
      groundUse: this.groundUse});

    this.buildStates = [{}];
	}

  /** @brief convert build menu state to simu prepare capex cmd
  @param buildState :as described in   buildmenu ->  state
  @param area :  {shape: (circle|...)}
  IF area.shape == cicle THEN area := {center, radius} (unit pix)
  IF area.center === undefined THEN areaInvalid

  @return a cmd as described in Simulateur.prepareCapex
  @details
    called on mouse move and on build state change

    draw the cursor

    areaInvalid means that the cursor is not in the map.
      Then return what would theorically happend if it was
           set ans.theorical = true

    if problem with build state, can return undefined or throw

  @note for now, only build is considered. no rebuild. no deconstruction
  @note for points (ex, nuke central), area is still send as circle, but radius can be ignored
  @warning ans.area (if any) unit : m2
  **/
  prepareBuild(buildState, area){
    //exemple code
    let ans = {};

    ans.theorical = (area.center === undefined);

    let validPixels = area.radius * area.radius * 3.14;

    if(!ans.theorical){
      if(buildState.type != 'nuke'){
        this.drawer.drawCircle(area.center.x, area.center.y, area.radius);

        //count the valid pixels
        validPixels = this._countPvArea(area);
      }
      else {
        //for nuke, cursor must be valid
        ans.theorical = this.getPx(area.center.x, area.center.y).baseLandUse == GroundUsage.out;
        this.drawer.drawNukeCursor(area.center);
      }
    }
    else {
      //clear cursor
      this.drawer.clearCursor();

    }

    ans.type = buildState.type;
    if(buildState.type == 'pv')
      ans.area = validPixels * 200 * 200; //m2
    else if(buildState.type == 'battery'){
      ans.volume = validPixels * 200 * 200 * 5; //m3
    }
    else if(buildState.type == 'nuke'){
      ans.nameplate = 3000000000; //Watt
    }
    else {
      throw 'to do';
    }

    return ans;
  }


  /**   @brief : like prepareBuild BUT saves the action
  @return void
  @details
    called on click

    will only be called if prepareBuild(...).theorical != True

    must succeed !
  **/
  build(buildState, area){
    //exemple code
//    this.saveCircle(area.center.x, area.center.y, area.radius, 'pv');

    if(buildState.type == 'pv' ||
      buildState.type == 'battery'){
      this.buildStates.push(buildState);

      let r, g, b;
      if(buildState.type == 'pv'){
        r = 0; g = 0; b = 250;
      }
      if(buildState.type == 'battery'){
        r = 0; g = 255; b = 250;
      }


      let buildIndex = this.drawer.energy.appendPalette(r, g, b);

      this._forEach(area, (x, y) => {
        const pix = this.getPx(x, y);
        const lu = pix.baseLandUse;
        if((lu == GroundUsage.field || lu == GroundUsage.field2
           || lu == GroundUsage.forest || lu == GroundUsage.forest2) &&
          pix.nrj == 0)
           this.energyGrid[x + y * 1374] = buildIndex;
      });

      this.drawer.update('energy');
      this.drawer.draw();
    }
    else if(buildState.type == 'nuke'){
      this.drawer.addNuke(area.center);
    }
    else{
      throw 'to do';
    }
  }

  /** @brief check if any nuclear central explode.
  @details : if a central explode, must reallocate surounding pop, and estimate cost
  */
  testBoom(){

  }


  /** @brief in the given area, count the valid valid pixels
  @note area is as defined in prepareBuild
  @note a pixel oriented south can be counted as 'more than a pixel'
  @note area must be valid
  @return area (float) pixels
   */
  _countPvArea(area){
    let counter = (x, y) => {
      const pix = this.getPx(x, y);
      const lu = pix.baseLandUse;
      if((lu == GroundUsage.field || lu == GroundUsage.field2
         || lu == GroundUsage.forest || lu == GroundUsage.forest2) &&
        pix.nrj == 0)
        counter.area ++;
    };
    counter.area = 0;

    this._forEach(area, counter);

    return counter.area;
  }


  /** @brief will call f(x, y) for each pixel in the given area */
  _forEach(area, f){
    const radius = area.radius;
    const radius2 = radius*radius;
    const x = area.center.x;
    const y = area.center.y;

    let box = {
      minX: area.center.x-radius,
      minY: area.center.y-radius,
      maxX: area.center.x+radius,
      maxY: area.center.y+radius,
    };

    //no outside
    box.minX = Math.max(box.minX, 0);
    box.minY = Math.max(box.minY, 0);

    box.maxX = Math.min(box.maxX, 1374);
    box.maxY = Math.min(box.maxY, 1183);

    //re center it
    box.minX -= x;
    box.minY -= y;
    box.maxX -= x;
    box.maxY -= y;

    for(let i = box.minX; i < box.maxX; i++){
      const i2 = i*i;
      const xi = i + x;
      for(let j=box.minY; j < box.maxY; j++){
        if(i2+j*j<radius2){
          f(xi, y+j);
        }
      }

    }
  }

	/// return the land use at a given pixel.
    /// faire l'ajoute des pv
	/// ans format : pop  => int,
	///              solar => {//can be undefined
    ///                     efficiency multiplicator
    ///                     powerdelcine per year
    ///                     installation Capacity
	///				 },
	///              nuke => { //can be undefined
	///				 }
	///				 bat => { //can be undefined
	///              }
	/// baseLandUse => { //undefined = out of country
	///     City,
	///     Field
	///     Forest
	///     Water
	///     economicalInterestArea
	///     Airport
	/// }
	getPx(x, y){
        return {
//            pop: this._getPop[this.canvas['popDensity'].pixVal[y*1374+x]],
            nrj: this.energyGrid[y*1374+x],
            baseLandUse: this.groundUse[y*1374+x],
            // baseLandUse: undefined,
        }
	}



	/// set pixel x, y with value with same format as get
	setPx(x, y, landUse){
        // this.canvas['energyGrid'].pixVal[y*1374+x] = Number(4280501491);
        // GroundUsage[landUse.baseLandUse];
        // if(landUse.energyGrid === undefined){
        // }
	}

    logPx(x,y){
        let col = this.canvas['popDensity'].pixVal[y*1374+x];
        let legend = PopDensitylegend[col];
        console.log('x:'+x+' y:'+y+' v:'+col+' legend:'+JSON.stringify(legend));
    }

    // // get the name of every grid
    // listGrids(){
    //     return Object.keys(gridslist);
    // }


    // _color2nrj(c){
    //     if(!isNaN(c)){
    //         let a = c>>24 & 0xFF,
    //             b = c>>16 & 0xFF,
    //             g = c>>8 & 0xFF,
    //             r = c & 0xFF;
    //             c = {red:r, blue:b, green:g, alpha:a}
    //     }
    //     if(c.red === 255 && c.blue === 255 && c.green === 255 && c.alpha === 255){
    //         return undefined;
    //     } else if(c.red === 0 && c.blue === 250){
    //         return {nrj:'pv', year:2000+c.green};
    //     }
    //     return {};
    // }

    // saveCircle(x,y,radius, nrj, year) {
    //     let ctx = this.canvas['energyGrid'][0].getContext('2d');
    //     ctx.fillStyle = 'rgba(255,255,255,0.1)';
    //     // ctx.beginPath();
    //     // ctx.arc(x, y, radius, 0, 2*Math.PI, true);
    //     // ctx.fill();
    //     this._setForEarch(x,y,radius, this._nrg2color(nrj, year));
    //     ctx.putImageData(this.canvas['energyGrid'].imData,0,0);
    //     ctx.drawImage(this.canvas['energyGrid']['Im'], 0, 0);
    // }

  // _setForEarch(x,y,radius, color) {
  //   let r = color.red & 0xFF,
  //       g = color.green & 0xFF,
  //       b = color.blue & 0xFF,
  //       a = color.alpha & 0xFF;
  //   const abgr = (a << 24) + (b << 16) + (g << 8) + (r);
  //
  //   this._forEach({radius:radius, center:{x:x, y:y}},
  //     (x, y) => {
  //       this.canvas['energyGrid'].pixVal[y*1374+x] = abgr;
  //     });
  // }



    // getNRJcount(){
    //     let count = {
    //         pv:{},
    //         countrysize:0,
    //     }
    //     for(let x=0; x<this.canvas.top[0].width; x++){
    //         for(let y=0; y<this.canvas.top[0].height; y++){
    //             let nrj = this._color2nrj(
    //                         this.canvas['energyGrid'].pixVal[(y)*1374+(x)]);
    //             if(nrj !== undefined){
    //                 count.countrysize ++;
    //                 if(nrj.nrj !== undefined){
    //                     if(nrj.nrj === 'pv'){
    //                         if(count['pv'][nrj.year] === undefined){
    //                             count['pv'][nrj.year] = 1;
    //                         } else {
    //                             count['pv'][nrj.year] ++;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return count;
    // }


}
