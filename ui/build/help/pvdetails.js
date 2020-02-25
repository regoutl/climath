var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';

/** @brief this class provide a lot of explainations about pv
*/

var PvDetails = function (_React$Component) {
    _inherits(PvDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function PvDetails(props) {
        _classCallCheck(this, PvDetails);

        return _possibleConstructorReturn(this, (PvDetails.__proto__ || Object.getPrototypeOf(PvDetails)).call(this, props));
    }

    _createClass(PvDetails, [{
        key: 'render',
        value: function render() {
            var pv = this.props.productionMeans.pv;

            return React.createElement(
                'div',
                { className: 'detailContent' },
                React.createElement(
                    'h3',
                    null,
                    tr('Solar panels')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Solar pannels are devices that transform sun into electricity.')
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
                            tr('Production')
                        ),
                        React.createElement(
                            'p',
                            null,
                            'Production of a PV farm of area ',
                            React.createElement('img', { src: 'data/symbols/area.svg' }),
                            ' is : '
                        ),
                        React.createElement('img', { src: 'data/pv/production.svg', alt: 'Pv production eq' }),
                        React.createElement(
                            'ul',
                            null,
                            [{ img: 'symbols/radFlux', descr: 'is the maximal radiant flux (W/m2)' }, { img: 'symbols/efficiency', descr: 'is the pannel efficiency at y0' }, { img: 'symbols/capaFactT', descr: 'is the capacity factor at that hour' }, { img: 'symbols/decline', descr: 'is the yearly efficiency decline at y0' }, { img: 'symbols/year', descr: 'is the current year' }, { img: 'symbols/year0', descr: 'is the build year' }].map(function (i) {
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
                            tr('Radiant flux')
                        ),
                        React.createElement(
                            'div',
                            { className: 'hLayout' },
                            React.createElement(
                                'div',
                                null,
                                React.createElement('img', { src: 'data/pv/maxRadFlux.svg', alt: 'max rad flux eq' }),
                                React.createElement(
                                    'ul',
                                    null,
                                    React.createElement(
                                        'li',
                                        null,
                                        React.createElement('img', { src: 'data/symbols/avgCapaFact.svg', alt: 'avgCapaFact' }),
                                        ' is the average capacity factor'
                                    ),
                                    React.createElement(
                                        'li',
                                        null,
                                        tr('GHI is the Global Horizontal Irradiance')
                                    )
                                )
                            ),
                            React.createElement(
                                'div',
                                null,
                                React.createElement('img', { src: 'data/pv/globalHorisontalIrradiance.png', alt: 'ghi be', width: '120' }),
                                React.createElement(
                                    'p',
                                    { className: 'pSource' },
                                    'https://globalsolaratlas.info/'
                                )
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Efficiency evolution')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Proportion of sun power transformed into electric power. ')
                        ),
                        React.createElement(ReactPlot, { data: pv.efficiency }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            pv.efficiency.source
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
                            tr('Solar pannel manufacturing requires some energy. ')
                        ),
                        React.createElement(ReactPlot, { data: pv.build.energy }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            pv.build.energy.source
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Build cost')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Solar pannel manufacturing cost. ')
                        ),
                        React.createElement(ReactPlot, { data: pv.build.cost }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            pv.build.cost.source
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
                            tr('Yearly cost per m2')
                        ),
                        React.createElement(ReactPlot, { data: pv.perYear.cost }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            pv.perYear.cost.source
                        )
                    ),
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
                            tr('Naturally, photovoltaic panels do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')
                        ),
                        React.createElement(
                            'a',
                            { href: 'data/pv/allBePvCapaFact.csv' },
                            tr('Download the historic data for Belgium (1985-2016)')
                        ),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            'https://www.renewables.ninja/downloads'
                        )
                    )
                )
            );
        }
    }]);

    return PvDetails;
}(React.Component);

export default PvDetails;