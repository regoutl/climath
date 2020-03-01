var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';

/** @brief this class provide a lot of explainations about pv
*/

var FusionDetails = function (_React$Component) {
    _inherits(FusionDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function FusionDetails(props) {
        _classCallCheck(this, FusionDetails);

        return _possibleConstructorReturn(this, (FusionDetails.__proto__ || Object.getPrototypeOf(FusionDetails)).call(this, props));
    }

    _createClass(FusionDetails, [{
        key: 'render',
        value: function render() {
            var fusion = this.props.productionMeans.centrals.fusion;

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
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Production')
                        ),
                        React.createElement('img', { src: 'data/nuke/eq.svg', alt: 'Pv production eq' }),
                        React.createElement(
                            'ul',
                            null,
                            React.createElement(
                                'li',
                                null,
                                React.createElement('img', { src: 'data/nuke/nameplate.svg', alt: 'Pv production eq' }),
                                ' ',
                                tr('is the central pic production')
                            ),
                            React.createElement(
                                'li',
                                null,
                                React.createElement('img', { src: 'data/nuke/capaFact.svg', alt: 'Pv production eq' }),
                                ' ',
                                tr('is the capacity factor')
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Build cost')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Gaz central construction cost. ')
                        ),
                        React.createElement(ReactPlot, { data: fusion.build.cost }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            fusion.build.cost.source
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Operation and maintenance costs')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Cost per Wh')
                        ),
                        React.createElement(ReactPlot, { data: fusion.perWh.cost }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            fusion.perWh.cost.source
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
                            tr('Deconstruction of a gas central have an estimated cost of 5% of the build cost')
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
                            tr('Cooling')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Primary energy efficiency is ') + fusion.primEnergyEffi
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('This means that for 100 J of gas, ') + Math.round(fusion.primEnergyEffi * 100) + tr(' J of electricity are produced, and ') + Math.round(100 - fusion.primEnergyEffi * 100) + tr(' J of heat must be dissipated.')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Evacuhating this heat by boiling 20 deg water requires ') + valStr(m3PerWh, 'm3/Wh') + tr(' produced')
                        ),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            'Source ?'
                        )
                    )
                )
            );
        }
    }]);

    return FusionDetails;
}(React.Component);

export default FusionDetails;