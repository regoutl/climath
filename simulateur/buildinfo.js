

/** information about a build
*/
export default class BuildInfo{
    constructor(parameters){


        this.type = null;
        if(parameters)
            this.type = parameters.type;

        this.build ={
            begin: (parameters ? parameters.year: 0),
            cost: 0,
            co2: 0,
        };
        this.perWh ={
            cost: 0,
            co2: 0
        };
        this.perYear ={
            cost: 0,
            co2: 0
        };
        this.theorical = null;
    }

}
