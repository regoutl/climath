
import {tr} from '../../../tr/tr.js';
import {Plot} from '../../plot.js';

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
        this.cBuildCost = React.createRef();//canvas of the effi plot
    }

    componentDidMount(){
        let nuke = this.props.productionMeans.nuke;
        let p;


        p = new Plot(nuke.build.cost, 300, 200);
        p.draw(this.cBuildCost.current.getContext('2d'));

    }

    componentWillUnmount(){

    }

    render(){
        let nuke = this.props.productionMeans.nuke;


        return (<div className='detailContent'>
            <h3>{tr('Nuclear reactors')}</h3>
            <p>{tr('Solar pannels are devices that transform sun into electricity.')}</p>

            <p>{tr('The production of PV is ')}
            <img src="data/pv/eq.svg" alt="Pv production eq" />
            {tr('where')}
            </p>
            <ul>
            <li><img src="data/pv/radFlux.svg" alt="Pv production eq" />{tr('is the maximal radiant flux (W/m2)')}</li>
            <li><img src="data/pv/area.svg" alt="Pv production eq" /> {tr('is the area (m2)')}</li>
            <li><img src="data/pv/efficiency.svg" alt="Pv production eq" /> {tr('is the pannel efficiency')}</li>
            <li><img src="data/pv/capaFact.svg" alt="Pv production eq" /> {tr('is the capacity factor at that hour')}</li>
            </ul>

            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Efficiency evolution')}</h4>
                    <p>{tr('Proportion of sun power transformed into electric power. ')}</p>
                    <canvas ref={this.cEffi} width="300" height="200"/>
                    <p className="pSource">{pv.efficiency.source}</p>
                </div>

                <div>

                    <h4>{tr('Build energy')}</h4>

                    <p>{tr('Solar pannel manufacturing requires some energy. ')}</p>
                    <canvas ref={this.cBuildEn} width="300" height="200"/>
                    <p className="pSource">{pv.build.energy.source}</p>
                </div>
                <div>

                    <h4>{tr('Build cost')}</h4>
                    <p>{tr('Solar pannel manufacturing cost. ')}</p>
                    <canvas ref={this.cBuildCost} width="300" height="200"/>
                    <p className="pSource">{pv.build.cost.source}</p>
                </div>

                <div>

                    <h4>{tr('Operation and maintenance costs')}</h4>

                    <p>{tr('Yearly cost per m2')}</p>
                    <canvas ref={this.cPerYearCost} width="300" height="200"/>
                    <p className="pSource">{pv.perYear.cost.source}</p>
                </div>
                <div>
                    <h4>{tr('Capacity factor')}</h4>
                    <p>{tr('Naturally, photovoltaic panels do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')}</p>

                    <a href="data/pv/allBePvCapaFact.csv">{tr('Download the historic data for Belgium (1985-2016)')}</a>
                    <p className="pSource">https://www.renewables.ninja/downloads</p>
                </div>
            </div>

            <div className="hLayout"><div className="button black" onClick={this.props.closeRequested}>{tr('Close')}</div></div>
        </div>);
    }
}
