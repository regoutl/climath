
import {tr} from '../../../tr/tr.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';


/** @brief this class provide a lot of explainations about pv
*/
export default class FusionDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
    }

    render(){
        let fusion = this.props.productionMeans.centrals.fusion;

        const waterVapoNrg = 2250; // J / g
        const waterTCapa = 4185; // J/ kg / K
        const waterInitTemp = 20;
        const jToVapM3 = (100 - waterInitTemp) * 1000 *waterTCapa + waterVapoNrg * 1000000;
        const primEnergyPerProduced = 1 / fusion.primEnergyEffi;
        const heatPerEnProduced = primEnergyPerProduced * (1 - fusion.primEnergyEffi); //

        let m3PerJ = heatPerEnProduced / jToVapM3;
        let m3PerWh = m3PerJ * 3600;


        return (<div className='detailContent'>
            <h3>{tr('Fusion centrals')}</h3>
            <p>{tr('Fusion centrals produce electricity by fusing hydrogen.')}</p>


            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Production')}</h4>
                    <img src="data/nuke/eq.svg" alt="Pv production eq" />
                    <ul>
                    <li><img src="data/nuke/nameplate.svg" alt="Pv production eq" /> {tr('is the central pic production')}</li>
                    <li><img src="data/nuke/capaFact.svg" alt="Pv production eq" /> {tr('is the capacity factor')}</li>
                    </ul>
                </div>
                <div>
                    <h4>{tr('Build cost')}</h4>
                    <p>{tr('Gaz central construction cost. ')}</p>
                    <ReactPlot data={fusion.build.cost}/>
                    <p className="pSource">{fusion.build.cost.source}</p>
                </div>

                <div>
                    <h4>{tr('Operation and maintenance costs')}</h4>

                    <p>{tr('Cost per Wh')}</p>
                    <ReactPlot data={fusion.perWh.cost}/>
                    <p className="pSource">{fusion.perWh.cost.source}</p>
                </div>
                <div>
                    <h4>{tr('Decommission')}</h4>
                    <p>{tr('Deconstruction of a gas central have an estimated cost of 5% of the build cost')}</p>

                    <p className="pSource">Source ?</p>
                </div>
                <div>
                    <h4>{tr('Cooling')}</h4>
                    <p>{tr('Primary energy efficiency is ') + fusion.primEnergyEffi}</p>
                    <p>{tr('This means that for 100 J of gas, ')+Math.round(fusion.primEnergyEffi*100)+ tr(' J of electricity are produced, and ') + Math.round(100 - fusion.primEnergyEffi*100) + tr(' J of heat must be dissipated.')}</p>
                    <p>{tr('Evacuhating this heat by boiling 20 deg water requires ')  + valStr(m3PerWh, 'm3/Wh') + tr(' produced')}</p>

                    <p className="pSource">Source ?</p>
                </div>
            </div>
        </div>);
    }
}
