// Copyright 2020, ASBL Math for climate, All rights reserved.


import {tr} from '../../../tr.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

function Demand(props){
    let math =[
        <img src="res/symbols/conso/eq.svg" alt="Pv production eq" />,
        <ul>{[
            {img:'tax/pop', descr: 'is the population'},
            {img:'conso/powerDemandPerCap', descr: 'is the power consumption per capita'},
            ].map((i) => <li key={i.img}><img src={"res/symbols/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
        </ul>
    ];

    let text = [<p>{tr('The energy demand represent how much energy your population consumes. ')}</p>,
    <p>{tr('Climath assumes that all energy consumed is electric.')}<a href="">{tr('Learn more')}</a></p>];

    return <MathTextTile title='Energy demand' math={math} text={text} />

}

/** @brief this class provide a lot of explainations about pv
*/
export default function OriginDetails (props){
    let be = props.parameters.countries.belgium;

    return (<div className='detailContent'>
        <h3>{tr('Energy origin')}</h3>


        <div className="hWrapLayout">
            <Demand />

            <PlotTile
                title='Population'
                plot={be.pop}
            />

            <PlotTile
                title='Power consumption per capita'
                caption={"Total energy consumtion per person."}
                comment="This is higher than the current electric energy consumption, because we want all energy usage used to be electrified."
                plot={be.consoPerCap}
            />
        </div>
    </div>);
}
