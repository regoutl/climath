var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Copyright 2020, ASBL Math for climate, All rights reserved.

import { tr } from "../../../tr.js";
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import { pieChart, stackedLineChart } from '../../charts.js';
import OriginDetails from '../help/origindetails.js';
import { Dialog } from './dialog.js';

export var ConsoDialog = function (_React$Component) {
    _inherits(ConsoDialog, _React$Component);

    /** @details props
    closeRequested => function
    detailsRequested => function. user request details
    */
    function ConsoDialog(props) {
        _classCallCheck(this, ConsoDialog);

        var _this = _possibleConstructorReturn(this, (ConsoDialog.__proto__ || Object.getPrototypeOf(ConsoDialog)).call(this, props));

        _this.pieChart = React.createRef();
        return _this;
    }

    _createClass(ConsoDialog, [{
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
            var lastYearConso = this.props.history[this.props.history.length - 1].consumedEnergy;

            var ctx = this.pieChart.current.getContext("2d");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.translate(50, 50);

            pieChart(ctx, lastYearConso.origin, 'energy', { fontColor: 'white', legend: 'text' });

            ctx.translate(-50, -50);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var props = this.props;

            return React.createElement(
                Dialog,
                {
                    style: {
                        left: '100px',
                        top: 'statusbar'
                    },
                    onOk: props.closeRequested,
                    onDetails: function onDetails() {
                        return _this2.props.detailsRequested(OriginDetails);
                    }
                },
                React.createElement(
                    'h3',
                    null,
                    tr("Power origin in %d", '', this.props.history[this.props.history.length - 1].year)
                ),
                React.createElement('canvas', { ref: this.pieChart, width: '200', height: '110', style: { width: 200 } })
            );
        }
    }]);

    return ConsoDialog;
}(React.Component);