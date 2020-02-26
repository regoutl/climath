var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

import { PlotTile, MathTextTile } from './sharedtiles.js';

function Computation(props) {
    var math = [React.createElement('img', { src: 'data/tax/in.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        null,
        [{ img: 'tax/rate', descr: 'is the tax rate' }, { img: 'tax/minRate', descr: 'is the minimum tax rate (other government spendings)' }, { img: 'tax/pop', descr: 'is the population' }, { img: 'tax/gdp', descr: 'is the gdp per capita' }, { img: 'tax/costOnM', descr: 'is the operating and maintenance cost' }].map(function (i) {
            return React.createElement(
                'li',
                { key: i.img },
                React.createElement('img', { src: "data/" + i.img + ".svg", alt: i.descr }),
                ' ',
                tr(i.descr)
            );
        })
    )];

    var text = ['Between each year you gain money, proportionnaly to your tax rate. ', 'However, the country must still run, thus not all tax money goes into your pocket.'].map(function (i) {
        return React.createElement(
            'p',
            null,
            tr(i)
        );
    });

    return React.createElement(MathTextTile, { title: 'Computation', math: math, text: text });
}

/** @brief this class provide a lot of explainations about pv
*/

var TaxDetails = function (_React$Component) {
    _inherits(TaxDetails, _React$Component);

    /* accepted props
    productionMeans = this.simu.cProd.productionMeans
    countries       = this.simu.cProd.countries
    closeRequested
    */
    function TaxDetails(props) {
        _classCallCheck(this, TaxDetails);

        return _possibleConstructorReturn(this, (TaxDetails.__proto__ || Object.getPrototypeOf(TaxDetails)).call(this, props));
    }

    _createClass(TaxDetails, [{
        key: 'render',
        value: function render() {
            var be = this.props.countries.belgium;

            return React.createElement(
                'div',
                { className: 'detailContent' },
                React.createElement(
                    'h3',
                    null,
                    tr('Budget')
                ),
                React.createElement(
                    'div',
                    { className: 'hWrapLayout' },
                    React.createElement(Computation, null),
                    React.createElement(PlotTile, {
                        title: 'Population',
                        plot: be.pop
                    }),
                    React.createElement(PlotTile, {
                        title: 'GDP per capita',
                        plot: be.gdpPerCap
                    })
                )
            );
        }
    }]);

    return TaxDetails;
}(React.Component);

export default TaxDetails;