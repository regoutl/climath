var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import { pieChart } from '../charts.js';

/** @brief fancy slider for tax rates. Note that everyting is is range [0-1] */

var TaxSlider = function (_React$Component) {
    _inherits(TaxSlider, _React$Component);

    /** @brief accepted props
    oninput = function(new val) : called on value changed.
    value : initial value
    */
    function TaxSlider(props) {
        _classCallCheck(this, TaxSlider);

        // this.state = {val: props.value};

        //that's bc bind return a != func each time, and we want to be able to remove the event listener
        var _this = _possibleConstructorReturn(this, (TaxSlider.__proto__ || Object.getPrototypeOf(TaxSlider)).call(this, props));

        _this.mousemove = _this.onMouseMove.bind(_this);
        _this.mouseup = _this.onMouseUp.bind(_this);
        return _this;
    }

    _createClass(TaxSlider, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            window.addEventListener('mousemove', this.mousemove);
            window.addEventListener('mouseup', this.mouseup);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('mousemove', this.onmousemove);
            window.removeEventListener('mouseup', this.mouseup);
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e) {
            this.grab = true;
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(e) {
            if (!this.grab) return;

            this.onClick(e);
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp(e) {
            this.grab = false;
        }
    }, {
        key: 'onClick',
        value: function onClick(e) {
            var rect = this.refs.me.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.

            var prop = x / (rect.right - rect.left);
            this.props.oninput(Math.max(0, Math.min(1, prop)));

            // this.setState({val: Math.max(0, Math.min(1, prop))});
        }
    }, {
        key: 'render',
        value: function render() {
            var borderColor = { r: 0, g: 0, b: 0 };
            if (this.props.value < 0.3) {
                borderColor = { r: 75, g: 198, b: 125 };
            } else if (this.props.value < 0.45) {
                var prop = (this.props.value - 0.3) / (0.45 - 0.3); // prop of the end color (1 = yellow)
                // borderColor = {r: 75, g:198, b:125};
                // 	241, 196, 15

                borderColor.r = 75 * (1 - prop) + 241 * prop;
                borderColor.g = 198 * (1 - prop) + 196 * prop;
                borderColor.b = 125 * (1 - prop) + 15 * prop;
            } else {
                var _prop = (this.props.value - 0.45) / (1.0 - 0.45);
                // 	185, 74, 72

                borderColor.r = 241 * (1 - _prop) + 185 * _prop;
                borderColor.g = 196 * (1 - _prop) + 74 * _prop;
                borderColor.b = 15 * (1 - _prop) + 72 * _prop;
            }

            return React.createElement(
                'div',
                { className: 'taxSlider', ref: 'me', onClick: this.onClick.bind(this) },
                React.createElement(
                    'div',
                    {
                        className: 'handle',
                        onMouseDown: this.onMouseDown.bind(this),
                        style: { left: this.props.value * 100 + '%', border: '5px solid rgb(' + borderColor.r + ', ' + borderColor.g + ', ' + borderColor.b + ')' }
                    },
                    String(Math.round(this.props.value * 100) + " %").substr(0, 4)
                )
            );
        }
    }]);

    return TaxSlider;
}(React.Component);

var palette = { nuke: 'yellow',
    pv: 'rgb(70, 85,180)',
    fossil: 'rgb(255, 124, 84)',
    storage: 'rgb(0, 255, 250)',
    constructions: 'red',
    ccgt: 'rgb(169, 202, 250)',
    wind: 'white',
    fusion: 'green'
};

var BudgetDialog = function (_React$Component2) {
    _inherits(BudgetDialog, _React$Component2);

    /** @details props
    closeRequested => function
    */
    function BudgetDialog(props) {
        _classCallCheck(this, BudgetDialog);

        var _this2 = _possibleConstructorReturn(this, (BudgetDialog.__proto__ || Object.getPrototypeOf(BudgetDialog)).call(this, props));

        _this2.click = _this2.onClick.bind(_this2);
        _this2.key = _this2.onKey.bind(_this2);

        _this2.me = React.createRef();
        _this2.bOk = React.createRef();
        _this2.pieChart = React.createRef();
        return _this2;
    }

    _createClass(BudgetDialog, [{
        key: 'onClick',
        value: function onClick(e) {
            if (this.me.current.contains(e.target) && this.bOk.current != e.target) //the dialog was clicked
                return;

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
            var _this3 = this;

            //use a timeout, else the open click is catched by this event listener
            setTimeout(function () {
                return window.addEventListener("mousedown", _this3.click);
            }, 0);
            window.addEventListener("keydown", this.key);

            var lastYearCosts = this.props.history[this.props.history.length - 1].cost;

            var allOnM = {
                "nuke": lastYearCosts.perYear.nuke + lastYearCosts.perWh.nuke,
                "pv": lastYearCosts.perYear.pv + lastYearCosts.perWh.pv,
                "fossil": lastYearCosts.perYear.fossil + lastYearCosts.perWh.fossil,
                "storage": lastYearCosts.perYear.storage + lastYearCosts.perWh.storage,
                "ccgt": lastYearCosts.perYear.ccgt + lastYearCosts.perWh.ccgt,
                "wind": lastYearCosts.perYear.wind + lastYearCosts.perWh.wind,
                "fusion": lastYearCosts.perYear.fusion + lastYearCosts.perWh.fusion
            };

            var ctx = this.pieChart.current.getContext("2d");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.translate(50, 50);

            pieChart(ctx, allOnM, palette, { fontColor: 'white', legend: 'text' });
            ctx.translate(-50, -50);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener("mousedown", this.click);
            window.removeEventListener("keydown", this.key);
        }
    }, {
        key: 'render',
        value: function render() {
            var lastYearCosts = this.props.history[this.props.history.length - 1].cost;

            var allOnM = {
                "nuke": lastYearCosts.perYear.nuke + lastYearCosts.perWh.nuke,
                "pv": lastYearCosts.perYear.pv + lastYearCosts.perWh.pv,
                "fossil": lastYearCosts.perYear.fossil + lastYearCosts.perWh.fossil,
                "storage": lastYearCosts.perYear.storage + lastYearCosts.perWh.storage,
                "ccgt": lastYearCosts.perYear.ccgt + lastYearCosts.perWh.ccgt,
                "wind": lastYearCosts.perYear.wind + lastYearCosts.perWh.wind,
                "fusion": lastYearCosts.perYear.fusion + lastYearCosts.perWh.fusion
            };

            var taxIn = this.props.gdp * this.props.taxRate;
            var regSpend = this.props.gdp * this.props.regularTaxRate;
            var energySpend = allOnM.nuke + allOnM.pv + allOnM.fossil + allOnM.storage + allOnM.ccgt + allOnM.wind + allOnM.fusion;

            return React.createElement(
                'div',
                { className: 'dialog vLayout', ref: this.me, style: { right: 50, top: 60 } },
                React.createElement(
                    'table',
                    null,
                    React.createElement(
                        'tbody',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                { style: { verticalAlign: 'middle' } },
                                tr("Tax rate (average)")
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(TaxSlider, { oninput: this.props.onTaxRateChanged, value: this.props.taxRate })
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr("Taxes income")
                            ),
                            React.createElement(
                                'td',
                                null,
                                ' + ',
                                valStr(taxIn, '€')
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr("Regular government spendings")
                            ),
                            React.createElement(
                                'td',
                                null,
                                ' - ',
                                valStr(regSpend, '€')
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr("Energy maintenace (value of %d)", '', this.props.history[this.props.history.length - 1].year)
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'div',
                                    null,
                                    ' - ',
                                    valStr(energySpend, '€')
                                ),
                                React.createElement('canvas', { ref: this.pieChart, width: '250', height: '100' })
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr('Balance')
                            ),
                            React.createElement(
                                'td',
                                null,
                                valStr(taxIn - regSpend - energySpend, '€', { forceSign: true })
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'hLayout' },
                    React.createElement(
                        'div',
                        { className: 'button white', ref: this.bOk },
                        tr("Ok")
                    ),
                    React.createElement(
                        'div',
                        { className: 'button white', onClick: this.props.detailsRequested },
                        tr('Details...')
                    )
                )
            );
        }
    }]);

    return BudgetDialog;
}(React.Component);

export default BudgetDialog;