var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapLayers = function (_React$Component) {
    _inherits(MapLayers, _React$Component);

    function MapLayers(props) {
        _classCallCheck(this, MapLayers);

        return _possibleConstructorReturn(this, (MapLayers.__proto__ || Object.getPrototypeOf(MapLayers)).call(this, props));
    }

    _createClass(MapLayers, [{
        key: 'render',
        value: function render() {
            var bases = ['groundUse', 'popDensity', 'windPowDensAt50'];
            var layers = ['energyGrid', 'flows'];

            var name2icon = {
                'groundUse': 'groundUse.jpg',
                'popDensity': 'pop.png',
                'windPowDensAt50': 'windbis.jpeg',
                'energyGrid': 'electricEnergy.png',
                'flows': 'flows.png'
            };

            var baseEls = bases.map(function (label) {
                return React.createElement('img', { src: "res/icons/" + name2icon[label], className: 'mapButton' });
            });

            var extraEls = layers.map(function (label) {
                return React.createElement('img', { src: "res/icons/" + name2icon[label], className: 'mapButton' });
            });

            return React.createElement(
                'div',
                { id: 'dMapLayers', title: 'MapLayers', className: 'vLayout' },
                baseEls,
                extraEls
            );
        }
    }]);

    return MapLayers;
}(React.Component);

export default MapLayers;