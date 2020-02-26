var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import GameWin from './gamewin.js';
import { AppContext } from './appcontext.js';

/** @brief switch between full layouts*/
export var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            currentPage: 'gameWin',
            context: {
                //controls how the equations (typically in the details dialogs) are displayed
                // valid values : ('text', 'math').
                // text : plain text description of the equation
                // math : math description, with a quick explaination of the parameters
                equationDisplay: 'text',
                toggleEquationDisplay: _this.toggleEquationDisplay.bind(_this)
            }
        };
        return _this;
    }

    _createClass(App, [{
        key: 'toggleEquationDisplay',
        value: function toggleEquationDisplay() {
            this.setState(function (state) {
                var ctx = state.context;
                return { context: Object.assign({}, state.context, { equationDisplay: ctx.equationDisplay == 'math' ? 'text' : 'math' }) };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.currentPage == 'gameWin') {
                return React.createElement(
                    AppContext.Provider,
                    { value: this.state.context },
                    React.createElement(GameWin, null)
                );
            }

            return React.createElement(
                'p',
                null,
                'Coucou'
            );
        }
    }]);

    return App;
}(React.Component);