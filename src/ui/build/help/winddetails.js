var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';

function Production(props) {
    var turbDensTxt = 'is turbin density. Const ' + (0.1 * Math.round(props.turbineDensity * 1e7) + ' turbine/km2');

    var math = [React.createElement(
        'p',
        null,
        'Production of a wind farm of area ',
        React.createElement('img', { src: 'data/symbols/area.svg' }),
        ' is : '
    ), React.createElement('img', { src: 'data/wind/production.svg' }), React.createElement(
        'ul',
        null,
        [{ img: 'wind/turbDens', descr: turbDensTxt }, { img: 'wind/rotRad', descr: 'is the rotor radius. Const. 45m' }, { img: 'wind/wpd', descr: 'is the wind power density (W/m2)' }, { img: 'symbols/efficiency', descr: 'is the efficiency' }, { img: 'symbols/capaFactT', descr: 'is the capacity factor at hour t' }].map(function (i) {
            return React.createElement(
                'li',
                { key: i.img },
                React.createElement('img', { src: "data/" + i.img + ".svg", alt: i.descr }),
                ' ',
                tr(i.descr)
            );
        })
    )];

    var text = [React.createElement(
        'p',
        null,
        tr('The production depends on :')
    ), React.createElement(
        'ul',
        { className: 'default' },
        ['The area. ', 'The number of turbines per km2.', 'The turbine size', 'The amount of wind. ' + 'The amount of wind depends on the location (we call it \'Wind power density\') ' + 'and the time of the day/year (we call it \'Capacity factor\').', 'The wind turbine efficiency.  '].map(function (i) {
            return React.createElement(
                'li',
                null,
                tr(i)
            );
        })
    )];

    return React.createElement(MathTextTile, {
        title: 'Production',
        math: math,
        text: text
    });
}

/** @brief this class provide a lot of explainations about pv
*/

var WindDetails = function (_React$Component) {
    _inherits(WindDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function WindDetails(props) {
        _classCallCheck(this, WindDetails);

        return _possibleConstructorReturn(this, (WindDetails.__proto__ || Object.getPrototypeOf(WindDetails)).call(this, props));
    }

    _createClass(WindDetails, [{
        key: 'render',
        value: function render() {
            var wind = this.props.productionMeans.wind;

            return React.createElement(
                'div',
                { className: 'detailContent' },
                React.createElement(
                    'h3',
                    null,
                    tr('Wind turbines (onshore @50m)')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Wind turbines are devices that transform wind kinetic energy into electricity.')
                ),
                React.createElement(
                    'div',
                    { className: 'hWrapLayout' },
                    React.createElement(Production, {
                        turbineDensity: wind.density.at(2020)
                    }),
                    React.createElement(PlotTile, {
                        title: 'Efficiency',
                        caption: 'Proportion of wind energy transformed into electricity. ',
                        plot: wind.efficiency
                    }),
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
                            tr('Naturally, wind turbines do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')
                        ),
                        React.createElement(
                            'a',
                            { href: 'data/wind/wind_onshore_capaFact.csv' },
                            tr('Download the historic data for Belgium (2013-2017)')
                        ),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            'https://www.renewables.ninja/downloads'
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Wind power density')
                        ),
                        React.createElement(
                            'p',
                            null,
                            'The wind power density is the wind power flux. '
                        ),
                        React.createElement(
                            'a',
                            { href: 'data/wind/meanWindPowerDensity50.png', title: tr('Click to download') },
                            React.createElement('img', { src: 'data/wind/meanWindPowerDensity50.png', width: '300' })
                        ),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            'https://globalwindatlas.info/'
                        )
                    ),
                    React.createElement(PlotTile, {
                        title: 'Build cost',
                        caption: 'Build cost per item. ',
                        plot: wind.build.cost
                    }),
                    React.createElement(PlotTile, {
                        title: 'Maintenance cost',
                        caption: 'Yearly cost per item. ',
                        plot: wind.perYear.cost
                    })
                )
            );
        }
    }]);

    return WindDetails;
}(React.Component);

export default WindDetails;