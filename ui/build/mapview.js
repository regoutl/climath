var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
    onMouseMove : function(curPos)    -> called on mouse move && mouse leave  (then with undefined curPos)
    onClick : function(curPos)        -> called on click
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
        _this.click = _this.onclick.bind(_this);

        _this.mouseleave = _this.onmouseleave.bind(_this);

        //about mouse
        _this.physMousePos = { x: 0, y: 0 }; // cursor pos (px) in window coord
        //transforms logical coord -> physical coord
        // physMousePos  = (logicMousePos + translate) * scale
        _this.transform = { x: -0, y: -0, scale: 0.64 };
        //is the mouse curently down
        _this.isMouseDown = false;

        // content --------------------------------------------------

        // //array of positions of ponctual stuff (nuke, ccgt, ...). format : type, pos
        // this.items = [];
        return _this;
    }

    // /** @brief update the given layer*/
    // update(layerName){
    //     throw 'todo';
    //     // if(this[layerName+'Src'] === undefined)
    //     //     throw 'olala';
    //     // // this.energy.update(this.energySrc);
    //     // this[layerName].update(this[layerName+'Src']);
    // }
    //
    // // conceptually, mapView stores a Map (id, color)
    // // this function return the next free id and maps it to its coresponding color
    // appendEnergyPalette(type){
    //   let r, g, b, a = 255;
    //   if(type == 'pv'){r = 70; g = 85; b = 130;}
    //   else if(type == 'battery'){r = 0; g = 255; b = 250;}
    //   else if(type == 'wind'){r = 255; g = 255; b = 250; a = 128}
    //   else {
    //     throw 'todo';
    //   }
    //
    //   return this.energy.appendPalette(r, g, b, a);
    // }
    //
    // /// adds a point item at the given position
    // addItem(type, pos){
    //     if(!isCentral(type))
    //         throw 'not possible';
    //
    //     this.items.push({type: type, pos:pos});
    //     //update gl
    //     this._updatePtsBuf();
    //     this.draw();
    // }
    //
    // //removes a central
    // rmItem(type, pos){
    //     if(!isCentral(type))
    //         throw 'not possible';
    //
    //     let id = this.items.findIndex(v => v.type === type && v.pos.x === pos.x
    //         && v.pos.y === pos.y);
    //
    //     this.items.splice(id, 1);
    //
    //     //update gl
    //     this._updatePtsBuf();
    //     this.draw();
    // }


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
            this.props.scene.init(this.refs.mapCanvas);

            console.log("mount mapview !");

            this.draw();
            window.addEventListener('resize', this.draw);

            window.addEventListener('mousedown', this.mousedown);
            window.addEventListener('mousemove', this.mousemove);
            window.addEventListener('mouseup', this.mouseup);
            window.addEventListener('wheel', this.wheel);
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
                        ref: 'mapCanvas',
                        onMouseLeave: this.mouseleave,
                        onClick: this.click
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
        key: 'onmousedown',
        value: function onmousedown(e) {
            if (e.target != this.refs.mapCanvas) return;

            this.isMouseDown = true;
            this.physMousePos = { x: e.pageX, y: e.pageY };
        }
    }, {
        key: 'onmousemove',
        value: function onmousemove(e) {
            // if(e.target != this.refs.mapCanvas)
            //     return;

            if (this.isMouseDown) {

                this.transform.x += (e.pageX - this.physMousePos.x) / this.transform.scale;
                this.transform.y += (e.pageY - this.physMousePos.y) / this.transform.scale;

                this.physMousePos.x = e.pageX;
                this.physMousePos.y = e.pageY;
                this.dragging = true; //used to prevent click when drawing


                this.draw();
            } else {
                var rawPos = { x: e.pageX, y: e.pageY };

                var transformedPos = {
                    x: Math.round(rawPos.x / this.transform.scale - this.transform.x),
                    y: Math.round(rawPos.y / this.transform.scale - this.transform.y)
                };

                this.props.onMouseMove(transformedPos);
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

            if (e.target != this.refs.mapCanvas) return;
        }
    }, {
        key: 'onwheel',
        value: function onwheel(e) {
            var curX = e.pageX,
                curY = e.pageY;

            var origin = {
                x: curX / this.transform.scale - this.transform.x,
                y: curY / this.transform.scale - this.transform.y
            };

            if (e.deltaY > 0) {
                this.transform.scale *= 0.8;
            } else {
                this.transform.scale /= 0.8;
            }

            //bounds
            this.transform.scale = Math.max(this.transform.scale, Math.pow(0.8, 4)); //unzoom
            this.transform.scale = Math.min(this.transform.scale, Math.pow(1 / 0.8, 8)); //zoom

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

            this.props.onClick(transformedPos);
        }

        //called when cursor leaves direct contact with central area

    }, {
        key: 'onmouseleave',
        value: function onmouseleave(e) {
            this.props.onMouseMove(undefined);
        }
    }]);

    return MapView;
}(React.Component);

export default MapView;