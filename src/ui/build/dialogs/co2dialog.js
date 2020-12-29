var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Copyright 2020, ASBL Math for climate, All rights reserved.

import { tr } from "../../../tr.js";
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import { pieChart, stackedLineChart } from '../../charts.js';
import { Dialog } from './dialog.js';
import EmissionsDetails from '../help/emissionsdetails.js';

export var Co2Dialog = function (_React$Component) {
    _inherits(Co2Dialog, _React$Component);

    /** @details props
    closeRequested => function
    */
    function Co2Dialog(props) {
        _classCallCheck(this, Co2Dialog);

        var _this = _possibleConstructorReturn(this, (Co2Dialog.__proto__ || Object.getPrototypeOf(Co2Dialog)).call(this, props));

        _this.pieCharts = React.createRef();
        return _this;
    }

    _createClass(Co2Dialog, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
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
                palette: 'energy',
                order: ['fossil', 'ccgt', 'nuke', 'fusion', 'constructions'],
                from: this.props.history[0].year,
                to: this.props.history[this.props.history.length - 1].year,
                unit: 'C',
                width: 400
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;
            return React.createElement(
                Dialog,
                {
                    onOk: props.closeRequested,
                    onDetails: function onDetails() {
                        return props.detailsRequested(EmissionsDetails);
                    },
                    title: 'Emissions',
                    style: { top: 'statusbar' }
                },
                React.createElement('canvas', { ref: this.pieCharts, width: '400', height: '200' })
            );
        }
    }]);

    return Co2Dialog;
}(React.Component);