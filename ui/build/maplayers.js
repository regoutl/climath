var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../tr/tr.js';

/* this shows the buttons to select the displayed layers and the legend
*/

var MapLayers = function (_React$Component) {
    _inherits(MapLayers, _React$Component);

    function MapLayers(props) {
        _classCallCheck(this, MapLayers);

        var _this = _possibleConstructorReturn(this, (MapLayers.__proto__ || Object.getPrototypeOf(MapLayers)).call(this, props));

        _this.state = { open: false };
        return _this;
    }

    _createClass(MapLayers, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var props = this.props;

            var ans = [];
            if (this.state.open) {
                var bases = ['groundUse', 'popDensity', 'windPowDensAt50'];
                var layers = ['energyGrid', 'flows'];

                var name2icon = {
                    'groundUse': 'groundUse.jpg',
                    'popDensity': 'pop.png',
                    'windPowDensAt50': 'windbis.jpeg',
                    'energyGrid': 'electricEnergy.png',
                    'flows': 'flows.png'
                };
                var isSelected = function isSelected(label) {
                    if (bases.includes(label)) return props.base === label;else return props[label];
                };
                var mapListToIm = function mapListToIm(label) {
                    return React.createElement('img', {
                        src: "res/icons/" + name2icon[label],
                        className: 'mapButton',
                        style: {
                            filter: isSelected(label) ? "none" : 'grayscale(100%)'
                        },
                        onClick: function onClick() {
                            _this2.setState({ open: false });props.onLayerToggled(label);
                        },
                        key: label,
                        title: tr("Show " + label)
                    });
                };

                ans.push(React.createElement(
                    'div',
                    { id: 'dMapLayers', className: 'vLayout' },
                    bases.map(mapListToIm),
                    layers.map(mapListToIm)
                ));
            } else {
                ans.push(React.createElement(
                    'div',
                    { id: 'dMapLayers', title: tr("Choose displayed layers"), className: 'vLayout' },
                    React.createElement('img', {
                        src: 'res/icons/layers.png',
                        className: 'mapButton',
                        onClick: function onClick() {
                            return _this2.setState({ open: true });
                        }
                    })
                ));
            }

            if (props.base == 'popDensity') {
                ans.push(React.createElement('div', null));
            }

            return ans;
        }
    }]);

    return MapLayers;
}(React.Component);

export default MapLayers;