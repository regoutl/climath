var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Copyright 2020, ASBL Math for climate, All rights reserved.

import GameWin from './gamewin.js';
import { AppContext } from './appcontext.js';
import { NewGameDialog } from './dialogs/newgamedialog.js';
import { downloadDic } from '../../tr.js';

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
                toggleEquationDisplay: _this.toggleEquationDisplay.bind(_this),
                canEditParameters: true
            },
            country: ''
        };
        _this.parameters = null; // content of parameters.json

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

            this.setState(function (state) {
                return { currentPage: 'gameWin', context: Object.assign({}, state.context, { canEditParameters: false }) };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var content = void 0;

            if (this.state.currentPage == 'gameWin') {
                content = React.createElement(GameWin, {
                    country: this.state.country,
                    parameters: this.parameters
                });
            } else if (this.state.currentPage == 'newGame') {
                content = React.createElement(NewGameDialog, {
                    onStart: this.startGame.bind(this),
                    country: this.state.country,
                    parameters: this.parameters,
                    onCountryChange: function onCountryChange(countryCode, parameters) {
                        _this2.parameters = parameters;_this2.setState({ country: countryCode });
                    },
                    onLangChange: function onLangChange() {
                        return _this2.forceUpdate();
                    }
                });
            } else throw 'todo';

            //localhost only, adds the download dictionary button
            if (location.hostname == 'localhost') {
                var downloadDicButton = React.createElement('img', { src: 'res/icons/download.png', id: 'bDownloadDic', title: '(Dev) download dic', className: 'mainButton', onClick: function onClick() {
                        return downloadDic();
                    } });
                content = [content, downloadDicButton];
            }

            return React.createElement(
                AppContext.Provider,
                { value: this.state.context },
                content
            );
        }
    }]);

    return App;
}(React.Component);