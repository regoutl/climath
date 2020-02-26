
import {tr} from '../../../tr/tr.js';
import {PlotTile, CentralProduction, CoolingTile, MathTextTile} from './sharedtiles.js';



/** @brief this class provide a lot of explainations about pv
*/
/* accepted props
productionMeans = this.simu.cProd.productionMeans
countries       = this.simu.cProd.countries
closeRequested
*/
export default function NukeDetails (props){
    let nuke = props.productionMeans.centrals.nuke;

    return (<div className='detailContent'>
        <h3>{tr('Nuclear reactors')}</h3>
        <p>{tr('Nuclear reactors are devices that transform radioactivity into electricity.')}</p>


        <div className="hWrapLayout">

            <CentralProduction />

            <PlotTile
                title='Build cost'
                caption='Nuclear central construction cost. '
                plot={nuke.build.cost}
            />

            <PlotTile
                title='Operation and maintenance costs'
                caption='Cost per Wh. '
                plot={nuke.perWh.cost}
            />

            <PlotTile
                title='Operation footprint'
                caption='Footprint per Wh. '
                plot={nuke.perWh.co2}
            />

            <div>
                <h4>{tr('Capacity factor')}</h4>
                <p>{tr('Nuclear centrals have a capacity factor of 0.9.')}</p>

                <p className="pSource">Source ?</p>
            </div>
            <div>
                <h4>{tr('Decommission')}</h4>
                <p>{tr('Deconstruction of a nuclear central have an estimated cost of 15% of the build cost')}</p>

                <p className="pSource">Source ?</p>
            </div>
            <div>
                <h4>{tr('Accident risk')}</h4>
                <p>{tr('We assume that Fukushima-like event happend with probability ' + Math.round(100000*nuke.boom.probability)/1000 + '% per central, per year.')}</p>
                <p>{tr('In case of accident : ')}</p>
                <ul className='default'>
                    <li>{tr('A radius of 10 km around the central must be evacueted')}</li>
                    <li>{tr('The incident must be fixed, cost : ...')}</li>
                    <li>{tr('All installations in the 10km radius must be removed. ')}</li>
                </ul>

                <p className="pSource">Source ?</p>
            </div>

            <div>
                <h4>{tr('Nuclear waste')}</h4>
                <p>{tr('Nuclear waste are not directly included in this simulation because their mid term effect is well predicted. ')}</p>
                <p>{tr('Therefore they are included in the O&M cost of the central and in its footprint.')}</p>
            </div>

            <CoolingTile primEnergyEffi={nuke.primEnergyEffi} />
        </div>
    </div>);

}
