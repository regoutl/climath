
import {tr} from '../../../tr/tr.js';
import {Plot} from '../../plot.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class NukeDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
        this.cBuildCost = React.createRef();//canvas of the effi plot
        this.cPerWhCost = React.createRef();//canvas of the effi plot
        this.cPerWhCo2 = React.createRef();//canvas of the effi plot
    }

    componentDidMount(){
        let nuke = this.props.productionMeans.centrals.nuke;
        let p;


        p = new Plot(nuke.build.cost, 300, 200);
        p.draw(this.cBuildCost.current.getContext('2d'));

        p = new Plot(nuke.perWh.cost, 300, 200);
        p.draw(this.cPerWhCost.current.getContext('2d'));

        p = new Plot(nuke.perWh.co2, 300, 200);
        p.draw(this.cPerWhCo2.current.getContext('2d'));
    }

    componentWillUnmount(){

    }

    render(){
        let nuke = this.props.productionMeans.centrals.nuke;


        return (<div className='detailContent'>
            <h3>{tr('Nuclear reactors')}</h3>
            <p>{tr('Nuclear reactors are devices that transform radioactivity into electricity.')}</p>

            <p>{tr('The production of a central is ')}
            <img src="data/nuke/eq.svg" alt="Pv production eq" />
            {tr('where')}
            </p>
            <ul>
            <li><img src="data/nuke/nameplate.svg" alt="Pv production eq" /> {tr('is the central pic production')}</li>
            <li><img src="data/nuke/capaFact.svg" alt="Pv production eq" /> {tr('is the capacity factor')}</li>
            </ul>

            <div className="hWrapLayout">
                <div>

                    <h4>{tr('Build cost')}</h4>
                    <p>{tr('Nuclear central construction cost. ')}</p>
                    <canvas ref={this.cBuildCost} width="300" height="200"/>
                    <p className="pSource">{nuke.build.cost.source}</p>
                </div>

                <div>
                    <h4>{tr('Operation and maintenance costs')}</h4>

                    <p>{tr('Cost per Wh')}</p>
                    <canvas ref={this.cPerWhCost} width="300" height="200"/>
                    <p className="pSource">{nuke.perWh.cost.source}</p>
                </div>
                <div>
                    <h4>{tr('Operation footprint')}</h4>

                    <p>{tr('Footprint per Wh')}</p>
                    <canvas ref={this.cPerWhCo2} width="300" height="200"/>
                    <p className="pSource">{nuke.perWh.co2.source}</p>
                </div>
                <div>
                    <h4>{tr('Capacity factor')}</h4>
                    <p>{tr('Nuclear centrals have a capacity factor of 0.9.')}</p>

                    <p className="pSource">Source ?</p>
                </div>
                <div>
                    <h4>{tr('Decommission')}</h4>
                    <p>{tr('Deconstruction of a nuclear central have an estimated cost of 15% of the build cost')}</p>

                    <p className="pSource">Source ?</p>
                </div>
                <div>
                    <h4>{tr('Accident risk')}</h4>
                    <p>{tr('Public health treathening accidents happend with probability ')}</p>
                    <p>{tr('In case of accident, a radius of 10km aroudn the central must be evacueted')}</p>

                    <p className="pSource">Source ?</p>
                </div>
                <div>
                    <h4>{tr('Cooling')}</h4>
                    <p>{tr('Nuclear centrals have a primary energy efficiency of ') + nuke.primEnergyEffi}</p>
                    <p>{tr('Evacuhating all this heat by boiling 20 deg water requires 1.6m3/s')}</p>

                    <p className="pSource">Source ?</p>
                </div>
            </div>

            <div className="hLayout"><div className="button black" onClick={this.props.closeRequested}>{tr('Close')}</div></div>
        </div>);
    }
}
