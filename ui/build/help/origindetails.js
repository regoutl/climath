var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import ReactPlot from '../reactplot.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

/** @brief this class provide a lot of explainations about pv
*/

var OriginDetails = function (_React$Component) {
    _inherits(OriginDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function OriginDetails(props) {
        _classCallCheck(this, OriginDetails);

        return _possibleConstructorReturn(this, (OriginDetails.__proto__ || Object.getPrototypeOf(OriginDetails)).call(this, props));
    }

    _createClass(OriginDetails, [{
        key: 'render',
        value: function render() {
            var be = this.props.countries.belgium;

            return React.createElement(
                'div',
                { className: 'detailContent' },
                React.createElement(
                    'h3',
                    null,
                    tr('Energy origin')
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
                            tr('Demand')
                        ),
                        React.createElement('img', { src: 'data/conso/eq.svg', alt: 'Pv production eq' }),
                        React.createElement(
                            'ul',
                            null,
                            [{ img: 'tax/pop', descr: 'is the population' }, { img: 'conso/powerDemandPerCap', descr: 'is the power consumption per capita' }].map(function (i) {
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
                            tr('Population')
                        ),
                        React.createElement(ReactPlot, { data: be.pop }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            be.pop.source
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h4',
                            null,
                            tr('Power consumption per capita')
                        ),
                        React.createElement(ReactPlot, { data: be.consoPerCap }),
                        React.createElement(
                            'p',
                            { className: 'pSource' },
                            be.consoPerCap.source
                        )
                    )
                )
            );
        }
    }]);

    return OriginDetails;
}(React.Component);

export default OriginDetails;