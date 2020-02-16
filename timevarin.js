"use strict";

function mix(x, y, a){
	return x * (1-a) + y * a;
}
function mix2d(a, b, t){
	return {x: mix(a.x, b.x, t), y:mix(a.y, b.y, t)};
}

function bezier(first, control1, control2, end, t){

	var tmp1 = mix2d(first, control1, t);
	var tmp2 = mix2d(control1, control2, t);
	var tmp3 = mix2d(control2, end, t);

	return mix2d(mix2d(tmp1, tmp2, t), mix2d(tmp2, tmp3, t), t);
}

export class Raw{
	constructor(k){
		if(k === undefined)
			throw 'k should not be undefined';
		let json;
		if(typeof k == 'object'){
			json = k;
			k = 0;
		}

		this.unit = '';
		/// the historical (aka verified, certain) data goes from [2000: histoUntill]
		this.histoUntill = 2018;

		this.years = [];
		for(var i = 0; i <= 50; i++)
			this.years.push(k);

		this.source = "";

		this.nowCtrl = {x: this.histoUntill, y: k};
		/// value in 2050
		this.endVal = k;
		this.endCtrl = {x: 2050, y: k};

		this.updatePredi();

		if(json)
			this.fromJSON(json);
	}

	lastHistoVal(){
		return this.years[this.histoUntill - 2000];
	}

	/// return the value of the input of the given year.
	/// year must be in [1950; 2050[
	at(year){
		if(year < 2000)
			throw "year must be >= 2000";

		if(year > 2050)
			year = 2050;
		
		return this.years[year - 2000];



		//prediction question : lin for now
//		return (this.lastHistoVal() * (2050 - year) + this.endVal * (year - this.histoUntill)) / (2050 - this.histoUntill);
	}

	setAt(year, val){
		if(year < 2000 || year > 2050)
			throw "year must be in [2000:2050]";
		this.years[year - 2000] = val;
	}
	/// convenience ; equivalent to setAt(year, at(year) + val)
	addAt(year, val){
		if(year < 2000 || year > 2050)
			throw "year must be in [2000:2050]";
		this.years[year - 2000] += val;
	}

	lastHistoricalYear(){
		return this.histoUntill;
	}

	updatePredi(){
		for(var t = 0; t <= 1; t += 0.002){
			var tmp = bezier({x: this.histoUntill, y: this.lastHistoVal()}, this.nowCtrl,
							 this.endCtrl, {x: 2050, y: this.endVal}, t);

			var y = Math.round(tmp.x-2000);
			if(y+2000 > this.histoUntill)
				this.years[y] = tmp.y;
		}
	}

	toJSON(){
		return {
			"histoUntill" 	: this.histoUntill,
			'years'  		: this.years,
			'yearsSrc'		: this.source,
			'in2050'		: this.endVal,
			'ctrlPts'		: [this.nowCtrl, this.endCtrl],
			'valMul'		: 1
		};
	}

	fromJSON(j){
		this.comment = j.comment;//might be undefined but dont care
		if(j.unit)
			this.unit = j.unit;

		this.years		= j.years;
		if(j.histoUntill)
			this.histoUntill= j.histoUntill;
		else
			this.histoUntill = this.years.length + 1999;

		while(this.years.length < 51)
			this.years.push(this.years[this.years.length-1]);

		if(j.label)
			this.label	= j.label;


		this.source	= j.source;
		if(j.in2050)
			this.endVal		= j.in2050;
		else
			this.endVal = this.years[50];

		if(j.ctrlPts){
			this.nowCtrl	= j.ctrlPts[0];
			this.endCtrl	= j.ctrlPts[1];
		}
		else{
			this.nowCtrl = {x: this.histoUntill, y:this.lastHistoVal()};
			this.endCtrl = {x: 2050, y:this.endVal};

			//place it in the middle, for better ui
			this.endCtrl = {x: (this.endCtrl.x + this.nowCtrl.x) / 2, y:(this.endCtrl.y + this.nowCtrl.y) / 2};
		}

		if(j.valMul){
			for(var i = 0; i <= 50; i++)
				this.years[i] *= j.valMul;

			this.endVal		*= j.valMul;
			this.nowCtrl.y	*= j.valMul;
			this.endCtrl.y	*= j.valMul;
		}

		this.updatePredi();
	}
}


const Op = Object.freeze({"Mul":1, "div":2});

function isLetter(str) {
  return str.match(/[a-z€]/i);
}

function readUnit(outLetterCount, inStr, opposeExp = false){
	var lastLetterSeen = '';
	for(var i = 0; i < inStr.length; i++){
		var letter = inStr[i];
		if(isLetter(letter)){
			if(!(letter in outLetterCount))
				outLetterCount[letter] = 0;
			if(opposeExp)
				outLetterCount[letter] --;
			else
				outLetterCount[letter] ++;
			lastLetterSeen = letter;
		}
		else if(letter == '/')
			opposeExp = !opposeExp;
		else{
			var exp = parseInt(letter);
			if(opposeExp)
				outLetterCount[lastLetterSeen] -= (exp - 1);
			else
				outLetterCount[lastLetterSeen] += (exp - 1);
		}
	}
}

function combineUnits(u1, u2, mult = true){
	var letterCount = {};

	readUnit(letterCount, u1 );
	readUnit(letterCount, u2, !mult );

	var myUnit = '';

	var needDiv = false;
	for(var u in letterCount){
		if(letterCount[u] > 0)
			myUnit += u + ((letterCount[u] > 1) ? letterCount[u]: '');
		if(letterCount[u] < 0)
			needDiv = true;
	}

	if(needDiv){
		myUnit += '/';
		for(var u in letterCount){
			if(letterCount[u] < 0)
				myUnit += u + ((letterCount[u] < -1) ? -letterCount[u]: '');
		}
	}
	return myUnit;
}

export class Mult{
	constructor(subExpr1, subExpr2){
		this.a = subExpr1;
		this.b = subExpr2;

//		if(subExpr1.unit && subExpr2.unit){
			this.unit = combineUnits(subExpr1.unit, subExpr2.unit, true);
//		}
	}

	at(year){
		return this.a.at(year) * this.b.at(year);
	}
	lastHistoricalYear(){
		return Math.min(this.a.lastHistoricalYear(), this.b.lastHistoricalYear());
	}
}

export class Divide{
	constructor(subExpr1, subExpr2){
		this.a = subExpr1;
		this.b = subExpr2;

		if(subExpr1.unit && subExpr2.unit){
			this.unit = combineUnits(subExpr1.unit, subExpr2.unit, false);
		}
	}

	at(year){
		return this.a.at(year) / this.b.at(year);
	}
	lastHistoricalYear(){
		return Math.min(this.a.lastHistoricalYear(), this.b.lastHistoricalYear());
	}
}

export class Add{
	constructor(subExpr1, subExpr2){
		this.a = subExpr1;
		this.b = subExpr2;

		if(subExpr1.unit || subExpr2.unit){
			if(subExpr1.unit != subExpr2.unit)
				throw 'sum with wrong units';
			this.unit = subExpr1.unit;
		}
	}

	at(year){
		return this.a.at(year) + this.b.at(year);
	}
	lastHistoricalYear(){
		return Math.min(this.a.lastHistoricalYear(), this.b.lastHistoricalYear());
	}
}


export class Constant{
	constructor(val){
		this.unit = '';
		this.v = val;
	}

	at(year){
		return this.v;
	}
	lastHistoricalYear(){
		return 2050;
	}
}

export class Expo{
	/** build an exponent shaped value :=
	*     [2000: startYear[ = 0
	*     startYear = startValue
	* 	  year_i = year i-1 * coef   forall i > startYear
	*/
	constructor(startYear, startValue, coef){
		this.unit = '';
		this.firstNonZero = startYear;
		this.init = startValue;
		this.rate = coef;
	}

	at(year){
		if(year < this.firstNonZero)
			return 0;

		return Math.pow(this.rate, year - this.firstNonZero) * this.init;
	}
	lastHistoricalYear(){
		return 2050;
	}
}
