var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import { Plot } from '../../plot.js';

/** @brief this class provide a lot of explainations about pv
*/

var CcgtDetails = function (_React$Component) {
    _inherits(CcgtDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function CcgtDetails(props) {
        _classCallCheck(this, CcgtDetails);

        var _this = _possibleConstructorReturn(this, (CcgtDetails.__proto__ || Object.getPrototypeOf(CcgtDetails)).call(this, props));

        _this.cBuildCost = React.createRef(); //canvas of the effi plot
        return _this;
    }

    _createClass(CcgtDetails, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var nuke = this.props.productionMeans.nuke;
            var p = void 0;

            p = new Plot(nuke.build.cost, 300, 200);
            p.draw(this.cBuildCost.current.getContext('2d'));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'render',
        value: function render() {
            var nuke = this.props.productionMeans.nuke;

            return React.createElement(
                'div',
                { className: 'detailContent' },
                React.createElement(
                    'h3',
                    null,
                    tr('Nuclear reactors')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Solar pannels are devices that transform sun into electricity.')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('The production of PV is '),
                    React.createElement('img', { src: 'data/pv/eq.svg', alt: 'Pv production eq' }),
                    tr('where')
                ),
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/pv/radFlux.svg', alt: 'Pv production eq' }),
                        tr('is the maximal radiant flux (W/m2)')
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/pv/area.svg', alt: 'Pv production eq' }),
                        ' ',
                        tr('is the area (m2)')
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/pv/efficiency.svg', alt: 'Pv production eq' }),
                        ' ',
                        tr('is the pannel efficiency')
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/pv/capaFact.svg', alt: 'Pv production eq' }),
                        ' ',
                        tr('is the capacity factor at that hour')
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
                            tr('Efficiency evolution')
                        ),
                        React.createElement(
                            'p',
                            null,
                            tr('Proportion of sun power transformed into electric power. ')
                        ),
                        React.createElement('canvas', { ref: this.cEffi, width: '300', height: '200' }),
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
                        React.createElement('canvas', { ref: this.cBuildEn, width: '300', height: '200' }),
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
                        React.createElement('canvas', { ref: this.cBuildCost, width: '300', height: '200' }),
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
                        React.createElement('canvas', { ref: this.cPerYearCost, width: '300', height: '200' }),
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

    return CcgtDetails;
}(React.Component);

export default CcgtDetails;