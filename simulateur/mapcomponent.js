"use strict";

import MapDrawer from '../ui/mapdrawer.js';
import PaletteTexture from '../ui/palettetexture.js';

const GroundUsage = {
    out:0,
    airport:1,
    water:2,
    forest:3,
    industry:4,
    field:5,
    field2:6,
    unknown:7,
    city:8,
    forest2:9,
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
const kmpixratio = 30688/(1625442-854086);
const nuclearDisasterRadius = 50/*pix*/;
const meanCostToRelocate = 197000;
const cleaningcost = 150000000;
const totalpop = 11.4e6;
let densityMapPixPerCol = {// is it correct ?
    0:854086,
    1:223678,
    2:171151,
    3:141713,
    4:100527,
    5:38765,
    6:42552,
    7:32710,
    8:20260,
};

const nukeExplosionPeriod = 7540; // 2/15080 => 1/7540

/** @note : not DOM aware, defer all DOM interractions to MapDrawer */
export default class MapComponent{
    constructor(mapImgs){
        this._centrals = [];
        this.energyGrid = new Uint16Array(1374 * 1183);
        this.groundUse = mapImgs.groundUse;
        this.popDensity = mapImgs.popDensity;

        this.drawer = new MapDrawer({
            energy: this.energyGrid,
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
        let popfactor = totalpop / (kmpixratio*
            Object.keys(popDensitylegend).reduce((a,key) =>
                a+(densityMapPixPerCol[key]*popDensitylegend[key])
            , 0));
        let popDensity = popDensitylegend[this.popDensity[y*1374+x]];
        return Math.floor(popDensity * kmpixratio * 1.06);
    }

    getNrj(x,y){
        return this.energyGrid[y*1374+x];
    }

    getGroundUse(x,y){
        return this.groundUse[y*1374+x];
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

        let validPixels = area.radius * area.radius * 3.14;

        if(!ans.theorical){
            this.drawer.drawCursor(buildState.type, area.center, area.radius);

            if(buildState.type != 'nuke'){
                //count the valid pixels
                validPixels = this._countPvArea(area);
            } else{
                //for nuke, cursor must be valid
                const x = area.center.x, y = area.center.y;
                const baseLandUse = this.getGroundUse(x,y);
                ans.theorical = pixel.baseLandUse == GroundUsage.out;
                let expl = this._simulateBoom(area);
                ans.pop_affected = expl.pop_affected;
                ans.expl_cost = expl.cost;
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
        else if(buildState.type == 'ccgt')
            ans.nameplate = 1600000000; //Watt
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
            if(buildState.type == 'pv'){r = 70; g = 85; b = 130;}
            if(buildState.type == 'battery'){r = 0; g = 255; b = 250;}


            let buildIndex = this.drawer.energy.appendPalette(r, g, b);

            this._forEach(area, (x, y) => {
                const nrj = this.getNrj(x,y);
                const lu = this.getGroundUse(x,y);
                if((lu == GroundUsage.field || lu == GroundUsage.field2
                    || lu == GroundUsage.forest || lu == GroundUsage.forest2)
                    && nrj == 0)
                        this.energyGrid[x + y * 1374] = buildIndex;
            });

        this.drawer.update('energy');
        this.drawer.draw();
      } else if(buildState.type == 'nuke' || buildState.type == 'ccgt'){
            this.drawer.addItem(buildState.type, area.center);
            this._centrals.push({
                type: buildState.type,
                loc: area.center,
                dangerRadius: nuclearDisasterRadius,
            });
        } else{
            throw 'to do';
        }
    }

    /** @brief check if any nuclear central explode.
        @details : if a central explode, must reallocate surounding pop,
                        and estimate cost
    */
    testBoom(){
        let stat = this._centrals.reduce((tot, central, i) => {
            if(central.type === 'nuke'){
                if(rand()%nukeExplosionPeriod === 0){
                    let expl = this._simulateBoom({
                        center:central.loc,
                        radius:central.dangerRadius
                    }, true);
                    tot.cost += expl.cost;
                    tot.pop_affected += expl.pop_affected;
                }
            }
            return tot;
        }, {cost:0, pop_affected:0});
        this._centrals.filter(e => e !== -1)
        return stat;
    }

    _rmCentral(id){
        this.drawer.rmItem(this._centrals[id].type, this._centrals[id].loc);
        // this._centrals.splice(id, 1);
        this._centrals[id] = -1;
    }

    _simulateBoom(area, set){
        set = set || false;
        let topay = cleaningcost;
        let pop_affected = 0;
        let affected_central = 0;
        area.radius = nuclearDisasterRadius;
        this._forEach(area, (x,y) => {
            let sameloc = v => v !== -1 && v.loc.x === x && v.loc.y === y;
            let central_id = this._centrals.findIndex(sameloc);
            pop_affected += this.getPopDensity(x,y);
            if(set){
                this.setPx(x, y, {
                    baseLandUse:0,
                    nrj:0,
                    pop:0,
                })
                if(central_id !== -1){
                    this._rmCentral(central_id);
                }
            } else{
                affected_central += central_id !== -1 ? 1:0;
            }
        })
        if(set){
            ['energy','groundUse','popDensity'].forEach((layer, i) => {
                this.drawer.update(layer);
            });
            this.drawer.draw();
        }
        topay += pop_affected * meanCostToRelocate
        // TODO reallocate pop
        return {
            pop_affected: pop_affected,
            cost: topay,
            affected_central: affected_central,
        };
    }

    /** @brief in the given area, count the valid valid pixels
    @note area is as defined in prepareBuild
    @note a pixel oriented south can be counted as 'more than a pixel'
    @note area must be valid
    @return area (float) pixels
    */
    _countPvArea(area){
        let counter = (x, y) => {
            const nrj = this.getNrj(x,y);
            const lu = this.getGroundUse(x,y);
            if((lu == GroundUsage.field || lu == GroundUsage.field2
                || lu == GroundUsage.forest || lu == GroundUsage.forest2)
                && nrj == 0)
                    counter.area ++;
            };
        counter.area = 0;

        this._forEach(area, counter);
        return counter.area;
    }


    /** @brief will call f(x, y) for each pixel in the given area */
    _forEach({center:{x:x, y:y}, radius:radius}, f){
        const radius2 = radius*radius;

                //         bound   ,no outside       recenter
        let box = {
            minX: Math.max(x-radius,    0)             -x,
            minY: Math.max(y-radius,    0)             -y,
            maxX: Math.min(x+radius, 1374)             -x,
            maxY: Math.min(y+radius, 1183)             -y,
        };

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
            if(conv[key] == 'popDensity'){
                densityMapPixPerCol[maps[conv[key]][y*1374+x]] -= 1;
                densityMapPixPerCol[changes[key]] += 1;
            }
            maps[conv[key]][y*1374+x] = changes[key];
        });
    }
}
