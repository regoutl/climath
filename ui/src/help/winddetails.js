
import {tr} from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class WindDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
    }

    render(){
        let wind = this.props.productionMeans.wind;

        let turbDensTxt = ('is turbin density. Const ' + (0.1*Math.round(wind.density.at(2020) * 1e7) + ' turbine/km2'));

        return (<div className='detailContent'>
            <h3>{tr('Wind turbines (onshore @50m)')}</h3>
            <p>{tr('Wind turbines are devices that transform wind kinetic energy into electricity.')}</p>


            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Production')}</h4>
                    <p>Production of a wind farm of area <img src='data/symbols/area.svg'/> is : </p>
                    <img src='data/wind/production.svg' />
                    <ul>
                    {[{img:'wind/turbDens', descr: turbDensTxt},
                    {img:'wind/rotRad', descr: 'is the rotor radius. Const. 45m'},
                    {img:'wind/wpd', descr: 'is the wind power density (W/m2)'},
                    {img:'symbols/efficiency', descr: 'is the efficiency'},
                    {img:'symbols/capaFactT', descr: 'is the capacity factor at hour t'},
                ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
                    </ul>
                </div>

                <div>
                    <h4>{tr('Efficiency')}</h4>
                    <p>{tr('Proportion of wind energy transformed into electricity. ')}</p>
                    <ReactPlot data={wind.efficiency} />
                    <p className="pSource">{wind.efficiency.source}</p>
                </div>

                <div>
                    <h4>{tr('Capacity factor')}</h4>
                    <p>{tr('Naturally, wind turbines do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')}</p>

                    <a href="data/wind/wind_onshore_capaFact.csv">{tr('Download the historic data for Belgium (2013-2017)')}</a>
                    <p className="pSource">https://www.renewables.ninja/downloads</p>
                </div>
                <div>
                    <h4>{tr('Wind power density')}</h4>
                    <p>The wind power density is the wind power flux. </p>
                    <a href='data/wind/meanWindPowerDensity50.png' title={tr('Click to download')}>
                        <img src='data/wind/meanWindPowerDensity50.png' width="300"/>
                    </a>
                    <p className="pSource">https://globalwindatlas.info/</p>
                </div>

                <div>
                    <h4>{tr('Build cost')}</h4>
                    <p>Build cost per item</p>
                    <ReactPlot data={wind.build.cost} />
                    <p className="pSource">{wind.build.cost.source}</p>
                </div>

                <div>
                    <h4>{tr('Maintenance cost')}</h4>
                    <p>Yearly cost per item</p>
                    <ReactPlot data={wind.perYear.cost} />
                    <p className="pSource">{wind.perYear.cost.source}</p>
                </div>
            </div>

        </div>);
    }
}
