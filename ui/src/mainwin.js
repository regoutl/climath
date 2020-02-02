import StatDock from './statdock.js';
import MapView from './mapview.js';
import BuildDock from './builddock.js';
import StatusBar from './statusbar.js';


import {Simulateur, promiseSimulater, objSum} from '../../simulateur/simulateur.js';


export default class MainWin extends React.Component{
    constructor(props){
        super(props);
        this.state ={};



    	/// set of small functions that update screen text when some values changes
    	let valChangedCallbacks={
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



    render(){
        if(this.state.simu === undefined){
            return <p>Chargement ... </p>;
        }

        return (
        <div className="vLayout" >
            <StatusBar />

            <MapView cMap={this.state.simu.cMap} />
            <BuildDock />
         </div>);
    }
}