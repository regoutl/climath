var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../../tr.js";
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

import { Dialog } from './dialog.js';
import PvDetails from '../help/pvdetails.js';
import NukeDetails from '../help/nukedetails.js';
import CcgtDetails from '../help/ccgtdetails.js';
import WindDetails from '../help/winddetails.js';
import BatteryDetails from '../help/batterydetails.js';
import FusionDetails from '../help/fusiondetails.js';
import CurrentCountryDetails from '../help/currentcountrydetails.js';

import { CloseButton } from '../closebutton.js';

//to be checked
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

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

        _this.state = { region: 'belgium', paramSet: 'default', edit: null };
        _this.key = _this.keyPressed.bind(_this);

        _this.setCountry('be');
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

        // start(){
        //     promiseSimulater(this.props.scene).then(s =>{
        //         this.props.scene.setMap(s.cMap);
        //
        //         this.props.startRequested(s);
        //     })
        //     .catch(err => {
        //         alert(err);
        //     });
        // }
        //

    }, {
        key: 'handleRegionChange',
        value: function handleRegionChange() {}
    }, {
        key: 'handleParamChange',
        value: function handleParamChange() {}
    }, {
        key: 'setCountry',
        value: function setCountry(code) {
            var _this2 = this;

            fetch('data/' + code + '/defaultParameters.json').then(function (response) {
                return response.json();
            }) //   no txt to json conv
            .then(function (params) {
                _this2.props.onCountryChange(code, params);
            });
        }
    }, {
        key: 'editParam',
        value: function editParam() {
            // if(this.state.paramSet == 'default')
            //     this.newParam();

            this.setState({ help: PvDetails });
        }
    }, {
        key: 'newParam',
        value: function newParam() {
            var name = prompt('Enter name');
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.help) {
                return this._makeHelp();
            } else {
                return React.createElement(
                    Dialog,
                    {
                        title: 'New game',
                        onStart: this.props.onStart
                    },
                    React.createElement(
                        'table',
                        null,
                        React.createElement(
                            'tbody',
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
                                        { value: this.state.region, onChange: this.handleRegionChange.bind(this) },
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
                                        'div',
                                        { className: 'button white', onClick: this.editParam.bind(this) },
                                        tr('Edit...')
                                    )
                                )
                            )
                        )
                    )
                );
            }
        }

        /** @brief returns a react component for the current help
        @note : help must be not null
        */

    }, {
        key: '_makeHelp',
        value: function _makeHelp() {
            var _this3 = this;

            var energies = [{ label: 'Solar panels', target: PvDetails }, { label: 'Wind turbines', target: WindDetails }, { label: 'Batteries', target: BatteryDetails }, { label: 'Nuclear power', target: NukeDetails }, { label: 'Gas centrals', target: CcgtDetails }, { label: 'Fusion', target: FusionDetails }];

            var countries = [{ label: 'Belgium', target: CurrentCountryDetails }];

            var Help = this.state.help;
            return React.createElement(
                'div',
                {
                    id: 'editParamPage',
                    className: 'hLayout'
                },
                React.createElement(
                    'div',
                    { className: 'vLayout', style: { minWidth: 200 } },
                    React.createElement(
                        'nav',
                        { className: 'vLayout' },
                        React.createElement(
                            'h2',
                            null,
                            tr('Energies')
                        ),
                        energies.map(function (p) {
                            return React.createElement(
                                'div',
                                { key: p.label, onClick: function onClick() {
                                        return _this3.setState({ help: p.target });
                                    } },
                                tr(p.label)
                            );
                        }),
                        React.createElement(
                            'h2',
                            null,
                            tr('Countries')
                        ),
                        countries.map(function (p) {
                            return React.createElement(
                                'div',
                                { key: p.label, onClick: function onClick() {
                                        return _this3.setState({ help: p.target });
                                    } },
                                tr(p.label)
                            );
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'button black', onClick: function onClick() {
                                return _this3.setState({ help: null });
                            } },
                        tr('Ok')
                    )
                ),
                React.createElement(Help, {
                    parameters: this.props.parameters
                })
            );
        }
    }]);

    return NewGameDialog;
}(React.Component);