"use strict";

const GroundUsage = {
    city: 4280501491,
    4280501491: 'city',
	forest: 4281658024,
    4281658024: 'forest',
	forest2: 4280130122,
    4280130122: 'forest',
	water: 4293456303,
    4293456303: 'water',
	field: 4289722111,
    4289722111: 'field',
    field2: 4283949556,
    4283949556: 'field',
    industry: 4291845525,
    4291845525: 'industry',
	airport: 4291940334,
    4291940334: 'airport',
	heath: 4294014481,
    4294014481: 'heath',

    solarpanel:4294040525,
    4294040525:'solarpanel',
};

const PopDensitylegend = {
    4278190191:{min:5001, max:44973},
    4279314829:{min:2001, max:5000},
    4279979441:{min:1001, max:2000},
    4280710099:{min:501, max:1000},
    4281639415:{min:201, max:500},
    4282890747:{min:101, max:200},
    4284009982:{min:51, max:100},
    4285327102:{min:21, max:50},
    4286709503:{min:0, max:20},
}

let gridslist = {
    groundUse: 'landUse.png',
    popDensity: 'popDensity.png',
    // popDensitylegended: 'popDensity-legended.png',
    energyGrid: 'beedges.png',
};
let layerOrder = {
    'energyGrid':10,
    'groundUse':5,
    // 'popDensitylegended':4,
    'popDensity':1
};

function onload(canvas, im){
    let ctx = canvas[0].getContext("2d");
    return () => {
        if(im !== undefined){ctx.drawImage(im, 0, 0);}
        canvas.imData = ctx.getImageData(0, 0,
                                            canvas[0].width, canvas[0].height);
        canvas.pixVal = new Uint32Array(
                                    canvas.imData.data.buffer);
        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
        ctx.putImageData(canvas.imData,0,0);
    }
}

function newCanvas(name, file, zindex, visible){
    let canvas = $('<canvas id="'+name+'"'
                            + ' width="1374" height="1183"></canvas>');
    canvas['Im'] = new Image();
    canvas['Im'].crossOrigin = '';
    canvas['Im'].onload = onload(canvas, canvas['Im']);
    canvas['Im'].src = 'res/' + file;
    canvas.css({
        'z-index':zindex,
        visibility: (visible?'visible':'hidden'),
        position: 'fixed',
    });
    $('#dMovable').append(canvas);
    return canvas;
}

class Grid{
    currentShowGrid = {'groundUse':true, 'energyGrid':true};

	constructor(){
        // create multicaneva;
        this.gridLoaded = 0;
        this.gridToLoad = Object.keys(gridslist).length;

        this.canvas = { top: $('#top'),};

        // Load each grid
        for (const [name, file] of Object.entries(gridslist)) {
            this.canvas[name] = newCanvas(
                name,
                file,
                layerOrder[name],
                this.currentShowGrid[name],
            );
        }

        onload(this.canvas.top)();
        this.canvas.top[0].getContext("2d").globalAlpha = 0.3;
        this.setGridLayerCheckbox();
	}

    /**
        draw all specified grid, preserve order of drawing
        (first is first to be draw, thus is under the others)
    */
    drawCanvas(name){
        this.canvas[name].css('visibility','visible');
    }
    hideCanvas(name){
        this.canvas[name].css('visibility','hidden');
    }

	/// return the land use at a given pixel.
    /// faire l'ajoute des pv
	/// ans format : pop  => int,
	///              solar => {//can be undefined
    ///                     efficiency multiplicator
    ///                     powerdelcine per year
    ///                     installation Capacity
	///				 },
	///              nuke => { //can be undefined
	///				 }
	///				 bat => { //can be undefined
	///              }
	/// baseLandUse => { //undefined = out of country
	///     City,
	///     Field
	///     Forest
	///     Water
	///     economicalInterestArea
	///     Airport
	/// }
	getPx(x, y){
        return {
            pop: this._getPop[this.canvas['popDensity'].pixVal[y*1374+x]],
            solar: undefined,
            nuke: undefined,
            baseLandUse: GroundUsage[this.groundUseVal[y*1374+x]],
            // baseLandUse: undefined,
        }
	}

	/// set pixel x, y with value with same format as get
	setPx(x, y, landUse){
        // this.canvas['energyGrid'].pixVal[y*1374+x] = Number(4280501491);
        // GroundUsage[landUse.baseLandUse];
        // if(landUse.energyGrid === undefined){
        // }
	}

    logPx(x,y){
        let col = this.canvas['popDensity'].pixVal[y*1374+x];
        let legend = PopDensitylegend[col];
        console.log('x:'+x+' y:'+y+' v:'+col+' legend:'+JSON.stringify(legend));
    }

    // get the name of every grid
    listGrids(){
        return Object.keys(gridslist);
    }

    drawCircle(x,y,radius) {
        const ctx = this.canvas.top[0].getContext('2d');
        // ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.clearRect(0, 0,
            this.canvas.top[0].width,
            this.canvas.top[0].height);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI, true);
        ctx.fill();
    }

    _nrg2color(nrj, year){
        if(nrj == 'pv'){
            return {red:0, green:year-2000, blue:250, alpha:150};
        }
        return {red:255, green:255, blue:255, alpha:100};
    }
    _color2nrj(c){
        if(!isNaN(c)){
            let a = c>>24 & 0xFF,
                b = c>>16 & 0xFF,
                g = c>>8 & 0xFF,
                r = c & 0xFF;
            c = {red:r, blue:b, green:g, alpha:a};
        }
        if(c.red === 255 && c.blue === 255 && c.green===255 && c.alpha===255){
            return undefined;
        } else if(c.red === 0 && c.blue === 250){
            return {nrj:'pv', year:2000+c.green};
        }
        return {};
    }

    saveCircle(x,y,radius, nrj, year) {
        // set colors
        this._setForEarch(x,y,radius, this._nrg2color(nrj, year));
        let ctx = this.canvas['energyGrid'][0].getContext('2d');
        // draw colors
        ctx.putImageData(this.canvas['energyGrid'].imData,0,0);
        // cut country borders
        ctx.drawImage(this.canvas['energyGrid']['Im'], 0, 0);
    }

    _setForEarch(x,y,radius, color) {
        let r = color.red & 0xFF,
            g = color.green & 0xFF,
            b = color.blue & 0xFF,
            a = color.alpha & 0xFF;
        let abgr = (a << 24) + (b << 16) + (g << 8) + (r);
        for(let i=-radius; i<radius; i++){
            for(let j=-radius; j<radius; j++){
                if(i*i+j*j<radius*radius){
                    this.canvas['energyGrid'].pixVal[(y+j)*1374+(x+i)] = abgr;
                }
            }
        }
    }

    getNRJcount(){
        let count = {
            pv:{},
            countrysize:0,
        }
        for(let x=0; x<this.canvas.top[0].width; x++){
            for(let y=0; y<this.canvas.top[0].height; y++){
                let nrj = this._color2nrj(
                            this.canvas['energyGrid'].pixVal[(y)*1374+(x)]);
                if(nrj !== undefined){
                    count.countrysize ++;
                    if(nrj.nrj !== undefined){
                        if(nrj.nrj === 'pv'){
                            if(count['pv'][nrj.year] === undefined){
                                count['pv'][nrj.year] = 1;
                            } else {
                                count['pv'][nrj.year] ++;
                            }
                        }
                    }
                }
            }
        }
        return count;
    }

    setGridLayerCheckbox() {
        let grid = this;
        for (let m of Object.keys(layerOrder)) {
            let checkbox = $('<label>' + '<input type="checkbox"'+
                'name="' + m + '"' + ' value="'+ m + '"' +
                (this.currentShowGrid[m] ? 'checked':'') + '> ' +
                m + '</label><br>');
            $('#gridLayers').append(checkbox);
            $('#gridLayers input:checkbox').on('change',
            function() {
                    if($(this).is(':checked')){
                        grid.drawCanvas($(this).val());
                    }else{
                        grid.hideCanvas($(this).val());

                    }
            });
        }
    }

    _checkGroundUsageFlags(x,y,flags){
        let gu = this.canves.groundUse.pixVal[y*1374+x];
        for(let c of Object.keys(flags)){
            if(GroundUsage[c] === gu){
                return false;
            }
        }
        return true;
    }
    /**
    */
    _setPx(grid, x, y, radius, flags, value){
        let added = {count:0};
        for(let i=-radius; i<=radius; i++){
            for(let j=radius; j<=radius; j++){
                if(this._checkGroundUsageFlags(x+i,y+j, flags.groundUse)){
                    grid[(y+j)*1374+x+i] = value;
                    added.count++;
                }
            }
        }
        return added;
    }

    /**
    @param position : {x: ,y: } representing the center of the circle
    @param radius : radius to take into account around (a number in [0;+INF[)
    @param flags.groundUse[GroundUsage] : Boolean if false,
                                            don't consider these ground usage
    @param flags.PopDensity : {min:0, max:Inf}
    */
    getAreaAndAvgIrradiance(position, radius, flags){
        this._setPx(this.canvas.top, position.x, position.y, radius, flags,
                                (100 << 24) + (250 << 16) + (50 << 8) + (70));
    }

    setAreaAndAvgIrradiance(position, radius, flags){
        this._setPx(this.canvas.energyGrid,position.x, position.y, radius,
                        flags, (100 << 24) + (250 << 16) + (50 << 8) + (70));
    }

}
