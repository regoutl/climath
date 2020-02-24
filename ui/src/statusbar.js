import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {tr} from '../../tr/tr.js';
import {periodAvgCo2} from '../../periodavgco2.js';
import BudgetDialog from './budgetdialog.js';
import {Co2Dialog} from './co2dialog.js';
import {ConsoDialog} from './consodialog.js';

export default class StatusBar extends React.Component{
    /*
    props :
    showCo2Dialog : function called on click on co2
    showConsoDialog : function called on click on conso
    showBudgetDialog : function called on click on money

    history : simu stat array
    date : current year
    money : current money
    */
    constructor(props){
        super(props);

        this.state = {showBudgetDialog:false};
    }

    render(){
        //compute co2 of the last 15 years
        let avgCo2 = periodAvgCo2(this.props.history, Math.max(0, this.props.history.length - 20), this.props.history.length);
        let firstYearCo2 = periodAvgCo2(this.props.history, 0, 1);


        //co2 increase compared to 2019, %
        let increase = -Math.round(100 * (1 - avgCo2 / firstYearCo2));

        let sign = increase > 0 ? '+ ': '- ';

        // let arrow = (<svg width="20" height="36">
        //     <polyline points="4,19 10,25 16,19" stroke="white" strokeLinecap="round" strokeWidth="1.5" fill="none"/>
        // </svg>);


        //electricity origin
        const consumed = this.props.currentConso;

        return (
        <div id="statusBar" className="hLayout" >
            <div
                title={tr('Needed power')}
                onClick={() => this.props.showDialog(ConsoDialog)}
            >
                {this.props.date} <img width="25" src="res/icons/electricEnergy.png" /> {valStr(consumed, 'W')}
            </div>
            <div
                title="Co2"
                onClick={() => this.props.showDialog(Co2Dialog)}

            >
                <span title={tr('Average of the last 20 years')}>{valStr(avgCo2, 'C').slice(0, -5)} CO<sup>2</sup></span>
                <span
                    title={tr('Compared to 2019')}
                    style={{
                        padding:'10px 0 0 10px',
                        verticalAlign: 'middle' ,
                        fontSize: '14px',
                        color: (increase > 0 ? 'red': 'lime')}}
                >{sign + Math.abs(increase)} %</span>
            </div>
            <div title={tr("Set budget")} onClick={() => this.props.showDialog(BudgetDialog)}>{valStr(this.props.money, '€')}</div>
        </div>);
    }
}
