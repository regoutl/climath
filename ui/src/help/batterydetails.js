
import {tr} from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';

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
    }

    render(){
        let bat = this.props.productionMeans.storage.solutions.battery;


        return (<div className='detailContent'>
            <h3>{tr('Batteries')}</h3>
            <p>{tr('Batteries are devices that store electricity.')}</p>


            <div className="hWrapLayout">
                <div>
                    <h4>{tr('Storage capacity')}</h4>
                    <img src="data/battery/capa.svg" alt="Pv production eq" />
                    <ul>
                    {[{img:'symbols/nameplate', descr: 'is the installed capacity'},
                    {img:'symbols/decline', descr: 'is the yearly storage capacity decline'},
                    {img:'symbols/year', descr: 'is the current year'},
                    {img:'symbols/year0', descr: 'is the build year'},
                ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}

                    </ul>
                </div>
                <div>
                    <h4>{tr('Stored energy')}</h4>
                    <img src="data/battery/storedEq.svg" alt="Pv production eq" />
                    <ul>
                    {[{img:'battery/st', descr: 'is the energy stored at hour t'},
                    {img:'symbols/decline', descr: 'is the yearly storage capacity decline'},
                    {img:'battery/d', descr: 'is the hourly power loss'},
                    {img:'symbols/capaFact', descr: 'is the round trip efficiency'},
                    {img:'battery/it', descr: 'is the energy send to load the battery'},
                    {img:'symbols/prod', descr: 'is the energy production of the battery'},
                    {img:'battery/capacity', descr: 'is the storage capacity'},
                ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
                    </ul>
                </div>
                <div>
                    <h4>{tr('Build energy')}</h4>

                    <p>{tr('Battery manufacturing requires some energy. ')}</p>
                    <ReactPlot data={bat.build.energy}/>
                    <p className="pSource">{bat.build.energy.source}</p>
                </div>

                <div>
                    <h4>{tr('Operation and maintenance costs')}</h4>

                    <p>{tr('Yearly cost per storage capacity')}</p>
                    <ReactPlot data={bat.perYear.cost}/>
                    <p className="pSource">{bat.perYear.cost.source}</p>
                </div>
            </div>
        </div>);
    }
}
