var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from '../../tr/tr.js';
import MapLayers from './maplayers.js';
import PaletteTexture from './palettetexture.js';

var MapView = function (_React$Component) {
    _inherits(MapView, _React$Component);

    function MapView(props) {
        _classCallCheck(this, MapView);

        var _this = _possibleConstructorReturn(this, (MapView.__proto__ || Object.getPrototypeOf(MapView)).call(this, props));

        _this.state = {
            energyGrid: true,
            flows: false,
            base: 'groundUse'
        };

        _this.toogleLayer = _this.toogleLayer.bind(_this);
        return _this;
    }

    _createClass(MapView, [{
        key: 'toogleLayer',
        value: function toogleLayer(name) {
            if (['energyGrid', 'flows'].includes(name)) this.setState(function (state) {
                return _defineProperty({}, name, !state[name]);
            });else this.setState({ base: name });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var canvas = this.refs.mapCanvas;
            this.gl = canvas.getContext("webgl", { alpha: false });

            try {
                this._createProg();
                this._initTextures();
            } catch (e) {
                alert('mapview mount err', e);
            } finally {}

            console.log("mount mapview !");

            this.draw();
        }
    }, {
        key: 'render',
        value: function render() {
            this.draw();

            return React.createElement(
                'div',
                { id: 'dMapBox' },
                React.createElement(MapLayers, {
                    base: this.state.base,
                    energyGrid: this.state.energyGrid,
                    flows: this.state.flows,
                    setVisible: this.toogleLayer }),
                React.createElement(
                    'canvas',
                    {
                        ref: 'mapCanvas'
                    },
                    tr("Your browser is not supported")
                )
            );
        }

        /** @brief draw the currenty visible layers.
        @note if nuke cursor, draw flows
        */

    }, {
        key: 'draw',
        value: function draw() {
            var gl = this.gl;
            if (gl === undefined) return;

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.clearColor(1, 1, 1, 1);
            this.clear();

            this._drawTex(this[this.state.base]);
            //
            // if(this.currentShowGrid.energyGrid)
            //     this._drawTex(this.energy);
            //
            // if((this.currentCursor == 'nuke' || this.currentCursor == 'ccgt' || this.currentCursor == 'fusion'
            //     || this.currentShowGrid.flows) && this.water)
            //         this._drawTex(this.water);
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }
    }, {
        key: '_drawTex',
        value: function _drawTex(paletteTexture) {
            var gl = this.gl; //shortcut

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, paletteTexture.texture);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, paletteTexture.palette.tex);

            gl.useProgram(this.prog);
            gl.uniform1i(this.imageLoc, 0);
            gl.uniform1i(this.paletteLoc, 1);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }, {
        key: '_createProg',
        value: function _createProg() {
            var vert = '\n        attribute vec4 a_position;\n        varying vec2 v_texcoord;\n        void main() {\n          gl_Position = a_position;\n\n          // assuming a unit quad for position we\n          // can just use that for texcoords. Flip Y though so we get the top at 0\n          v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;\n        }\n        ';

            var frag = '\n        precision mediump float;\n        varying vec2 v_texcoord;\n        uniform sampler2D u_image;\n        uniform sampler2D u_palette;\n\n        void main() {\n            vec2 palXY = texture2D(u_image, v_texcoord).ra * 255.0;\n            gl_FragColor = texture2D(u_palette, (palXY + vec2(0.5)) / 256.0);\n        }\n        ';

            var gl = this.gl; //shortcut


            this.prog = createProgram(gl, [vert, frag]);

            this.imageLoc = gl.getUniformLocation(this.prog, "u_image");
            this.paletteLoc = gl.getUniformLocation(this.prog, "u_palette");

            // Setup a unit quad
            var positions = [1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1];
            this.vertBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        }
    }, {
        key: '_initTextures',
        value: function _initTextures() {
            this.energy = new PaletteTexture(this.gl, 2);
            this.energy.appendPalette(0, 0, 0, 0); //index 0 is transparent
            this.energy.update(this.props.cMap.energyGrid);

            this._initTexGroundUse();
            this._initTexPopDensity();
            this._initTexFlows();
            this._initWindPowDens();
        }
    }, {
        key: '_initTexGroundUse',
        value: function _initTexGroundUse() {
            this.groundUse = new PaletteTexture(this.gl, 1);

            this.groundUse.appendPalette(0, 0, 0, 0); //exterior
            this.groundUse.appendPalette(120, 120, 120); //airport
            this.groundUse.appendPalette(100, 140, 146); //water
            this.groundUse.appendPalette(59, 85, 48 /*52, 76, 45*/); //forest
            this.groundUse.appendPalette(120, 120, 97); //indus
            this.groundUse.appendPalette(114, 122, 74 /*183, 191, 154*/); //field
            this.groundUse.appendPalette(89, 109, 44 /*120, 124, 74*/); //field
            this.groundUse.appendPalette(114, 122, 74); //?
            this.groundUse.appendPalette(137, 141, 131); // city
            this.groundUse.appendPalette(52, 76, 45); //forest2

            this.groundUse.update(this.props.cMap.groundUse);
        }
    }, {
        key: '_initTexPopDensity',
        value: function _initTexPopDensity() {
            this.popDensity = new PaletteTexture(this.gl, 1);

            this.popDensity.appendPalette(0, 0, 0, 0); //out of country
            this.popDensity.appendPalette(255, 255, 128); // 0-20 h/km2
            this.popDensity.appendPalette(252, 233, 106); // 21-50 h/km2
            this.popDensity.appendPalette(250, 209, 85); // 51-100 h/km2
            this.popDensity.appendPalette(247, 190, 67); // 101-200 h/km2
            this.popDensity.appendPalette(242, 167, 46); // 201-500 h/km2
            this.popDensity.appendPalette(207, 122, 31); // 501-1k h/km2
            this.popDensity.appendPalette(173, 83, 19); // 1k1-2k h/km2
            this.popDensity.appendPalette(138, 46, 10); // 5k1-5k h/km2
            this.popDensity.appendPalette(107, 0, 0); // 5k1-50k h/km2

            this.popDensity.update(this.props.cMap.popDensity);
        }
    }, {
        key: '_initTexFlows',
        value: function _initTexFlows() {
            var self = this;
            fetch('hydro/flowdisplay.bin').then(function (response) {
                return response.arrayBuffer();
            }).then(function (waterData) {
                self.water = new PaletteTexture(self.gl, 1);
                self.water.appendPalette(0, 0, 255, 0); // j'ai  presque honte
                for (var i = 1; i < 256; i++) {
                    self.water.appendPalette(100, 140, 246, i);
                }var arr = new Uint8Array(waterData);
                self.water.update(arr);
            }).catch(function (e) {
                alert('prob load water ' + e);
            });
        }
    }, {
        key: '_initWindPowDens',
        value: function _initWindPowDens() {
            this.windPowDensAt50 = new PaletteTexture(this.gl, 1);

            this.windPowDensAt50.appendPalette(255, 255, 255);
            for (var i = 0; i < 2; i++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(197, 233, 250);
            for (var _i = 0; _i < 2; _i++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(178, 226, 249);
            for (var _i2 = 0; _i2 < 2; _i2++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(141, 204, 238);
            for (var _i3 = 0; _i3 < 2; _i3++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(123, 187, 229);
            for (var _i4 = 0; _i4 < 2; _i4++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(106, 173, 220);
            for (var _i5 = 0; _i5 < 2; _i5++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(90, 158, 212);
            for (var _i6 = 0; _i6 < 2; _i6++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(72, 142, 202);
            for (var _i7 = 0; _i7 < 3; _i7++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(72, 150, 173);
            for (var _i8 = 0; _i8 < 2; _i8++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(72, 158, 148);
            for (var _i9 = 0; _i9 < 2; _i9++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(73, 165, 124);
            for (var _i10 = 0; _i10 < 2; _i10++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(73, 173, 99);
            for (var _i11 = 0; _i11 < 2; _i11++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(73, 181, 70);
            for (var _i12 = 0; _i12 < 2; _i12++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(111, 192, 75);
            for (var _i13 = 0; _i13 < 2; _i13++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(145, 202, 79);
            for (var _i14 = 0; _i14 < 2; _i14++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(178, 211, 83);
            for (var _i15 = 0; _i15 < 3; _i15++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(212, 221, 87);
            for (var _i16 = 0; _i16 < 5; _i16++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(250, 232, 92);
            for (var _i17 = 0; _i17 < 5; _i17++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(249, 208, 82);
            for (var _i18 = 0; _i18 < 5; _i18++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(248, 184, 73);
            for (var _i19 = 0; _i19 < 6; _i19++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(247, 160, 63);
            for (var _i20 = 0; _i20 < 5; _i20++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(246, 137, 53);
            for (var _i21 = 0; _i21 < 5; _i21++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(245, 106, 41);
            for (var _i22 = 0; _i22 < 5; _i22++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(238, 92, 41);
            for (var _i23 = 0; _i23 < 6; _i23++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(232, 78, 41);
            for (var _i24 = 0; _i24 < 5; _i24++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(226, 63, 40);
            for (var _i25 = 0; _i25 < 5; _i25++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(211, 31, 40);
            for (var _i26 = 0; _i26 < 12; _i26++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(199, 35, 52);
            for (var _i27 = 0; _i27 < 11; _i27++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(188, 39, 65);
            for (var _i28 = 0; _i28 < 12; _i28++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(176, 43, 77);
            for (var _i29 = 0; _i29 < 11; _i29++) {
                this.windPowDensAt50.appendPalette(0, 0, 0, 0);
            }this.windPowDensAt50.appendPalette(165, 47, 90);

            this.windPowDensAt50.update(this.props.cMap.windPowDens.at50);
        }
    }]);

    return MapView;
}(React.Component);

export default MapView;


function createShader(gl, sourceCode, type) {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return shader;
}

function createProgram(gl, src, attribs) {
    var program = gl.createProgram();

    // Attach pre-existing shaders
    gl.attachShader(program, createShader(gl, src[0], gl.VERTEX_SHADER));
    gl.attachShader(program, createShader(gl, src[1], gl.FRAGMENT_SHADER));

    gl.bindAttribLocation(program, 0, 'a_position');

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return program;
}