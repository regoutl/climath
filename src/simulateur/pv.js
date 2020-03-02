import IntermittentProductionMean from './intermittentproductionmean.js';
import * as Yearly from "../timevarin.js";
import BuildInfo from './buildinfo.js';

export default class Pv extends IntermittentProductionMean{

    /// init pv component.
    constructor(parameters, capaFact, simu) {
        super(parameters, capaFact, 'pv');

        this.simu = simu;

        /// store pv with same stat. only used for yearly capacity update
        /* store, for each (powerDeclinePerYears)
        {
            nameplate    //current initNameplate
            nowBuilding  //nameplate to be added next year
        }
        */
        this.groups= new Map();
        this.area= parameters.init.area; ///m2 installed. usefull for o&m compute
        this.areaNowBuilding = 0;

        this.efficiency = new Yearly.Raw(parameters.efficiency);

        this._build.energy = new Yearly.Raw(parameters.build.energy);

        /// initial capacity is not null, create groups that match its spec
        this.groups.set(Math.pow(parameters.init.powerDecline25Years, 1/25.0),
                        {nameplate: this.capacity, nowBuilding: 0});

        this.yearlyPowerDecline = Math.pow(parameters.efficiencyDecline25Years, 1/25);
    }

    //do power decline, add newly builds and compute yearly cost
    happyNYEve(yStats){
        //do power decline : re count the capacity of all groups
        this.capacity = 0;

        this.groups.forEach( (group, powerDecline) => {
          group.nameplate *= powerDecline;
          group.nameplate += group.nowBuilding;
          group.nowBuilding = 0;

          this.capacity += group.nameplate;
        });


        //compute fixed o & M
        yStats.cost.perYear.pv +=
              this.area * this.perYear.cost.at(yStats.year); // pv

        //and add the area wi just build (AFTER O & M)
        this.area += this.areaNowBuilding;
        this.areaNowBuilding = 0;
    }

    /** @brief compute info associated with the build.  Build is NOT executed.
    @param parameters {
        year : build begin year,
    }.
    @param zone.  a valid map area (see mapcomponent)
    @return  info as defined in Simulateur.buildInfo.  BUT theorical is never set

    @important parameters is modified
    */
    buildInfo(parameters, zone){
        parameters.extraSumDemolish = 'radiantFlux';

        let [area, radiantFlux] = this.simu.cMap.reduceIf(['area', 'radiantFlux'], zone, ['buildable']);

        if(parameters.effiMul === undefined)
          parameters.effiMul = 1;
        if(parameters.madeIn === undefined)
          parameters.madeIn = 'china';
        if(parameters.installedIn === undefined)
          parameters.installedIn = 'belgium';
        if(parameters.powerDecline === undefined)
          parameters.powerDecline = this.yearlyPowerDecline;
        if(parameters.priceMul === undefined)
          parameters.priceMul = 1;

        return this._buildInfo(parameters, area, radiantFlux);
    }


    ///does the job of prepare capex, with a correct parameters (no modification of build.parameters)
    _buildInfo(parameters, area, radiantFlux){
        let info = new BuildInfo(parameters);
        info.area = area;

        info.build.end = this.endOfBuild(info);

        let initNameplate
            = radiantFlux
              * this.efficiency.at(info.build.begin)
              * parameters.effiMul;
        info.nameplate = new Yearly.Expo(info.build.end,
                                        initNameplate,
                                        parameters.powerDecline);
        info.nameplate.unit = 'N';

        let countries = this.simu.cProd.countries;

        info.build.co2 = area // m2
            * this._build.energy.at(info.build.begin)  // wH / m2
            * countries[parameters.madeIn].elecFootprint.at(info.build.begin); // C / Wh
        info.build.cost  = this._buildCost(parameters, area);


        info.perYear.cost =  this.perYear.cost.at(info.build.end) * area;
        info.avgCapacityFactor = 0.12; //todo : do a real computation ?

        return info;
    }

    _buildCost(parameters, area){
        return area * parameters.priceMul * // m2
            this._build.cost.at(parameters.year);  // eur/m2
    }

    /** @brief start the building of pv.
    @param info is the result of buildInfo
    @return undefined
    @details start the building.
    */
    build(info){
        if(info.type != 'pv')
          throw 'PV.capex; info.type != pv';

        this.areaNowBuilding += info.area;

        let nameplate = info.nameplate.at(info.build.end);

        // this.capacity += nameplate;

    	let powerDecline = info.nameplate.rate;

    	if(!this.groups.has(powerDecline))
    		this.groups.set(powerDecline, {nameplate: 0, nowBuilding: nameplate});
    	else
    		this.groups.get(powerDecline).nowBuilding += nameplate;
    }

    /** @brief return the cost of demolition. Dont apply the demoliton*/
    demolishCost(parameters, area){
        return this._buildCost(parameters, area) * this.demolishRatio;
    }

    /**
    @param parameters is exactly the same as what was send to capex as build.buildParameters
    @param  area:     area to deconstruct m2,
    @param radianFlux: the radiant flux over the area to demolish of reduce(bc of parameters.extraSumDemolish)
    @param demolish.info.build.begin : begin build year
    @param demolish.year : demolish year

    @todo : when (in the year) is this function called ? Some adjustements to be done
    */
    demolish(demolishYear, parameters, area, radianFlux){
        //get all the build informations
        let buildInfo = this._buildInfo(parameters, area, radianFlux);

        //get the current nameplate :
        let nameplate = buildInfo.nameplate.at(demolishYear);
        let powerDecline = buildInfo.nameplate.rate;
        if(!this.groups.has(powerDecline))
            throw 'biz';

        //not build yet
        if(buildInfo.build.end > demolishYear){
            console.log('was not done yet');
            this.areaNowBuilding -= area;
            // in the associated group, reduce the production
            this.groups.get(powerDecline).nowBuilding -= nameplate;


            if(this.areaNowBuilding < 0 || this.groups.get(powerDecline).nowBuilding < 0)
                throw 'sdf';
        }
        else{
            //diminish the area
            this.area -= area;

            // in the associated group, reduce the production
            this.groups.get(powerDecline).nameplate -= nameplate;

            if(this.area < 0 || this.groups.get(powerDecline).nameplate < 0)
                throw 'check non consistent';
        }
    }

}
