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

class Map{
	/// load the map data (land use,
	///
	constructor(drawCtx){
        this.drawCtx = drawCtx;

        this.showGroundUseMap = true;
        this.groundUseMap = new Image();
        this.groundUseMap.crossOrigin = '';
        this.groundUseMap.onload = () => {
            drawCtx.drawImage(this.groundUseMap, 0, 0);

            this.groundUseData = new Uint32Array(
                    drawCtx.getImageData(0, 0, 1374, 1183).data.buffer);
        }
        this.groundUseMap.src = 'landUse.png';
	}

    drawMap(){
        if(this.showGroundUseMap){
            this.drawCtx.putImageData(this.groundUseData, 0, 0);
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

}
