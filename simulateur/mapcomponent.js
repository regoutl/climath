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

const plank = 200;
const pixelArea = plank * plank;

//Const for our current map
const kmpixratio = 30688/(1625442-854086);
const nuclearDisasterRadius = 50/*pix*/;
const nuclearDisasterArea = nuclearDisasterRadius * nuclearDisasterRadius * 3.14; /*same unit power 2*/
const meanCostToRelocate = 197000;
const cleaningcost = 150000000;
const totalpop = 11.4e6;
const nPixInCountry = 30600e6 / pixelArea;
const averagePopDensity = totalpop / nPixInCountry;

const avgIrradiance =  300; //W/m2 @see parameters.countries.belgium.irradiance
const avgWindPowerDensity50 = 400; //W/m2 @see wind map
const avgPopDensity = totalpop / 30600e6; // average pop/m2

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
        this.windPowDens = mapImgs.windPowDens;

        this.drawer = new MapDrawer({
            energy: this.energyGrid,
            groundUse: this.groundUse,
            popDensity: this.popDensity,
            windPowDens: this.windPowDens,
        });

        // this.buildInfos = [{}];
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

    updateCursor(buildInput){
      let theorical = (buildInput.curPos === undefined);

      if(!theorical){
          this.drawer.drawCursor(buildInput.state.type, buildInput.curPos, buildInput.radius);
      } else{
          //clear cursor
          this.drawer.clearCursor();
      }
    }


    /** @brief return the sum of values over an area satisfaying criterions

    @param field : array of string, describing which values to sum.
              Accepted : 'area', 'radiantFlux', 'windPower50', 'population'
    @param area : object {center: , radius: }.
    @param conditions : array of string, describing which conditions must be satisfied
              Accepted : 'buildable' : the area is either a field / forest

    @return array of the requested field sums, in the same order as fields

    @note if the area is invalid (aka curPos is undefined) :
          - condition buildable always succeed
          - specific values are replaced by their averages :
              - irradiance by average irradiance
              - etc
    @note conditions can be undefined. treated as 'no condition'

    @note pixels out of country always fail the condition test

    @warning this function modifies 'fields' and 'conditions'
    */
    reduceIf(fields, area, conditions){
        if(area.center == undefined){
            let A = area.radius * area.radius * 3.14 * pixelArea;
            for(let i = 0; i < fields.length; i++){
                if(fields[i] == 'area')
                    fields[i] = A;
                else if(fields[i] == 'radiantFlux')
                    fields[i] = A * avgIrradiance;
                else if(fields[i] == 'population')
                    fields[i] = A * avgPopDensity;
                else if(fields[i] == 'windPower50')
                    fields[i] = A * avgWindPowerDensity50;
                else
                    throw 'to do';
            }

            return fields;
        }

        if( conditions === undefined)
            conditions = [];

        if(conditions.length == 0)
            conditions = ['inCountry'];

        const nField = fields.length;
        const nCond = conditions.length;

        if(nCond > 1)
            throw 'todo : de comment the loop in f'

        for(let i = 0; i < nCond; i++)
            conditions[i] = 'is' + conditions[i].charAt(0).toUpperCase() + conditions[i].substring(1);

        for(let i = 0; i < nField; i++)
            fields[i] = fields[i] + 'At';

        let f = (x, y) => {
            // for(let i = 0; i < nCond; i++){
                if(!this[conditions[0]](x, y))
                    return;
            // }

            for(let i = 0; i < nField; i++){
                f.ans[i] += this[fields[i]](x, y);
            }
        }

        f.ans = [];
        for(let i = 0; i < nField; i++)
            f.ans.push(0);

        this._forEach(area, f);
        return f.ans;
    }

    areaAt(x, y){return pixelArea;}
    radiantFluxAt(x, y){return avgIrradiance * pixelArea;}
    windPower50At(x, y){return this.windPowDens.at50[x + y * 1374] * 8.0 * pixelArea;}
    populationAt(x, y){return this.getPopDensity(x, y) * pixelArea;}

    isInCountry(x, y){
        const lu = this.getGroundUse(x, y);
        return lu != GroundUsage.out;
    }
    isBuildable(x, y){
        const lu = this.getGroundUse(x, y);
        const nrj = this.getNrj(x,y);
        return (lu == GroundUsage.field || lu == GroundUsage.field2
            || lu == GroundUsage.forest || lu == GroundUsage.forest2)
            && nrj == 0;
    }



    /**   @brief : like prepareBuild BUT saves the action
    @return void
    @details
        called on click

        will only be called if prepareBuild(...).theorical != True

        must succeed !
    **/
    build(buildInfo){
        if(buildInfo.type == 'pv' || buildInfo.type == 'battery'|| buildInfo.type == 'wind'){
            // this.buildInfos.push(buildInfo.input.state);

            let r, g, b, a = 255;
            if(buildInfo.type == 'pv'){r = 70; g = 85; b = 130;}
            if(buildInfo.type == 'battery'){r = 0; g = 255; b = 250;}
            if(buildInfo.type == 'wind'){r = 255; g = 255; b = 250; a = 128}


            let buildIndex = this.drawer.energy.appendPalette(r, g, b, a);

            this._forEach({center: buildInfo.input.curPos, radius: buildInfo.input.radius}, (x, y) => {
                const nrj = this.getNrj(x,y);
                const lu = this.getGroundUse(x,y);
                if((lu == GroundUsage.field || lu == GroundUsage.field2
                    || lu == GroundUsage.forest || lu == GroundUsage.forest2)
                    && nrj == 0)
                        this.energyGrid[x + y * 1374] = buildIndex;
            });

        this.drawer.update('energy');
        this.drawer.draw();
      } else if(buildInfo.type == 'nuke' || buildInfo.type == 'ccgt'){
            this.drawer.addItem(buildInfo.type, buildInfo.input.curPos);
            this._centrals.push({
                type:buildInfo.type,
                loc: buildInfo.input.curPos,
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
