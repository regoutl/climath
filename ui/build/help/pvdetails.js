var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        return _this;
    }

    _createClass(PvDetails, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
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
                    'p',
                    null,
                    tr('The following plot present the evolution of average solar pannel.')
                ),
                React.createElement('canvas', { ref: this.cEffi, width: '200', height: '100' })
            );
        }
    }]);

    return PvDetails;
}(React.Component);

export default PvDetails;