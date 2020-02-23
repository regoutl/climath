var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { quantityToHuman as valStr } from '../quantitytohuman.js';
import { tr } from '../../tr/tr.js';
import { periodAvgCo2 } from '../../periodavgco2.js';

var StatusBar = function (_React$Component) {
    _inherits(StatusBar, _React$Component);

    /*
    props :
    showCo2Dialog : function called on click on co2
    showConsoDialog : function called on click on conso
    showBudgetDialog : function called on click on money
     history : simu stat array
    date : current year
    money : current money
    */
    function StatusBar(props) {
        _classCallCheck(this, StatusBar);

        var _this = _possibleConstructorReturn(this, (StatusBar.__proto__ || Object.getPrototypeOf(StatusBar)).call(this, props));

        _this.state = { showBudgetDialog: false };
        return _this;
    }

    _createClass(StatusBar, [{
        key: 'render',
        value: function render() {
            //compute co2 of the last 15 years
            var avgCo2 = periodAvgCo2(this.props.history, Math.max(0, this.props.history.length - 20), this.props.history.length);
            var firstYearCo2 = periodAvgCo2(this.props.history, 0, 1);

            //co2 increase compared to 2019, %
            var increase = -Math.round(100 * (1 - avgCo2 / firstYearCo2));

            var sign = increase > 0 ? '+ ' : '- ';

            // let arrow = (<svg width="20" height="36">
            //     <polyline points="4,19 10,25 16,19" stroke="white" strokeLinecap="round" strokeWidth="1.5" fill="none"/>
            // </svg>);


            //electricity origin
            var consumed = this.props.currentConso;

            return React.createElement(
                'div',
                { id: 'statusBar', className: 'hLayout' },
                React.createElement(
                    'div',
                    {
                        title: tr('Needed power'),
                        onClick: this.props.showConsoDialog
                    },
                    this.props.date,
                    ' ',
                    React.createElement('img', { width: '25', src: 'res/icons/electricEnergy.png' }),
                    ' ',
                    valStr(consumed, 'W')
                ),
                React.createElement(
                    'div',
                    {
                        title: 'Co2',
                        onClick: this.props.showCo2Dialog

                    },
                    React.createElement(
                        'span',
                        { title: tr('Average of the last 20 years') },
                        valStr(avgCo2, 'C').slice(0, -5),
                        ' CO',
                        React.createElement(
                            'sup',
                            null,
                            '2'
                        )
                    ),
                    React.createElement(
                        'span',
                        {
                            title: tr('Compared to 2019'),
                            style: {
                                padding: '10px 0 0 10px',
                                verticalAlign: 'middle',
                                fontSize: '14px',
                                color: increase > 0 ? 'red' : 'lime' }
                        },
                        sign + Math.abs(increase),
                        ' %'
                    )
                ),
                React.createElement(
                    'div',
                    { title: tr("Set budget"), onClick: this.props.showBudgetDialog },
                    valStr(this.props.money, '€')
                )
            );
        }
    }]);

    return StatusBar;
}(React.Component);

export default StatusBar;