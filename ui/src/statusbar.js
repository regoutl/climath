import { quantityToHuman as valStr } from '../quantitytohuman.js';

export default class StatusBar extends React.Component{
    constructor(props){
        super(props);

        this.state = {showStats:true, showBM:true};
    }

    render(){
        return (
        <div id="statusBar" className="hLayout" >
            <div className="vYear">{this.props.Date}</div>
            <div className="vMoney">{valStr(this.props.Money, '€')}</div>
        </div>);
    }
}
