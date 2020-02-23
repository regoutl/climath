var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';

/** @brief this class provide a lot of explainations about pv
*/

var BatteryDetails = function (_React$Component) {
    _inherits(BatteryDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function BatteryDetails(props) {
        _classCallCheck(this, BatteryDetails);

        return _possibleConstructorReturn(this, (BatteryDetails.__proto__ || Object.getPrototypeOf(BatteryDetails)).call(this, props));
    }

    _createClass(BatteryDetails, [{
        key: 'render',
        value: function render() {
            var bat = this.props.productionMeans.storage.solutions.battery;

            return React.createElement(
                'div',
                { className: 'detailContent' },
                React.createElement(
                    'h3',
                    null,
                    tr('Batteries')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Batteries are devices that store electricity.')
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
                            tr('Storage capacity')
                        ),
                        React.createElement('img', { src: 'data/battery/capa.svg', alt: 'Pv production eq' }),
                        React.createElement(
                            'ul',
                            null,
                            [{ img: 'symbols/nameplate', descr: 'is the installed capacity' }, { img: 'symbols/decline', descr: 'is the yearly storage capacity decline' }, { img: 'symbols/year', descr: 'is the current year' }, { img: 'symbols/year0', descr: 'is the build year' }].map(function (i) {
                                return React.createElement(
                                    'li',
                                    { key: i.img },
                                    React.createElement('img', { src: "data/" + i.img + ".svg", alt: i.descr }),
                                    ' ',
                                    tr(i.descr)
                                );
                            })
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Stored energy')
                        ),
                        React.createElement('img', { src: 'data/battery/storedEq.svg', alt: 'Pv production eq' }),
                        React.createElement(
                            'ul',
                            null,
                            [{ img: 'battery/st', descr: 'is the energy stored at hour t' }, { img: 'symbols/decline', descr: 'is the yearly storage capacity decline' }, { img: 'battery/d', descr: 'is the hourly power loss' }, { img: 'symbols/capaFact', descr: 'is the round trip efficiency' }, { img: 'battery/it', descr: 'is the energy send to load the battery' }, { img: 'symbols/prod', descr: 'is the energy production of the battery' }, { img: 'battery/capacity', descr: 'is the storage capacity' }].map(function (i) {
                                return React.createElement(
                                    'li',
                                    { key: i.img },
                                    React.createElement('img', { src: "data/" + i.img + ".svg", alt: i.descr }),
                                    ' ',
                                    tr(i.descr)
                                );
                            })
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Build energy')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Battery manufacturing requires some energy. ')
                        ),
                        React.createElement(ReactPlot, { data: bat.build.energy }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            bat.build.energy.source
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
                            tr('Yearly cost per storage capacity')
                        ),
                        React.createElement(ReactPlot, { data: bat.perYear.cost }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            bat.perYear.cost.source
                        )
                    )
                )
            );
        }
    }]);

    return BatteryDetails;
}(React.Component);

export default BatteryDetails;