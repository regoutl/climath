// Copyright 2020, ASBL Math for climate, All rights reserved.

/** @brief : Transform a number + unit into a human readable string

@details
	Units : An unit must NOT contain any multiplier (kilo, nano, etc).
	Symbols are :

	(H)uman
	(W)att
	(N)ameplate : plant pic production (W, but not efficive)
	(h)our
	(€)
	(C)arbon (grams)
	(i)tem : an item (no matter what)
	(y)ear
	(m)eters
	(S)torage : Wh (stored)


option.compact : [0-2], 0 = less compact, 2 = most compact. default 0
options.mag int [-3, 5] : force mag order. 1 => k aso. default : auto detect.
options.forceSign : bool. default false. if true, will write '+3' instead of '3'
*/
export function quantityToHuman(value, unit, options){
	if(options === undefined){
		options = {};
	}
	if(typeof options != 'object'){
		throw 'bad options';
	}

	if(options.compact === undefined)
		options.compact = 0;

	let sign = '';

	if(options.forceSign && value > 0)
		sign = '+ ';


	if(unit == '%')
		return sign + Math.round(value * 1000) / 10 + ' %';
	if(unit == '€' && options.compact==0)
		return sign + plainTextEuro(value);

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
	var orderVal = value / divider;

	if(options.compact == 2)//if ultra compact, less sig digits
		orderVal /= 10;

	if(orderVal >= 100)
		orderVal = Math.round(orderVal);
	else
		orderVal = Math.round(orderVal * 10) / 10;

	if(options.compact == 2)
		orderVal *= 10;


	if(value == 0)
		orderVal = 0;


	return sign + orderVal + ' ' + unitToHuman(suffix + unit, options.compact);
}

/** @brief convert an unit into a human readable string
*/
export function unitToHuman(unit, compact){
	if(compact == undefined)
		compact = 0;

	var tmp = unit;
	if(unit.match(/^(m|μ|ν)(€|C)/) && unit.match(/\//)){
		if(unit[0] == 'm')
			tmp = unit.substring(1).replace('/', '/k');
		if(unit[0] == 'μ')
			tmp = unit.substring(1).replace('/', '/M');
	}

	if(compact == 0)
		tmp = tmp.replace('/', ' per ').replace('€', '(2019) €').replace('i', 'item').replace('H', ' inhabitant ').replace('y', ' year ').replace('N', 'W (peak) ').replace('C', 'gCO2eq');
	else
		tmp = tmp.replace('N', 'Wp').replace('C', 'gCO2');

	//improve carbon readibility
	tmp = tmp.replace('PgCO2', 'GT CO2').replace('TgCO2', 'MT CO2').replace('GgCO2', 'kT CO2').replace('MgCO2', 'T CO2');

	//storage
	tmp = tmp.replace('S', 'Wh');

	if(compact == 2){
		tmp = tmp.replace('CO2', '').replace('G€', 'B').replace('M€', 'M');
	}

	return tmp.replace('  ', ' ');
}

function plainTextEuro(amound){
	if(amound == 0)
		return 0 + ' €';

	let coef = 1, unit = '';
	if(Math.abs(amound) >= 1000000000){
		coef = 0.000000001;
		unit = 'billion';
	}
	else if(Math.abs(amound) >= 1000000){
		coef = 0.000001;
		unit = 'million';
	}
	else if(Math.abs(amound) >= 1000){
		coef = 0.001;
		unit = 'thousand';
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
