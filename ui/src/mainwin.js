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
            targetBuildLoc: {},
            vBMTheoReason: "",
            vBMBuild: "",
            vBMPerYear: "",
            vBMNameplate: "",
            vBMArea: "",
            vBMPop: "",
            vBMExplCost: "",
            vBMCoolingWaterRate: "",
            vBMStorageCapacity: "",
            money: 0,
            date: 2019,
        };



        this.slider = {default: 50, min: 0, max: 100,
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
            'targetBuildLoc':{radius: this.slider.default},
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
        }, vBMArea = undefined;

        if(this.state.targetBuild.type !== undefined ){
        //     && targetBuildLoc.pos !== undefined){  -> non : target buid loc undefined := "valeur moyenne"
                let build = this.state.simu.onBuildMenuStateChanged(
                    this.state.targetBuild, targetBuildLoc.pos,
                    targetBuildLoc.radius);
                vBMArea = (build.info !== undefined)?build.info.area:undefined;
                // console.log(build.info.area);
        }

        this.setState({targetBuildLoc:targetBuildLoc, vBMArea:vBMArea})
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
        />

        <BuildDock
            buildMenuSelectionCallback = {this.setTargetBuild.bind(this)}
            target = {this.state.targetBuild.type}
            vBMTheoReason = {this.state.vBMTheoReason}
            vBMBuild = {this.state.vBMBuild}
            vBMPerYear = {this.state.vBMPerYear}
            vBMNameplate = {this.state.vBMNameplate}
            vBMArea = {this.state.vBMArea}
            vBMPop = {this.state.vBMPop}
            vBMExplCost = {this.state.vBMExplCost}
            vBMCoolingWaterRate = {this.state.vBMCoolingWaterRate}
            vBMStorageCapacity = {this.state.vBMStorageCapacity}
            sliderRadius = {this.slider}
        />
         </div>);
    }

}
