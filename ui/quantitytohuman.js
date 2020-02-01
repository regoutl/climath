/** option.compact : bool, true if you want the most compact possible. default false
options.mag int [-3, 5] : force mag order. 1 => k aso. default : auto detect.
*/
export function quantityToHuman(value, unit, options){
	if(options === undefined){
		options = {};
	}
	if(typeof options != 'object'){
		throw 'bad options';
	}

	if(options.compact === undefined)
		options.compact = false;

	if(unit == '%')
		return Math.round(value * 1000) / 10 + ' %';
	if(unit == '€' && !options.compact)
		return plainTextEuro(value);

	let yolo = 1000;
	if(unit.length >= 2 && !isNaN(Number(unit[1]))){
		if(unit[1] == '2')
			yolo *= yolo; // square it
		else if(unit[1] == '3')
			yolo = yolo*yolo*yolo; // square it
		else
			throw 'aie';
	}

	let mag = Math.floor(Math.log(value) / Math.log(yolo));
	if(options.mag !== undefined)
		mag = options.mag;

	let divider = Math.pow(yolo, mag);
	let suffix = '';
	switch(mag){
		case 0: break;
		case 1: suffix = 'k'; break;
		case 2: suffix = 'M'; break;
		case 3: suffix = 'G'; break;
		case 4: suffix = 'T'; break;
		case 5: suffix = 'P'; break;
		case -1: suffix = 'm'; break;
		case -2: suffix = 'μ'; break;
		case -3: suffix = 'ν'; break;
	}


	//max 3 digit sig
	var div = value / divider;
	if(div >= 100)
		div = Math.round(div);
	else
		div = Math.round(div * 10) / 10;

	if(value == 0)
		div = 0;


	return div + ' ' + unitToHuman(suffix + unit, options.compact);
}

function unitToHuman(unit, compact = false){
	var tmp = unit;
	if(unit.match(/^(m|μ|ν)(€|C)/) && unit.match(/\//)){
		if(unit[0] == 'm')
			tmp = unit.substring(1).replace('/', '/k');
		if(unit[0] == 'μ')
			tmp = unit.substring(1).replace('/', '/M');
	}

	if(!compact)
		tmp = tmp.replace('/', ' par ').replace('€', '(2019) €').replace('i', 'item').replace('H', ' habitant ').replace('y', ' an ').replace('N', 'W (pic) ').replace('C', 'gCO2eq');
	else
		tmp = tmp.replace('N', 'Wp').replace('C', 'gCO2');

	//improve carbon readibility
	tmp = tmp.replace('PgCO2', 'GT CO2').replace('TgCO2', 'MT CO2').replace('GgCO2', 'kT CO2').replace('MgCO2', 'T CO2');

	//storage
	tmp = tmp.replace('S', 'Wh');

	return tmp.replace('  ', ' ');
}

function plainTextEuro(amound){
	if(amound == 0)
		return 0 + ' €';

	let coef = 1, unit = '';
	if(Math.abs(amound) >= 1000000000){
		coef = 0.000000001;
		unit = 'milliard';
	}
	else if(Math.abs(amound) >= 1000000){
		coef = 0.000001;
		unit = 'million';
	}
	else if(Math.abs(amound) >= 1000){
		coef = 0.001;
		unit = 'miles';
	}
	else if(Math.abs(amound) >= 1){}
	else if(Math.abs(amound) >= 0.001){
		coef = 100;
		unit = 'cent';
	}


	var inMillion = (Math.round(amound * coef * 10)/10).toString();

	if(inMillion.length != 3 && inMillion.includes('.')){
		inMillion = inMillion.substr(0, inMillion.length - 2);
	}

	return   inMillion +  " " + unit + (unit != 'cent' ? " €":"");
}
