
import {tr} from '../../../tr.js';
import {PlotTile, CentralProduction, CoolingTile} from './sharedtiles.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class CcgtDetails extends React.Component{

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    constructor(props){
        super(props);
    }

    render(){
        let ccgt = this.props.productionMeans.centrals.ccgt;



        return (<div className='detailContent'>
            <h3>{tr('Gas centrals')}</h3>
            <p>{tr('Gas centrals transform chemical energy into electricity.')}</p>


            <div className="hWrapLayout">
                <CentralProduction />

                <PlotTile
                    title='Build cost'
                    caption='Gas central construction cost. '
                    plot={ccgt.build.cost}
                />

                <PlotTile
                    title='Operation and maintenance costs'
                    caption='Cost per Wh. '
                    plot={ccgt.perWh.cost}
                />

                <PlotTile
                    title='Operation footprint'
                    caption='Footprint per Wh. '
                    plot={ccgt.perWh.co2}
                />

                <div>
                    <h4>{tr('Decommission')}</h4>
                    <p>{tr('Deconstruction of a gas central have an estimated cost of 5% of the build cost')}</p>

                    <p className="pSource">Source ?</p>
                </div>

                <CoolingTile primEnergyEffi={ccgt.primEnergyEffi} />
            </div>
        </div>);
    }
}
