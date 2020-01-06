var _lastRandValue = BigInt(1);

function srand(val){
	if(val <= 0 || val >= 2147483647)
		throw 'seed invalid';
	_lastRandValue = BigInt(val);
}



/// return a random number between 1 and 2147483647 (see c++ std::minstd_rand)
/// deterministic
function rand(){
	//overflow is ... : 30 bit * 15 bit = 55 bit
	_lastRandValue = (_lastRandValue * BigInt(48271)) % BigInt(2147483647);
	
	return Number(_lastRandValue);
}
