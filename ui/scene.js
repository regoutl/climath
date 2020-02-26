

import {tr} from '../tr/tr.js';
import PaletteTexture from './palettetexture.js';

function isCentral(type){
    return type == 'nuke' || type == 'ccgt' || type == 'fusion';
}

let curForType = {
    ccgt: 0,
    nuke: 1,
    fusion: 2,
    pv: 3,
    wind: 3,
    battery: 3,
};

/** @brief this class is only responsible for the drawing of the map
@details the idea here is that there is no need to use react for map darwing as
there is no dom manipulation.

example usage :

let s = new Scene

s.setMap(map)
s.init(canvas)

s.draw(...)
 */
export default class Scene{
    constructor(){

        //array of positions of ponctual stuff (nuke, ccgt, ...). format : type, pos
        this.items = [];


        this.gl = null;

        this.cursor = {
            pos: {x: 0, y: 0},
            type: undefined,
            radius: null
        };
    }

    //should be called once, with the valid canvas
    init(canvas){
        if(this.gl){
            console.log('Wrining :no second init');
//            return;
        }

        if(this.cMap === undefined){
            console.log('need to call setMap before init');
        }

        this.gl = canvas.getContext("webgl", { alpha: false });

        let gl = this.gl;

        this.instancing = gl.getExtension("ANGLE_instanced_arrays");

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.clearColor(1, 1, 1, 1);

        this._initMapShader();
        this._initTextures();
        this._initPointShader();
    }

    //shoud be called with the map
    setMap(cMap){
        this.cMap = cMap;
    }



    /** @brief update the given layer*/
    update(layerName){
        if(layerName != 'energy')
            throw 'todo';
        this.energy.update(this.cMap.energyGrid);
    }

    // conceptually, mapView stores a Map (id, color)
    // this function return the next free id and maps it to its coresponding color
    appendEnergyPalette(type){
      let r, g, b, a = 255;
      if(type == 'pv'){r = 70; g = 85; b = 130;}
      else if(type == 'battery'){r = 0; g = 255; b = 250;}
      else if(type == 'wind'){r = 255; g = 255; b = 250; a = 128}
      else {
        throw 'todo';
      }

      return this.energy.appendPalette(r, g, b, a);
    }

    /// adds a point item at the given position
    addItem(type, pos){
        if(!isCentral(type))
            throw 'not possible';

        this.items.push({type: type, pos:pos});
        //update gl
        this._updatePtsBuf();
        // this.draw();
    }

    //removes a central
    rmItem(type, pos){
        if(!isCentral(type))
            throw 'not possible';

        let id = this.items.findIndex(v => v.type === type && v.pos.x === pos.x
            && v.pos.y === pos.y);

        this.items.splice(id, 1);

        //update gl
        this._updatePtsBuf();
        this.draw();
    }





    /** @brief draw the currenty visible layers.
    @note if nuke cursor, draw flows
    */
    draw(transform, base, showEnergy, showFlows){
        requestAnimationFrame(() => {
            let gl = this.gl;
            if(gl === undefined)
                return;

            /// handle any canvas resize event
            this._checkSize();


            //compute the transformation matrix
            let unitSquareToPix = stMat.scale(1374, 1183);
            let pixTrans = stMat.mul(stMat.scale(transform.scale, transform.scale),
                                    stMat.translate(transform.x, transform.y));
            let pixToNDC = stMat.mul( stMat.translate(-1, 1),
                                        stMat.scale(2 / gl.canvas.width, -2 / gl.canvas.height));


            this.mvProj = stMat.mul(stMat.mul(pixToNDC, pixTrans), unitSquareToPix);


            //clear canvas
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            //draw base
            this._drawTex(this[base]);

            //draw energy grid if toogled
            if(showEnergy)
                this._drawTex(this.energy);

            //draw flows if toogled or user is building a central
            if((isCentral(this.cursor.type)
                || showFlows) && this.water)
                    this._drawTex(this.water);


            //point positions are in pixels already
            this.mvProj = stMat.mul(pixToNDC, pixTrans);
            //draw all the point items
            this._drawPoints();

            this.mvProj = stMat.mul(stMat.mul(pixToNDC, pixTrans), unitSquareToPix);
        });
    }



    //internal functions--------------------------------------------------------

    //check canvas siwe is the same as displayed size
    _checkSize(){
        // return;

        let gl = this.gl;
        let canvas = gl.canvas;
        // Lookup the size the browser is displaying the canvas.
        let displayWidth  =  window.innerWidth;
        let displayHeight =  window.innerHeight;


        // console.log(displayWidth, displayHeight);

        // Check if the canvas is not the same size.
        if (canvas.width  != displayWidth || canvas.height != displayHeight) {

            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;

            gl.viewport(0, 0, displayWidth, displayHeight);
        }
    }




    _drawTex(paletteTexture){
        let gl = this.gl; //shortcut

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, paletteTexture.texture);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, paletteTexture.palette.tex);


        gl.useProgram(this._mapShader);
        this.mvProj.uniform(gl, this._texmodelviewLoc);

        //send the points
            gl.enableVertexAttribArray(0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._mapVertBuffer);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        //bind the textures
            gl.uniform1i(this._imageLoc, 0);
            gl.uniform1i(this._paletteLoc, 1);
        //draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }




    _initMapShader(){
        let vert = `
        attribute vec4 a_position;
        varying vec2 v_texcoord;
        uniform mat3 texmodelview;

        void main() {
          gl_Position = vec4(vec3(texmodelview * vec3(a_position.xy, 1.0)).xy, 0.0, 1.0);

          v_texcoord = a_position.xy;
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


        this._mapShader = createProgram(gl, [vert, frag]);


        this._imageLoc = gl.getUniformLocation(this._mapShader, "u_image");
        this._paletteLoc = gl.getUniformLocation(this._mapShader, "u_palette");
        this._texmodelviewLoc = gl.getUniformLocation(this._mapShader, "texmodelview");

        // Setup a unit quad
        let positions = [
            1,  1,
            0,  1,
            0, 0,
            1,  1,
            0, 0,
            1, 0,
        ];
        this._mapVertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._mapVertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    }


    _initTextures(){
        this.energy = new PaletteTexture(this.gl, 2);
        this.energy.appendPalette(0, 0, 0, 0);//index 0 is transparent
        this.energy.update(this.cMap.energyGrid);

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

        this.groundUse.update(this.cMap.groundUse);
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

        this.popDensity.update(this.cMap.popDensity);

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

      this.windPowDensAt50.defaultGradiant(0, 162);
      this.windPowDensAt50.update(this.cMap.windPowDens.at50);
    }



    _initPointShader(){
        let vert = `
        //xy is center of the quad,  (px)
        //z  is texture index : 0 : ccgt, 1 nuke, 2 : fusion, 3 circle
        //w  is circle radius (px). ignored for cursor != circle.
        attribute vec4 a_position;
        //point coord in {0,1}^2
        attribute vec2 a_texcoord;



        varying float v_tex;         //passes a_position.z
        varying vec2 v_pointcoord;  //passes a_texcoord
        uniform mat3 texmodelview;  //transformation
        uniform vec4 overrideValue; //cursor info
        uniform vec2 invScreenSize; //1/screen.*


        void main() {
            v_pointcoord = a_texcoord; //pass the tex coord
            vec4 me = a_position;
            vec2 snormCoord = 2.0 * a_texcoord - vec2(1.0); //also coords, but range from -1 to 1

            if(a_position.x < 0.0){ //its an invalid x -> we know its the cursor -> replace it with cursor value
                me = overrideValue;

                if(overrideValue.z > 2.5){           //it is a round cursor : dynamic point size
                    v_tex = me.z;
                    gl_Position = vec4(
                            vec3(texmodelview * vec3(    //transformation
                                me.xy                    //square origin
                                + snormCoord * me.w // +/- radius
                                , 1.0)).xy,
                            0.0, 1.0);

                    return;
                }
            }

            v_tex = me.z;

            gl_Position = vec4(
                    vec3(texmodelview * vec3(me.xy, 1.0)).xy  //transformation of the position
                    + snormCoord*16.0*invScreenSize,         // +/- 16 pix
                0.0, 1.0);
        }
        `;

        let frag = `
        precision mediump float;
        varying float v_tex;
        varying vec2 v_pointcoord;
        uniform sampler2D u_image;

        void main() {
            vec2 offset = vec2(0.0);
            if(v_tex < 0.5){ //ccgt
                offset = vec2(0.0, 0.5);
            }
            else if(v_tex < 1.5){ //nuke
                offset = vec2(0.5);
            }
            else if(v_tex < 2.5){ //fusion
                offset = vec2(0.0);
            }
            else if(v_tex < 3.5){ // its a circle
                vec2 centered = v_pointcoord * 2.0 - vec2(1.0);
                if( dot(centered, centered) < 1.0)
                    gl_FragColor = vec4(0.5, 0.5, 0.5, 0.8);
                else
                    gl_FragColor = vec4(0.0);
                return;
            }

            gl_FragColor = texture2D(u_image, vec2(v_pointcoord * 0.5 + offset) * vec2(1.0, -1.0) + vec2(0.0, 1.0) );
            // gl_FragColor = texture2D(u_image, v_pointcoord  * vec2(1.0, -1.0) + vec2(0.0, 1.0) );
        }
        `;

        let gl = this.gl; //shortcut


        this._ptsShader = createProgram(gl, [vert, frag]);


        this._mvLocInPtsShader = gl.getUniformLocation(this._ptsShader, "texmodelview");
        this._cursorLocInPtsShader = gl.getUniformLocation(this._ptsShader, "overrideValue");
        this._texPtsLocInPtsShader = gl.getUniformLocation(this._ptsShader, "u_image");
        this._invScreenSizePtsLocInPtsShader = gl.getUniformLocation(this._ptsShader, "invScreenSize");

        this._updatePtsBuf();

        this._texPts = loadTexture(gl, 'res/icons/itemTex.png');



        //create the quad buf
        let texCoords = new Uint8Array([
            0, 0,
            0, 255,
            255, 0,

            255, 255,
            0, 255,
            255, 0,
        ]); // 1 quad = 2 tri = 6 pts
        this._quadBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    }

    //
    _updatePtsBuf(){
        let gl = this.gl; //shortcut


        let positions = new Float32Array(4*(this.items.length + 1)); //4 float per item + cursor

        positions[0] = -1; //x -> cursor so -1


        for(let i = 0; i < this.items.length; i++){
            positions[i*4 + 4 + 0] = this.items[i].pos.x; //x
            positions[i*4 + 4 + 1] = this.items[i].pos.y; //y

            positions[i*4  + 4 + 2] = curForType[this.items[i].type]; //z
        }


        this._ptsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._ptsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    }

    _drawPoints(){
        // return;
        let gl = this.gl; //shortcut

        //bind point sprites
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texPts);


        gl.useProgram(this._ptsShader);
        this.mvProj.uniform(gl, this._mvLocInPtsShader);
        gl.uniform2fv(this._invScreenSizePtsLocInPtsShader, [2.0/gl.canvas.width, 2.0/gl.canvas.height]); //no cursor : offset it


        if(!this.cursor.type || !this.cursor.pos)
            gl.uniform4fv(this._cursorLocInPtsShader, [-1000000, 0, 0, 0]); //no cursor : offset it
        else{
            gl.uniform4fv(this._cursorLocInPtsShader,
                [this.cursor.pos.x,
                    this.cursor.pos.y,
                    curForType[this.cursor.type],
                    this.cursor.radius]);
            // console.log(this.cursor.radius);
        }

        //send the pointstexmodelviewLoc
            gl.enableVertexAttribArray(0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._ptsBuffer);
            gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
            this.instancing.vertexAttribDivisorANGLE(0, 1);
            // this.instancing.vertexAttribDivisorANGLE(0, 0);

        //send the square
            gl.enableVertexAttribArray(1);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer);
            gl.vertexAttribPointer(
                1, //concern  VertexAttribArray 1
                2, //2 components
                gl.UNSIGNED_BYTE, //unsigned bytes each
                true,  //normalize them
                0, // no space between them
                0); //no offset at buffer beginning


        // //bind the textures
            gl.uniform1i(this._texPtsLocInPtsShader, 0);
        //     gl.uniform1i(this._paletteLoc, 1);
        //draw
            this.instancing.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, (this.items.length+1)); // each tile is 6 verdices

            this.instancing.vertexAttribDivisorANGLE(0, 0); //reset instancing
            gl.disableVertexAttribArray(1);
    }
}




/// scale translate matrix
class stMat{
    //identity
    constructor(){
        this.sx = 1.0;
        this.sy = 1.0;
        this.tx = 0.0;
        this.ty = 0.0;
    }

    static scale(scaleX, scaleY){
        let ans = new stMat;
        ans.sx = scaleX;
        ans.sy = scaleY;
        return ans;
    }

    static translate(x, y){
        let ans = new stMat;
        ans.tx = x;
        ans.ty = y;
        return ans;
    }

    /// return A*B
    static mul(A, B){
        if(!(A instanceof stMat) || !(B instanceof stMat))
            throw 'matrices only';

        let ans = new stMat;

        ans.sx = A.sx * B.sx;
        ans.sy = A.sy * B.sy;

        ans.tx = A.sx * B.tx + A.tx;
        ans.ty = A.sy * B.ty + A.ty;

        return ans;
    }

    uniform(gl, loc){
        gl.uniformMatrix3fv(loc, gl.FALSE, [this.sx, 0.0, 0, 0.0, this.sy, 0, this.tx, this.ty,  1]);
    }

    inverse(){
        let ans = new stMat;

        //(TS)-1 = S-1 T-1

        ans.sx = 1.0 / this.sx;
        ans.sy = 1.0 / this.sy;

        ans.tx = - ans.sx * this.tx;
        ans.ty = - ans.sy * this.ty;

        return ans;
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
    gl.bindAttribLocation(program, 1, 'a_texcoord');

    gl.linkProgram(program);

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
        const info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return program;
}



//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
