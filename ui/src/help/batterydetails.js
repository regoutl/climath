
import {tr} from '../../../tr/tr.js';
import {Plot} from '../../plot.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class BatteryDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
        this.cBuildEn = React.createRef();//canvas of the effi plot
        this.cPerYearCost = React.createRef();//canvas of the effi plot
    }

    componentDidMount(){
        let bat = this.props.productionMeans.storage.solutions.battery;
        let p;


        p = new Plot(bat.build.energy, 300, 200);
        p.draw(this.cBuildEn.current.getContext('2d'));

        p = new Plot(bat.perYear.cost, 300, 200);
        p.draw(this.cPerYearCost.current.getContext('2d'));
    }

    componentWillUnmount(){

    }

    render(){
        let bat = this.props.productionMeans.storage.solutions.battery;


        return (<div className='detailContent'>
            <h3>{tr('Batteries')}</h3>
            <p>{tr('Batteries devices that store electricity.')}</p>

            <p>{tr('The storage capacity of a battery is ')}
            <img src="data/battery/capa.svg" alt="Pv production eq" />
            {tr('where')}
            </p>
            <ul>
            <li><img src="data/nuke/nameplate.svg" alt="Pv production eq" />{tr('is the installed capacity')}</li>
            <li><img src="data/battery/storCapaDecl.svg" alt="Pv production eq" /> {tr('is the yearly storage capacity decline')}</li>
            <li><img src="data/battery/curYear.svg" alt="Pv production eq" /> {tr('is the current year')}</li>
            <li><img src="data/battery/buildYear.svg" alt="Pv production eq" /> {tr('is the build year')}</li>

            </ul>

            <div className="hWrapLayout">
                <div>

                    <h4>{tr('Build energy')}</h4>

                    <p>{tr('Solar pannel manufacturing requires some energy. ')}</p>
                    <canvas ref={this.cBuildEn} width="300" height="200"/>
                    <p className="pSource">{bat.build.energy.source}</p>
                </div>

                <div>

                    <h4>{tr('Operation and maintenance costs')}</h4>

                    <p>{tr('Yearly cost per storage capacity')}</p>
                    <canvas ref={this.cPerYearCost} width="300" height="200"/>
                    <p className="pSource">{bat.perYear.cost.source}</p>
                </div>
            </div>

            <div className="hLayout"><div className="button black" onClick={this.props.closeRequested}>{tr('Close')}</div></div>
        </div>);
    }
}
