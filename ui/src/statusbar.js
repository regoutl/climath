import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {tr} from '../../tr/tr.js';

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
        const energies = ['nuke', 'pv', 'fossil', 'storage', 'ccgt', 'wind', 'fusion'];

        const begin = Math.max(0, this.props.history.length - 20);

        let avgCo2 = 0;


        for(let i = begin; i < this.props.history.length; i++){
            let emi = this.props.history[i].co2;


            energies.forEach((item) => {avgCo2 += emi.build[item];});
            energies.forEach((item) => {avgCo2 += emi.perWh[item] + emi.perYear[item];});
        }

        avgCo2 /= (this.props.history.length - begin); //sum to avg


        //compute first year Co2
        let firstYearCo2 = 0;
        let emi = this.props.history[0].co2;
        energies.forEach((item) => {firstYearCo2 += emi.build[item];});
        energies.forEach((item) => {firstYearCo2 += emi.perWh[item] + emi.perYear[item];});


        //co2 increase compared to 2019, %
        let increase = -Math.round(100 * (1 - avgCo2 / firstYearCo2));

        let sign = increase > 0 ? '+ ': '- ';

        // let arrow = (<svg width="20" height="36">
        //     <polyline points="4,19 10,25 16,19" stroke="white" strokeLinecap="round" strokeWidth="1.5" fill="none"/>
        // </svg>);


        //electricity origin
        // let ctx = cStatEnergyOri.getContext("2d");
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // ctx.translate(50, 50);
        const consumed = this.props.history[this.props.history.length-1].consumedEnergy.total;
        // $('#dStats p')[0].innerHTML = 'Demande moyenne : ' + valStr(consumed.total, 'Wh');
        // pieChart(ctx, consumed.origin,palette);
        // ctx.translate(-50, -50);

        return (
        <div id="statusBar" className="hLayout" >
            <div
                title={tr('Last year consumption')}
                onClick={this.props.showConsoDialog}
            >
                {this.props.date} <img width="25" src="res/icons/electricEnergy.png" /> {valStr(consumed, 'W')}
            </div>
            <div
                title="Co2"
                onClick={this.props.showCo2Dialog}

            >
                <span title={tr('Average of the last 20 years')}>{valStr(avgCo2, 'C').slice(0, -5)} CO<sup>2</sup></span>
                <span
                    title={tr('Compared to 2019')}
                    style={{
                        padding:'10px 0 0 10px',
                        verticalAlign: 'middle' ,
                        fontSize: '14px',
                        color: (increase > 0 ? 'red': 'green')}}
                >{sign + Math.abs(increase)} %</span>
            </div>
            <div title={tr("Set budget")} onClick={this.props.showBudgetDialog}>{valStr(this.props.money, '€')}</div>
        </div>);
    }
}
