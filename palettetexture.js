
export default class PaletteTexture{
  constructor(gl, bytePerPix){
    this.bytePerPixel = bytePerPix;

    this.gl = gl;
    //energy tex
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    this.palette = {};
    //energy palette
    this.palette.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.palette.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


    let maxPalette = 256;
    if(bytePerPix == 2)
      maxPalette *= 256;

    // Setup a palette.
    this.palette.data = new Uint8Array(maxPalette * 4);

    this.palette.index = 0;
    this.palette.modified = true;
  }

  update(data /*uint8/16Array*/){
    let gl = this.gl; //shortcut

    let enAsUint8Array = new Uint8Array(data.buffer);

    let content = (this.bytePerPixel == 1) ? gl.LUMINANCE : gl.LUMINANCE_ALPHA;


    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, content,
                  1374, 1183, 0,
                  content, gl.UNSIGNED_BYTE, enAsUint8Array);
                  console.log(gl.getError());

    if(this.palette.modified){
      this.palette.modified = false;
      gl.bindTexture(gl.TEXTURE_2D, this.palette.tex);
      let h =  (this.bytePerPixel == 1) ? 1 : 256;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, h, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, this.palette.data);
    }
  }

  /// add the given color to the palette and return its index
  /// note : a = 255 => opaque
  appendPalette(r, g, b, a = 255){
    this.palette.data[this.palette.index * 4 + 0] = r;
    this.palette.data[this.palette.index * 4 + 1] = g;
    this.palette.data[this.palette.index * 4 + 2] = b;
    this.palette.data[this.palette.index * 4 + 3] = a;

    this.palette.modified = true;

    return this.palette.index++;
  }
};
