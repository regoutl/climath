var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import { pieChart } from '../piechart.js';
import { stackedLineChart } from '../stackedlinechart.js';

var palette = {
    nuke: 'yellow',
    pv: 'rgb(70, 85,180)',
    fossil: 'rgb(255, 124, 84)',
    storage: 'rgb(0, 255, 250)',
    constructions: 'red',
    ccgt: 'rgb(169, 202, 250)',
    wind: 'white',
    fusion: 'green'
};

export var Co2Dialog = function (_React$Component) {
    _inherits(Co2Dialog, _React$Component);

    /** @details props
    closeRequested => function
    */
    function Co2Dialog(props) {
        _classCallCheck(this, Co2Dialog);

        var _this = _possibleConstructorReturn(this, (Co2Dialog.__proto__ || Object.getPrototypeOf(Co2Dialog)).call(this, props));

        _this.click = _this.onClick.bind(_this);
        _this.key = _this.onKey.bind(_this);

        _this.me = React.createRef();
        _this.bOk = React.createRef();
        _this.pieCharts = React.createRef();
        return _this;
    }

    _createClass(Co2Dialog, [{
        key: 'onClick',
        value: function onClick(e) {
            if ( /*this.me.current.contains(e.target) && */this.bOk.current != e.target) //the dialog was clicked
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
            var _this2 = this;

            //use a timeout, else the open click is catched by this event listener
            setTimeout(function () {
                return window.addEventListener("mousedown", _this2.click);
            }, 0);
            window.addEventListener("keydown", this.key);

            this.update();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.update();
        }
    }, {
        key: 'update',
        value: function update() {
            var energies = ['nuke', 'pv', 'fossil', 'storage', 'ccgt', 'wind', 'fusion'];

            var ctx = this.pieCharts.current.getContext("2d");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            var values = [];

            this.props.history.forEach(function (yearStat, i) {
                var emi = yearStat.co2;

                var stat = { constructions: 0 };
                energies.forEach(function (item) {
                    stat.constructions += emi.build[item];
                });
                energies.forEach(function (item) {
                    stat[item] = emi.perWh[item] + emi.perYear[item];
                });

                values.push(stat);
            });

            stackedLineChart(ctx, values, {
                palette: palette,
                order: ['fossil', 'ccgt', 'nuke', 'fusion', 'constructions'],
                from: this.props.history[0].year,
                to: this.props.history[this.props.history.length - 1].year,
                unit: 'C',
                width: 400
            });
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
            return React.createElement(
                'div',
                { className: 'dialog vLayout', ref: this.me, style: { left: '50%', top: 110, marginLeft: -210 } },
                React.createElement(
                    'h3',
                    null,
                    'Emissions'
                ),
                React.createElement('canvas', { ref: this.pieCharts, width: '400', height: '200' }),
                React.createElement(
                    'div',
                    { className: 'hLayout' },
                    React.createElement(
                        'div',
                        { className: 'button white', ref: this.bOk },
                        tr("Ok")
                    )
                )
            );
        }
    }]);

    return Co2Dialog;
}(React.Component);