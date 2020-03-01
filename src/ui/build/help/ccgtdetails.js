var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr.js';
import { PlotTile, CentralProduction, CoolingTile } from './sharedtiles.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

/** @brief this class provide a lot of explainations about pv
*/

var CcgtDetails = function (_React$Component) {
    _inherits(CcgtDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function CcgtDetails(props) {
        _classCallCheck(this, CcgtDetails);

        return _possibleConstructorReturn(this, (CcgtDetails.__proto__ || Object.getPrototypeOf(CcgtDetails)).call(this, props));
    }

    _createClass(CcgtDetails, [{
        key: 'render',
        value: function render() {
            var ccgt = this.props.productionMeans.centrals.ccgt;

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
    }]);

    return CcgtDetails;
}(React.Component);

export default CcgtDetails;