
import {tr} from '../../../tr.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

import {PlotTile, MathTextTile} from './sharedtiles.js';


function Computation(props){
    let math = [
        <img src="res/symbols/tax/in.svg" alt="Pv production eq" />,
        <ul>
            {[
            {img:'tax/rate', descr: 'is the tax rate'},
            {img:'tax/minRate', descr: 'is the minimum tax rate (other government spendings)'},
            {img:'tax/pop', descr: 'is the population'},
            {img:'tax/gdp', descr: 'is the gdp per capita'},
            {img:'tax/costOnM', descr: 'is the operating and maintenance cost'},
        ].map((i) => <li key={i.img}><img src={"res/symbols/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
        </ul>    ];

    let text = ['Between each year you gain money, proportionnaly to your tax rate. ',
    'However, the country must still run, thus not all tax money goes into your pocket.',
    ].map((i) => <p>{tr(i)}</p>);

    return <MathTextTile title='Computation' math={math} text={text} />
}

/** @brief this class provide a lot of explainations about pv
*/
export default function TaxDetails(props){
    let be = props.parameters.countries.belgium;

    return (<div className='detailContent'>
        <h3>{tr('Budget')}</h3>


        <div className="hWrapLayout">
            <Computation />



            <PlotTile
                title='Population'
                plot={be.pop}
            />

            <PlotTile
                title='GDP per capita'
                plot={be.gdpPerCap}
            />
        </div>
    </div>);
}
