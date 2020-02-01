import {tr} from '../../tr/tr.js';
import MapLayers from './maplayers.js';
import PaletteTexture from './palettetexture.js';


export default class MapView extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            energyGrid:true,
            flows:false,
            base: 'groundUse'
        };

        this.toogleLayer = this.toogleLayer.bind(this);
    }

    toogleLayer(name){
        if(['energyGrid', 'flows'].includes(name))
            this.setState((state) => {
                return {[name]: !state[name]};
            });
        else
            this.setState({base: name});

    }

    componentDidMount(){
        const canvas = this.refs.mapCanvas;
        this.gl = canvas.getContext("webgl", { alpha: false });

        this._createProg();
        // this._initTextures();
    }

    render(){
        if(this.gl){


        }




        return (<div id="dMapBox">
                    <MapLayers
                        base={this.state.base}
                        energyGrid={this.state.energyGrid}
                        flows={this.state.flows}
                        setVisible={this.toogleLayer} />

                    <canvas
                        ref="mapCanvas"
                    >
                        {tr("Your browser is not supported")}
                    </canvas>
                </div>);
    }





    _createProg(){
        let vert = `
        attribute vec4 a_position;
        varying vec2 v_texcoord;
        void main() {
          gl_Position = a_position;

          // assuming a unit quad for position we
          // can just use that for texcoords. Flip Y though so we get the top at 0
          v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;
        }
        `;

        let frag = `
        precision mediump float;
        varying vec2 v_texcoord;
        uniform sampler2D u_image;
        uniform sampler2D u_palette;

        void main() {
            vec2 palXY = texture2D(u_image, v_texcoord).ra * 255.0;
            gl_FragColor = texture2D(u_palette, (palXY + vec2(0.5)) / 256.0);
        }
        `;

        let gl = this.gl; //shortcut


        this.prog = createProgram(gl, [vert, frag]);


        this.imageLoc = gl.getUniformLocation(this.prog, "u_image");
        this.paletteLoc = gl.getUniformLocation(this.prog, "u_palette");

        // Setup a unit quad
        let positions = [
             1,  1,
            -1,  1,
            -1, -1,
             1,  1,
            -1, -1,
             1, -1,
        ];
        this.vertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    }


    _initTextures(){
        this.energy = new PaletteTexture(this.gl, 2);
        this.energy.appendPalette(0, 0, 0, 0);//index 0 is transparent
        this.energy.update(this.energySrc);

        this._initTexGroundUse();
        this._initTexPopDensity();
        this._initTexFlows();
        this._initWindPowDens();
    }

    _initTexGroundUse(){
        this.groundUse = new PaletteTexture(this.gl, 1);

        this.groundUse.appendPalette(0, 0, 0, 0); //exterior
        this.groundUse.appendPalette(120, 120, 120);//airport
        this.groundUse.appendPalette(100, 140, 146);//water
        this.groundUse.appendPalette(59, 85, 48/*52, 76, 45*/); //forest
        this.groundUse.appendPalette(120, 120, 97); //indus
        this.groundUse.appendPalette(114, 122, 74/*183, 191, 154*/);//field
        this.groundUse.appendPalette(89, 109, 44/*120, 124, 74*/); //field
        this.groundUse.appendPalette(114, 122, 74); //?
        this.groundUse.appendPalette(137, 141, 131); // city
        this.groundUse.appendPalette(52, 76, 45); //forest2

        this.groundUse.update(this.groundUseSrc);
    }
    _initTexPopDensity(){
        this.popDensity = new PaletteTexture(this.gl, 1);

        this.popDensity.appendPalette(0,0,0,0);       //out of country
        this.popDensity.appendPalette(255, 255, 128); // 0-20 h/km2
        this.popDensity.appendPalette(252, 233, 106); // 21-50 h/km2
        this.popDensity.appendPalette(250, 209, 85 ); // 51-100 h/km2
        this.popDensity.appendPalette(247, 190, 67 ); // 101-200 h/km2
        this.popDensity.appendPalette(242, 167, 46 ); // 201-500 h/km2
        this.popDensity.appendPalette(207, 122, 31 ); // 501-1k h/km2
        this.popDensity.appendPalette(173, 83,  19 ); // 1k1-2k h/km2
        this.popDensity.appendPalette(138, 46,  10 ); // 5k1-5k h/km2
        this.popDensity.appendPalette(107,  0,   0 ); // 5k1-50k h/km2

        this.popDensity.update(this.popDensitySrc);

    }
    _initTexFlows(){
        let self = this;
        fetch('hydro/flowdisplay.bin')
        .then((response) => {return response.arrayBuffer();})
        .then((waterData) => {
            self.water = new PaletteTexture(self.gl, 1);
            self.water.appendPalette(0, 0, 255, 0); // j'ai  presque honte
            for(let i = 1; i < 256; i++)
                self.water.appendPalette(100, 140, 246, i);

            let arr= new Uint8Array(waterData);
            self.water.update(arr);
        })
        .catch((e)=>{
            alert('prob load water ' +e);
        });

    }
    _initWindPowDens(){
      this.windPowDensAt50 = new PaletteTexture(this.gl, 1);

      this.windPowDensAt50.appendPalette( 255 , 255 ,  255 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 197 , 233 ,  250 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 178 , 226 ,  249 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 141 , 204 ,  238 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 123 , 187 ,  229 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 106 , 173 ,  220 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 90 , 158 ,  212 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 72 , 142 ,  202 );
      for(let i =0; i< 3 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 72 , 150 ,  173 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 72 , 158 ,  148 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 73 , 165 ,  124 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 73 , 173 ,  99 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 73 , 181 ,  70 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 111 , 192 ,  75 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 145 , 202 ,  79 );
      for(let i =0; i< 2 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 178 , 211 ,  83 );
      for(let i =0; i< 3 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 212 , 221 ,  87 );
      for(let i =0; i< 5 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 250 , 232 ,  92 );
      for(let i =0; i< 5 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 249 , 208 ,  82 );
      for(let i =0; i< 5 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 248 , 184 ,  73 );
      for(let i =0; i< 6 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 247 , 160 ,  63 );
      for(let i =0; i< 5 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 246 , 137 ,  53 );
      for(let i =0; i< 5 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 245 , 106 ,  41 );
      for(let i =0; i< 5 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 238 , 92 ,  41 );
      for(let i =0; i< 6 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 232 , 78 ,  41 );
      for(let i =0; i< 5 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 226 , 63 ,  40 );
      for(let i =0; i< 5 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 211 , 31 ,  40 );
      for(let i =0; i< 12 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 199 , 35 ,  52 );
      for(let i =0; i< 11 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 188 , 39 ,  65 );
      for(let i =0; i< 12 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 176 , 43 ,  77 );
      for(let i =0; i< 11 ;i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);
      this.windPowDensAt50.appendPalette( 165 , 47 ,  90 );

      this.windPowDensAt50.update(this.windPowDensSrcs.at50);
    }
}








function createShader (gl, sourceCode, type) {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    let shader = gl.createShader( type );
    gl.shaderSource( shader, sourceCode );
    gl.compileShader( shader );

    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
        let info = gl.getShaderInfoLog( shader );
        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return shader;
}

function createProgram(gl, src, attribs){
    let program = gl.createProgram();

    // Attach pre-existing shaders
    gl.attachShader(program, createShader(gl, src[0], gl.VERTEX_SHADER));
    gl.attachShader(program,  createShader(gl, src[1], gl.FRAGMENT_SHADER));

    gl.bindAttribLocation(program, 0, 'a_position');

    gl.linkProgram(program);

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
        const info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return program;
}
