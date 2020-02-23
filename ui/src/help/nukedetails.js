
import {tr} from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';

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
    }


    render(){
        let nuke = this.props.productionMeans.centrals.nuke;

        return (<div className='detailContent'>
            <h3>{tr('Nuclear reactors')}</h3>
            <p>{tr('Nuclear reactors are devices that transform radioactivity into electricity.')}</p>


            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Production')}</h4>
                    <img src="data/nuke/production.svg" alt="Pv production eq" />
                    <ul>
                    <li><img src="data/symbols/nameplate.svg" alt="Nuke" /> {tr('is the central pic production')}</li>
                    <li><img src="data/symbols/capaFact.svg" alt="Nuke" /> {tr('is the capacity factor')}</li>
                    </ul>
                </div>
                <div>
                    <h4>{tr('Build cost')}</h4>
                    <p>{tr('Nuclear central construction cost. ')}</p>
                    <ReactPlot data={nuke.build.cost} />
                    <p className="pSource">{nuke.build.cost.source}</p>
                </div>

                <div>
                    <h4>{tr('Operation and maintenance costs')}</h4>

                    <p>{tr('Cost per Wh')}</p>
                    <ReactPlot data={nuke.perWh.cost} />
                    <p className="pSource">{nuke.perWh.cost.source}</p>
                </div>
                <div>
                    <h4>{tr('Operation footprint')}</h4>

                    <p>{tr('Footprint per Wh')}</p>
                    <ReactPlot data={nuke.perWh.co2} />
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
        </div>);
    }
}
