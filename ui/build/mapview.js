var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../tr/tr.js';
import MapLayers from './maplayers.js';
import { BuildDock, TouchBuildDock } from './builddock.js';
import { isTouchScreen, isMobile, isSmallScreen, isLandscape } from '../screenDetection.js';

function isCentral(type) {
    return type == 'nuke' || type == 'ccgt' || type == 'fusion';
}

/* The map view is responsible for :
-the map canvas (not the centent, see Scene)
-The map layers buttons
- the build menus
*/

var MapView = function (_React$Component) {
    _inherits(MapView, _React$Component);

    /* accepted props :
    onBuildPosChanged : function({pos: curPos, confirmOnDock: bool})
            -> called on mouse move && mouse leave  (then with undefined curPos)
    onBuildConfirmed : function(curPos)        -> called on click
    cursor : {type, radius} type : undefined or string (pv, nuke, ...)
                            radius : undefined or Number. unit : px
    onBuildMenuRequested()
    scene : a Scene
    */
    function MapView(props) {
        _classCallCheck(this, MapView);

        var _this = _possibleConstructorReturn(this, (MapView.__proto__ || Object.getPrototypeOf(MapView)).call(this, props));
        //react


        _this.targetBuild = { //the current sheduled build
            type: null,
            loc: { pos: { x: 0, y: 0 }, radius: 50 }
        };

        _this.state = {
            energyGrid: true,
            flows: false,
            base: 'groundUse',
            touchBuildMenuPos: null
        };

        _this._toogleLayer = _this._toogleLayer.bind(_this);

        //callbacks ----------------------------------------------------
        _this.draw = _this.draw.bind(_this);
        _this.mousemove = _this.onmousemove.bind(_this);
        _this.mouseup = _this.onmouseup.bind(_this);

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

    /** callback
        set the current location of the cursor as {pos:{x:,y:}, radius:}
    */


    _createClass(MapView, [{
        key: 'setTargetBuild',
        value: function setTargetBuild(_ref) {
            var _ref$type = _ref.type,
                type = _ref$type === undefined ? this.targetBuild.type : _ref$type,
                _ref$pos = _ref.pos,
                pos = _ref$pos === undefined ? this.targetBuild.loc.pos : _ref$pos,
                _ref$radius = _ref.radius,
                radius = _ref$radius === undefined ? this.targetBuild.loc.radius : _ref$radius;


            this.targetBuild.loc = {
                pos: pos,
                radius: radius
            };

            //we were builing nothing and it will not change, stop
            if (!this.targetBuild.type && !type) return;

            //set the new values
            this.targetBuild.type = type;

            this.props.scene.cursor = {
                type: this.targetBuild.type,
                radius: this.targetBuild.loc.radius,
                pos: this.targetBuild.loc.pos
            };

            this.forceUpdate();
        }

        //internal functions--------------------------------------------------------

    }, {
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
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.draw);

            window.removeEventListener('mousemove', this.mousemove);
            window.removeEventListener('mouseup', this.mouseup);
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
                        onMouseLeave: this.onmouseleave.bind(this),
                        onWheel: this.onwheel.bind(this),
                        onMouseDown: this.onmousedown.bind(this),
                        onTouchStart: this.ontouchstart.bind(this),
                        onTouchMove: this.ontouchmove.bind(this),
                        onTouchEnd: this.ontouchend.bind(this),
                        onTouchCancel: this.ontouchend.bind(this),
                        onClick: function onClick(e) {
                            return e.preventDefault();
                        }
                    },
                    tr("Your browser is not supported")
                ),
                this._makeDesktopBuildDock(),
                this._makeTouchBuildMenu()
            );
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.props.scene.draw(this.transform, this.state.base, this.state.energyGrid, this.state.flows);
        }

        /** @brief returns a react component for a detailed build dock
        @note : desktop build dock is alwas visible, and detailed
        */

    }, {
        key: '_makeDesktopBuildDock',
        value: function _makeDesktopBuildDock() {
            var _this2 = this;

            //no detailed build dock
            if (isTouchScreen() && isMobile()) return null;

            return React.createElement(BuildDock, {
                simu: this.props.simu,
                targetBuild: this.targetBuild,

                onTypeChanged: this.setTargetBuild.bind(this),
                onDetailsRequested: function onDetailsRequested(c) {
                    _this2.setState({ help: c });
                },
                onBuildConfirmed: function onBuildConfirmed() {
                    return _this2.confirmBuild(_this2.scene.cursor.pos);
                }
            });
        }
    }, {
        key: '_makeTouchBuildMenu',
        value: function _makeTouchBuildMenu() {
            var _this3 = this;

            if (!this.state.touchBuildMenuPos) return null;

            return React.createElement(TouchBuildDock, {
                simu: this.props.simu,
                targetBuild: this.targetBuild,
                center: this.state.touchBuildMenuPos,

                onTypeChanged: this.setTargetBuild.bind(this),
                onDetailsRequested: function onDetailsRequested(c) {
                    _this3.setState({ help: c });
                },
                onBuildConfirmed: function onBuildConfirmed() {
                    _this3.props.onBuildConfirmed(); //normal, confirm the build
                    _this3.setTargetBuild({ type: null });
                    _this3.setState({ touchBuildMenuPos: null }); //hide the menu
                }
            });
        }
    }, {
        key: 'toogleTouchBuildMenu',
        value: function toogleTouchBuildMenu(pos) {
            var _this4 = this;

            this.setState(function (state) {
                var ans = void 0;
                if (!state.touchBuildMenuPos) {
                    _this4.setTargetBuild({ pos: {
                            x: Math.round(pos.x / _this4.transform.scale - _this4.transform.x),
                            y: Math.round(pos.y / _this4.transform.scale - _this4.transform.y)

                        } });
                    ans = pos;
                } else ans = null;

                return { touchBuildMenuPos: ans };
            });
        }
    }, {
        key: 'onBuildTargetChange',
        value: function onBuildTargetChange(_ref3) {
            var rawPos = _ref3.rawPos,
                _ref3$confirmOnDock = _ref3.confirmOnDock,
                confirmOnDock = _ref3$confirmOnDock === undefined ? false : _ref3$confirmOnDock;

            this.setTargetBuild({
                pos: {
                    x: Math.round(rawPos.x / this.transform.scale - this.transform.x),
                    y: Math.round(rawPos.y / this.transform.scale - this.transform.y)
                }
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
                if (this.genericDrag({ x: this.physMousePos.x, y: this.physMousePos.y }, { x: e.pageX, y: e.pageY })) {
                    //on drag success, update mouse pos
                    this.physMousePos.x = e.pageX;
                    this.physMousePos.y = e.pageY;
                }
            } else {
                if (e.target != this.canvas.current) return;

                this.onBuildTargetChange({ rawPos: { x: e.pageX, y: e.pageY } });
            }
        }
    }, {
        key: 'onmouseup',
        value: function onmouseup(e) {
            if (!this.dragging) {
                //we were not dragging, count as a click
                var rawPos = { x: e.pageX, y: e.pageY };

                var transformedPos = {
                    x: Math.round(rawPos.x / this.transform.scale - this.transform.x),
                    y: Math.round(rawPos.y / this.transform.scale - this.transform.y)
                };

                this.props.onBuildConfirmed(transformedPos);
            }

            this.isMouseDown = false;
            this.dragging = false;
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
        value: function zoom(_ref4) {
            var curX = _ref4.curX,
                curY = _ref4.curY,
                deltaY = _ref4.deltaY,
                _ref4$scale = _ref4.scale,
                scale = _ref4$scale === undefined ? 0 : _ref4$scale;

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

        //called when cursor leaves direct contact with central area

    }, {
        key: 'onmouseleave',
        value: function onmouseleave(e) {
            this.setTargetBuild({ pos: null });
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
            //maybe we clicked on a map layer button or else. do nothing in that case
            if (e.target != this.canvas.current) return;
            e.preventDefault();
            this.updatetouchstate(new (Function.prototype.bind.apply(Array, [null].concat(_toConsumableArray(e.touches))))());
            if (e.touches.length === 1) {
                // this.onBuildTargetChange({rawPos: {
                //     x : e.touches[0].pageX,
                //     y : e.touches[0].pageY,
                // }, confirmOnDock: true,})
            }
        }
    }, {
        key: 'ontouchmove',
        value: function ontouchmove(e) {
            if (e.target != this.canvas.current) return;
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
                if (this.genericDrag({ x: touchstate.touches[0].x, y: touchstate.touches[0].y }, { x: touches[0].pageX, y: touches[0].pageY })) {
                    this.updatetouchstate(touches);
                }
            }

            var pos = this.state.touchBuildMenuPos;
            this.setTargetBuild({ pos: {
                    x: Math.round(pos.x / this.transform.scale - this.transform.x),
                    y: Math.round(pos.y / this.transform.scale - this.transform.y)
                } });

            this.setTargetBuild({ radius: Math.round(50 / this.transform.scale) });

            //whut ? move on 0 touches ?
            // else{
            //     this.dragging = true;//used to prevent click when drawing
            //     this.updatetouchstate(touches);
            //     this.draw();
            // }
        }
    }, {
        key: 'ontouchend',
        value: function ontouchend(e) {
            if (e.target != this.canvas.current) return;
            e.preventDefault();

            //it is a click from touch : display the small build menu
            if (!this.dragging) {
                var touch = this.touchstate.touches[0];
                this.toogleTouchBuildMenu({ x: touch.x, y: touch.y });
            }

            this.touchstate = { touches: [] };
            this.dragging = false;
        }

        // do a drag. return true if drag hapenned

    }, {
        key: 'genericDrag',
        value: function genericDrag(oldPos, newPos) {
            //prevent drag on very small movement
            if (!this.dragging && Math.abs(newPos.x - oldPos.x) + Math.abs(newPos.y - oldPos.y) < 5) return false;

            //update transform
            this.dragging = true;

            this.transform.x += (newPos.x - oldPos.x) / this.transform.scale;
            this.transform.y += (newPos.y - oldPos.y) / this.transform.scale;

            this.draw();

            return true;
        }
    }]);

    return MapView;
}(React.Component);

export default MapView;