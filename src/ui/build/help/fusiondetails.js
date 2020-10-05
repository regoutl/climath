// Copyright 2020, ASBL Math for climate, All rights reserved.


import { tr } from '../../../tr.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

import { PlotTile, CentralProduction, CoolingTile } from './sharedtiles.js';

/** @brief this class provide a lot of explainations about pv
*/
export default function FusionDetails(props) {
    var fusion = props.parameters.energies.fusion;

    var waterVapoNrg = 2250; // J / g
    var waterTCapa = 4185; // J/ kg / K
    var waterInitTemp = 20;
    var jToVapM3 = (100 - waterInitTemp) * 1000 * waterTCapa + waterVapoNrg * 1000000;
    var primEnergyPerProduced = 1 / fusion.primEnergyEffi;
    var heatPerEnProduced = primEnergyPerProduced * (1 - fusion.primEnergyEffi); //

    var m3PerJ = heatPerEnProduced / jToVapM3;
    var m3PerWh = m3PerJ * 3600;

    return React.createElement(
        'div',
        { className: 'detailContent' },
        React.createElement(
            'h3',
            null,
            tr('Fusion centrals')
        ),
        React.createElement(
            'p',
            null,
            tr('Fusion centrals produce electricity by fusing hydrogen.')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(CentralProduction, null),
            React.createElement(PlotTile, {
                title: 'Build cost',
                caption: 'Gas central construction cost. ',
                plot: fusion.build.cost
            }),
            React.createElement(PlotTile, {
                title: 'Operation and maintenance costs',
                caption: 'Cost per Wh. ',
                plot: fusion.perWh.cost
            }),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    tr('Decommission')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Deconstruction of a gas central have an estimated cost of 5% of the build cost')
                ),
                React.createElement(
                    'p',
                    { className: 'pSource' },
                    'Source ?'
                )
            ),
            React.createElement(CoolingTile, { primEnergyEffi: fusion.primEnergyEffi })
        )
    );
}