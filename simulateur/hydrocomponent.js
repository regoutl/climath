import {simplex} from '../simplex.js';
//tmp
import {Plot, canvasEnablePloting, quantityToHuman as valStr} from '../ui/plot.js';

/** @brief this component check that no river go negative.
@note : maybe move it to nuke component (as it is the only user) ?
*/
export default class HydroComponent{
    constructor(createInfo){
    // this.poolMap = createInfo.pools.map;
    // if(this.poolMap.length != 748 * 631)
    //   throw 'prob taille';

    this.pools =  createInfo.pools.links;
    this.flows = {data: createInfo.stations, nCol:0, nRow: 0};
    // this.sea = createInfo.sea;

    // if(this.sea.length != 349 * 177)
    //   throw 'prob taille';

    //count the columns
    for(let p of this.pools)
      if(p.dataColIndex !== undefined)
        this.flows.nCol = Math.max(this.flows.nCol, p.dataColIndex+1);

    this.flows.nRow = this.flows.data.length / this.flows.nCol;
    if(!Number.isInteger(this.flows.nRow))
      throw 'prob taille table';

    this.central = [];

    this._rdyProb = {obj: null, constrains:null, dirty: true, relevantPoolIndices:null};

    this.flowsIndependentCapacity = 0;
  }

    // todo : move to map

    poolName(index){
        if(index == 254)
            return 'Mer';
        else
            return this.pools[index].river;
    }


    addCentral(pool, avgProd, m3perJ){
        if(pool > 254)
            throw 'pool 255 does not exist. did you mean sea := 254 ?';

        //central in the sea
        if(pool == 254){
            this.flowsIndependentCapacity += avgProd;
            return;
        }


        this.central.push({
          pool: pool,
          capa: avgProd,
          m3perJ: m3perJ
        });

        this._rdyProb.dirty = true;
    }


  ///a preiod is a group of 5 periods. period index := day index / 5
  getNukeCapaLimitForPeriod(period){
    if(this.central.length == 0)
      return this.flowsIndependentCapacity * 24 * 5;

    //  console.log('evaporate ' + this.m3perWh * energyOut / 3600 + 'm3/s');
    if(this._rdyProb.dirty)
      this._prepareProblem();

    period %= this.flows.nRow;

    const nVarPlus1 = this._rdyProb.obj.length;

    //todo : be able to set min flow > 0

    let workingIndice = (this.central.length + 1) * nVarPlus1 - 1;
    //set the <= nominal flow   -  min flow
    for(let j = 0; j < this._rdyProb.relevantPoolIndices.length; j++) {
      this._rdyProb.constrains[workingIndice] =
        this._nominalFlow(this._rdyProb.relevantPoolIndices[j], period);// - minFlow[j]; //= nominalFlow_j - minFlow_j
      workingIndice += nVarPlus1;
  	}


    // console.log('raw obj', this._rdyProb.obj);
    // console.log('raw constrains', this._rdyProb.constrains);

    //slice so that they are not affected
  	let opti = simplex(this._rdyProb.obj.slice(), this._rdyProb.constrains.slice());

    //note : optimum is watt

    // console.log('raw sol', opti);
    // console.log(valStr(opti[opti.length-1], 'W'));

    return (opti[opti.length-1] + this.flowsIndependentCapacity) * 24 * 5;
  }


  _prepareProblem(){
    const nCentral = this.central.length;

    //a pool is relevant if there is at least a central on it
    let isPoolRelevant = new Uint8Array(this.pools.length);
    for(let central of this.central){
      isPoolRelevant[central.pool] = 1;
    }

    const nRelevantPool = isPoolRelevant.reduce((a, b) => a+b);

    if(nRelevantPool > 255)
      throw 'trop bcp pr next';

    // array of all the relevant pool indices
    this._rdyProb.relevantPoolIndices = new Uint8Array(nRelevantPool);
    let cur = 0;
    for(let i = 0; i < this.pools.length; i++){
      if(isPoolRelevant[i] == 1){
        this._rdyProb.relevantPoolIndices[cur] = i;
        cur ++;
      }
    }


    let m3PerJ = new Float32Array(nCentral);
    let maxW = new Float32Array(nCentral);
    let affect = new Float32Array(nCentral * nRelevantPool);

    for(let i = 0; i < nCentral; i++){
      m3PerJ[i] = this.central[i].m3perJ;
      maxW[i] = this.central[i].capa;
    }

    let relIndex = 0;
    for(let i = 0; i < nRelevantPool; i++){ //for each relevant pool
      relIndex = this._rdyProb.relevantPoolIndices[i];

      for(let c = 0; c < nCentral; c++){
        affect[c * nRelevantPool + i] = this._flowsToward(this.central[c].pool, relIndex) ? 1: 0;
      }
    }

    this._prepareProbToCan(m3PerJ, maxW, affect);
    this._rdyProb.dirty = false;
  }

  //true if pool source flows to dst. source == dst return true
  _flowsToward(source, dst){
    for(; this.pools[source].dstPool !== undefined; source = this.pools[source].dstPool){
      if(source == dst)
        return true;
    }
    return source == dst;
  }

  // return m3/s. period must be in [0, this.flows.nRows]
  _nominalFlow(pool, period){

    if(this.pools[pool].dataColIndex !== undefined)
      return this.flows.data[period * this.flows.nCol + this.pools[pool].dataColIndex];
    else{ //sum of parents
      let ans = 0;
      // //debug :
      // if(this.pools[pool].srcPool.length == 0)
      //   throw 'need data';

      for(let i = 0; i < this.pools[pool].srcPool.length; i++)
        ans += this._nominalFlow(this.pools[pool].srcPool[i], period);
      return ans;
    }
  }


  /* solve (return p_i : production of central i)
  max p_i
  p_i < maxW_i
  nominalFlow_j - p_i * m3PerJ_i * affect_ij > minFlow_j
  p_i > 0
  */
 _prepareProbToCan(
  		m3PerJ /*array(i) : m3 per W of central i*/,
  		maxW, /*array(i) : max output of central i*/
  		affect /*array(i, j) in {0, 1} : 1 iff activity of central i affect pool j */
  //		nominalFlow, /*array(j) : originL m3/s of pool j*/
  //		minFlow/*array(j) : MIN VAL m3/s of pool j*/
  	){
  	let nCentral = m3PerJ.length, nPools = affect.length / nCentral;
  	// if(nominalFlow.length != nPools || maxW.length != nCentral || affect.length != nCentral * nPools)
  	// 	throw 'invalid size';

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
  		// constrains[thisLineOffset + nVar] = nominalFlow[j] - minFlow[j]; //= nominalFlow_j - minFlow_j
  	}

    this._rdyProb.constrains = constrains;
    this._rdyProb.obj = obj;

  //	return simplex(obj, constrains);
  }
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
