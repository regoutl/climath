// Copyright 2020, ASBL Math for climate, All rights reserved.


import {tr} from '../../../tr.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';


function StorageCapacity(props){
    let math = [
        <p key='1'>{tr('The storage capacity of a battery of volume V is')}</p>,
        <img key='2' src="res/symbols/battery/capa.svg" alt="Pv production eq" />,
        <ul key='3'>
        {[
            {img:'shared/density', descr: 'is the storage density (Wh/m3)'},
            {img:'shared/decline', descr: 'is the yearly storage capacity decline'},
            {img:'shared/year', descr: 'is the current year'},
            {img:'shared/year0', descr: 'is the build year'},
        ].map((i) => <li key={i.img}><img src={"res/symbols/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}

        </ul>
    ];

    let text = [<p key='1'>{tr('The storage capacity depends on :')}</p>,
        <ul key='2' className='default'>
            {[
                'The size of the battery.',
                'Amount of energy stored per unit volume. ',
                'The battery\'s age. Batteries storage capacity declines over time. ',
            ].map((i) => <li key={i.substr(10, 12)}>{tr(i)}</li>)}
        </ul>
    ];

    return <MathTextTile title= 'Storage capacity' math={math} text={text} />
}

function StoredEnergy(props){
    let math = [<img key='1' src="res/symbols/battery/storedEq.svg" alt="Pv production eq" />,
        <ul key='2'>
            {[{img:'battery/st', descr: 'is the energy stored at hour t (Wh)'},
            {img:'shared/decline', descr: 'is the yearly storage capacity decline'},
            {img:'battery/d', descr: 'is the hourly power loss'},
            {img:'shared/efficiency', descr: 'is the round trip efficiency'},
            {img:'battery/it', descr: 'is the energy send to load the battery (average for this hour) (W)'},
            {img:'shared/prod', descr: 'is the energy production of the battery (average for this hour) (W)'},
            {img:'battery/capacity', descr: 'is the storage capacity'},
        ].map((i) => <li key={i.img}><img src={"res/symbols/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
        </ul>];


    return <MathTextTile title= 'Stored energy' math={math} text={null} />
}

function StorageCapacityDecline(props){
    let shared =  <p key='1'>{tr('It is estimated that, after 10 year, a battery can only store ' +
            75
    +'% of its original capacity.')}</p>;

    let math = [
        shared,
        <p key='2'>{tr('The yearly storage decline is then simply :')}</p>,
        <img key='3' src='res/symbols/battery/decl10Todecl.svg' />
    ];

    let text = shared;

    return <MathTextTile title= 'Storage capacity decline' math={math} text={text} />
}

function PowerLoss(props){
    let math =[<p key='1'>{tr('It is estimated that, every month, the stored energy decrease by 2%.')}</p>,
    <p key='2'>{tr('The hourly power loss is then simply :')}</p>,
    <img  key='3' src='res/symbols/battery/lossMtoH.svg' />,
    <p key='4'>730 = number of hour per month in a 365 day year</p>];


    let text= <p>{tr('It is estimated that, every month, the stored energy decrease by 2%.')}</p>;

    return <MathTextTile title= 'Power loss' math={math} text={text} />
}

function RoundTripEfficiency(props){
    let math =[    <p key='1'>{tr('It is the ratio between the retreived energy and the energy put in.')}</p>,
        <p key='2'>{tr("We assume that 'half' the loss happend at load time and 'half' at unload time, hence the ")}
            <img src='res/symbols/battery/sqrtEffi.svg' alt ='sqrt effi' />{tr(' in the equation')}
        </p>,
        <p key='3'>{tr('We estimate round trip efficiency to be 0.9.')}</p>]
    let text =[  <p key='5'>{tr('It is the ratio between the retreived energy and the energy put in.')}</p>,
        <p key='4'>{tr('We estimate round trip efficiency to be 0.9.')}</p>];

    return <MathTextTile title= 'Round trip efficiency' math={math} text={text} />

}


/** @brief this class provide a lot of explainations about pv
*/
export default function BatteryDetails (props){
    let bat = props.parameters.energies.storage.battery;


    return (<div className='detailContent' style={props.restyle}>
        <h3>{tr('Batteries (Li-ion)')}</h3>
        <p>{tr('Batteries are devices that store electricity.')}</p>


        <div className="hWrapLayout">
            <StorageCapacity />

            <StoredEnergy />

            <PlotTile
                title="Build cost"
                caption="Battery construction cost"
                plot={bat.build.cost}
            />
            <PlotTile
                title='Build energy'
                caption='Battery manufacturing requires some energy.'
                plot={bat.build.energy}
                comment="We assume they are build in China"
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

            <PowerLoss />

            <RoundTripEfficiency />


        </div>
    </div>);

}
