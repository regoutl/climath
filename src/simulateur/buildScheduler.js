import PriorityQueue from '../res/priorityqueue.js';

/** @brief execute building at build.build.end */
export default class BuildScheduler{
    constructor(){
        // top := next to be finished build
    		this.pendingBuilds = new PriorityQueue((a, b) => a.year < b.year);
    }

    push(build){
        this.pendingBuilds.push(build);
    }

    happyNYEve(yStats){
        let year = yStats.year;
		let a =this.pendingBuilds.peek();
        //note : the inequality allows actions scheduled for a given year to have an order
		while(a && a.year < year+2){
			this._processBuild(this.pendingBuilds.pop());

			a =this.pendingBuilds.peek();
		}
  	}

  	_processBuild(job){
        if(job.action == 'build'){
            job.data.pm.capex(job.data);
        }
        else if(job.action == 'demolish'){
            job.data.pm.demolish(job.data);
        }
        else if(job.action == null){} //null action : do nothing
        else {
            throw 'i dont know this action';
        }
  	}
}
