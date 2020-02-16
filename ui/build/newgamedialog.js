var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import { Simulateur, promiseSimulater } from '../../simulateur/simulateur.js';

/** @brief this dialog prompt user with choice of the region and parameters
@note it prevent clicks on the page
*/
export var NewGameDialog = function (_React$Component) {
    _inherits(NewGameDialog, _React$Component);

    /** @details props
    startRequested => function(simu) : called when start was clicked. provide a simuater
    */
    function NewGameDialog(props) {
        _classCallCheck(this, NewGameDialog);

        var _this = _possibleConstructorReturn(this, (NewGameDialog.__proto__ || Object.getPrototypeOf(NewGameDialog)).call(this, props));

        _this.state = { region: 'belgium', paramSet: 'default' };
        _this.key = _this.keyPressed.bind(_this);
        return _this;
    }

    _createClass(NewGameDialog, [{
        key: 'startClicked',
        value: function startClicked(e) {
            this.start();
        }
    }, {
        key: 'keyPressed',
        value: function keyPressed(e) {
            if (e.keyCode == 13) this.start();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            window.addEventListener('keydown', this.key);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('keydown', this.key);
        }
    }, {
        key: 'start',
        value: function start() {
            var _this2 = this;

            promiseSimulater(this.props.scene).then(function (s) {
                _this2.props.scene.setMap(s.cMap);

                _this2.props.startRequested(s);
            }).catch(function (err) {
                alert(err);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { style: { position: 'absolute', width: '100%', 'height': '100%', zIndex: 100000000, alignItems: 'center', justifyContent: 'center' }, className: 'vLayout' },
                React.createElement(
                    'div',
                    { className: 'dialog vLayout', ref: this.me, style: { position: 'static', flex: '0 0' } },
                    React.createElement(
                        'h3',
                        null,
                        tr("New game")
                    ),
                    React.createElement(
                        'table',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr('Region')
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'select',
                                    { value: this.state.region, onChange: this.handleRegionChange },
                                    React.createElement(
                                        'option',
                                        { value: 'belgium' },
                                        tr('Belgium')
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                tr('Parameters')
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'select',
                                    { value: this.state.paramSet, onChange: this.handleParamChange },
                                    React.createElement(
                                        'option',
                                        { value: 'default' },
                                        tr('Default')
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'hLayout' },
                        React.createElement(
                            'div',
                            { className: 'button white', onClick: this.startClicked.bind(this) },
                            tr("Start")
                        )
                    )
                )
            );
        }
    }]);

    return NewGameDialog;
}(React.Component);