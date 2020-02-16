var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../../tr/tr.js';
import { Plot } from '../../plot.js';

/** @brief this class provide a lot of explainations about pv
*/

var PvDetails = function (_React$Component) {
    _inherits(PvDetails, _React$Component);

    /* accepted props
    efficiency : Raw Time varying input
    */
    function PvDetails(props) {
        _classCallCheck(this, PvDetails);

        var _this = _possibleConstructorReturn(this, (PvDetails.__proto__ || Object.getPrototypeOf(PvDetails)).call(this, props));

        _this.cEffi = React.createRef(); //canvas of the effi plot
        _this.cBuildEn = React.createRef(); //canvas of the effi plot
        _this.cBuildCost = React.createRef(); //canvas of the effi plot
        return _this;
    }

    _createClass(PvDetails, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var p = new Plot(this.props.efficiency, 300, 200);
            p.draw(this.cEffi.current.getContext('2d'));

            p = new Plot(this.props.buildEnergy, 300, 200);
            p.draw(this.cBuildEn.current.getContext('2d'));

            p = new Plot(this.props.buildCost, 300, 200);
            p.draw(this.cBuildCost.current.getContext('2d'));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
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
                    'p',
                    null,
                    tr('They are caracterised by their efficiency : the proportion of sun power transformed into electric power. ')
                ),
                React.createElement(
                    'h4',
                    null,
                    tr('Efficiency evolution')
                ),
                React.createElement('canvas', { ref: this.cEffi, width: '300', height: '200' }),
                React.createElement(
                    'p',
                    { className: 'pSource' },
                    this.props.efficiency.comment
                ),
                React.createElement(
                    'h4',
                    null,
                    tr('Build energy')
                ),
                React.createElement(
                    'p',
                    null,
                    tr('Solar pannel manufacturing cost some energy. ')
                ),
                React.createElement('canvas', { ref: this.cBuildEn, width: '300', height: '200' }),
                React.createElement(
                    'p',
                    null,
                    tr('This implies that, depending on the country, the pollution varies')
                ),
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
                React.createElement('canvas', { ref: this.cBuildCost, width: '300', height: '200' })
            );
        }
    }]);

    return PvDetails;
}(React.Component);

export default PvDetails;