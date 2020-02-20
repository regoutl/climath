var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import { Plot } from '../../plot.js';

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

        var _this = _possibleConstructorReturn(this, (BatteryDetails.__proto__ || Object.getPrototypeOf(BatteryDetails)).call(this, props));

        _this.cBuildEn = React.createRef(); //canvas of the effi plot
        _this.cPerYearCost = React.createRef(); //canvas of the effi plot
        return _this;
    }

    _createClass(BatteryDetails, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var bat = this.props.productionMeans.storage.solutions.battery;
            var p = void 0;

            p = new Plot(bat.build.energy, 300, 200);
            p.draw(this.cBuildEn.current.getContext('2d'));

            p = new Plot(bat.perYear.cost, 300, 200);
            p.draw(this.cPerYearCost.current.getContext('2d'));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
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
                    tr('Batteries devices that store electricity.')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('The storage capacity of a battery is '),
                    React.createElement('img', { src: 'data/battery/capa.svg', alt: 'Pv production eq' }),
                    tr('where')
                ),
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/nuke/nameplate.svg', alt: 'Pv production eq' }),
                        tr('is the installed capacity')
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/battery/storCapaDecl.svg', alt: 'Pv production eq' }),
                        ' ',
                        tr('is the yearly storage capacity decline')
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/battery/curYear.svg', alt: 'Pv production eq' }),
                        ' ',
                        tr('is the current year')
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/battery/buildYear.svg', alt: 'Pv production eq' }),
                        ' ',
                        tr('is the build year')
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
                            tr('Build energy')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Solar pannel manufacturing requires some energy. ')
                        ),
                        React.createElement('canvas', { ref: this.cBuildEn, width: '300', height: '200' }),
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
                        React.createElement('canvas', { ref: this.cPerYearCost, width: '300', height: '200' }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            bat.perYear.cost.source
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

    return BatteryDetails;
}(React.Component);

export default BatteryDetails;