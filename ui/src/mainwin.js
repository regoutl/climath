import StatDock from './statdock.js';
import MapView from './mapview.js';
import BuildDock from './builddock.js';
import StatusBar from './statusbar.js';
import BudgetDialog from './budgetdialog.js';
import {tr} from '../../tr/tr.js';

import Scene from '../scene.js';

import {Simulateur, promiseSimulater, objSum} from '../../simulateur/simulateur.js';

function NullDialog(props){
    return null;
}


export default class MainWin extends React.Component{
    constructor(props){
        super(props);

        //those are no state bc their draw is not related to a DOM change
        this.simu= null;
        this.targetBuild= {},
        this.targetBuildLoc= {pos:{x:0, y:0}, radius:0},

        this.state = {
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
            currentDialog: NullDialog
        };



        this.slider = {default: 50, min: 1, max: 100,
            sliderChange: (r) => this.setTargetBuildLoc({radius: Number(r)})};
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

        this.scene = new Scene();

        promiseSimulater(valChangedCallbacks, this.scene).then(s =>{
            this.scene.setMap(s.cMap);

            this.simu = s;

            this.forceUpdate();
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
        if(target === undefined && this.targetBuild.type !== undefined){//we just cleaered the cursor
            // this.targetBuildLoc = targetBuildLoc;

            this.scene.cursor.type = undefined;
            this.setState({
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

        this.targetBuild.type = target;
        this.targetBuildLoc = {pos:{x:0, y:0}, radius: this.slider.default};
    }

    /** callback
        set the current location of the cursor as {pos:{x:,y:}, radius:}
    */
    setTargetBuildLoc({pos=this.targetBuildLoc.pos,
                                    radius=this.targetBuildLoc.radius}){



        let targetBuildLoc = {
            pos: pos,
            radius: radius,
        }, vBMArea = "", vBMBuildCost = 0;



        if(this.targetBuild.type !== undefined ){
        //     && targetBuildLoc.pos !== undefined){  -> non : target buid loc undefined := "valeur moyenne"
            const info = this.simu.onBuildMenuStateChanged(
                this.targetBuild, targetBuildLoc.pos,
                targetBuildLoc.radius).info;


            let avgProd = info.nameplate ? info.nameplate.at(info.build.end) * info.avgCapacityFactor : 0;

            this.targetBuildLoc = targetBuildLoc;


            this.scene.cursor={
                            type:this.targetBuild.type,
                            radius: this.targetBuildLoc.radius,
                            pos:this.targetBuildLoc.pos
                        };

            this.setState({
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

    }

    runYear(){
        this.simu.run();


    }

    showBudgetDialog(){
        this.setState({currentDialog: BudgetDialog});
    }

    onTaxRateChanged(newVal){
        this.simu.taxRate = newVal;
        this.forceUpdate();
    }

    render(){
        if(this.simu === null){
            return <p>Chargement ... </p>;
        }

        let CurDialog = this.state.currentDialog;

        return (
        <div className="vLayout" style={{width: '100%', height: '100%'}}>
        <StatusBar
            date = {this.state.date}
            money = {this.state.money}
            showBudgetDialog={this.showBudgetDialog.bind(this)}
        />

        <MapView
            scene={this.scene}
            onMouseMove={(curPos) => this.setTargetBuildLoc({pos: curPos})}
            onClick={(curPos) => this.simu.confirmCurrentBuild()}
        />

        <BuildDock
            buildMenuSelectionCallback = {this.setTargetBuild.bind(this)}
            target = {this.targetBuild.type}
            info={this.state.currentBuildInfo}
            sliderRadius = {this.slider}
        />

        <div
            id="bNextTurn"
            title={tr("Go to the next year")}
            onClick={this.runYear.bind(this)}
        >
            {tr("Next turn")}

        </div>

        <CurDialog gdp={this.simu.gdp} regularTaxRate={this.simu.minTaxRate} taxRate={this.simu.taxRate} onTaxRateChanged={this.onTaxRateChanged.bind(this)}/>
         </div>);
    }

}
