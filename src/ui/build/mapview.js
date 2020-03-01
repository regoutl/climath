var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../tr.js';
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
    onBuildConfirmed : function(curPos)        -> called on click
    scene : a Scene
    */
    function MapView(props) {
        _classCallCheck(this, MapView);

        var _this = _possibleConstructorReturn(this, (MapView.__proto__ || Object.getPrototypeOf(MapView)).call(this, props));
        //react


        _this.state = {
            energyGrid: true,
            flows: false,
            base: 'groundUse',
            touchBuildMenuPos: null,
            targetBuild: { //the current sheduled build
                type: null,
                pos: { x: 0, y: 0 },
                radius: 50
            }
        };

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

    _createClass(MapView, [{
        key: 'setTargetBuildState',
        value: function setTargetBuildState(attrName, val) {
            this.setState(function (state) {
                var ans = { targetBuild: Object.assign({}, state.targetBuild, _defineProperty({}, attrName, val)) };
                return ans;
            });
        }
    }, {
        key: 'confirmBuild',
        value: function confirmBuild() {
            // console.log('confirm build');
            this.props.simu.build(this.state.targetBuild);

            //should make game win update
            this.props.onMoneyChanged();
        }
    }, {
        key: 'confirmDemolish',
        value: function confirmDemolish() {
            this.props.simu.demolish({ center: this.state.targetBuild.pos, radius: this.state.targetBuild.radius });

            //should make game win update
            this.props.onMoneyChanged();
        }

        //internal functions--------------------------------------------------------

    }, {
        key: '_toggleLayer',
        value: function _toggleLayer(name) {
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
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.draw();
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
            var props = this.props;

            // return <div>{this.myProp}</div>;
            this.draw();

            console.log('render :/');

            return React.createElement(
                'div',
                { id: 'dMapBox' },
                !props.showOnlyMap && React.createElement(MapLayers, {
                    base: this.state.base,
                    energyGrid: this.state.energyGrid,
                    flows: this.state.flows,
                    onLayerToggled: this._toggleLayer.bind(this) }),
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
                        onTouchCancel: this.ontouchend.bind(this)
                    },
                    tr("Your browser is not supported")
                ),
                !props.showOnlyMap && this._makeDesktopBuildDock(),
                !props.showOnlyMap && this._makeTouchBuildMenu()
            );
        }
    }, {
        key: 'draw',
        value: function draw() {
            //update the cursor
            this.props.scene.cursor = {
                type: this.state.targetBuild.type,
                radius: this.state.targetBuild.radius,
                pos: this.state.targetBuild.pos
            };

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
                targetBuild: this.state.targetBuild,

                onTypeChanged: this.setTargetBuildState.bind(this, 'type'),
                onDetailsRequested: this.props.onDetailsRequested,
                onBuildConfirmed: function onBuildConfirmed() {
                    return _this2.confirmBuild();
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
                targetBuild: this.state.targetBuild,
                center: this.state.touchBuildMenuPos,

                onTypeChanged: this.setTargetBuildState.bind(this, 'type'),
                onDetailsRequested: this.props.onDetailsRequested,
                onBuildConfirmed: function onBuildConfirmed() {
                    _this3.confirmBuild(); //normal, confirm the build
                    _this3.setTargetBuildState('type', null);
                    //hide the menu
                    _this3.setState({ touchBuildMenuPos: null });
                }
            });
        }
    }, {
        key: 'toogleTouchBuildMenu',
        value: function toogleTouchBuildMenu(pos) {
            var _this4 = this;

            this.setState(function (state) {
                var ans = void 0,
                    np = void 0;
                if (!state.touchBuildMenuPos) {

                    np = {
                        x: Math.round(pos.x / _this4.transform.scale - _this4.transform.x),
                        y: Math.round(pos.y / _this4.transform.scale - _this4.transform.y)
                    };
                    ans = pos;
                } else {
                    ans = null;
                    np = null;
                }

                return { touchBuildMenuPos: ans, targetBuild: Object.assign({}, state.targetBuild, { pos: np, type: null }) };
            });
        }
    }, {
        key: 'onBuildTargetChange',
        value: function onBuildTargetChange(_ref2) {
            var rawPos = _ref2.rawPos,
                _ref2$confirmOnDock = _ref2.confirmOnDock,
                confirmOnDock = _ref2$confirmOnDock === undefined ? false : _ref2$confirmOnDock;

            //update target build pos
            this.setTargetBuildState('pos', {
                x: Math.round(rawPos.x / this.transform.scale - this.transform.x),
                y: Math.round(rawPos.y / this.transform.scale - this.transform.y)
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
                //avoid state update if not necessary
                if (e.target != this.canvas.current || !this.state.targetBuild.type) return;

                this.onBuildTargetChange({ rawPos: { x: e.pageX, y: e.pageY } });
            }
        }
    }, {
        key: 'onmouseup',
        value: function onmouseup(e) {
            //we were not dragging, count as a click
            //note : the check 'isMouseDown' is necessary; else, toucheend triger the build confirmation
            if (!this.dragging && this.isMouseDown && this.state.targetBuild.type) {
                // let rawPos = {x:e.pageX, y : e.pageY};
                //
                // let transformedPos = {
                //     x: Math.round((rawPos.x / this.transform.scale) - this.transform.x),
                //     y: Math.round((rawPos.y / this.transform.scale) - this.transform.y),
                // };

                if (this.state.targetBuild.type != 'demolish') this.confirmBuild();else this.confirmDemolish();
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
            this.transform.scale = Math.max(this.transform.scale, Math.pow(0.8, 8));
            this.transform.scale = Math.min(this.transform.scale, Math.pow(1 / 0.8, 8));

            this.transform.x = curX / this.transform.scale - origin.x;
            this.transform.y = curY / this.transform.scale - origin.y;

            if (this.state.touchBuildMenuPos && this.state.targetBuild.type) this.updateTouchBuildCursor();else this.draw();
        }

        //called when cursor leaves direct contact with central area

    }, {
        key: 'onmouseleave',
        value: function onmouseleave(e) {
            this.setTargetBuildState('pos', null);
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
                this.dragging = true;
            } else if (this.touchstate.touches.length > 0) {
                if (this.genericDrag({ x: touchstate.touches[0].x, y: touchstate.touches[0].y }, { x: touches[0].pageX, y: touches[0].pageY })) {
                    this.updatetouchstate(touches);
                }
            }

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
            // e.stopImmediatePropagation();

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

            if (this.state.touchBuildMenuPos && this.state.targetBuild.type) this.updateTouchBuildCursor();

            this.draw();

            return true;
        }

        //update the cursor of the build menu

    }, {
        key: 'updateTouchBuildCursor',
        value: function updateTouchBuildCursor() {
            this.setTargetBuildState('radius', Math.round(50 / this.transform.scale));
            var pos = this.state.touchBuildMenuPos;

            this.setTargetBuildState('pos', {
                x: Math.round(pos.x / this.transform.scale - this.transform.x),
                y: Math.round(pos.y / this.transform.scale - this.transform.y)
            });
        }
    }]);

    return MapView;
}(React.Component);

export default MapView;