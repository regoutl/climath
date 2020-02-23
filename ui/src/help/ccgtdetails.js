
import {tr} from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class CcgtDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
    }

    render(){
        let ccgt = this.props.productionMeans.centrals.ccgt;

        const waterVapoNrg = 2250; // J / g
        const waterTCapa = 4185; // J/ kg / K
        const waterInitTemp = 20;
        const jToVapM3 = (100 - waterInitTemp) * 1000 *waterTCapa + waterVapoNrg * 1000000;
        const primEnergyPerProduced = 1 / ccgt.primEnergyEffi;
        const heatPerEnProduced = primEnergyPerProduced * (1 - ccgt.primEnergyEffi); //

        let m3PerJ = heatPerEnProduced / jToVapM3;
        let m3PerWh = m3PerJ * 3600;


        return (<div className='detailContent'>
            <h3>{tr('Gas centrals')}</h3>
            <p>{tr('Gas centrals transform chemical energy into electricity.')}</p>


            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Production')}</h4>
                    <img src="data/nuke/eq.svg" alt="Pv production eq" />
                    {tr('where')}
                    <ul>
                    <li><img src="data/nuke/nameplate.svg" alt="Pv production eq" /> {tr('is the central pic production')}</li>
                    <li><img src="data/nuke/capaFact.svg" alt="Pv production eq" /> {tr('is the capacity factor')}</li>
                    </ul>
                </div>
                <div>
                    <h4>{tr('Build cost')}</h4>
                    <p>{tr('Gaz central construction cost. ')}</p>
                    <ReactPlot data={ccgt.build.cost}/>
                    <p className="pSource">{ccgt.build.cost.source}</p>
                </div>

                <div>
                    <h4>{tr('Operation and maintenance costs')}</h4>

                    <p>{tr('Cost per Wh')}</p>
                    <ReactPlot data={ccgt.perWh.cost}/>
                    <p className="pSource">{ccgt.perWh.cost.source}</p>
                </div>
                <div>
                    <h4>{tr('Operation footprint')}</h4>

                    <p>{tr('Footprint per Wh')}</p>
                    <ReactPlot data={ccgt.perWh.co2}/>
                    <p className="pSource">{ccgt.perWh.co2.source}</p>
                </div>
                <div>
                    <h4>{tr('Decommission')}</h4>
                    <p>{tr('Deconstruction of a gas central have an estimated cost of 5% of the build cost')}</p>

                    <p className="pSource">Source ?</p>
                </div>
                <div>
                    <h4>{tr('Cooling')}</h4>
                    <p>{tr('Primary energy efficiency is ') + ccgt.primEnergyEffi}</p>
                    <p>{tr('This means that for 100 J of gas, ')+Math.round(ccgt.primEnergyEffi*100)+ tr(' J of electricity are produced, and ') + Math.round(100 - ccgt.primEnergyEffi*100) + tr(' J of heat must be dissipated.')}</p>
                    <p>{tr('Evacuhating this heat by boiling 20 deg water requires ')  + valStr(m3PerWh, 'm3/Wh') + tr(' produced')}</p>

                    <p className="pSource">Source ?</p>
                </div>
            </div>
        </div>);
    }
}
