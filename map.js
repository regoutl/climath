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
}

let mapslist = {
    groundUse: 'landUse.png',
    popDensity: 'popDensity.png',
}

class Map{
	/// load the map data (land use,
	///
	constructor(drawCtx){
        this.drawCtx = drawCtx;

        this.defaultMap = 'groundUse';

        this.mapLoaded = 0;
        this.mapToLoad = 2;

        // Load each map
        for (const [name, file] of Object.entries(mapslist)) {
            let im = new Image();
            im.crossOrigin = '';
            im.onload = () => {
                this.drawCtx.drawImage(im, 0, 0);
                this[name+'Data'] = this.drawCtx.getImageData(0, 0, 1374, 1183)
                this[name+'Val'] = new Uint32Array(this[name+'Data'].data.buffer);
                this.clear();
                this.mapLoaded ++;
                if(this.mapLoaded === this.mapToLoad){
                    this.drawMap();
                }
            }
            im.src = file;
            this[name+'Im'] = im;
        }
	}

    clear(){
        this.drawCtx.clearRect(0, 0, this.drawCtx.canvas.width, this.drawCtx.canvas.height);
    }

    /**
        draw all specified map, preserve order of drawing
        (first is first to be draw, thus is under the others)
    */
    drawMap(mapsToShow){
        this.clear();
        mapsToShow = mapsToShow || [this.defaultMap];
        this.currentShowMap = mapsToShow.reverse();

        for (let mapname of mapsToShow) {
            this.drawCtx.putImageData(this[mapname+'Data'], 0, 0);
        }
    }
	/// return the land use at a given pixel.
    /// faire l'ajoute des pv
	/// ans format : pop  => int,
	///              solar => {//can be undefined
    ///                  year of installation
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
        if(GroundUsage[this.groundUseData[y*1374+x]] === undefined) {
            console.log('x:'+x+' y:'+y+'  v:'+this.groundUseData[y*1374+x]);
        } else {
            console.log(GroundUsage[this.groundUseData[y*1374+x]]);
        }
        return {
            pop: undefined,
            solar: undefined,
            nuke: undefined,
            baseLandUse: GroundUsage[this.groundUseData[y*1374+x]],
        }
	}

	/// set pixel x, y with value with same format as get
	setPx(x, y, landUse){
        if(landUse.baseLandUse !== undefined){
            this.groundUseData[y*1374+x] = GroundUsage[landUse.baseLandUse];
        }
	}

    // get the name of every map
    listMaps(){
        return Object.keys(mapslist);
    }

}
