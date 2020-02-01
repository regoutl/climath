import IntermittentProductionMean from './intermittentproductionmean.js';
import * as Yearly from "../timevarin.js";


export default class Pv extends IntermittentProductionMean{
    constructor(parameters, simu) {
        super(parameters, 'pv');

        this.simu = simu;

        /// store pv with same stat. only used for yearly capacity update
        /// store, for each (powerDeclinePerYears) the installed capacity
        this.groups= new Map();
        this.area= parameters.init.area; ///m2 installed. usefull for o&m compute

        this.efficiency = new Yearly.Raw(0);
        this.efficiency.fromJSON(parameters.efficiency);

        this.build.energy = new Yearly.Raw(0);
        this.build.energy.fromJSON(parameters.build.energy);

        /// initial capacity is not null, create groups that match its spec
        this.groups.set(Math.pow(parameters.init.powerDecline25Years, 1/25.0),
                        this.capacity);
    }

    happyNYEve(yStats){
        //do power decline
        this.capacity = 0;

        this.groups.forEach( (value, key, map) => {
          value *= key;
          map.set(key, value);
          this.capacity += value;
        });


        //compute fixed o & M
        yStats.cost.perYear.pv +=
              this.area * this.perYear.cost.at(yStats.year); // pv
    }

    /**
    * 		@param what.area : R. m^2 . required.
    *      @param what.effiMul : [0-1], default val = 1
    *      @param what.madeIn : {china, usa} , default val = china
    *      @param what.powerDecline : [0, 1] , power decline per year.
    * 						nextYearCapa = thisYearCapa * powerDecline.
    * 						default val = 1.
    *      @param what.priceMul : R, coef of price for installation.
    * 						default val = 1
    * @todo:		@param what.seller : {sunPower ,Panasonic, JinkoSolar}. set above params (see parameters.json)
    @warning do not directly modify build.info in this function (leave it to _prepareCapex)
    **/
    prepareCapex(build){
        build.pm = this;

        let parameters = build.parameters;


        parameters.extraSumDemolish = 'radiantFlux';


        let a = this.simu.cMap.reduceIf(['area', 'radiantFlux'], build.area, ['buildable']);
        let area = a[0];
        let radiantFlux  = a[1];

        if(parameters.effiMul === undefined)
          parameters.effiMul = 1;
        if(parameters.madeIn === undefined)
          parameters.madeIn = 'china';
        if(parameters.installedIn === undefined)
          parameters.installedIn = 'belgium';
        if(parameters.powerDecline === undefined)
          parameters.powerDecline = 1;
        if(parameters.priceMul === undefined)
          parameters.priceMul = 1;

        this._prepareCapex(build, area, radiantFlux);
    }

    // _sanitiseBuildParameters(build){
    //
    // }

    ///does the job of prepare capex, with a correct parameters (no modification of build.parameters)
    _prepareCapex(build, area, radiantFlux){
        const parameters = build.parameters; //leave this const here !
        let info = build.info;
        info.area = area;

        info.build.end = this.endOfBuild(build);

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
            * this.build.energy.at(info.build.begin)  // wH / m2
            * countries[parameters.madeIn].elecFootprint.at(info.build.begin); // C / Wh
        info.build.cost  = this._computeBuildCost(build, area);


        info.perYear = {cost: this.perYear.cost.at(info.build.end) * area, co2: 0};
        info.perWh = {cost: 0, co2: 0};
        info.avgCapacityFactor = 0.12; //todo : do a real computation ?
    }

    _computeBuildCost(build, area){
        return area * build.parameters.priceMul * // m2
            this.build.cost.at(build.info.build.begin);  // eur/m2
    }


    //note : must be called when simu.year = cmd.build.end
    capex(build){
        if(build.info.type != 'pv')
          throw 'PV.capex; build.Info.type != pv';

        this.area += build.info.area;

        let nameplate = build.info.nameplate.at(build.info.build.end);

        this.capacity += nameplate;

    	let powerDecline = build.info.nameplate.rate;

    	if(!this.groups.has(powerDecline))
    		this.groups.set(powerDecline, nameplate);
    	else
    		this.groups.set(powerDecline,
                      this.groups.get(powerDecline) + nameplate);
    }

    /** same input as demolish. return the cost of demolition. Dont apply the demoliton*/
    costOfDemolish(demolish){
        return this._computeBuildCost(demolish, demolish.reductions.area) * this.demolishRatio;
    }

    /**
    @param demolish.parameters is exactly the same as what was send to capex as build.buildParameters
    @param demolish.reductions  {
    area:     area to deconstruct m2,
    extra:    the radiant flux over the area to demolish of reduce(bc of parameters.extraSumDemolish)
    }
    @param demolish.info.build.begin : begin build year
    @param demolish.year : demolish year
    @return demolition cost

    @todo : when (in the year) is this function called ? Some adjustements to be done
    */
    demolish(demolish){
        //get all the build informations
        this._prepareCapex(demolish, demolish.reductions.area, demolish.reductions.extra);

        //not build yet -> this a job for the scheduled build queue
        /** reflexion : as (pv, wind, storage) are build in a year,
        why not pre-remove the surface, and let the scheduled build happend normally ?

        To investigate
        */
        if(demolish.info.build.end < demolish.year)
            return 0;

        //diminish the area
        this.area -= demolish.reductions.area;

        //get the current nameplate :
        let nameplate = demolish.info.nameplate.at(demolish.year);
        let powerDecline = demolish.info.nameplate.rate;
        if(!this.groups.has(powerDecline))
            throw 'biz';

        // in the associated group, reduce the production
        this.groups.set(powerDecline,
                  this.groups.get(powerDecline) - nameplate);


        return demolish.info.build.cost * this.demolishRatio;
    }

}
