var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import GameWin from './gamewin.js';
import { AppContext } from './appcontext.js';
import { NewGameDialog } from './dialogs/newgamedialog.js';

/** @brief switch between full layouts*/
export var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            currentPage: 'newGame',
            context: {
                //controls how the equations (typically in the details dialogs) are displayed
                // valid values : ('text', 'math').
                // text : plain text description of the equation
                // math : math description, with a quick explaination of the parameters
                equationDisplay: 'text',
                toggleEquationDisplay: _this.toggleEquationDisplay.bind(_this)
            },
            country: ''
        };
        _this.parameters = null;

        _this.setCountry('be');
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

        //when menu ask for start

    }, {
        key: 'startGame',
        value: function startGame() {
            //todo : validations checks (is parameters loaded etc)

            this.setState({ currentPage: 'gameWin' });
        }
    }, {
        key: 'setCountry',
        value: function setCountry(code) {
            var _this2 = this;

            fetch('data/' + code + '/defaultParameters.json').then(function (response) {
                return response.json();
            }) //   no txt to json conv
            .then(function (params) {
                _this2.parameters = params;
                _this2.setState({ country: code });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var content = void 0;

            if (this.state.currentPage == 'gameWin') {
                content = React.createElement(GameWin, {
                    country: this.state.country,
                    parameters: this.parameters
                });
            } else if (this.state.currentPage == 'newGame') {
                content = React.createElement(NewGameDialog, {
                    onStart: this.startGame.bind(this),
                    onCountryChange: this.setCountry.bind(this),
                    onParamChange: function onParamChange(strParam) {
                        return _this3.setState({ strParameters: strParam });
                    }
                });
            } else throw 'todo';

            return React.createElement(
                AppContext.Provider,
                { value: this.state.context },
                content
            );
        }
    }]);

    return App;
}(React.Component);