import {tr} from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {periodAvgCo2} from '../../periodavgco2.js';

export class EndDialog extends React.Component{

    /** @details props
    closeRequested => function
    */
    constructor(props){
        super(props);

        this.click = this.onClick.bind(this);
        this.key = this.onKey.bind(this);

    }

    onClick(e){
        this.props.closeRequested();
    }

    onKey(e){
        if(e.key === "Escape") {
            this.props.closeRequested();
        }
    }

    componentDidMount(){
        //use a timeout, else the open click is catched by this event listener
        window.addEventListener("keydown", this.key);

    }


    componentWillUnmount(){
        window.removeEventListener("keydown", this.key)
    }


    render(){
        let avgCo2 = periodAvgCo2(this.props.history, Math.max(0, this.props.history.length - 20), this.props.history.length);
        let firstYearCo2 = periodAvgCo2(this.props.history, 0, 1);


        //co2 increase compared to 2019, %
        let increase = Math.round(100 * (1 - avgCo2 / firstYearCo2));

        let avgTax = 0;
        this.props.history.forEach((year, i) => {
            avgTax += year.taxes.rate;
        });
        avgTax /= this.props.history.length;
        avgTax *= 100;
        avgTax = Math.round(avgTax);



        return (
            <div style={{position: 'absolute', width: '100%', 'height':'100%', zIndex: 100000000, alignItems: 'center', justifyContent: 'center'}} className="vLayout">
                <div className="dialog vLayout" ref={this.me} style={{position: 'static', flex: '0 0'}}>
                    <h3>{tr("The end")}</h3>
                    <table>
                    <tr>
                        <th>{tr('Objective reached at')}</th>
                        <td>{increase} %</td>
                    </tr>
                    <tr>
                        <th>{tr('Average taxes')}</th>
                        <td>{avgTax }%</td>
                    </tr>
                    <tr>
                        <th>{tr('Territory occupied')}</th>
                        <td>{Math.round(this.props.energyGroundUseProp * 100)} %</td>
                    </tr>
                    <tr>
                        <th>{tr('River level diminution')}</th>
                        <td>0 %</td>
                    </tr>
                    <tr>
                        <th>{tr('Nuclear refugies')}</th>
                        <td>0 Hab</td>
                    </tr>
                    </table>
                    <div className="hLayout">
                        <div className="button white" onClick={this.click}>{tr("Continue playing")}</div>
                        <div className="button white" onClick={this.props.newGame}>{tr("New game")}</div>
                    </div>
                </div>
            </div>);
    }
}
