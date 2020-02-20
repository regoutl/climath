var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import { Plot } from '../../plot.js';

/** @brief this class provide a lot of explainations about pv
*/

var NukeDetails = function (_React$Component) {
    _inherits(NukeDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function NukeDetails(props) {
        _classCallCheck(this, NukeDetails);

        var _this = _possibleConstructorReturn(this, (NukeDetails.__proto__ || Object.getPrototypeOf(NukeDetails)).call(this, props));

        _this.cBuildCost = React.createRef(); //canvas of the effi plot
        _this.cPerWhCost = React.createRef(); //canvas of the effi plot
        _this.cPerWhCo2 = React.createRef(); //canvas of the effi plot
        return _this;
    }

    _createClass(NukeDetails, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var nuke = this.props.productionMeans.centrals.nuke;
            var p = void 0;

            p = new Plot(nuke.build.cost, 300, 200);
            p.draw(this.cBuildCost.current.getContext('2d'));

            p = new Plot(nuke.perWh.cost, 300, 200);
            p.draw(this.cPerWhCost.current.getContext('2d'));

            p = new Plot(nuke.perWh.co2, 300, 200);
            p.draw(this.cPerWhCo2.current.getContext('2d'));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'render',
        value: function render() {
            var nuke = this.props.productionMeans.centrals.nuke;

            return React.createElement(
                'div',
                { className: 'detailContent' },
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
                    'p',
                    null,
                    tr('The production of a central is '),
                    React.createElement('img', { src: 'data/nuke/eq.svg', alt: 'Pv production eq' }),
                    tr('where')
                ),
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
                            tr('Build cost')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Nuclear central construction cost. ')
                        ),
                        React.createElement('canvas', { ref: this.cBuildCost, width: '300', height: '200' }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            nuke.build.cost.source
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
                        React.createElement('canvas', { ref: this.cPerWhCost, width: '300', height: '200' }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            nuke.perWh.cost.source
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Operation footprint')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Footprint per Wh')
                        ),
                        React.createElement('canvas', { ref: this.cPerWhCo2, width: '300', height: '200' }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            nuke.perWh.co2.source
                        )
                    ),
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
                            tr('Public health treathening accidents happend with probability ')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('In case of accident, a radius of 10km aroudn the central must be evacueted')
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
                            tr('Nuclear centrals have a primary energy efficiency of ') + nuke.primEnergyEffi
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Evacuhating all this heat by boiling 20 deg water requires 1.6m3/s')
                        ),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            'Source ?'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'hLayout' },
                    React.createElement(
                        'div',
                        { className: 'button black', onClick: this.props.closeRequested },
                        tr('Close')
                    )
                )
            );
        }
    }]);

    return NukeDetails;
}(React.Component);

export default NukeDetails;