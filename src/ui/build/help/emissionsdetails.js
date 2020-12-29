// Copyright 2020, ASBL Math for climate, All rights reserved.


import { tr } from '../../../tr.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

/** @brief this class provide a lot of explainations about pv
*/
export default function EmissionsDetails(props) {
    var be = props.parameters.countries.belgium;

    return React.createElement(
        'div',
        { className: 'detailContent' },
        React.createElement(
            'h3',
            null,
            tr('Carbon emissions')
        ),
        React.createElement(
            'p',
            null,
            tr('Cabon dioxide and other greenhouses gases are emmited at various stages of the centrals liftimes : Construction, operation and disposal.')
        ),
        React.createElement(
            'p',
            null,
            tr('Cabon dioxide and other greenhouses gases are ammited at various stages of the centrals liftimes : Construction, operation and disposal.')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(PlotTile, {
                title: 'Population',
                plot: be.pop
            })
        )
    );
}