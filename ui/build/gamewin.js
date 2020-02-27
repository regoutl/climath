var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import MapView from './mapview.js';
import StatusBar from './statusbar.js';
import { EndDialog } from './dialogs/enddialog.js';
import { NewGameDialog } from './dialogs/newgamedialog.js';
import { tr } from '../../tr/tr.js';
import { CloseButton } from './closebutton.js';
import { isTouchScreen, isMobile, isSmallScreen, isLandscape } from '../screenDetection.js';

import { TutoDialog } from './dialogs/tutodialog.js';

import Scene from '../scene.js';

import { Simulateur, promiseSimulater, objSum } from '../../simulateur/simulateur.js';

function NullDialog(props) {
    return null;
}
function NullHelp(props) {
    return null;
}

/** @brief playing window
*/

var GameWin = function (_React$Component) {
    _inherits(GameWin, _React$Component);

    function GameWin(props) {
        _classCallCheck(this, GameWin);

        //those are no state bc their draw is not related to a DOM change
        var _this = _possibleConstructorReturn(this, (GameWin.__proto__ || Object.getPrototypeOf(GameWin)).call(this, props));

        _this.simu = null; //the simulater, responsible for all computations

        _this.state = {
            currentDialog: NewGameDialog,
            help: NullHelp
        };

        _this.scene = new Scene();

        return _this;
    }

    _createClass(GameWin, [{
        key: 'runYear',
        value: function runYear() {
            this.simu.run();
            if (this.simu.year == 2021) {
                this.setState({
                    currentDialog: EndDialog
                });
            }

            this.forceUpdate();
        }
    }, {
        key: 'setDialog',
        value: function setDialog(c) {
            if (c === undefined || c === null) c = NullDialog;
            this.setState({ currentDialog: c });
        }
    }, {
        key: 'onTaxRateChanged',
        value: function onTaxRateChanged(newVal) {
            this.simu.taxRate = newVal;
            this.forceUpdate();
        }
    }, {
        key: 'confirmBuild',
        value: function confirmBuild(curPos) {
            this.simu.confirmCurrentBuild();
            this.forceUpdate();
        }
    }, {
        key: 'startGame',
        value: function startGame(simu) {
            this.simu = simu;
            this.setDialog(TutoDialog);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (this.state.currentDialog == NewGameDialog) {
                return React.createElement(NewGameDialog, {
                    startRequested: this.startGame.bind(this),
                    scene: this.scene });
            }

            if (!this.simu) {
                return React.createElement(
                    'p',
                    null,
                    'Chargement ... '
                );
            }

            var cProd = this.simu.cProd;
            var cMap = this.simu.cMap;

            var currentDate = this.simu.year;

            var currentConso = cProd.countries.belgium.pop.at(currentDate) * //watt
            cProd.countries.belgium.consoPerCap.at(currentDate);

            return React.createElement(
                'div',
                { className: 'vLayout', style: { width: '100%', height: '100%' } },
                React.createElement(StatusBar, {
                    date: currentDate,
                    money: this.simu.money,
                    showDialog: this.setDialog.bind(this),
                    history: this.simu.stats,
                    currentConso: currentConso
                }),
                React.createElement(MapView, {
                    scene: this.scene,
                    onBuildConfirmed: this.confirmBuild.bind(this),
                    simu: this.simu,
                    onDetailsRequested: function onDetailsRequested(c) {
                        _this2.setState({ help: c });
                    }
                }),
                this._makeNextTurnButton(),
                this._makeDialog(),
                this._makeHelp()
            );
        }

        /** @brief returns a react component for the currentDialog
        @note : dialog are small, optional, mutually exclusive boxes
        */

    }, {
        key: '_makeDialog',
        value: function _makeDialog() {
            var _this3 = this;

            if (this.state.currentDialog == EndDialog) {
                var cProd = this.simu.cProd;
                var cMap = this.simu.cMap;
                var areaAll = { center: { x: 0, y: 0 }, radius: 100000000 };

                var energyGroundUseProp = cMap.reduceIf(['area'], areaAll, ['energy']) / cMap.reduceIf(['area'], areaAll);

                return React.createElement(EndDialog, {
                    onClose: this.setDialog.bind(this, null),
                    history: this.simu.stats,
                    energyGroundUseProp: energyGroundUseProp,
                    newGame: this.setDialog.bind(this, NewGameDialog)
                });
            } else {
                var CurDialog = this.state.currentDialog;

                return React.createElement(CurDialog, {
                    gdp: this.simu.gdp,
                    regularTaxRate: this.simu.minTaxRate,
                    taxRate: this.simu.taxRate,
                    onTaxRateChanged: this.onTaxRateChanged.bind(this),
                    closeRequested: this.setDialog.bind(this, null),
                    history: this.simu.stats,
                    detailsRequested: function detailsRequested(c) {
                        _this3.setState({ help: c });
                    }
                });
            }
        }

        /** @brief returns a react component for the current help
        @note : help are big, optional, mutually exclusive boxes
        */

    }, {
        key: '_makeHelp',
        value: function _makeHelp() {
            var _this4 = this;

            if (this.state.help != NullHelp) {
                var Help = this.state.help;
                return React.createElement(
                    'div',
                    {
                        className: 'dialog',
                        style: {
                            left: '5%',
                            right: '5%',
                            top: 'calc(var(--status-bar-height) + 20px)', // 60px
                            bottom: 30,
                            background: 'white',
                            boxShadow: '0 0 50px 10px black',
                            color: 'black',
                            overflow: 'auto'
                        }
                    },
                    React.createElement(CloseButton, { closeRequested: function closeRequested() {
                            return _this4.setState({ help: NullHelp });
                        } }),
                    React.createElement(Help, {
                        productionMeans: this.simu.cProd.productionMeans,
                        countries: this.simu.cProd.countries
                    })
                );
            } else {
                return null;
            }
        }
    }, {
        key: '_makeNextTurnButton',
        value: function _makeNextTurnButton() {
            return React.createElement(
                'div',
                {
                    id: 'bNextTurn',
                    className: 'button black',
                    title: tr("Go to the next year"),
                    onClick: this.runYear.bind(this)
                },
                tr("Next turn")
            );
        }
    }]);

    return GameWin;
}(React.Component);

export default GameWin;