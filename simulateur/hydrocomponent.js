
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

    available(pool, day){
        day %= (this.flows.nRow * 5);
        return this._nominalFlow(pool, Math.floor(day / 5)) - 0;
    }

}
