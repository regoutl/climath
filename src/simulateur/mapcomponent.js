// Copyright 2020, ASBL Math for climate, All rights reserved.

import Scene from '../ui/scene.js';

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

//hab/m2. todo : be more generic. (other countries ?)
const popDensitylegend = {
    0:0e-6,
    1:1e-6,
    2:50e-6,
    3:100e-6,
    4:200e-6,
    5:500e-6,
    6:1000e-6,
    7:2000e-6,
    8:5000e-6,
}


/** @note : not DOM aware, defer all DOM interractions to MapDrawer */
export default class MapComponent{

    /** @brief
    @param view, is the map view, must implement the functions
        - addItem(type, pos)
        - appendEnergyPalette(type)
        - update(layername)
    */
    constructor(mapImgs, simu){
        this.width = 1374;

        this.simu = simu;

        this._centrals = [];
        this.energyGrid = new Uint16Array(this.width * 1183);
        this.groundUse = mapImgs.groundUse;
        this.popDensity = mapImgs.popDensity;
        this.windPowDens = mapImgs.windPowDens;
        this.poolMap = mapImgs.pools;

        this.buildParameters = [{}];// first one is the null build



        //lots of coefs, can be modified on a country basis------------------
        this.plank = 200; //m / pix side
        this.pixelArea = this.plank * this.plank; //m2 / pix

        this.avgIrradiance = 1030; //W/m2
        this.avgWindPowerDensity50 = 328; //W/m2 (src : globalwindatlas)
        this.avgWindPowerDensity100 = 477; //W/m2 (src : globalwindatlas)
        this.totalArea = 30600e6; //m2
        this.totalPop = 11.4e6; //hab
        this.avgPopDensity = this.totalPop / this.totalArea;
        this.popGrowthSinceStart = 1.06;

    }



    /** @brief return the sum of values over an area satisfaying criterions

    @param field : array of string, describing which values to sum.
              Accepted : 'area', 'radiantFlux', 'windPower50', 'population'
    @param area : object {center: , radius: }.
    @param conditions : array of string, describing which conditions must be satisfied
              Accepted : 'buildable' : the area is either a field / forest

    @return array of the requested field sums, in the same order as fields

    @note if the area is invalid (aka curPos is undefined OR none of the specified area touches the country) :
          - condition buildable always succeed
          - specific values are replaced by their averages :
              - irradiance by average irradiance
              - etc
    @note conditions can be undefined. treated as 'no condition'

    @note pixels out of country always fail the condition test

    @warning this function modifies 'fields' and 'conditions'
    */
    reduceIf(fields, area, conditions){
        if(area.center == null || !this._areaIntersectWithCountry(area)){
            return this._theoricReduce(fields, area, conditions);
        }


        const nField = fields.length;

        for(let i = 0; i < nField; i++)
            fields[i] = fields[i] + 'At';

        let f = (x, y) => {
            for(let i = 0; i < nField; i++){
                f.ans[i] += this[fields[i]](x, y);
            }
        }

        f.ans = [];
        for(let i = 0; i < nField; i++)
            f.ans.push(0);

        this._forEachIf(area, f, conditions);


        return f.ans;
    }

    //do the theorical val of reduce.
    _theoricReduce(fields, area, conditions){
        let A = area.radius * area.radius * 3.14 * this.pixelArea;
        for(let i = 0; i < fields.length; i++){
            if(fields[i] == 'area')
                fields[i] = A;
            else if(fields[i] == 'radiantFlux')
                fields[i] = A * this.avgIrradiance;
            else if(fields[i] == 'population')
                fields[i] = A * this.avgPopDensity;
            else if(fields[i] == 'windPower50')
                fields[i] = A * this.avgWindPowerDensity50;
            else if(fields[i] == 'windPower100')
                fields[i] = A * this.avgWindPowerDensity100;
            else
                throw 'to do';
        }

        return fields;
    }

    //true if area intersects with the country
    _areaIntersectWithCountry(area){
        const radius = area.radius;
        const x = area.center.x, y = area.center.y;
        const radius2 = radius*radius;

                //         bound   ,no outside       recenter
        let box = {
            minX: Math.max(x-radius,    0)             -x,
            minY: Math.max(y-radius,    0)             -y,
            maxX: Math.min(x+radius, this.width)             -x,
            maxY: Math.min(y+radius, 1183)             -y,
        };
        // console.log(x, y, radius, box);

        for(let i = box.minX; i < box.maxX; i++){
            const i2 = i*i;
            const xi = i + x;
            for(let j=box.minY; j < box.maxY; j++){
                if(i2+j*j<radius2 && this.isInCountry(xi, y+j)){
                    return true;
                }
            }
        }
        return false;
    }

    //value getters. x & y must be valid
    areaAt(x, y){return this.pixelArea;}
    radiantFluxAt(x, y){return this.avgIrradiance * this.pixelArea;}
    windPower50At(x, y){return this.windPowDens.at50[x + y * this.width] * 8.0 * this.pixelArea;}
    windPower100At(x, y){return this.windPowDens.at100[x + y * this.width] * 8.0 * this.pixelArea;}
    populationAt(x, y){return popDensitylegend[this.popDensity[y*this.width+x]]* this.popGrowthSinceStart * this.pixelArea;}
    energyAt(x, y){ return this.energyGrid[y*this.width+x]; }
    groundUseAt(x,y){return this.groundUse[y*this.width+x];}

    //bool getters
    isInCountry(x, y){
        const lu = this.groundUseAt(x, y);
        return lu != GroundUsage.out;
    }
    isBuildable(x, y){
        const lu = this.groundUseAt(x, y);
        const nrj = this.energyAt(x,y);
        return (lu == GroundUsage.field || lu == GroundUsage.field2
            || lu == GroundUsage.forest || lu == GroundUsage.forest2)
            && nrj == 0;
    }
    isEnergy(x, y){
        return this.energyAt(x,y) != 0;
    }

    /** @brief return the content of area.
    @return array of obj. obj has a field    type
    for type in [pv, bat, wind], obj = {type, area, buildParameters, buildParametersIndex, extraDataLabel[, radiantFlux, windPower50 ]}
    for centrals, obj = {type, id}
    */
    energiesInArea(area){
        let ans = [];

        /// step 1 : list (pv (area & radFlux), storage (area), wind (area & wpd))
        let dataPerBuildId = {};
        this._forEach(area, (x, y) => {
            let buildId = this.energyAt(x,y);
            if(buildId == 0) //skip the null build
                return;
            if(dataPerBuildId[buildId] === undefined){//it is a new record
                dataPerBuildId[buildId] = {pixCount: 0}; //0 pixels
                if(this.buildParameters[buildId].extraSumDemolish){//the nrj requires a reduction
                    dataPerBuildId[buildId].label = this.buildParameters[buildId].extraSumDemolish + 'At';
                    dataPerBuildId[buildId].extra = 0;
                }
            }
            //for each pix, increase pix count
            dataPerBuildId[buildId].pixCount++;
            if(dataPerBuildId[buildId].label) //and if an xtra data is needed
                dataPerBuildId[buildId].extra += this[dataPerBuildId[buildId].label](x, y);
        });


        /// STEP 2 : add step 1 ans as a readable ans
        for (let [buildParamIndex, demolishData] of Object.entries(dataPerBuildId)) {
            let bm = this.buildParameters[buildParamIndex];

            let item = {
                type: bm.type,
                area: demolishData.pixCount * this.pixelArea,
                buildParameters: bm,
                buildParametersIndex: buildParamIndex,
            };

            if(bm.extraSumDemolish){
                item[bm.extraSumDemolish] = demolishData.extra;//ex for pv : item.radiantFlux = x W
                item.extraDataLabel = bm.extraSumDemolish;
            }

            ans.push(item);
        }


        // centrals-----------------------------
        for(let c in this._centrals){
            if(areaContains(area, this._centrals[c].loc)){
                ans.push({
                    type: 'central',
                    id: this._centrals[c].id,
                });
            }
        }

        return ans;
    }


    build(buildParameters, buildInfo, buildZone){
        if(['pv', 'battery', 'wind'].includes(buildInfo.type) ){
            this.buildParameters.push(buildParameters);

            let buildIndex = this.view.appendEnergyPalette(buildInfo.type);

            if(buildIndex + 1!= this.buildParameters.length)
                throw('insert mismatch. (buildIndex != palette index)');

            this._forEachIf(buildZone, (x, y) => {
                this.energyGrid[x + y * this.width] = buildIndex;
            }, ["buildable"]);

            this.view.update('energy');
            // this.drawer.draw();
        }
        else if(['ccgt', 'nuke', 'fusion'].includes(buildInfo.type)){
            this.view.addItem(buildInfo.type, buildZone.center);
            this._centrals.push({
                id:  buildInfo.centralId,
                loc: buildZone.center
            });
        }
        else {
          throw 'todo';
        }
    }

    //demolish a specific pv/wind/bat corresponding to buildParametersIndex in the zone.
    demolishEnergyInArea(buildParametersIndex, zone){
        this._forEach(zone, (x, y) => {
            if(this.energyAt(x, y) == buildParametersIndex)
                this.energyGrid[x + y * this.width] = 0;
        });

        this.view.update('energy');
    }

    //demolish a central
    demolishCentral(id){
        this.view.rmItem(this._centrals[id].loc);
        delete this._centrals[id];
    }



    /** @brief will call f(x, y) for each pixel in the given area */
    _forEach({center:{x:x, y:y}, radius:radius}, f){
        const radius2 = radius*radius;

                //         bound   ,no outside       recenter
        let box = {
            minX: Math.max(x-radius,    0)             -x,
            minY: Math.max(y-radius,    0)             -y,
            maxX: Math.min(x+radius, this.width)             -x,
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

    _forEachIf(area, callback, conditions){
        if( conditions === undefined)
            conditions = [];

        if(conditions.length == 0)
            conditions = ['inCountry'];

        const nCond = conditions.length;

        if(nCond > 1)
            throw 'todo : de comment the loop in f'

        for(let i = 0; i < nCond; i++)
            conditions[i] = 'is' + conditions[i].charAt(0).toUpperCase() + conditions[i].substring(1);

        let fun = (x, y) => {
          // for(let i = 0; i < nCond; i++){
              if(!this[conditions[0]](x, y))
                  return;
          // }

            callback(x, y);
        }

        this._forEach(area, fun);
    }


    /** @brief return the pool index at the given pixel.
    Null if no pool here
    254 if sea
    */
    poolIndexAt(p){
      //to hydro pos
      let pos = this._regToHydroCoord(p);

      if(pos.x < 0 || pos.y < 0 || pos.x >= 748 || pos.y >= 631)
        return null;

      let ans = this.poolMap[pos.x + pos.y * 748] - 1
      if(ans < 0)
          return null;
      return ans;
    }
    _regToHydroCoord(input){
      return {x : Math.floor((input.x - 8) / 1.836),   y: Math.floor((input.y - 63) / 1.836)};
    }


    clearEnergies(){
        //todo : also clear palette cursor.
        this.energyGrid = new Uint16Array(this.width * 1183);
    }
}


function areaContains(area, pt){
    let dx = area.center.x - pt.x;
    let dy = area.center.y - pt.y;

    return dx*dx + dy*dy <= area.radius * area.radius;
}
