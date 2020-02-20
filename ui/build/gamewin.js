var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import MapView from './mapview.js';
import BuildDock from './builddock.js';
import StatusBar from './statusbar.js';
import BudgetDialog from './budgetdialog.js';
import { Co2Dialog } from './co2dialog.js';
import { ConsoDialog } from './consodialog.js';
import { EndDialog } from './enddialog.js';
import { NewGameDialog } from './newgamedialog.js';
import { tr } from '../../tr/tr.js';

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

        _this.simu = null;
        _this.targetBuild = {}, _this.targetBuildLoc = { pos: { x: 0, y: 0 }, radius: 0 }, _this.state = {
            currentBuildInfo: {
                theoReason: "",
                buildCost: 0,
                buildCo2: 0,
                perYearCost: 0,
                perYearCo2: 0,
                nameplate: 0,
                pop: 0,
                explCost: 0,
                coolingWaterRate: 0,
                storageCapacity: 0,
                confirmOnDock: false
            },
            money: 0,
            currentDialog: NewGameDialog,
            help: NullHelp
        };

        _this.slider = { default: 50, min: 1, max: 100,
            sliderChange: function sliderChange(r) {
                return _this.setTargetBuildLoc({ radius: Number(r) });
            } };
        var mainWin = _this;

        _this.scene = new Scene();
        return _this;
    }

    /** callback
        set the current target build
        target is a string as specified in builddock.js
    */


    _createClass(GameWin, [{
        key: 'setTargetBuild',
        value: function setTargetBuild(target) {
            if (target === undefined && this.targetBuild.type !== undefined) {
                //we just cleaered the cursor
                // this.targetBuildLoc = targetBuildLoc;

                this.scene.cursor.type = undefined;
                this.setState({
                    currentBuildInfo: {
                        theoReason: undefined,
                        buildCost: 0,
                        buildCo2: 0,
                        perYearCost: 0,
                        perYearCo2: 0,
                        nameplate: 0,
                        pop: 0,
                        explCost: 0,
                        coolingWaterRate: 0,
                        storageCapacity: 0,
                        confirmOnDock: false
                    }
                });
            }

            this.targetBuild.type = target;
            this.targetBuildLoc = { pos: { x: 0, y: 0 }, radius: this.slider.default };

            this.forceUpdate();
        }

        /** callback
            set the current location of the cursor as {pos:{x:,y:}, radius:}
        */

    }, {
        key: 'setTargetBuildLoc',
        value: function setTargetBuildLoc(_ref) {
            var _ref$pos = _ref.pos,
                pos = _ref$pos === undefined ? this.targetBuildLoc.pos : _ref$pos,
                _ref$radius = _ref.radius,
                radius = _ref$radius === undefined ? this.targetBuildLoc.radius : _ref$radius,
                _ref$confirmOnDock = _ref.confirmOnDock,
                confirmOnDock = _ref$confirmOnDock === undefined ? false : _ref$confirmOnDock;


            var targetBuildLoc = {
                pos: pos,
                radius: radius
            },
                vBMArea = "",
                vBMBuildCost = 0;

            if (this.targetBuild.type !== undefined) {
                var info = this.simu.onBuildMenuStateChanged(this.targetBuild, targetBuildLoc.pos, targetBuildLoc.radius).info;

                var avgProd = info.nameplate ? info.nameplate.at(info.build.end) * info.avgCapacityFactor : 0;

                this.targetBuildLoc = targetBuildLoc;

                this.scene.cursor = {
                    type: this.targetBuild.type,
                    radius: this.targetBuildLoc.radius,
                    pos: this.targetBuildLoc.pos
                };

                this.setState({
                    currentBuildInfo: {
                        theoReason: info.theorical,
                        buildCost: info.build.cost,
                        buildCo2: info.build.co2,
                        perYearCost: info.perYear.cost + info.perWh.cost * avgProd,
                        perYearCo2: info.perYear.co2 + info.perWh.co2 * avgProd,
                        avgProd: avgProd,
                        pop: info.pop_affected,
                        explCost: info.expl_cost,
                        coolingWaterRate: info.coolingWaterRate,
                        storageCapacity: info.storageCapacity ? info.storageCapacity.at(info.build.end) : 0,
                        confirmOnDock: confirmOnDock
                    } });
            }
        }
    }, {
        key: 'runYear',
        value: function runYear() {
            this.simu.run();
            if (this.simu.year == 2070) {
                this.setState({
                    currentDialog: EndDialog
                });

                this.setTargetBuild(undefined);
            }

            this.forceUpdate();
        }
    }, {
        key: 'showBudgetDialog',
        value: function showBudgetDialog() {
            this.setState({ currentDialog: BudgetDialog });
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
            this.setDialog(undefined);
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

            if (this.simu === null) {
                return React.createElement(
                    'p',
                    null,
                    'Chargement ... '
                );
            }

            var dialog = void 0;
            if (this.state.currentDialog == EndDialog) {
                var areaAll = { center: { x: 0, y: 0 }, radius: 100000000 };

                var energyGroundUseProp = this.simu.cMap.reduceIf(['area'], areaAll, ['energy']) / this.simu.cMap.reduceIf(['area'], areaAll);

                dialog = React.createElement(EndDialog, {
                    closeRequested: this.setDialog.bind(this, null),
                    history: this.simu.stats,
                    energyGroundUseProp: energyGroundUseProp,
                    newGame: this.setDialog.bind(this, NewGameDialog)
                });
            } else {
                var CurDialog = this.state.currentDialog;

                dialog = React.createElement(CurDialog, {
                    gdp: this.simu.gdp,
                    regularTaxRate: this.simu.minTaxRate,
                    taxRate: this.simu.taxRate,
                    onTaxRateChanged: this.onTaxRateChanged.bind(this),
                    closeRequested: this.setDialog.bind(this, null),
                    history: this.simu.stats
                });
            }

            var helpDialog = null;
            if (this.state.help != NullHelp) {
                var Help = this.state.help;
                helpDialog = React.createElement(
                    'div',
                    { className: 'dialog', style: { left: '5%', right: '5%', top: 60, bottom: 30, background: 'white', boxShadow: '0 0 50px 10px black', color: 'black', overflow: 'auto' } },
                    React.createElement(Help, {
                        productionMeans: this.simu.cProd.productionMeans,
                        countries: this.simu.cProd.countries,
                        closeRequested: function closeRequested() {
                            return _this2.setState({ help: NullHelp });
                        }
                    })
                );
            }

            return React.createElement(
                'div',
                { className: 'vLayout', style: { width: '100%', height: '100%' } },
                React.createElement(StatusBar, {
                    date: this.simu.year,
                    money: this.simu.money,
                    showBudgetDialog: this.setDialog.bind(this, BudgetDialog),
                    showCo2Dialog: this.setDialog.bind(this, Co2Dialog),
                    history: this.simu.stats,
                    showConsoDialog: this.setDialog.bind(this, ConsoDialog)
                }),
                React.createElement(MapView, {
                    scene: this.scene,
                    onBuildChange: this.setTargetBuildLoc.bind(this),
                    onConfirmBuild: this.confirmBuild.bind(this)
                }),
                React.createElement(BuildDock, {
                    buildMenuSelectionCallback: this.setTargetBuild.bind(this),
                    target: this.targetBuild.type,
                    info: this.state.currentBuildInfo,
                    sliderRadius: this.slider,
                    detailsRequested: function detailsRequested(c) {
                        _this2.setState({ help: c });
                    },
                    onConfirmBuild: function onConfirmBuild() {
                        return _this2.confirmBuild(_this2.scene.cursor.pos);
                    }
                }),
                React.createElement(
                    'div',
                    {
                        id: 'bNextTurn',
                        className: 'button black',
                        title: tr("Go to the next year"),
                        onClick: this.runYear.bind(this)
                    },
                    tr("Next turn")
                ),
                dialog,
                helpDialog
            );
        }
    }]);

    return GameWin;
}(React.Component);

export default GameWin;