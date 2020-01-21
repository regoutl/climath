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
    unknown: 9,
}
const popDensitylegend = {
    0:0,
    1:1,
    2:50,
    3:100,
    4:200,
    5:500,
    6:1000,
    7:2000,
    8:5000,
}

//Const for our current map
const kmpixratio = 30688/(1625442-54086);

/** @note : not DOM aware, defer all DOM interractions to MapDrawer */
export default class MapComponent{
    constructor(mapImgs){

        this.energyGrid = new Uint16Array(1374 * 1183);
        this.groundUse = mapImgs.groundUse;
        this.popDensity = mapImgs.popDensity;

        this.drawer = new MapDrawer({
            energy:this.energyGrid,
            groundUse: this.groundUse,
            popDensity: this.popDensity,
        });

        this.buildStates = [{}];
    }

    /** [TODO]
    * Should find the correction factor in fct of:
    *       - current pop
    *       - number of available living pixel
    *                   (removing those where an explosion has occured)
    */
    getPopDensity(x,y){
        // km2 / pix
        //1.06 is a correction factor to match current population of 11.4e6 hab
        return popDensitylegend[this.popDensity[y*1374+x]] * kmpixratio * 1.06;
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

    @note for now, only build is considered. no rebuild. no deconstruction
    @note for points (ex, nuke central), area is still send as circle, but radius can be ignored
    @warning ans.area (if any) unit : m2
    **/
    prepareBuild(ans, buildState, area){
        ans.theorical = (area.center === undefined);

        ans.theorical = (area.center === undefined);

        let validPixels = area.radius * area.radius * 3.14;

        if(!ans.theorical){
            if(buildState.type != 'nuke'){
                this.drawer.drawCircle(area);

                //count the valid pixels
                validPixels = this._countPvArea(area);
            } else{
                //for nuke, cursor must be valid
                let pixel = this.getPx(area.center.x, area.center.y);
                ans.theorical = pixel.baseLandUse == GroundUsage.out;
                this.drawer.drawNukeCursor(area.center);
            }
        } else{
            //clear cursor
            this.drawer.clearCursor();
        }

        ans.type = buildState.type;
        if(buildState.type == 'pv')
            ans.area = validPixels * 200 * 200; //m2
        else if(buildState.type == 'battery')
            ans.volume = validPixels * 200 * 200 * 5; //m3
        else if(buildState.type == 'nuke')
            ans.nameplate = 3000000000; //Watt
        else
            throw 'to do';

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
        //this.saveCircle(area.center.x, area.center.y, area.radius, 'pv');

        if(buildState.type == 'pv' || buildState.type == 'battery'){
            this.buildStates.push(buildState);

            let r, g, b;
            if(buildState.type == 'pv'){r = 0; g = 0; b = 250;}
            if(buildState.type == 'battery'){r = 0; g = 255; b = 250;}


            let buildIndex = this.drawer.energy.appendPalette(r, g, b);

            this._forEach(area, (x, y) => {
                const pix = this.getPx(x, y);
                const lu = pix.baseLandUse;
                if((lu == GroundUsage.field || lu == GroundUsage.field2
                    || lu == GroundUsage.forest || lu == GroundUsage.forest2)
                    && pix.nrj == 0)
                        this.energyGrid[x + y * 1374] = buildIndex;
            });

        this.drawer.update('energy');
        this.drawer.draw();
        } else if(buildState.type == 'nuke'){
            this.drawer.addNuke(area.center);
        } else{
            throw 'to do';
        }
    }

    /** @brief check if any nuclear central explode.
        @details : if a central explode, must reallocate surounding pop,
                        and estimate cost
    */
    testBoom(area){
        let cleaningcost = 150000000;

        let topay = cleaningcost;
        topay += cleaningcost;
        this._forEach(area, (x,y) => {
            let pix = this.getPx(x,y);
            // pix.nrj => destroyed
            // baseLandUse => destroyed
            // pop => should move
            // price per home => mean be :197.000
            topay += 197000 * pix.pop;
        })
        return topay;
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
                || lu == GroundUsage.forest || lu == GroundUsage.forest2)
                && pix.nrj == 0)
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
    ///              },
    ///              nuke => { //can be undefined
    ///              }
    ///              bat => { //can be undefined
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
            nrj: this.energyGrid[y*1374+x],
            baseLandUse: this.groundUse[y*1374+x],
            pop: this.getPopDensity(x,y),
        }
    }

    /// set pixel x, y with value with same format as get
    setPx(x, y, changes){
        let conv = {
            'nrj':'energyGrid',
            'energyGrid':'energyGrid',
            'baseLandUse':'groundUse',
            'groundUse':'groundUse',
            'pop':'popDensity',
            'popDensity':'popDensity',
        }, maps = this;
        Object.keys(changes).forEach(key => {
            maps[conv[key]][y*1374+x] = changes[key];
        });
    }
}
