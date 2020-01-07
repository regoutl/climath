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

const PopDensity = {
};

let gridslist = {
    groundUse: 'landUse.png',
    popDensity: 'popDensity.png',
    energyGrid: 'beedges.png',
};
let layerOrder = ['energyGrid', 'groundUse', 'popDensity'];

class Grid{
    currentShowGrid = {'groundUse':true};

	constructor(drawCtx){
        this.drawCtx = drawCtx;

        this.gridLoaded = 0;
        this.gridToLoad = Object.keys(gridslist).length;

        // Load each grid
        for (const [name, file] of Object.entries(gridslist)) {
            let im = new Image();
            im.crossOrigin = '';
            im.onload = () => {
                this.clear();
                this.drawCtx.drawImage(im, 0, 0);
                this[name+'Data']=this.drawCtx.getImageData(0, 0, 1374, 1183);
                this[name+'Val']=new Uint32Array(
                                            this[name+'Data'].data.buffer);
                this.clear();
                this.gridLoaded ++;
                if(this.gridLoaded === this.gridToLoad){
                    this.drawGrid();
                }
            }
            im.src = 'res/' + file;
            this[name+'Im'] = im;
        }
        this.setGridLayerCheckbox();
	}

    clear(){
        this.drawCtx.clearRect(0, 0,
            this.drawCtx.canvas.width,
            this.drawCtx.canvas.height);
        this.drawCtx.fillStyle = "rgba(0,0,0,1)";
        this.drawCtx.fillRect(0, 0, this.drawCtx.width, this.drawCtx.height);
        this.drawCtx.fillStyle = "rgba(0,0,0,1)";
    }

    /**
        draw all specified grid, preserve order of drawing
        (first is first to be draw, thus is under the others)
    */
    drawGrid(gridsToShow){
        this.currentShowGrid = gridsToShow || this.currentShowGrid;
        this.draw();
    }
    draw(){
        this.clear();
        for (let gridname of layerOrder) {
            if(this.currentShowGrid[gridname]){
                this.drawCtx.putImageData(this[gridname+'Data'], 0, 0);
            }
        }
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
        // if(GroundUsage[this.groundUseData[y*1374+x]] === undefined) {
        //     console.log('x:'+x+' y:'+y+'  v:'+this.groundUseData[y*1374+x]);
        // } else {
        //     console.log(GroundUsage[this.groundUseData[y*1374+x]]);
        // }
        // if(PopDensity[this.popDensityVal[y*1374+x]] === undefined) {
        //     console.log('x:'+x+' y:'+y+'  pop:'+this.popDensityVal[y*1374+x]);
        // } else {
        //     console.log(PopDensity[this.popDensityVal[y*1374+x]]);
        // }
        return {
            pop: undefined,
            solar: undefined,
            nuke: undefined,
            baseLandUse: GroundUsage[this.groundUseVal[y*1374+x]],
        }
	}

	/// set pixel x, y with value with same format as get
	setPx(x, y, landUse){
        this.energyGrid[y*1374+x] = Number(4280501491);
        // GroundUsage[landUse.baseLandUse];
        // if(landUse.energyGrid === undefined){
        // }
	}

    // get the name of every grid
    listGrids(){
        return Object.keys(gridslist);
    }

    forEachInCircle({x,y,radius}, setter){
        for(let i=-radius; i<radius; i++){
            for(let j=-radius; j<radius; j++){
                if(i*i+j*j<radius*radius){
                    this.setPx = setter(x,y,this.getPx(x+i, y+j));
                }
            }
        }
        this.draw();
    }

    drawCircle(x,y,radius) {
        this.drawGrid(this.currentShowGrid);
        this.drawCtx.beginPath();
        this.drawCtx.arc(x, y, radius, 0, 2*Math.PI, true);
        this.drawCtx.fill();
    }

    saveCircle(x,y,radius, landuse) {
        let old = this.drawCtx.save();
        this.clear();
        this.drawCtx.putImageData(this['energyGridData'], 0, 0);
        // this.drawCtx.beginPath();
        // this.drawCtx.arc(x, y, radius, 0, 2*Math.PI, true);
        this.drawCtx.fill();
        console.log(this['energyGridIm']);
        this.drawCtx.drawImage(this['energyGridIm'],0,0)
        this['energyGridData']=this.drawCtx.getImageData(0, 0, 1374, 1183);
        this['energyGridVal']=new Uint32Array(
                                    this['energyGridData'].data.buffer);
        this.drawCtx.restore(old);
    }

    setGridVisible(grid, visible){
        this.currentShowGrid[grid] = visible;
        this.draw();
    }
    setGridLayerCheckbox(){
        let grid = this;
        for (let m of layerOrder.reverse()) {
            let checkbox = $('<label>' + '<input type="checkbox"'+
                'name="' + m + '"' + ' value="'+ m + '"' +
                (this.currentShowGrid[m] ? 'checked':'') + '> ' +
                m + '</label><br>');
            $('#gridLayers').append(checkbox);
            $('#gridLayers input:checkbox').on('change',
            function() {
                    grid.setGridVisible($(this).val(), $(this).is(':checked'));
            });
        }
    }

}
