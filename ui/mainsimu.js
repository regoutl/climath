var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import StatDock from './statdock.js';
import MapView from './mapview.js';
import BuildDock from './builddock.js';

var MainSimu = function (_React$Component) {
    _inherits(MainSimu, _React$Component);

    function MainSimu(props) {
        _classCallCheck(this, MainSimu);

        var _this = _possibleConstructorReturn(this, (MainSimu.__proto__ || Object.getPrototypeOf(MainSimu)).call(this, props));

        _this.state = { showStats: false, showBM: true };
        return _this;
    }

    _createClass(MainSimu, [{
        key: 'render',
        value: function render() {
            // let ans = "";
            //
            // if(this.state.showStats)
            //     ans += <StatDock />;
            //
            // ans += <MapView />;
            //
            // if(this.state.showBM)
            //     ans += <BuildDock />;


            return React.createElement(
                'div',
                { className: 'hFlex' },
                React.createElement(MapView, null)
            );
        }
    }]);

    return MainSimu;
}(React.Component);

export default MainSimu;