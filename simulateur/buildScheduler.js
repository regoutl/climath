import PriorityQueue from '../res/priorityqueue.js';

/** @brief execute building at build.build.end */
export default class BuildScheduler{
    constructor(){
        // top := next to be finished build
    		this.pendingBuilds = new PriorityQueue((a, b) => a.info.build.end < b.info.build.end);
    }

    push(build){
        this.pendingBuilds.push(build);
    }

    happyNYEve(yStats){
        let year = yStats.year;
    		let a =this.pendingBuilds.peek();
    		while(a && a.info.build.end == year+1){
    			this._processBuild(this.pendingBuilds.pop());

    			a =this.pendingBuilds.peek();
    		}
  	}

  	_processBuild(build){
  		  build.pm.capex(build);
  	}
}
