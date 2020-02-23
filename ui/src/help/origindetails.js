
import {tr} from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class OriginDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
    }

    render(){
        let be = this.props.countries.belgium;

        return (<div className='detailContent'>
            <h3>{tr('Energy origin')}</h3>

            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Demand')}</h4>
                    <img src="data/conso/eq.svg" alt="Pv production eq" />
                    <ul>
                    {[
                        {img:'tax/pop', descr: 'is the population'},
                        {img:'conso/powerDemandPerCap', descr: 'is the power consumption per capita'},
                ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
                    </ul>
                </div>

                <div>
                    <h4>{tr('Population')}</h4>
                    <ReactPlot data={be.pop}/>
                    <p className="pSource">{be.pop.source}</p>
                </div>

                <div>
                    <h4>{tr('Power consumption per capita')}</h4>
                    <ReactPlot data={be.consoPerCap}/>
                    <p className="pSource">{be.consoPerCap.source}</p>
                </div>
            </div>
        </div>);
    }
}
