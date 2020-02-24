
import {tr} from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class PvDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
    }


    render(){
        let pv = this.props.productionMeans.pv;


        return (<div className='detailContent'>
            <h3>{tr('Solar panels')}</h3>
            <p>{tr('Solar pannels are devices that transform sun into electricity.')}</p>


            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Production')}</h4>
                    <p>Production of a PV farm of area <img src='data/symbols/area.svg'/> is : </p>
                    <img src="data/pv/production.svg" alt="Pv production eq" />
                    <ul>
                    {[{img:'symbols/radFlux', descr: 'is the maximal radiant flux (W/m2)'},
                    {img:'symbols/efficiency', descr: 'is the pannel efficiency'},
                    {img:'symbols/capaFactT', descr: 'is the capacity factor at that hour'},
                    {img:'symbols/decline', descr: 'is the yearly efficiency decline'},
                    {img:'symbols/year', descr: 'is the current year'},
                    {img:'symbols/year0', descr: 'is the build year'},
                ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
                    </ul>
                </div>

                <div>
                    <h4>{tr('Radiant flux')}</h4>
                    <div className='hLayout'>
                        <div>
                            <img src="data/pv/maxRadFlux.svg" alt="max rad flux eq" />
                            <ul>
                                <li><img src='data/symbols/avgCapaFact.svg' alt='avgCapaFact' /> is the average capacity factor</li>
                                <li>{tr('GHI is the Global Horizontal Irradiance')}</li>
                            </ul>
                        </div>
                        <div>
                            <img src='data/pv/globalHorisontalIrradiance.png' alt='ghi be' width="120"/>
                            <p className="pSource">https://globalsolaratlas.info/</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h4>{tr('Efficiency evolution')}</h4>
                    <p>{tr('Proportion of sun power transformed into electric power. ')}</p>
                    <ReactPlot data={pv.efficiency} />
                    <p className="pSource">{pv.efficiency.source}</p>
                </div>

                <div>

                    <h4>{tr('Build energy')}</h4>

                    <p>{tr('Solar pannel manufacturing requires some energy. ')}</p>
                    <ReactPlot data={pv.build.energy} />
                    <p className="pSource">{pv.build.energy.source}</p>
                </div>
                <div>

                    <h4>{tr('Build cost')}</h4>
                    <p>{tr('Solar pannel manufacturing cost. ')}</p>
                    <ReactPlot data={pv.build.cost} />
                    <p className="pSource">{pv.build.cost.source}</p>
                </div>

                <div>

                    <h4>{tr('Operation and maintenance costs')}</h4>

                    <p>{tr('Yearly cost per m2')}</p>
                    <ReactPlot data={pv.perYear.cost} />
                    <p className="pSource">{pv.perYear.cost.source}</p>
                </div>
                <div>
                    <h4>{tr('Capacity factor')}</h4>
                    <p>{tr('Naturally, photovoltaic panels do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')}</p>

                    <a href="data/pv/allBePvCapaFact.csv">{tr('Download the historic data for Belgium (1985-2016)')}</a>
                    <p className="pSource">https://www.renewables.ninja/downloads</p>
                </div>
            </div>
        </div>);
    }
}
