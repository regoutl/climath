import * as Yearly from "../timevarin.js";
import AbstractProductionMean from './abstractproductionmean.js';

class Kind extends AbstractProductionMean{
    constructor(parameters, label){
        super(parameters, label);

        this.primEnergyEffi = parameters.primEnEfficiency;

        this.capacity = parameters.init.capacity *
                          parameters.init._capacityvalMul; //W installed

        //capacity factor
        this._capacityFactor = parameters.capacityFactor ? parameters.capacityFactor: 1;

        // this.demolishRatio = 0.15;
    }
}

const nuclearDisasterRadius = 50/*pix*/;

export default class ThermicCentral /*extends AbstractProductionMean*/{
    constructor(parameters, simu){
        this.simu = simu;
        this.centrals = {};

        this.hourlyDemand = new Float32Array(8760);
        this.hourlyDemandCur = 0;

        this.nuke = new Kind(parameters.nuke, 'nuke');
        this.ccgt = new Kind(parameters.ccgt, 'ccgt');
        this.fusion = new Kind(parameters.fusion, 'fusion');

        this.nuke.boom = {probability: 3/15080};

        this.nuke.defaultNameplate = 3e9;
        this.ccgt.defaultNameplate = 1.6e9;
        this.fusion.defaultNameplate = 3e9;
        this.fossilFootprint = parameters.fossil.footprint;

        this.centrals.fossil = {
            prodMax: Infinity,
            co2PerWh:parameters.fossil.footprint,
            m3PerJ: 0,
            pool: 254, // whatever pool
            costPerWh: 0,
            type: 'fossil',
        };
        this.centrals.beginNuke = {
            prodMax: parameters.nuke.init.capacity *
                              parameters.nuke.init._capacityvalMul,
            co2PerWh:this.nuke.perWh.co2.at(2019),
            m3PerJ: 0,
            pool: 254, // whatever pool
            costPerWh: this.nuke.perWh.cost.at(2019),
            type: 'nuke',
        } ;
        this.centrals.beginCcgt = {
            prodMax: parameters.ccgt.init.capacity *
                              parameters.ccgt.init._capacityvalMul,
            co2PerWh:this.ccgt.perWh.co2.at(2019),
            m3PerJ: 0,
            pool: 254, // whatever pool
            costPerWh: this.ccgt.perWh.cost.at(2019),
            type: 'ccgt',
        };

        this.nextCentralName = 0;
    }

    /// this component includes petrol, so infinite
    capacityAt(t){return Infinity;}

    /// produces the given energy amount.
    /// update output : incease output.co2 and output.cost
    produce(amount, output, hourIndex){
        if(hourIndex === undefined)
            throw 'need hour index';
        this.hourlyDemand[hourIndex] += amount;
    }

    //O & M. Called right before the new year, for the ending year
    happyNYEve(yStats){
        // this.nuke.happyNYEve(yStats); //todo : add fixed o n m
        // this.ccgt.happyNYEve(yStats);

        //convert the dic to an array for yearly prod
        let centArr = [];
        for(let c in this.centrals){
            centArr.push(this.centrals[c]);
        }

        let productions = yearlyProductions(this.hourlyDemand,
                                            {dayOffset: rand() % 100 * 365,
                                            hydroComp: this.simu.cHydro},
                                            centArr);


        for(let i = 0; i < centArr.length; i++){
            let type = centArr[i].type;
            yStats.co2.perWh[type] += productions[i] * centArr[i].co2PerWh;
            yStats.cost.perWh[type] += productions[i] * centArr[i].costPerWh;
            yStats.consumedEnergy.origin[type] += productions[i];
        }

        //reset the demand to 0
        this.hourlyDemand.fill(0);
    }

    prepareCapex(build){
        let parameters = build.parameters;
        let info = build.info;

        if(!['nuke', 'ccgt', 'fusion'].includes(parameters.type))
            throw 'wrong component';

        build.pm = this;

        info.build.end = this[parameters.type].build.delay +
                        info.build.begin;

        //check for parameters
        if(parameters.nameplate === undefined)
    //      throw 'must define a nameplate';
            parameters.nameplate =
                    this[parameters.type].defaultNameplate;

        let nameplate = parameters.nameplate;


        info.nameplate = new Yearly.Raw(nameplate);
        info.nameplate.unit = 'N';

        info.build.co2 = nameplate // m2
            * this[parameters.type].build.co2.at(info.build.begin);

        info.build.cost  =  this._computeBuildCost(build);


        info.perYear = {
            cost: this[parameters.type].perYear.cost.at(info.build.end) * nameplate,
            co2: 0};

        info.perWh = {
          cost: this[parameters.type].perWh.cost.at(info.build.end),
          co2:  this[parameters.type].perWh.co2.at(info.build.end)};
        info.avgCapacityFactor = this[parameters.type]._capacityFactor;

        info.primEnergyEffi = this[parameters.type].primEnergyEffi;

        //cooling rate
        const waterVapoNrg = 2250; // J / g
        const waterTCapa = 4185; // J/ kg / K
        const waterInitTemp = 20;
        const jToVapM3 = (100 - waterInitTemp) * 1000 *waterTCapa + waterVapoNrg * 1000000;
        // let whToVapM3 = jToVapM3 / 3600;//wh/m3

        const primEnergyPerProduced = 1 / info.primEnergyEffi;
        const heatPerEnProduced = primEnergyPerProduced * (1 - info.primEnergyEffi); //

        info._m3PerJ = heatPerEnProduced / jToVapM3;
        info.coolingWaterRate = nameplate * info.avgCapacityFactor * info._m3PerJ;

        info.centralId = this.nextCentralName;
        this.nextCentralName++;

        if(parameters.type == 'nuke'){
            info.pop_affected = this.simu.cMap.reduceIf(['population'],
                                                            {center: build.area.center, radius: nuclearDisasterRadius});
        }

        if(build.area.center !== null){
            let pool = this.simu.cMap.poolIndexAt(build.area.center);

            if(pool == null){
                info.theorical = "water";
            }
            else{
                info._poolIndex = pool;
                info.river = this.simu.cHydro.poolName(pool);
            }

            if(!this.simu.cMap.isInCountry(build.area.center.x, build.area.center.y))
                info.theorical = "wrong space";
        }
    }
    _computeBuildCost(build){
        return build.parameters.nameplate * // w
            this[build.parameters.type].build.cost.at(build.info.build.begin);  // eur/w
    }

    /// expand capacity
    capex(build){
        let parameters = build.parameters;
        let info = build.info;

        if(!['nuke', 'ccgt', 'fusion'].includes(parameters.type))
            throw 'wrong component';

        let nameplate = build.info.nameplate.at(build.info.build.end);

        if(info.centralId in this.centrals)
            throw 'appeler prepareCapex a chaque fois svp';

        this.centrals[info.centralId] = {
            prodMax: nameplate * this[parameters.type]._capacityFactor,
            co2PerWh:info.perWh.co2,
            m3PerJ: info._m3PerJ,
            pool: info._poolIndex,
            costPerWh: info.perWh.cost,
            type: parameters.type,
            demolishCost: info.build.cost * this[parameters.type].demolishRatio,
        };

    }

    /** same input as pv.demolish. return the cost of demolition. Dont apply the demoliton*/
    costOfDemolish(demolish){
        return this._computeBuildCost(demolish) * this.demolishRatio;
    }

    /**
    demolish the given central.
    @warning the central must exist (build complete)
    @return demolition cost
    */
    demolish(centralId){
        if(!centralId in this.centrals)
            throw 'no in';

        let cost = this.centrals[centralId].demolishCost;

        delete this.centrals[centralId];
        return cost;
    }
}


/** @param consumptions : 24 x Watts needed
@param water : {day, hydroComp}
@param centrals : {centralIndex:{prodMax, co2PerWh, m3PerJ, pool}}

@return  {centralIndex:prod} (daily productions, Wh)
*/
function simulateDay(a, consumptions, water, centrals){
    let lp = a.lp;

    let ans = new Float32Array(centrals.length);
    const nCentral = centrals.length;

    //update the consumtion constraints
    for(let h = 0; h < 24; h++){
        glp_set_row_bnds(lp, h + 1, GLP_FX, consumptions[h]);
    }

    const relevantPoolIndices = a.relevantPoolIndices;
    const hydro = water.hydroComp;
    //update the water levels
    for(let p = 0; p < relevantPoolIndices.length; p++){
        let pool = relevantPoolIndices[p];
        // console.log(hydro.available(pool, water.day));
        //note : the * 24 is in the init as a division
        glp_set_row_bnds(lp, 1 + 24 + p, GLP_UP, 0, hydro.available(pool, water.day));
    }







    let errCode = glp_simplex(lp, null);
    if(errCode != 0)
        throw 'error';

    let asdf = glp_get_prim_stat(lp);
    if(asdf != GLP_FEAS){

        // if(day % 365 == 0){
        //     console.log('at h = 0')
        //     let i = 0, h = 0;
        //     for(let c in centrals){
        //         i++;
        //     }
        // }

        alert('infeasible ?? "' + asdf + '"');
    }

    // let objective = glp_get_obj_val(lp);

    // for(let i = 1; i <= glp_get_num_cols(lp); i++){
    //     let colName = glp_get_col_name(lp, i);
    //
    //     let unId = colName.indexOf('_');
    //     ans[colName.substring(1, unId)] += glp_get_col_prim (lp, i);
    //
    //     // result[] = glp_get_col_prim (lp, i);
    // }


    for(let i = 0; i <nCentral; i++){
        for(let h = 0; h < 24; h++){
            ans[i] += glp_get_col_prim (lp, i * 24 + h + 1);
        }
    }

    return ans;
}


/** @param consumptions : 8760 x Watts needed
@param water : {dayOffset, hydroComp}
@param centrals : {i:{prodMax, co2PerWh, m3PerWh, pool}}

@return  {1, 2, 3, .., n, fossil} (yearly productions, Wh)
*/
function yearlyProductions(consumptions, water, centrals){
    let lp = initLp(water.hydroComp, centrals);


    const nPieces = 128;

    let evals = [];
    for(let i = 0; i <= nPieces; i++){
        let dayIndex = Math.round(i * 364.0 / nPieces);

        evals.push(simulateDay(lp, consumptions.slice(dayIndex*24, (dayIndex + 1)*24),
                                {day: dayIndex + water.dayOffset, hydroComp:water.hydroComp},
                                centrals));
    }


    let productions = {};

    //do romberg
    for(let c = 0; c < centrals.length; c++){
        let values = []; // production of central c during the selected day
        for(let i = 0; i <= nPieces; i++)
            values.push(evals[i][c]);

        productions[c] = romberg(values) * 365.0 / nPieces;
    }

    return productions;
}

//return the romberg integral of unit spaced samples
function romberg(values){
    let estimates = [];
    for(let i = 1; i <= values.length; i *= 2)
        estimates.push(trapezis(values, i));


    let k = 4.0;
    for(let i = estimates.length - 1; i >= 0; i--){
        for(let j = 0; j < i; j++){
            estimates[j] = (k*estimates[j+1] - estimates[j]) / (k-1);
        }
        k *= 4.0;
    }

    return estimates[0];
}

//return the trapezis integral of unit spaced points
// done via sum of n trapezis
function trapezis(values, n = 1){
    let ans = 0.0;
    const spacing = (values.length - 1) / n;

    for(let i = 0; i < n; i++)
        ans += (values[i*spacing] + values[(i+1)*spacing]) / 2.0 * spacing;
    return ans;
}



function initLp(hydro, centrals){
    const nCentral = centrals.length;
    let lp = glp_create_prob();

    glp_set_obj_dir(lp, GLP_MIN);
    glp_add_cols(lp, nCentral * 24); //production of each central for each hour

    //obj function : min co2 = sum p_i * c_i
    for(let h = 0; h < 24; h++){

        for(let i = 0;i < nCentral; i++){
            glp_set_obj_coef(lp, i * 24 + h+1, centrals[i].co2PerWh);
        }
    }

    // hourly production = consumption
    glp_add_rows(lp, 24);

    let indices = new Uint16Array(nCentral + 1);
    let vals = new Float32Array(nCentral + 1);
    for(let h = 0; h < 24; h++){
        for(let i = 0;i < nCentral; i++){
            indices[i+1] = i * 24 + h + 1;
            vals[i+1] = 1;
        }

        glp_set_mat_row(lp, h + 1, nCentral, indices, vals);
        // glp_set_row_bnds(lp, h + 1, GLP_FX, consumptions[h]);
    }


    //respect water levels
    const pools = hydro.pools;

    let isPoolRelevant = new Uint8Array(pools.length);
    for(let i = 0;i < nCentral; i++){
        if(centrals[i].pool == 254) continue; //skip sea
        isPoolRelevant[centrals[i].pool] = 1;
    }
    const nRelevantPool = isPoolRelevant.reduce((a, b) => a+b);
    if(nRelevantPool > 255)
        throw 'trop bcp pr next';

    let relevantPoolIndices = new Uint8Array(nRelevantPool);
    if(nRelevantPool > 0){
        let cur = 0;
        for(let i = 0; i < pools.length; i++){
            if(isPoolRelevant[i] == 1){
                relevantPoolIndices[cur] = i;
                cur ++;
            }
        }

        const jourParHeure = 1.0 /24.0;
        const offset = glp_add_rows(lp, nRelevantPool);
        // console.log(offset);
        indices = new Uint16Array(nCentral * 24+1);
        vals = new Float32Array(nCentral * 24+1);
        for(let k = 0; k < nRelevantPool; k++){ //for each pool
            let currentPool = relevantPoolIndices[k];

            //each
            let cur = 0;

            for(let c = 0;c < nCentral; c++){
                if(centrals[c].pool == 254 || !hydro._flowsToward(centrals[c].pool, currentPool)){
                    continue;
                }

                for(let h = 0; h < 24; h++){
                    indices[cur+1] = c * 24 + h + 1;
                    //note : coef jourPerHeure est pr faire la moyenne de conso d'eau < debit du jour
                    vals[cur+1] = centrals[c].m3PerJ * jourParHeure;
                    cur++;
                }
            }

            glp_set_mat_row(lp, k + offset, cur, indices.slice(0, cur+1), vals.slice(0, cur+1));
        }
    }



    //prod of each central at each time <= max
    for(let h = 0; h < 24; h++){
        for(let c = 0; c < nCentral; c++){
            if(centrals[c].type == 'fossil'){
                glp_set_col_bnds(lp, c * 24 + h + 1, GLP_LO, 0);
            }
            else
                glp_set_col_bnds(lp, c * 24 + h + 1, GLP_DB, 0, centrals[c].prodMax);
        }
    }
    var smcp = new SMCP({presolve: GLP_ON});
    glp_scale_prob(lp, GLP_SF_AUTO);
    glp_simplex(lp, smcp);
    return {lp: lp, relevantPoolIndices: relevantPoolIndices};
}
