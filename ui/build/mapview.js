var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../tr/tr.js';
import MapLayers from './maplayers.js';

function isCentral(type) {
    return type == 'nuke' || type == 'ccgt' || type == 'fusion';
}

var MapView = function (_React$Component) {
    _inherits(MapView, _React$Component);

    /* accepted props :
    onBuildChange : function({pos: curPos, confirmOnDock: bool})
            -> called on mouse move && mouse leave  (then with undefined curPos)
    onConfirmBuild : function(curPos)        -> called on click
    cursor : {type, radius} type : undefined or string (pv, nuke, ...)
                            radius : undefined or Number. unit : px
    */
    function MapView(props) {
        _classCallCheck(this, MapView);

        var _this = _possibleConstructorReturn(this, (MapView.__proto__ || Object.getPrototypeOf(MapView)).call(this, props));
        //react


        _this.state = {
            energyGrid: true,
            flows: false,
            base: 'groundUse'
        };

        _this._toogleLayer = _this._toogleLayer.bind(_this);

        //callbacks ----------------------------------------------------
        _this.draw = _this.draw.bind(_this);
        _this.mousedown = _this.onmousedown.bind(_this);
        _this.mousemove = _this.onmousemove.bind(_this);
        _this.mouseup = _this.onmouseup.bind(_this);
        _this.wheel = _this.onwheel.bind(_this);
        _this.touchstart = _this.ontouchstart.bind(_this);
        _this.touchmove = _this.ontouchmove.bind(_this);
        _this.touchend = _this.ontouchend.bind(_this);
        _this.click = _this.onclick.bind(_this);

        _this.mouseleave = _this.onmouseleave.bind(_this);

        //about mouse
        _this.physMousePos = { x: 0, y: 0 }; // cursor pos (px) in window coord
        //transforms logical coord -> physical coord
        // physMousePos  = (logicMousePos + translate) * scale
        _this.transform = { x: -0, y: -0, scale: 0.64 };
        //is the mouse curently down
        _this.isMouseDown = false;

        //Touch state
        _this.touchstate = {
            touches: []
        };

        _this.canvas = React.createRef();
        return _this;
    }

    //internal functions--------------------------------------------------------

    _createClass(MapView, [{
        key: '_toogleLayer',
        value: function _toogleLayer(name) {
            if (['energyGrid', 'flows'].includes(name)) this.setState(function (state) {
                return _defineProperty({}, name, !state[name]);
            });else this.setState({ base: name });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.scene.init(this.canvas.current);

            console.log("mount mapview !");

            this.draw();
            window.addEventListener('resize', this.draw);

            window.addEventListener('mousemove', this.mousemove);
            window.addEventListener('mouseup', this.mouseup);

            window.addEventListener('touchstart', this.touchstart);
            window.addEventListener('touchmove', this.touchmove, { passive: false });
            window.addEventListener('touchend', this.touchend);
            window.addEventListener('touchcancel', this.touchend);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.draw);

            window.removeEventListener('mousemove', this.mousemove);
            window.removeEventListener('mouseup', this.mouseup);

            window.removeEventListener('touchstart', this.touchstart);
            window.removeEventListener('touchmove', this.touchmove);
            window.removeEventListener('touchend', this.touchend);
            window.removeEventListener('touchcancel', this.touchend);
        }
    }, {
        key: 'render',
        value: function render() {

            // return <div>{this.myProp}</div>;
            this.draw();

            console.log('render :/');

            return React.createElement(
                'div',
                { id: 'dMapBox' },
                React.createElement(MapLayers, {
                    base: this.state.base,
                    energyGrid: this.state.energyGrid,
                    flows: this.state.flows,
                    setVisible: this._toogleLayer }),
                React.createElement(
                    'canvas',
                    {
                        ref: this.canvas,
                        onMouseLeave: this.mouseleave,
                        onClick: this.click,
                        onWheel: this.wheel,
                        onMouseDown: this.mousedown
                    },
                    tr("Your browser is not supported")
                )
            );
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.props.scene.draw(this.transform, this.state.base, this.state.energyGrid, this.state.flows);
        }
    }, {
        key: 'onBuildTargetChange',
        value: function onBuildTargetChange(_ref2) {
            var rawPos = _ref2.rawPos,
                _ref2$confirmOnDock = _ref2.confirmOnDock,
                confirmOnDock = _ref2$confirmOnDock === undefined ? false : _ref2$confirmOnDock;

            this.props.onBuildChange({ pos: {
                    x: Math.round(rawPos.x / this.transform.scale - this.transform.x),
                    y: Math.round(rawPos.y / this.transform.scale - this.transform.y)
                },
                confirmOnDock: confirmOnDock
            });
        }
    }, {
        key: 'onmousedown',
        value: function onmousedown(e) {
            if (e.target != this.canvas.current) return;

            this.isMouseDown = true;
            this.physMousePos = { x: e.pageX, y: e.pageY };
        }
    }, {
        key: 'onmousemove',
        value: function onmousemove(e) {
            if ("ontouchstart" in document.documentElement) return; // prenvent mouse move event on touch event

            if (this.isMouseDown) {

                this.transform.x += (e.pageX - this.physMousePos.x) / this.transform.scale;
                this.transform.y += (e.pageY - this.physMousePos.y) / this.transform.scale;

                this.physMousePos.x = e.pageX;
                this.physMousePos.y = e.pageY;
                this.dragging = true; //used to prevent click when drawing


                this.draw();
            } else {
                if (e.target != this.canvas.current) return;

                this.onBuildTargetChange({ rawPos: { x: e.pageX, y: e.pageY } });
            }
        }
    }, {
        key: 'onmouseup',
        value: function onmouseup(e) {
            var _this2 = this;

            this.isMouseDown = false;
            setTimeout(function () {
                _this2.dragging = false;
            }, 0);

            if (e.target != this.canvas.current) return;
        }
    }, {
        key: 'onwheel',
        value: function onwheel(e) {
            this.zoom({
                curX: e.pageX,
                curY: e.pageY,
                deltaY: e.deltaY
            });
        }
    }, {
        key: 'zoom',
        value: function zoom(_ref3) {
            var curX = _ref3.curX,
                curY = _ref3.curY,
                deltaY = _ref3.deltaY,
                _ref3$scale = _ref3.scale,
                scale = _ref3$scale === undefined ? 0 : _ref3$scale;

            var origin = {
                x: curX / this.transform.scale - this.transform.x,
                y: curY / this.transform.scale - this.transform.y
            };

            this.transform.scale *= scale === 0 ? deltaY > 0 ? 0.8 : 1.25 : scale;

            //bounds
            this.transform.scale = Math.max(this.transform.scale, Math.pow(0.8, 4));
            this.transform.scale = Math.min(this.transform.scale, Math.pow(1 / 0.8, 8));

            this.transform.x = curX / this.transform.scale - origin.x;
            this.transform.y = curY / this.transform.scale - origin.y;

            this.draw();
        }
    }, {
        key: 'onclick',
        value: function onclick(e) {
            if (this.dragging) return;
            var rawPos = { x: e.pageX, y: e.pageY };

            var transformedPos = {
                x: Math.round(rawPos.x / this.transform.scale - this.transform.x),
                y: Math.round(rawPos.y / this.transform.scale - this.transform.y)
            };

            this.props.onConfirmBuild(transformedPos);
        }

        //called when cursor leaves direct contact with central area

    }, {
        key: 'onmouseleave',
        value: function onmouseleave(e) {
            this.props.onBuildChange({ pos: undefined });
        }
    }, {
        key: 'updatetouchstate',
        value: function updatetouchstate(touches) {
            this.touchstate.touches = touches.map(function (touch) {
                return { x: touch.pageX, y: touch.pageY };
            });
        }
    }, {
        key: 'ontouchstart',
        value: function ontouchstart(e) {
            if (e.target === this.canvas.current) {
                this.updatetouchstate(new (Function.prototype.bind.apply(Array, [null].concat(_toConsumableArray(e.touches))))());
                if (e.touches.length === 1) {
                    this.onBuildTargetChange({ rawPos: {
                            x: e.touches[0].pageX,
                            y: e.touches[0].pageY
                        }, confirmOnDock: true });
                }
            }
        }
    }, {
        key: 'ontouchmove',
        value: function ontouchmove(e) {
            if (e.target === this.canvas.current) {
                e.preventDefault();
                var touchstate = this.touchstate;
                var touches = new (Function.prototype.bind.apply(Array, [null].concat(_toConsumableArray(e.targetTouches))))();
                if (e.targetTouches.length > 1) {
                    //wheel
                    var middle = function middle(x0, x1) {
                        return Math.abs(x0 + x1) / 2;
                    },
                        d0 = {
                        x: touches[0].pageX,
                        y: touches[0].pageY
                    },
                        d1 = {
                        x: touches[1].pageX,
                        y: touches[1].pageY
                    },
                        oldd0 = touchstate.touches[0],
                        oldd1 = touchstate.touches[1];

                    var zoomArg = {
                        curX: middle(d0.x, d1.x),
                        curY: middle(d0.y, d1.y)
                    };

                    var dist = function dist(x0, y0, x1, y1) {
                        return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
                    };
                    var currDist = dist(d0.x, d0.y, d1.x, d1.y);
                    var oldDist = dist(oldd0.x, oldd0.y, oldd1.x, oldd1.y);

                    zoomArg.deltaY = Math.round(oldDist - currDist);
                    zoomArg.scale = currDist / oldDist;

                    this.updatetouchstate(touches);
                    this.zoom(zoomArg);
                } else if (this.touchstate.touches.length > 0) {
                    this.transform.x += (touches[0].pageX - touchstate.touches[0].x) / this.transform.scale;
                    this.transform.y += (touches[0].pageY - touchstate.touches[0].y) / this.transform.scale;

                    this.onBuildTargetChange({ rawPos: {
                            x: touches[0].pageX,
                            y: touches[0].pageY
                        }, confirmOnDock: true });

                    this.dragging = true; //used to prevent click when drawing

                    this.updatetouchstate(touches);
                    this.draw();
                } else {
                    this.dragging = true; //used to prevent click when drawing
                    this.updatetouchstate(touches);
                    this.draw();
                }
            }
        }
    }, {
        key: 'ontouchend',
        value: function ontouchend(e) {
            if (e.target === this.canvas.current) {
                e.preventDefault();
                this.draw();
                this.touchstate = { touches: [] };
                this.dragging = false;
            }
        }
    }]);

    return MapView;
}(React.Component);

export default MapView;