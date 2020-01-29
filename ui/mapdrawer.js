import PaletteTexture from './palettetexture.js';


export default class MapDrawer{
    currentShowBase = 'groundUse';//or popDensity or windPowDens

    currentShowGrid = {
        'energyGrid':true,
        'flows':false,
    };

    constructor(arg){
        //array of positions of ponctual stuff (nuke, ccgt, ...). format : type, pos, and node (DOM node)
        this.items = [];

    		let cTop = $('<canvas width="1374" height="1183"></canvas>');
    		cTop.css({
    		  'z-index': 99, position: 'fixed'
    		});
    		$('#dMap').append(cTop);

    		this.ctxTop = cTop[0].getContext("2d");
        this.ctxTop.globalAlpha = 0.6;

        this._setGridLayerCheckbox();

        this.c = $('<canvas id="wololo" width="1374" height="1183"></canvas>');
        this.c.css({
            'z-index':10,
            position: 'fixed',
        });
        $('#dMap').append(this.c);

        this.gl = this.c[0].getContext("webgl", { alpha: false });

    		this.gl = this.c[0].getContext("webgl", { alpha: false });

        this._createProg();


        this.energySrc = arg.energy;
    		this.groundUseSrc = arg.groundUse;
        this.popDensitySrc = arg.popDensity;
        this.windPowDensSrcs = arg.windPowDens;//note : dic of {at50: array, at100: array, ...}
    		this._initTextures();



        //represent the nursor for nuke
        this._itemCursorNode = $('<img src="res/icons/nuke.png" ' +
            ' class="scaleInvariant energyRelated" width="24px"/>');
        this._itemCursorNode.css('display', 'none');
        $('#dMap').append(this._itemCursorNode);

        this.currentCursor = null;

        this.draw();

        this._initEvents();
    } // END OF MapDrawer.constructor()

    /** @brief draw the currenty visible layers.
    @note if nuke cursor, draw flows
    */
    draw(){
        let gl = this.gl;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.clearColor(1, 1, 1, 1);
        this.clear();

        this._drawTex(this[this.currentShowBase]);

        if(this.currentShowGrid.energyGrid)
            this._drawTex(this.energy);

        if((this.currentCursor == 'nuke' || this.currentCursor == 'ccgt' || this.currentCursor == 'fusion'
            || this.currentShowGrid.flows) && this.water)
                this._drawTex(this.water);
    }

    /** @brief update the given layer*/
    update(layerName){
        if(this[layerName+'Src'] === undefined)
            throw 'olala';
        // this.energy.update(this.energySrc);
        this[layerName].update(this[layerName+'Src']);
    }

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
    /// radius can be ommited
    drawCursor(type, pos, radius){
      if(type == 'pv' || type == 'battery' || type == 'wind'){
        const ctx = this.ctxTop;
        ctx.clearRect(0, 0,
            this.ctxTop.canvas.width,
            this.ctxTop.canvas.height);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2*Math.PI, true);
        ctx.fill();

      }
      else if(type == 'nuke' || type == 'ccgt' || type == 'fusion'){
        this._itemCursorNode.css({
            top:pos.y-15,
            left:pos.x - 12,
            display: 'block',
        });
      }
      else {
        throw 'to do';
      }

      //cursor type changed
      if(this.currentCursor != type){
        this.currentCursor = type;

        this._itemCursorNode.attr('src', 'res/icons/' + type + '.png');

        this.draw();
      }
    }

    clearCursor(){
        this.currentCursor = null;
        const ctx = this.ctxTop;
        ctx.clearRect(0, 0,
            ctx.canvas.width,
            ctx.canvas.height);
        //clear nuke cursor
        this._itemCursorNode.css({ display: 'none'});
        this.draw();
    }

    addItem(type, pos){
        if(type != 'nuke' && type != 'ccgt' && type != 'fusion')
            throw 'to do';

        let node = $('<img src="res/icons/' + type + '.png" '
                    + 'class="scaleInvariant energyRelated" width="24px"/>');
        node.css({top:pos.y-15, left:pos.x - 12});
        $('#dMap').append(node);

        this.items.push({type: type, pos:pos, node:node});
    }

    rmItem(type, pos){
        if(type != 'nuke' && type != 'ccgt')
            throw 'to do';

        let id = this.items.findIndex(v => v.type === type && v.pos.x === pos.x
            && v.pos.y === pos.y);

        this.items[id].node.remove(); //rm from html
        this.items.splice(id, 1);
    }

    //call
    on(eventType, callback){
        if(this._eventCallback[eventType] !== null)
            throw 'un seul a la fois';

        this._eventCallback[eventType] = callback;
    }


    _initEvents(){
        this._eventCallback = {click:null, pointerleave:null,mousemove:null};

        let self = this;
        $(function(){
            //on click on the grid
            $('#dCentralArea').on('click', function(){
                if($(this).data('moving'))
                    return;
                self._eventCallback['click']();
            });

            $(self.ctxTop.canvas).on('pointerleave', function(){
              self._eventCallback['pointerleave']();
            });

            $(self.ctxTop.canvas).on('mousemove', function(evt){
              self._eventCallback['mousemove'](evt);
            });
        });
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

    clear(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    _drawTex(paletteTexture){
        let gl = this.gl; //shortcut

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, paletteTexture.texture);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, paletteTexture.palette.tex);

        gl.useProgram(this.prog);
        gl.uniform1i(this.imageLoc, 0);
        gl.uniform1i(this.paletteLoc, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }


    _setGridLayerCheckbox() {
        let grid = this;
        let bases = ['groundUse', 'popDensity', 'windPowDensAt50'];
        let name2icon = {
            'groundUse':'groundUse.jpg',
            'popDensity':'pop.png',
            'windPowDensAt50':'windbis.jpeg',
            'energyGrid':'electricEnergy.png',
            'flows':'flows.png',
        }
        // // RADIO Btn
        // bases.forEach((m) => {
        //     let radiobutton = $('<label><input type="radio" name="showBase"' +
        //         ' value="'+ m + '"' +
        //         (this.currentShowBase == m ? 'checked':'') + '> ' +
        //         m + '</label><br>');
        //     $('#gridLayers').append(radiobutton);
        // });
        //
        // $('#gridLayers input:radio').on('change',
        // function() {
        //     grid.currentShowBase = $(this).val();
        //     grid.draw();
        // });

        let setFilter = (m, grey) => $(name2id(m)).css({
            filter: grey?'grayscale(100%)':'none'
        });
        let name2id = name => '#MapLayerButton'+name;
        // MAP Btn
        let setPos = (m, i, yOffser=20) => {
            $(name2id(m)).css({
                top: (yOffser+20+35*i)+'px',
                left: $('body').width() - $('#dRightDock').width() -32 -10,
            });
        }

        let showAllBases = selected => {
            bases.forEach(m => setFilter(m, m !== selected))
            grid.currentShowBase = selected;
            grid.draw();
        }

        bases.forEach((m,i) => {
            let imbutton = $('<img src="res/icons/'+name2icon[m]+
            '" id="'+name2id(m).substr(1)+'" title="'+m+'" class="mapButton" />');
            imbutton.on('click',e => showAllBases(e.currentTarget.title));
            $('#MapLayers').append(imbutton);
            setPos(m,i);
            setFilter(m, m !== grid.currentShowBase)
        });


        let layers = ['energyGrid', 'flows'];
        // // CHECKBOX
        // layers.forEach((m) => {
        //     let checkbox = $('<label>' + '<input type="checkbox"'+
        //         'name="' + m + '"' + ' value="'+ m + '"' +
        //         (this.currentShowGrid[m] ? 'checked':'') + '> ' +
        //         m + '</label><br>');
        //     $('#gridLayers').append(checkbox);
        // });
        //
        //
        // $('#gridLayers input:checkbox').on('change',
        // function() {
        //     grid.currentShowGrid[$(this).val()] = $(this).is(':checked');
        //     grid.draw();
        //     if($(this).val() == 'energyGrid'){
        //         $('.energyRelated').css({
        //             'opacity': $(this).is(':checked') ? 1.0: 0,
        //         });
        //     }
        // });
        layers.forEach((m,i) => {
            let imbutton = $('<img src="res/icons/'+name2icon[m]+
            '" id="'+name2id(m).substr(1)+'" title="'+m+'" class="mapButton" />');
            imbutton.on('click',e => {
                grid.currentShowGrid[m] = !grid.currentShowGrid[m];
                grid.draw();
                setFilter(m, !grid.currentShowGrid[m])
            });
            $('#MapLayers').append(imbutton);
            setPos(m,i,bases.length*35+50+10*i);
            setFilter(m, !grid.currentShowGrid[m])
        });
    }

    _nrg2color(nrj, year){
        if(nrj == 'pv'){
            return {red:0, green:year-2000, blue:250, alpha:150};
        }
        return {red:255, green:255, blue:255, alpha:100};
    }

};




let mousePos = {x: 0, y:0};
let transform = {x: -0, y: -0, scale:0.64};
$('#dMap').css('transform','scale(' + transform.scale + ') ' +
                    'translate(' + transform.x + 'px,' + transform.y + 'px)');

let dCentral = $("#dCentralArea");
dCentral.data('moving', false);

/// view control facilities----------------------------------------------------
export function enableAreaMoving(){
    dCentral.on("wheel", onWheel);
    dCentral.on("mousedown", onMouseDown);
    $('body').on("mouseup", onMouseUp);
}

export function disableAreaMoving(){
    dCentral.off("wheel", onWheel);
    dCentral.off("mousedown", onMouseDown);
    $('body').off("mouseup", onMouseUp);
}

function onWheel(e){
    let curX = e.originalEvent.pageX - dCentral.offset().left,
        curY = e.originalEvent.pageY - dCentral.offset().top;

    let origin = {
        x: (curX  / transform.scale- transform.x),
        y: (curY  / transform.scale- transform.y)
    };

    if(e.originalEvent.deltaY > 0){
        transform.scale *= 0.8;
    }else{
        transform.scale /= 0.8;
    }

    //bounds
    transform.scale = Math.max(transform.scale, Math.pow(0.8, 4)); //unzoom
    transform.scale = Math.min(transform.scale, Math.pow(1/0.8, 8));//zoom

    transform.x = curX / transform.scale - origin.x;
    transform.y = curY / transform.scale - origin.y;


    $('#dMap').css('transform', 'scale(' + transform.scale + ') ' +
                    'translate(' + transform.x + 'px,' + transform.y + 'px)');
    $('.scaleInvariant').css('transform', 'scale(' + (1/transform.scale) +')');
}

function onMouseDown(e){
    mousePos.x = e.screenX;
    mousePos.y = e.screenY;

    $('body').mousemove(function(e){
        transform.x += (e.screenX - mousePos.x) / transform.scale;
        transform.y += (e.screenY - mousePos.y) / transform.scale;

        mousePos.x = e.screenX;
        mousePos.y = e.screenY;
        dCentral.data('moving', true);

        $('#dMap').css('transform', 'scale(' + transform.scale + ') ' +
                    'translate(' + transform.x + 'px,' + transform.y + 'px)');
    });
}
function onMouseUp(e){
    setTimeout(() => dCentral.data('moving', false), 1);
    $('body').off('mousemove');
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
