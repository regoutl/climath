// Copyright 2020, ASBL Math for climate, All rights reserved.


import { tr } from '../../../tr.js';
import { PlotTile, CentralProduction, CoolingTile, MathTextTile } from './sharedtiles.js';

/** @brief this class provide a lot of explainations about pv
*/
/* accepted props
productionMeans = this.simu.cProd.productionMeans
countries       = this.simu.cProd.countries
closeRequested
*/
export default function NukeDetails(props) {
    var nuke = props.parameters.energies.nuke;

    return React.createElement(
        'div',
        { className: 'detailContent', style: props.restyle },
        React.createElement(
            'h3',
            null,
            tr('Nuclear reactors')
        ),
        React.createElement(
            'p',
            null,
            tr('Nuclear reactors are devices that transform radioactivity into electricity.')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(CentralProduction, null),
            React.createElement(PlotTile, {
                title: 'Build cost',
                caption: 'Nuclear central construction cost. ',
                plot: nuke.build.cost
            }),
            React.createElement(PlotTile, {
                title: 'Operation and maintenance costs',
                caption: 'Cost per Wh. ',
                plot: nuke.perWh.cost
            }),
            React.createElement(PlotTile, {
                title: 'Operation footprint',
                caption: 'Footprint per Wh. ',
                plot: nuke.perWh.co2
            }),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    tr('Capacity factor')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Nuclear centrals have a capacity factor of 0.9.')
                ),
                React.createElement(
                    'p',
                    { className: 'pSource' },
                    'Source ?'
                )
            ),
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
                    tr('Deconstruction of a nuclear central have an estimated cost of 15% of the build cost')
                ),
                React.createElement(
                    'p',
                    { className: 'pSource' },
                    'Source ?'
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    tr('Accident risk')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('We assume that Fukushima-like event happend with probability ' + Math.round(100000 * nuke.accident.probability.year[0]) / 1000 + '% per central, per year.')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('In case of accident : ')
                ),
                React.createElement(
                    'ul',
                    { className: 'default' },
                    React.createElement(
                        'li',
                        null,
                        tr('A radius of 10 km around the central must be evacueted')
                    ),
                    React.createElement(
                        'li',
                        null,
                        tr('The incident must be fixed, cost : ...')
                    ),
                    React.createElement(
                        'li',
                        null,
                        tr('All installations in the 10km radius must be removed. ')
                    )
                ),
                React.createElement(
                    'p',
                    { className: 'pSource' },
                    'Source ?'
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    tr('Nuclear waste')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Nuclear waste are not directly included in this simulation because their mid term effect is well predicted. ')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Therefore they are included in the O&M cost of the central and in its footprint.')
                )
            ),
            React.createElement(CoolingTile, { primEnergyEffi: nuke.primEnEfficiency })
        )
    );
}