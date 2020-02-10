import StatDock from './statdock.js';
import MapView from './mapview.js';
import BuildDock from './builddock.js';
import StatusBar from './statusbar.js';


import {Simulateur, promiseSimulater, objSum} from '../../simulateur/simulateur.js';



export default class MainWin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            simu: null,
            targetBuild: {},
            targetBuildLoc: {pos:{x:0, y:0}, radius:0},
            currentBuildInfo:{
                theoReason: "",
                buildCost: 0,
                buildCo2: 0,
                perYearCost: 0,
                perYearCo2: 0,
                nameplate: 0,
                pop: 0,
                explCost: 0,
                coolingWaterRate: 0,
                storageCapacity: 0,
            },
            money: 0,
            date: 2019,
        };



        this.slider = {default: 50, min: 1, max: 100,
            sliderChange: (r) => this.setTargetBuildLoc({radius: r})};
        let mainWin = this;

    	/// set of small functions that update screen text when some values changes
    	let valChangedCallbacks = {
            money(val){
                mainWin.setState({money:val});
            },
            year(year){
                mainWin.setState({date: year});
    			// if(simu){
    			// 	StatDock.update();
    			// 	BuildMenu.notifyStateChanged();
    			// }
    		},
    		// totalCo2: function(co2){
    		// 	let strco2Total = valStr(co2, 'C');
    	    // strco2Total = strco2Total.substr(0, strco2Total.length - 6);
    	    // $('.vTotalCo2').text(strco2Total);
    		// },
    		// lastYearCo2: function(co2){
    		// 	let strco2Total = valStr(co2, 'C');
    	    // strco2Total = strco2Total.substr(0, strco2Total.length - 6);
    	    // $('.vLastYearCo2').text(strco2Total);
    		// },
    		taxRate: function(rate){
    			// $('.vTaxRate').text(Math.round(rate * 100) + '%');
    		}
    	}

        promiseSimulater(valChangedCallbacks).then(s =>{
            this.setState({simu: s});
        })
        .catch(err => {
            alert(err);
        });
    }


    /** callback
        set the current target build
        target is a string as specified in builddock.js
    */
    setTargetBuild(target){
        this.setState({
            'targetBuild':{"type": target},
            'targetBuildLoc':{pos:{x:0, y:0}, radius: this.slider.default},
        });
    }

    /** callback
        set the current location of the cursor as {pos:{x:,y:}, radius:}
    */
    setTargetBuildLoc({pos=this.state.targetBuildLoc.pos,
                                    radius=this.state.targetBuildLoc.radius}){
        // console.log(pos.x, pos.y, radius);
                                        // console.log('yo');
        let targetBuildLoc = {
            pos: pos,
            radius: radius,
        }, vBMArea = "", vBMBuildCost = 0;

        if(this.state.targetBuild.type !== undefined ){
        //     && targetBuildLoc.pos !== undefined){  -> non : target buid loc undefined := "valeur moyenne"
            const info = this.state.simu.onBuildMenuStateChanged(
                this.state.targetBuild, targetBuildLoc.pos,
                targetBuildLoc.radius).info;


            let avgProd = info.nameplate ? info.nameplate.at(info.build.end) * info.avgCapacityFactor : 0;

            this.setState({
                targetBuildLoc:targetBuildLoc,
                currentBuildInfo:{
                    theoReason: info.theorical,
                    buildCost: info.build.cost,
                    buildCo2: info.build.co2,
                    perYearCost: info.perYear.cost + info.perWh.cost * avgProd,
                    perYearCo2: info.perYear.co2 + info.perWh.co2 * avgProd,
                    avgProd: avgProd,
                    pop: info.pop_affected,
                    explCost: info.expl_cost,
                    coolingWaterRate: info.coolingWaterRate,
                    storageCapacity: info.storageCapacity ? info.storageCapacity.at(info.build.end) : 0,
                }});
        }
        else{
            this.setState({
                targetBuildLoc:targetBuildLoc,
                currentBuildInfo:{
                    theoReason: undefined,
                    buildCost: 0,
                    buildCo2: 0,
                    perYearCost: 0,
                    perYearCo2: 0,
                    nameplate: 0,
                    pop: 0,
                    explCost: 0,
                    coolingWaterRate: 0,
                    storageCapacity: 0,
                }
            });
        }

    }

    render(){
        if(this.state.simu === null){
            return <p>Chargement ... </p>;
        }

        return (
        <div className="vLayout" style={{width: '100%', height: '100%'}}>
        <StatusBar
            Date = {this.state.date}
            Money = {this.state.money}
        />

        <MapView
            cMap={this.state.simu.cMap}
            mousemove={(curPos) => this.setTargetBuildLoc({pos: curPos})}
            cursor={{
                type:this.state.targetBuild.type,
                radius: this.state.targetBuildLoc.radius,
                pos:this.state.targetBuildLoc.pos
            }}
        />

        <BuildDock
            buildMenuSelectionCallback = {this.setTargetBuild.bind(this)}
            target = {this.state.targetBuild.type}
            info={this.state.currentBuildInfo}
            sliderRadius = {this.slider}
        />
         </div>);
    }

}
