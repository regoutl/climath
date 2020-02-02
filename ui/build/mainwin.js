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
            simu: {},
            targetBuild: {},
            vBMTheoReason: "",
            vBMBuild: "",
            vBMPerYear: "",
            vBMNameplate: "",
            vBMArea: "",
            vBMPop: "",
            vBMExplCost: "",
            vBMCoolingWaterRate: "",
            vBMStorageCapacity: ""
        };

        var mainWin = _this;

        /// set of small functions that update screen text when some values changes
        var valChangedCallbacks = {
            money: function money(_money) {
                // $('.vMoney').text(valStr(money, '€'));
            },
            year: function year(_year) {
                // $('.vYear').text(year);
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

    _createClass(MainWin, [{
        key: 'onPositionChange',
        value: function onPositionChange(position) {
            this.simu.onBuildMenuStateChanged(this.state.targetBuild, position, this.state.targetBuild.radius);
        }
    }, {
        key: 'setTargetBuild',
        value: function setTargetBuild(target, radius) {
            this.setState({
                'targetBuild': { "type": target, "radius": radius }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.simu === undefined) {
                return React.createElement(
                    'p',
                    null,
                    'Chargement ... '
                );
            }
            //this.setTargetBuild.bind(this)
            return React.createElement(
                'div',
                { className: 'vLayout' },
                React.createElement(StatusBar, null),
                React.createElement(MapView, { cMap: this.state.simu.cMap }),
                React.createElement(BuildDock, {
                    buildMenuSelectionCallback: this.setTargetBuild.bind(this),
                    target: this.state.targetBuild.type,
                    vBMTheoReason: this.state.vBMTheoReason,
                    vBMBuild: this.state.vBMBuild,
                    vBMPerYear: this.state.vBMPerYear,
                    vBMNameplate: this.state.vBMNameplate,
                    vBMArea: this.state.vBMArea,
                    vBMPop: this.state.vBMPop,
                    vBMExplCost: this.state.vBMExplCost,
                    vBMCoolingWaterRate: this.state.vBMCoolingWaterRate,
                    vBMStorageCapacity: this.state.vBMStorageCapacity
                })
            );
        }
    }]);

    return MainWin;
}(React.Component);

export default MainWin;