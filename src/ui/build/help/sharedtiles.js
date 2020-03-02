var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr.js';
import ReactPlot from '../reactplot.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import { AppContext } from '../appcontext.js';

/* accepted props : title, caption, plot*/
export function PlotTile(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h4',
            null,
            tr(props.title)
        ),
        props.caption && React.createElement(
            'p',
            null,
            tr(props.caption)
        ),
        React.createElement(ReactPlot, { data: props.plot }),
        props.comment && React.createElement(
            'p',
            null,
            tr(props.comment)
        ),
        React.createElement(
            'p',
            { className: 'pSource' },
            props.plot.source
        )
    );
}

export function CentralProduction(props) {
    var math = [React.createElement('img', { key: '1', src: 'res/symbols/nuke/production.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        { key: '2' },
        React.createElement(
            'li',
            null,
            React.createElement('img', { src: 'res/symbols/shared/nameplate.svg', alt: 'Nuke' }),
            ' ',
            tr('is the central pic production')
        ),
        React.createElement(
            'li',
            null,
            React.createElement('img', { src: 'res/symbols/shared/capaFact.svg', alt: 'Nuke' }),
            ' ',
            tr('is the capacity factor')
        )
    )];

    var text = React.createElement(
        'p',
        null,
        tr('Production of a central is roughly constant, except for the reparations/maintenance that requires a full stop. The capacity factor model that.')
    );

    return React.createElement(MathTextTile, {
        title: 'Production',
        math: math,
        text: text
    });
}

//props : primEnergyEffi : float, source
export function CoolingTile(props) {
    var waterVapoNrg = 2250; // J / g
    var waterTCapa = 4185; // J/ kg / K
    var waterInitTemp = 20;
    var jToVapM3 = (100 - waterInitTemp) * 1000 * waterTCapa + waterVapoNrg * 1000000;
    var primEnergyPerProduced = 1 / props.primEnergyEffi;
    var heatPerEnProduced = primEnergyPerProduced * (1 - props.primEnergyEffi); //

    var m3PerJ = heatPerEnProduced / jToVapM3;
    var m3PerWh = m3PerJ * 3600;

    var math = [React.createElement(
        'p',
        { key: '1' },
        tr('Primary energy efficiency is ') + props.primEnergyEffi
    ), React.createElement(
        'p',
        { key: '2' },
        tr('This means that for 100 J of gas, ') + Math.round(props.primEnergyEffi * 100) + tr(' J of electricity are produced, and ') + Math.round(100 - props.primEnergyEffi * 100) + tr(' J of heat must be dissipated.')
    ), React.createElement(
        'p',
        { key: '3' },
        tr('Evacuhating this heat by boiling 20 deg water requires ') + valStr(m3PerWh, 'm3/Wh') + tr(' produced')
    ), React.createElement(
        'p',
        { key: '4', className: 'pSource' },
        props.source
    )];

    var text = React.createElement(
        'p',
        null,
        tr('Thermic centrals heats water in order to produce electricity. ' + 'That hot water cannot be trashed back in a river, because it would harm the eco-system.' + ' Therefore, what they do is to boil it throught those big chemeys. The amount of water consumed is ') + valStr(m3PerWh, 'm3/Wh')
    );

    return React.createElement(MathTextTile, { title: 'Cooling', math: math, text: text });
}

/// display a tile with text or equation (user choosable).
/* props :
title : string
math : react component displaying the math
text : react comp. if null and equation display mode is text, hides the dock
//hideModeToggleButton : bool. default false. if true, do not displays the mode toggle button
*/
export var MathTextTile = function (_React$Component) {
    _inherits(MathTextTile, _React$Component);

    function MathTextTile() {
        _classCallCheck(this, MathTextTile);

        return _possibleConstructorReturn(this, (MathTextTile.__proto__ || Object.getPrototypeOf(MathTextTile)).apply(this, arguments));
    }

    _createClass(MathTextTile, [{
        key: 'render',
        value: function render() {
            var props = this.props;

            if (this.context.equationDisplay == 'text' && !props.text) return null;

            return React.createElement(
                'div',
                { className: 'mathTextTile' },
                React.createElement(
                    'h4',
                    null,
                    React.createElement(
                        'span',
                        null,
                        tr(props.title)
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement('img', {
                            onClick: this.context.toggleEquationDisplay,
                            title: tr(this.context.equationDisplay == 'math' ? 'Display as text' : 'Display the equation'),
                            width: '32',
                            src: 'res/icons/' + (this.context.equationDisplay == 'math' ? 'text.png' : 'math.png')
                        })
                    )
                ),
                this.context.equationDisplay == 'math' ? props.math : props.text
            );
        }
    }]);

    return MathTextTile;
}(React.Component);

MathTextTile.contextType = AppContext;

/*props :
value : whatever
onChange = function(new val)
*/
export var NumberEditOrShow = function (_React$Component2) {
    _inherits(NumberEditOrShow, _React$Component2);

    function NumberEditOrShow() {
        _classCallCheck(this, NumberEditOrShow);

        return _possibleConstructorReturn(this, (NumberEditOrShow.__proto__ || Object.getPrototypeOf(NumberEditOrShow)).apply(this, arguments));
    }

    _createClass(NumberEditOrShow, [{
        key: 'render',
        value: function render() {
            var props = this.props;

            if (this.context.canEditParameters) return React.createElement('input', { type: 'text',
                value: props.value,
                onChange: function onChange(e) {
                    var v = Number(e.target.value);
                    if (Number.isNaN(v) || props.min > v || props.max < v) return;
                    props.onChange(v);
                },

                style: { width: 30 }
            });else {
                return React.createElement(
                    'span',
                    null,
                    props.value
                );
            }
        }
    }]);

    return NumberEditOrShow;
}(React.Component);

NumberEditOrShow.contextType = AppContext;