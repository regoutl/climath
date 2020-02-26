
export default class PaletteTexture{
  constructor(gl, bytePerPix){
    this.bytePerPixel = bytePerPix;
    if(isNaN(Number(bytePerPix)) || bytePerPix < 1 || bytePerPix > 2)
      throw 'bytePerPix';

    this.gl = gl;
    //energy tex
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    let content = (this.bytePerPixel == 1) ? gl.LUMINANCE : gl.LUMINANCE_ALPHA;
    gl.texImage2D(gl.TEXTURE_2D, 0, content,
                  1374, 1183, 0,
                  content, gl.UNSIGNED_BYTE, null);


    this.palette = {};
    //energy palette
    this.palette.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.palette.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    let h =  (this.bytePerPixel == 1) ? 1 : 256;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, h, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, null);


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

    if(data.length != 1374 * 1183)
      throw 'pas la bonne taille';

    let enAsUint8Array = new Uint8Array(data.buffer);

    let content = (this.bytePerPixel == 1) ? gl.LUMINANCE : gl.LUMINANCE_ALPHA;


    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage2D(gl.TEXTURE_2D, 0,
                  0, 0,
                  1374, 1183,
                  content, gl.UNSIGNED_BYTE, enAsUint8Array);

    if(this.palette.modified){
      this.palette.modified = false;
      gl.bindTexture(gl.TEXTURE_2D, this.palette.tex);
      let h =  (this.bytePerPixel == 1) ? 1 : 256;
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 256, h,
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

    //this will create a palette withe the default gradiant.
    // min will be associated to the default gradiant lowest, and max the opposite
    defaultGradiant(min, max){
        let d = max - min;

        if(min > 255)
            throw 'did you forget to scale ? Min should be under 255';

        //everything undex min is white
        let i = 0;
        for(; i < min; i++)
            this.appendPalette(255, 255, 255);

        const pts =[
            {val: 0, r: 255, g: 255, b: 255},
            {val: 0.13, r: 72, g: 142, b: 202},
            {val: 0.23, r: 72, g: 187, b: 70},
            {val: 0.345, r: 250, g: 232, b: 92},
            {val: 0.537, r: 240, g: 120, b: 41},
            {val: 0.69, r: 210, g: 31, b: 40},
            {val: 1.0, r: 165, g: 47, b: 90},
        ];

        let index = 0;
        for(; i <= max && i < 256; i++){
            let a = (i - min) / (d);//prop dans le degrade

            while(pts[index + 1].val < a)
                index ++;

            //interpolate bw pts[index] et pts[index+1]. mix = 0 : full pts[index]
            let mix = (a - pts[index].val) / (pts[index + 1].val - pts[index].val);



            this.appendPalette(
                pts[index+1].r *mix + pts[index].r *(1-mix),
                pts[index+1].g *mix + pts[index].g *(1-mix),
                pts[index+1].b *mix + pts[index].b *(1-mix),
            );

        }


    }
};
