import StatDock from './statdock.js';
import MapView from './mapview.js';
import BuildDock from './builddock.js';
import StatusBar from './statusbar.js';


import {Simulateur, promiseSimulater, objSum} from '../../simulateur/simulateur.js';


export default class MainWin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            simu: "unloaded",
            targetBuild: {},
            targetBuildPos: {},
            vBMTheoReason: "",
            vBMBuild: "",
            vBMPerYear: "",
            vBMNameplate: "",
            vBMArea: "",
            vBMPop: "",
            vBMExplCost: "",
            vBMCoolingWaterRate: "",
            vBMStorageCapacity: "",
        };

        let mainWin = this;

    	/// set of small functions that update screen text when some values changes
    	let valChangedCallbacks = {
    		money: function(money){
    			// $('.vMoney').text(valStr(money, '€'));
    		},
    		year: function(year){
    			// $('.vYear').text(year);
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

    onPositionChange(position){
        this.simu.onBuildMenuStateChanged(this.state.targetBuild,
                                    position, this.state.targetBuild.radius);
    }

    setTargetBuild(target){
        this.setState({
            'targetBuild':{"type": target},
        });
    }
    setTargetBuildPos({pos, radius}){
        this.setState({
            'targetBuildPos':{
                pos: pos === undefined? this.state.targetBuildPos.pos:pos,
                radius: radius === undefined?
                                    this.state.targetBuildPos.radius:radius,
            },
        });
    }

    render(){
        if(this.state.simu === "unloaded"){
            return <p>Chargement ... </p>;
        }
        //this.setTargetBuild.bind(this)
        return (
        <div className="vLayout" >
        <StatusBar />

        <MapView cMap={this.state.simu.cMap} />

        <BuildDock
            buildMenuSelectionCallback = {this.setTargetBuild.bind(this)}
            buildMenuRadiusCallback = {this.setTargetBuildPos.bind(this)}
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
        />
         </div>);
    }
}
