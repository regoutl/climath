var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import StatDock from './statdock.js';
import MapView from './mapview.js';
import BuildDock from './builddock.js';
import StatusBar from './statusbar.js';

import { Simulateur, promiseSimulater, objSum } from '../../simulateur/simulateur.js';

var MainWin = function (_React$Component) {
    _inherits(MainWin, _React$Component);

    function MainWin(props) {
        _classCallCheck(this, MainWin);

        var _this = _possibleConstructorReturn(this, (MainWin.__proto__ || Object.getPrototypeOf(MainWin)).call(this, props));

        _this.state = {
            simu: null,
            targetBuild: {},
            targetBuildLoc: { pos: { x: 0, y: 0 }, radius: 0 },
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
                storageCapacity: 0
            },
            money: 0,
            date: 2019
        };

        _this.slider = { default: 50, min: 1, max: 100,
            sliderChange: function sliderChange(r) {
                return _this.setTargetBuildLoc({ radius: Number(r) });
            } };
        var mainWin = _this;

        /// set of small functions that update screen text when some values changes
        var valChangedCallbacks = {
            money: function money(val) {
                mainWin.setState({ money: val });
            },
            year: function year(_year) {
                mainWin.setState({ date: _year });
                // if(simu){
                // 	StatDock.update();
                // 	BuildMenu.notifyStateChanged();
                // }
            },

            // totalCo2: function(co2){
            // 	let strco2Total = valStr(co2, 'C');
            // strco2Total = strco2Total.substr(0, strco2Total.length - 6);
            // $('.vTotalCo2').text(strco2Total);
            // },
            // lastYearCo2: function(co2){
            // 	let strco2Total = valStr(co2, 'C');
            // strco2Total = strco2Total.substr(0, strco2Total.length - 6);
            // $('.vLastYearCo2').text(strco2Total);
            // },
            taxRate: function taxRate(rate) {
                // $('.vTaxRate').text(Math.round(rate * 100) + '%');
            }
        };

        promiseSimulater(valChangedCallbacks).then(function (s) {
            _this.setState({ simu: s });
        }).catch(function (err) {
            alert(err);
        });
        return _this;
    }

    /** callback
        set the current target build
        target is a string as specified in builddock.js
    */


    _createClass(MainWin, [{
        key: 'setTargetBuild',
        value: function setTargetBuild(target) {
            this.setState({
                'targetBuild': { "type": target },
                'targetBuildLoc': { pos: { x: 0, y: 0 }, radius: this.slider.default }
            });
        }

        /** callback
            set the current location of the cursor as {pos:{x:,y:}, radius:}
        */

    }, {
        key: 'setTargetBuildLoc',
        value: function setTargetBuildLoc(_ref) {
            var _ref$pos = _ref.pos,
                pos = _ref$pos === undefined ? this.state.targetBuildLoc.pos : _ref$pos,
                _ref$radius = _ref.radius,
                radius = _ref$radius === undefined ? this.state.targetBuildLoc.radius : _ref$radius;

            // console.log(pos.x, pos.y, radius);
            // console.log('yo');
            var targetBuildLoc = {
                pos: pos,
                radius: radius
            },
                vBMArea = "",
                vBMBuildCost = 0;

            if (this.state.targetBuild.type !== undefined) {
                //     && targetBuildLoc.pos !== undefined){  -> non : target buid loc undefined := "valeur moyenne"
                var info = this.state.simu.onBuildMenuStateChanged(this.state.targetBuild, targetBuildLoc.pos, targetBuildLoc.radius).info;

                var avgProd = info.nameplate ? info.nameplate.at(info.build.end) * info.avgCapacityFactor : 0;

                this.setState({
                    targetBuildLoc: targetBuildLoc,
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
                        storageCapacity: info.storageCapacity ? info.storageCapacity.at(info.build.end) : 0
                    } });
            } else {
                this.setState({
                    targetBuildLoc: targetBuildLoc,
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
                        storageCapacity: 0
                    }
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (this.state.simu === null) {
                return React.createElement(
                    'p',
                    null,
                    'Chargement ... '
                );
            }

            return React.createElement(
                'div',
                { className: 'vLayout', style: { width: '100%', height: '100%' } },
                React.createElement(StatusBar, {
                    Date: this.state.date,
                    Money: this.state.money
                }),
                React.createElement(MapView, {
                    cMap: this.state.simu.cMap,
                    onMouseMove: function onMouseMove(curPos) {
                        return _this2.setTargetBuildLoc({ pos: curPos });
                    },
                    cursor: {
                        type: this.state.targetBuild.type,
                        radius: this.state.targetBuildLoc.radius,
                        pos: this.state.targetBuildLoc.pos
                    },
                    onClick: function onClick(curPos) {
                        return _this2.state.simu.confirmCurrentBuild();
                    }
                }),
                React.createElement(BuildDock, {
                    buildMenuSelectionCallback: this.setTargetBuild.bind(this),
                    target: this.state.targetBuild.type,
                    info: this.state.currentBuildInfo,
                    sliderRadius: this.slider
                })
            );
        }
    }]);

    return MainWin;
}(React.Component);

export default MainWin;