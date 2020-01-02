	const GroundUse = {
		city: 4280237790,
		forest: 4281259417,
		forest2: 4279864386,
		water: 4292140191,
		field: 4288667881,
		field2: 4283420126,
		industry: 4290663815,
		airport: 4290756057,
		heath: 4290663815
	}


class Map{
	/// load the map data (land use, 
	/// 
	constructor(k){
	}
	
	/// return the land use at a given pixel.
	/// ans format : pop  => int,
	///              solar => {//can be undefined
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
	}
	
	/// set pixel x, y with value with same format as get
	setPx(x, y, landUse){
	}
	
}
