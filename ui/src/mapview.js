import {tr} from '../../tr/tr.js';
import MapLayers from './maplayers.js';
import PaletteTexture from './palettetexture.js';

function isCentral(type){
    return type == 'nuke' || type == 'ccgt' || type == 'fusion';
}

/* IMPORTANT : should never be re-mounted. (big perf cost + useless)
*/
export default class MapView extends React.Component{

    /* accepted props :
    mousemove : function(curPos)    -> called on mouse move && mouse leave  (then with undefined curPos)
    click : function(curPos)        -> called on click

    */
    constructor(props){
        //react
        super(props);

        this.state = {
            energyGrid:true,
            flows:false,
            base: 'groundUse'
        };

        this._toogleLayer = this._toogleLayer.bind(this);

        //drag ----------------------------------------------------
        this.draw = this.draw.bind(this);
        this.mousedown = this.onmousedown.bind(this);
        this.mousemove = this.onmousemove.bind(this);
        this.mouseup = this.onmouseup.bind(this);
        this.wheel = this.onwheel.bind(this);

        this.mouseleave = this.onmouseleave.bind(this);



        this.physMousePos = {x: 0, y:0}; // cursor pos (px) in window coord
        //transforms logical coord -> physical coord
        // physMousePos.* = (logicMousePos.* + translate) * scale
        this.transform = {x: -0, y: -0, scale:0.64};
        //is the mouse curently down
        this.isMouseDown = false;

        // content --------------------------------------------------

        //array of positions of ponctual stuff (nuke, ccgt, ...). format : type, pos
        this.items = [];

        //current cursor
        this.cursor = {
            type: null,   //will be str, (nuke| ccgt| fusion| pv| bat| wind)
            pos: {        //note : logical pos (not transformed)
                x: null,
                y: null
            },
            radius: null,
        };
    }




    /** @brief update the given layer*/
    update(layerName){
        throw 'todo';
        // if(this[layerName+'Src'] === undefined)
        //     throw 'olala';
        // // this.energy.update(this.energySrc);
        // this[layerName].update(this[layerName+'Src']);
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

    /// @brief draws a cursor of the given type at the given location.
    /// radius can be ommited for centrals
    drawCursor(type, pos, radius){
        if(isCentral(type)){
            if(isCentral(this.cursor.type)){//life is good - we were already a central
                this.items[this.items.length-1] = {pos: pos, type:type};
                // this.items[this.items.length-1].type = pos; //will have to se the type
            }
            else{ //new central
                this.items.push({pos: pos, type:type});
            }
            this._updatePtsBuf();
        }
        else if(isCentral(this.cursor.type)){//we where a central, just remove it
            this.items.pop();
            this._updatePtsBuf();
        }

        this.cursor.type = type;
        this.cursor.pos = pos;
        this.cursor.radius = radius;

        this.draw();
    }

    clearCursor(){
        this.drawCursor(null, null, null);
    }


    /// adds a point item at the given position
    /// NOTE : tmp ; should be a red square. NOT TESTED
    addItem(type, pos){
        if(!isCentral(type))
            throw 'not possible';

        this.items.push({type: type, pos:pos});
        //update gl
        this._updatePtsBuf();
        this.draw();
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



    //internal functions--------------------------------------------------------

    _toogleLayer(name){
        if(['energyGrid', 'flows'].includes(name))
            this.setState((state) => {
                return {[name]: !state[name]};
            });
        else
            this.setState({base: name});

    }

    componentDidMount(){
        let canvas = this.refs.mapCanvas;

        this.gl = canvas.getContext("webgl", { alpha: false });

        this._initMapShader();
        this._initTextures();
        this._initPointShader();


        console.log("mount mapview !");

        this.draw();
        window.addEventListener('resize', this.draw);


        window.addEventListener('mousedown', this.mousedown);
        window.addEventListener('mousemove', this.mousemove);
        window.addEventListener('mouseup', this.mouseup);
        window.addEventListener('wheel', this.wheel);
    }

    render(){
        this.draw();




        return (<div id="dMapBox">
                    <MapLayers
                        base={this.state.base}
                        energyGrid={this.state.energyGrid}
                        flows={this.state.flows}
                        setVisible={this._toogleLayer} />

                    <canvas
                        ref="mapCanvas"
                        onMouseLeave={this.mouseleave}
                    >
                        {tr("Your browser is not supported")}
                    </canvas>
                </div>);
    }



    /** @brief draw the currenty visible layers.
    @note if nuke cursor, draw flows
    */
    draw(){
        requestAnimationFrame(() => {
            let gl = this.gl;
            if(gl === undefined)
                return;

            this.checkSize();


            // let ndcToPix = stMat.mul(stMat.scale(window.innerWidth, window.innerHeight),
            //                             stMat.mul(stMat.translate(0.5, 0.5), stMat.scale(0.5, -0.5)));

            // console.log('draw');
            let unitSquareToPix = stMat.scale(1374, 1183);

            let pixTrans = stMat.mul(stMat.scale(this.transform.scale, this.transform.scale),
                                    stMat.translate(this.transform.x, this.transform.y));

            let pixToNDC = stMat.mul( stMat.translate(-1, 1),
                                        stMat.scale(2 / gl.canvas.width, -2 / gl.canvas.height));


            this.mvProj = stMat.mul(stMat.mul(pixToNDC, pixTrans), unitSquareToPix);
            // console.log(this.mvProj);



            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.clearColor(1, 1, 1, 1);
            this.clear();

            this._drawTex(this[this.state.base]);

            if(this.state.energyGrid)
                this._drawTex(this.energy);

            if((isCentral(this.cursor.type)
                || this.state.flows) && this.water)
                    this._drawTex(this.water);

            this._drawPoints();

            if(this.cursor.type !== null && !isCentral(this.cursor.type)){
                // this._drawAreaCursor();
            }
        });
    }

    clear(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }


    checkSize(){
        // return;

        let gl = this.gl;
        let canvas = gl.canvas;
        // Lookup the size the browser is displaying the canvas.
        let displayWidth  =  window.innerWidth;
        let displayHeight =  window.innerWidth;

        // Check if the canvas is not the same size.
        if (canvas.width  != displayWidth || canvas.height != displayHeight) {
            // console.log('resize', displayHeight);

            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;

            gl.viewport(0, 0, canvas.width, canvas.height);

            // let ratio;
            // if(displayWidth > displayHeight){
            //     ratio = stMat.scale(displayWidth/displayHeight, 1);
            // }
            // else {
            //     ratio = stMat.scale(1,displayHeight/displayWidth);
            // }
            //
            // this.proj = stMat.mul(ratio, stMat.scale(1/window.innerWidth, 1/window.innerHeight));
        }
    }



    onmousedown(e){
        if(e.target != this.refs.mapCanvas)
            return;

        this.isMouseDown = true;
        this.physMousePos = {x:e.pageX , y:e.pageY};
    }
    onmousemove(e){
        // if(e.target != this.refs.mapCanvas)
        //     return;

        if(this.isMouseDown){

            this.transform.x += (e.pageX - this.physMousePos.x) / this.transform.scale;
            this.transform.y += (e.pageY - this.physMousePos.y) / this.transform.scale;

            this.physMousePos.x = e.pageX;
            this.physMousePos.y = e.pageY;


            this.draw();
        }
        else {
            let rawPos = {x:e.pageX, y : e.pageY};

            let transformedPos = {
                x: Math.round((rawPos.x / this.transform.scale) - this.transform.x),
                y: Math.round((rawPos.y / this.transform.scale) - this.transform.y),
            };

            this.props.mousemove(transformedPos);
        }
    }
    onmouseup(e){
        this.isMouseDown = false;

        if(e.target != this.refs.mapCanvas)
            return;

    }

    onwheel(e){
        let curX = e.pageX ,
            curY = e.pageY ;

        let origin = {
            x: (curX  / this.transform.scale- this.transform.x),
            y: (curY  / this.transform.scale- this.transform.y)
        };

        if(e.deltaY > 0){
            this.transform.scale *= 0.8;
        }else{
            this.transform.scale /= 0.8;
        }

        //bounds
        this.transform.scale = Math.max(this.transform.scale, Math.pow(0.8, 4)); //unzoom
        this.transform.scale = Math.min(this.transform.scale, Math.pow(1/0.8, 8));//zoom

        this.transform.x = curX / this.transform.scale - origin.x;
        this.transform.y = curY / this.transform.scale - origin.y;

        this.draw();
    }

    //called when cursor leaves direct contact with central area
    onmouseleave(e){
        this.props.mousemove(undefined);
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
        this.energy.update(this.props.cMap.energyGrid);

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

        this.groundUse.update(this.props.cMap.groundUse);
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

        this.popDensity.update(this.props.cMap.popDensity);

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

      this.windPowDensAt50.update(this.props.cMap.windPowDens.at50);
    }



    _initPointShader(){
        let vert = `
        attribute vec4 a_position;
        varying vec2 v_texcoord;
        uniform mat3 texmodelview;

        void main() {
          gl_Position = vec4(vec3(texmodelview * vec3(a_position.xy, 1.0)).xy, 0.0, 1.0);

          v_texcoord = vec2(0.5, 0.5); //whatever
          gl_PointSize = 64.0;
        }
        `;

        let frag = `
        precision mediump float;
        varying vec2 v_texcoord;
        uniform sampler2D u_image;

        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        `;

        let gl = this.gl; //shortcut


        this._ptsShader = createProgram(gl, [vert, frag]);


        this._mvLocInPtsShader = gl.getUniformLocation(this._ptsShader, "texmodelview");
        // this.imageLoc = gl.getUniformLocation(this.ptsShader, "u_image");

        this._updatePtsBuf();
    }

    //
    _updatePtsBuf(){
        let gl = this.gl; //shortcut
        // Setup a unit quad
        let positions = new Float32Array(2*this.items.length);
        for(let i = 0; i < this.items.length; i++){
            position[2*i+0] = this.items[i].pos.x;
            position[2*i+1] = this.items[i].pos.y;
        }


        this._ptsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._ptsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    }

    _drawPoints(){
        let gl = this.gl; //shortcut

        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, paletteTexture.texture);
        //
        // gl.activeTexture(gl.TEXTURE1);
        // gl.bindTexture(gl.TEXTURE_2D, paletteTexture.palette.tex);


        gl.useProgram(this._ptsShader);
        this.mvProj.uniform(gl, this._mvLocInPtsShader);

        //send the pointstexmodelviewLoc
            gl.enableVertexAttribArray(0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._ptsBuffer);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        // //bind the textures
        //     gl.uniform1i(this._imageLoc, 0);
        //     gl.uniform1i(this._paletteLoc, 1);
        //draw
            gl.drawArrays(gl.POINTS, 0, this.items.length); //todo ; not 1
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

    gl.linkProgram(program);

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
        const info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return program;
}
