// Copyright 2020, ASBL Math for climate, All rights reserved.


import {tr} from '../../../tr.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';


/** @brief this class provide a lot of explainations about pv
*/
export default function EmissionsDetails (props){
    let be = props.parameters.countries.belgium;

    return (<div className='detailContent'>
        <h3>{tr('Carbon emissions')}</h3>

        <p>{tr('Cabon dioxide and other greenhouses gases are emmited at various stages of the centrals liftimes : Construction, operation and disposal.')}</p>
        <p>{tr('Cabon dioxide and other greenhouses gases are ammited at various stages of the centrals liftimes : Construction, operation and disposal.')}</p>

        <div className="hWrapLayout">
            <PlotTile
                title='Population'
                plot={be.pop}
            />

        </div>
    </div>);
}
