var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import { periodAvgCo2 } from '../../periodavgco2.js';

export var EndDialog = function (_React$Component) {
    _inherits(EndDialog, _React$Component);

    /** @details props
    closeRequested => function
    */
    function EndDialog(props) {
        _classCallCheck(this, EndDialog);

        var _this = _possibleConstructorReturn(this, (EndDialog.__proto__ || Object.getPrototypeOf(EndDialog)).call(this, props));

        _this.click = _this.onClick.bind(_this);
        _this.key = _this.onKey.bind(_this);

        return _this;
    }

    _createClass(EndDialog, [{
        key: 'onClick',
        value: function onClick(e) {
            this.props.closeRequested();
        }
    }, {
        key: 'onKey',
        value: function onKey(e) {
            if (e.key === "Escape") {
                this.props.closeRequested();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            //use a timeout, else the open click is catched by this event listener
            window.addEventListener("keydown", this.key);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener("keydown", this.key);
        }
    }, {
        key: 'render',
        value: function render() {
            var avgCo2 = periodAvgCo2(this.props.history, Math.max(0, this.props.history.length - 20), this.props.history.length);
            var firstYearCo2 = periodAvgCo2(this.props.history, 0, 1);

            //co2 increase compared to 2019, %
            var increase = Math.round(100 * (1 - avgCo2 / firstYearCo2));

            var avgTax = 0;
            this.props.history.forEach(function (year, i) {
                avgTax += year.taxes.rate;
            });
            avgTax /= this.props.history.length;
            avgTax *= 100;
            avgTax = Math.round(avgTax);

            return React.createElement(
                'div',
                { style: { position: 'absolute', width: '100%', 'height': '100%', zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }, className: 'vLayout' },
                React.createElement(
                    'div',
                    { className: 'dialog vLayout', ref: this.me, style: { position: 'static', flex: '0 0' } },
                    React.createElement(
                        'h3',
                        null,
                        tr("The end")
                    ),
                    React.createElement(
                        'table',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr('Objective reached at')
                            ),
                            React.createElement(
                                'td',
                                null,
                                increase,
                                ' %'
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr('Average taxes')
                            ),
                            React.createElement(
                                'td',
                                null,
                                avgTax,
                                '%'
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr('Territory occupied')
                            ),
                            React.createElement(
                                'td',
                                null,
                                Math.round(this.props.energyGroundUseProp * 100),
                                ' %'
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr('River level diminution')
                            ),
                            React.createElement(
                                'td',
                                null,
                                '0 %'
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr('Nuclear refugies')
                            ),
                            React.createElement(
                                'td',
                                null,
                                '0 Hab'
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'hLayout' },
                        React.createElement(
                            'div',
                            { className: 'button white', onClick: this.click },
                            tr("Continue playing")
                        ),
                        React.createElement(
                            'div',
                            { className: 'button white', onClick: this.props.newGame },
                            tr("New game")
                        )
                    )
                )
            );
        }
    }]);

    return EndDialog;
}(React.Component);