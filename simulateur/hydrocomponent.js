import {simplex} from '../simplex.js';


export default class HydroComponent{
  constructor(createInfo){
    this.poolMap = createInfo.pools.map;
    if(this.poolMap.length != 748 * 631)
      throw 'prob taille';

    console.log(this.poolMap);
  }


  //check distance river
  canBuildNukeHere(pos){
    //to hydro pos
    pos = this._regToHydroCoord(pos);

    if(pos.x < 0 || pos.y < 0 || pos.x >= 748 || pos.y >= 631)
      return false;

    let poolIndex = this.poolMap[pos.x + pos.y * 748];



    return poolIndex > 0;
  }


  _regToHydroCoord(input){
    return {x : Math.floor((input.x - 8) / 1.836),   y: Math.floor((input.y - 63) / 1.836)};
  }
}

/* solve (return p_i : production of central i)
max p_i
p_i < maxW_i
nominalFlow_j - p_i * m3PerJ_i * affect_ij > minFlow_j
p_i > 0
*/
function allocateFlows(
		m3PerJ /*array(i) : m3 per W of central i*/,
		maxW, /*array(i) : max output of central i*/
		affect, /*array(i, j) in {0, 1} : 1 iff activity of central i affect pool j */
		nominalFlow, /*array(j) : originL m3/s of pool j*/
		minFlow/*array(j) : MIN VAL m3/s of pool j*/
	){
	let nCentral = m3PerJ.length, nPools = minFlow.length;
	if(nominalFlow.length != nPools || maxW.length != nCentral || affect.length != nCentral * nPools)
		throw 'invalid size';

/* let x' = [p, s, t]
p_i + s_i = maxW_i
p_i * m3PerW_i * affect_ij + t_j = nominalFlow_j - minFlow_j
*/

	let nVar = 2*nCentral + nPools, nConstrains = (nCentral + nPools);

	let obj = new Float32Array(nVar + 1);
	obj.fill(1, 0, nCentral); // sum_i 1*p_i

	let constrains  = new Float32Array((nVar + 1) * nConstrains);
	for(let i = 0; i < nCentral; i ++) {
		let thisLineOffset = i * (nVar + 1);
		constrains[thisLineOffset + 0 + i] = 1;
		constrains[thisLineOffset + nCentral + i] = 1;
		constrains[thisLineOffset + nVar] = maxW[i];
	}

	for(let j = 0; j < nPools; j ++) {
		let thisLineOffset = (j + nCentral) * (nVar + 1);
		for(let i = 0; i < nCentral; i ++) {
			constrains[thisLineOffset + 0 + i] = m3PerJ[i] * affect[i * nPools +j]; //p_i * m3PerW_i * affect_ij
		}

		constrains[thisLineOffset + 2*nCentral + j] = 1;// + t_j
		constrains[thisLineOffset + nVar] = nominalFlow[j] - minFlow[j]; //= nominalFlow_j - minFlow_j
	}


	return simplex(obj, constrains);
}

// let arr = allocateFlows(
// 	[1, 0.5],
// 	[10000, 20],
// 	[0, 1, 1,
// 	0, 0, 1],
// 	[10, 15, 20],
// 	[5, 15, 5]
// );
//
// alert(arr[0] + " " + arr[1]);
