import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {tr} from '../../tr/tr.js';

export default class StatusBar extends React.Component{
    constructor(props){
        super(props);

        this.state = {showBudgetDialog:false};
    }

    render(){
        return (
        <div id="statusBar" className="hLayout" >
            <div title="">{this.props.date}</div>
            <div title="Co2">{this.props.co2}</div>
            <div title={tr("Set budget")} onClick={this.props.showBudgetDialog}>{valStr(this.props.money, '€')}</div>
        </div>);
    }
}
