
import {tr} from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class TaxDetails extends React.Component{

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
            <h3>{tr('Budget')}</h3>


            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Computation')}</h4>
                    <img src="data/tax/in.svg" alt="Pv production eq" />
                    <ul>
                    {[
                    {img:'tax/rate', descr: 'is the tax rate'},
                    {img:'tax/minRate', descr: 'is the minimum tax rate (other government spendings)'},
                    {img:'tax/pop', descr: 'is the population'},
                    {img:'tax/gdp', descr: 'is the gdp per capita'},
                    {img:'tax/costOnM', descr: 'is the operating and maintenance cost'},
                ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
                    </ul>
                </div>

                <div>
                    <h4>{tr('Population')}</h4>
                    <ReactPlot data={be.pop}/>
                    <p className="pSource">{be.pop.source}</p>
                </div>

                <div>
                    <h4>{tr('GDP per capita')}</h4>
                    <ReactPlot data={be.gdpPerCap}/>
                    <p className="pSource">{be.gdpPerCap.source}</p>
                </div>
            </div>
        </div>);
    }
}
