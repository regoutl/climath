
import { tr } from '../../../tr.js';
import { PlotTile, CentralProduction, CoolingTile } from './sharedtiles.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

/** @brief this class provide a lot of explainations about pv
*/
export default function CcgtDetails(props) {
    var ccgt = props.parameters.energies.ccgt;

    return React.createElement(
        'div',
        { className: 'detailContent' },
        React.createElement(
            'h3',
            null,
            tr('Gas centrals')
        ),
        React.createElement(
            'p',
            null,
            tr('Gas centrals transform chemical energy into electricity.')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(CentralProduction, null),
            React.createElement(PlotTile, {
                title: 'Build cost',
                caption: 'Gas central construction cost. ',
                plot: ccgt.build.cost
            }),
            React.createElement(PlotTile, {
                title: 'Operation and maintenance costs',
                caption: 'Cost per Wh. ',
                plot: ccgt.perWh.cost
            }),
            React.createElement(PlotTile, {
                title: 'Operation footprint',
                caption: 'Footprint per Wh. ',
                plot: ccgt.perWh.co2
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
            React.createElement(CoolingTile, { primEnergyEffi: ccgt.primEnergyEffi })
        )
    );
}