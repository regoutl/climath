import PaletteTexture from './palettetexture.js';

function createShader (gl, sourceCode, type) {
  // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  var shader = gl.createShader( type );
  gl.shaderSource( shader, sourceCode );
  gl.compileShader( shader );

  if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
    var info = gl.getShaderInfoLog( shader );
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
    var info = gl.getProgramInfoLog(program);
    throw 'Could not compile WebGL program. \n\n' + info;
  }
    return program;
}


/*function newCanvas(name, im, zindex, visible){
  let yo;
  let canvas = $(
    '<canvas id="'+name
                          + '" width="1374" height="1183"></canvas>');
  let ctx = canvas[0].getContext("2d");
  ctx.drawImage(im, 0, 0);
  canvas.imData = ctx.getImageData(0, 0, 1374, 1183);
  canvas.pixVal = new Uint32Array(
                              canvas.imData.data.buffer);
  ctx.clearRect(0, 0,
      canvas[0].width,
      canvas[0].height);
  ctx.putImageData(canvas.imData,0,0);
  canvas['Im'] = im;
  canvas.css({
    'z-index':zindex,
    visibility: (visible?'visible':'hidden'),
    position: 'fixed'});
  $('#dMovable').append(canvas);
  return canvas;
}
*/

export default class MapDrawer{
  currentShowGrid = {'groundUse':true, 'energyGrid':true};

  constructor(arg){
    this.canvas = {
        top: $('#top'),
    }

    this.canvas.top[0].getContext("2d").globalAlpha = 0.6;


    this.setGridLayerCheckbox();

    this.c = $('<canvas id="wololo" width="1374" height="1183"></canvas>');
    this.c.css({
      'z-index':10,
      position: 'fixed'});
    $('#dMovable').append(this.c);

    this.gl = this.c[0].getContext("webgl");

    this._createProg();


    this.energy = new PaletteTexture(this.gl, 2);
    this.energySrc = arg.energy;
    this.energy.appendPalette(0, 0, 0, 0);//index 0 is transparent
    this.energy.update(this.energySrc);

    this.groundUse = new PaletteTexture(this.gl, 1);
    this.groundUseSrc = arg.groundUse;

    this.groundUse.appendPalette(0, 0, 0, 0); //exterior
    this.groundUse.appendPalette(120, 120, 120);//airport
    this.groundUse.appendPalette(114, 122, 74/*183, 191, 154*/);//field
    this.groundUse.appendPalette(59, 85, 48/*52, 76, 45*/); //forest
    this.groundUse.appendPalette(120, 120, 97); //indus
    this.groundUse.appendPalette(137, 141, 131); // city
    this.groundUse.appendPalette(89, 109, 44/*120, 124, 74*/); //field
    this.groundUse.appendPalette(100, 140, 146);//water
    this.groundUse.appendPalette(52, 76, 45); //forest2
    this.groundUse.appendPalette(0, 0, 0); //?

    this.groundUse.update(this.groundUseSrc);

    this.draw();
  }

  draw(){
    let gl = this.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.clear();
    if(this.currentShowGrid.groundUse)
      this._drawTex(this.groundUse);
    if(this.currentShowGrid.energyGrid)
      this._drawTex(this.energy);
  }

  update(layerName){
    if(layerName != 'energy')
      throw 'olala';
    this.energy.update(this.energySrc);
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
        palXY.y = 0.0;
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


  setGridLayerCheckbox() {
    let layers = ['groundUse', 'energyGrid'];

    let grid = this;
    layers.forEach((m) => {
        let checkbox = $('<label>' + '<input type="checkbox"'+
            'name="' + m + '"' + ' value="'+ m + '"' +
            (this.currentShowGrid[m] ? 'checked':'') + '> ' +
            m + '</label><br>');
        $('#gridLayers').append(checkbox);
        $('#gridLayers input:checkbox').on('change',
        function() { grid.currentShowGrid[$(this).val()] = $(this).is(':checked');  grid.draw();});
    });
  }

  _nrg2color(nrj, year){
      if(nrj == 'pv'){
          return {red:0, green:year-2000, blue:250, alpha:150};
      }
      return {red:255, green:255, blue:255, alpha:100};
  }

  drawCircle(x,y,radius) {
      const ctx = this.canvas.top[0].getContext('2d');
      ctx.clearRect(0, 0,
          this.canvas.top[0].width,
          this.canvas.top[0].height);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2*Math.PI, true);
      ctx.fill();
  }

};
