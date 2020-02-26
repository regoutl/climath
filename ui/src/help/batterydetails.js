
import {tr} from '../../../tr/tr.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';


function StorageCapacity(props){
    let math = [
        <p>{tr('The storage capacity of a battery of volume V is')}</p>,
        <img src="data/battery/capa.svg" alt="Pv production eq" />,
        <ul>
        {[
            {img:'symbols/density', descr: 'is the storage density (Wh/m3)'},
            {img:'symbols/decline', descr: 'is the yearly storage capacity decline'},
            {img:'symbols/year', descr: 'is the current year'},
            {img:'symbols/year0', descr: 'is the build year'},
        ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}

        </ul>
    ];

    let text = [<p>{tr('The storage capacity depends on :')}</p>,
        <ul className='default'>
            {[
                'The size of the battery.',
                'How dense the energy is stored. ',
                'The battery\'s age. Batteries storage capacity declines over time. ',
            ].map((i) => <li>{tr(i)}</li>)}
        </ul>
    ];

    return <MathTextTile title= 'Storage capacity' math={math} text={text} />
}

function StoredEnergy(props){
    let math = [<img src="data/battery/storedEq.svg" alt="Pv production eq" />,
        <ul>
            {[{img:'battery/st', descr: 'is the energy stored at hour t (Wh)'},
            {img:'symbols/decline', descr: 'is the yearly storage capacity decline'},
            {img:'battery/d', descr: 'is the hourly power loss'},
            {img:'symbols/efficiency', descr: 'is the round trip efficiency'},
            {img:'battery/it', descr: 'is the energy send to load the battery (average for this hour) (W)'},
            {img:'symbols/prod', descr: 'is the energy production of the battery (average for this hour) (W)'},
            {img:'battery/capacity', descr: 'is the storage capacity'},
        ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
        </ul>];


    return <MathTextTile title= 'Stored energy' math={math} text={null} />
}

function StorageCapacityDecline(props){
    let math = [
        <p>{tr('It is estimated that, after 10 year, a battery can only store 75% of its original capacity.')}</p>,
        <p>{tr('The yearly storage decline is then simply :')}</p>,
        <img src='data/battery/decl10Todecl.svg' />
    ];

    let text = (<p>{tr('It is estimated that, after 10 year, a battery can only store 75% of its original capacity.')}</p>)    ;

    return <MathTextTile title= 'Storage capacity decline' math={math} text={text} />
}

function HourlyPowerLoss(props){
    let math =[<p>{tr('It is estimated that, every month, the stored energy decrease by 2%.')}</p>,
    <p>{tr('The hourly power loss is then simply :')}</p>,
    <img src='data/battery/lossMtoH.svg' />,
    <p>730 = number of hour per month in a 365 day year</p>];


    let text= <p>{tr('It is estimated that, every month, the stored energy decrease by 2%.')}</p>;

    return <MathTextTile title= 'Hourly power loss' math={math} text={text} />
}

function RoundTripEfficiency(props){
    let math =[    <p>{tr('It is the ratio between the retreived energy and the energy put in.')}</p>,
        <p>{tr("We assume that 'half' the loss happend at load time and 'half' at unload time, hence the ")}
            <img src='data/battery/sqrtEffi.svg' alt ='sqrt effi' />{tr(' in the equation')}
        </p>,
        <p>{tr('We estimate round trip efficiency to be 0.9.')}</p>]
    let text =[  <p>{tr('It is the ratio between the retreived energy and the energy put in.')}</p>,
        <p>{tr('We estimate round trip efficiency to be 0.9.')}</p>];

    return <MathTextTile title= 'Round trip efficiency' math={math} text={text} />

}


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
            <h3>{tr('Batteries (Li-ion)')}</h3>
            <p>{tr('Batteries are devices that store electricity.')}</p>


            <div className="hWrapLayout">
                <StorageCapacity />

                <StoredEnergy />

                <PlotTile
                    title='Build energy'
                    caption='Battery manufacturing requires some energy.'
                    plot={bat.build.energy}
                />

                <PlotTile
                    title='Operation and maintenance costs'
                    caption='Yearly cost per storage capacity.'
                    plot={bat.perYear.cost}
                />

                <PlotTile
                    title='Storage density'
                    caption='Energy stored per volume.'
                    plot={bat.energyDensity}
                />

                <StorageCapacityDecline />

                <HourlyPowerLoss />

                <RoundTripEfficiency />


            </div>
        </div>);
    }
}
