
import {tr} from '../../../tr/tr.js';
import {Plot} from '../../plot.js';

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
        this.cEffi = React.createRef();//canvas of the effi plot
        this.cBuildEn = React.createRef();//canvas of the effi plot
        this.cBuildCost = React.createRef();//canvas of the effi plot
        this.cPerYearCost = React.createRef();//canvas of the effi plot
    }

    componentDidMount(){
        let pv = this.props.productionMeans.pv;
        let p = new Plot(pv.efficiency, 300, 200);
        p.draw(this.cEffi.current.getContext('2d'));

        p = new Plot(pv.build.energy, 300, 200);
        p.draw(this.cBuildEn.current.getContext('2d'));

        p = new Plot(pv.build.cost, 300, 200);
        p.draw(this.cBuildCost.current.getContext('2d'));

        p = new Plot(pv.perYear.cost, 300, 200);
        p.draw(this.cPerYearCost.current.getContext('2d'));
    }

    componentWillUnmount(){

    }

    render(){
        let pv = this.props.productionMeans.pv;


        return (<div className='detailContent'>
            <h3>{tr('Solar panels')}</h3>
            <p>{tr('Solar pannels are devices that transform sun into electricity.')}</p>

            <p>{tr('At a given hour, the production of a square meter of PV is ')}</p>

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

                    <a href="data/allBePvCapaFact.csv">{tr('Download the historic data for Belgium (1985-2016)')}</a>
                    <p className="pSource">https://www.renewables.ninja/downloads</p>
                </div>
            </div>



            <div className="hLayout"><div className="button black" onClick={this.props.closeRequested}>{tr('Close')}</div></div>

        </div>);
    }
}
