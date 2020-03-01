
import {tr} from '../../../tr.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

function Demand(props){
    let math =[
        <img src="data/conso/eq.svg" alt="Pv production eq" />,
        <ul>{[
            {img:'tax/pop', descr: 'is the population'},
            {img:'conso/powerDemandPerCap', descr: 'is the power consumption per capita'},
            ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
        </ul>
    ];

    let text = <p>{tr('The energy demand represent how much energy your population consumes. ')}</p>;

    return <MathTextTile title='Energy demand' math={math} text={text} />

}

/** @brief this class provide a lot of explainations about pv
*/
export default class OriginDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
    }

    render(){
        let be = this.props.countries.belgium;

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
                    plot={be.consoPerCap}
                />
            </div>
        </div>);
    }
}
