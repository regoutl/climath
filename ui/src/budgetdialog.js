import {tr} from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {pieChart} from '../charts.js';
import TaxDetails from './help/taxdetails.js';

/** @brief fancy slider for tax rates. Note that everyting is is range [0-1] */
class TaxSlider extends React.Component {
    /** @brief accepted props
    oninput = function(new val) : called on value changed.
    value : initial value
    */
    constructor(props){
        super(props);

        // this.state = {val: props.value};

        //that's bc bind return a != func each time, and we want to be able to remove the event listener
        this.mousemove = this.onMouseMove.bind(this);
        this.mouseup = this.onMouseUp.bind(this);
    }

    componentDidMount(){
        window.addEventListener('mousemove', this.mousemove);
        window.addEventListener('mouseup', this.mouseup);
    }
    componentWillUnmount(){
        window.removeEventListener('mousemove', this.onmousemove);
        window.removeEventListener('mouseup', this.mouseup);
    }

    onMouseDown(e){
        this.grab = true;
    }

    onMouseMove(e){
        if(!this.grab)
            return;

        this.onClick(e);
    }
    onMouseUp(e){
        this.grab = false;
    }

    onClick(e){
        let rect = this.refs.me.getBoundingClientRect();
        let x = e.clientX - rect.left; //x position within the element.

        let prop = x / (rect.right - rect.left);
        this.props.oninput(Math.max(0, Math.min(1, prop)));

        // this.setState({val: Math.max(0, Math.min(1, prop))});
    }

    render(){
        let borderColor = {r: 0, g:0, b:0};
        if(this.props.value < 0.3){
            borderColor = {r: 75, g:198, b:125};
        }
        else if(this.props.value < 0.45){
            let prop = (this.props.value - 0.3) / (0.45 - 0.3); // prop of the end color (1 = yellow)
            // borderColor = {r: 75, g:198, b:125};
            // 	241, 196, 15

            borderColor.r = 75 * (1-prop) + 241 * prop;
            borderColor.g = 198 * (1-prop) + 196 * prop;
            borderColor.b = 125 * (1-prop) + 15 * prop;
        }
        else{
            let prop = (this.props.value - 0.45) / (1.0 - 0.45);
            // 	185, 74, 72

            borderColor.r = 241 * (1-prop) + 185 * prop;
            borderColor.g = 196 * (1-prop) + 74 * prop;
            borderColor.b = 15 * (1-prop) + 72 * prop;
        }



        return (<div className="taxSlider" ref="me" onClick={this.onClick.bind(this)}>
            <div
                className="handle"
                onMouseDown={this.onMouseDown.bind(this)}
                style={{left: (this.props.value*100) + '%', border: `5px solid rgb(${borderColor.r}, ${borderColor.g}, ${borderColor.b})`}}
            >
                {String(Math.round(this.props.value*100) + " %").substr(0, 4)}
            </div>
        </div>)
    }
}


export default class BudgetDialog extends React.Component{

    /** @details props
    closeRequested => function
    */
    constructor(props){
        super(props);

        this.click = this.onClick.bind(this);
        this.key = this.onKey.bind(this);

        this.me = React.createRef();
        this.bOk = React.createRef();
        this.pieChart = React.createRef();
    }

    onClick(e){
        if(this.me.current.contains(e.target) && this.bOk.current != e.target) //the dialog was clicked
            return;

        this.props.closeRequested();
    }

    onKey(e){
        if(e.key === "Escape") {
            this.props.closeRequested();
        }
    }

    componentDidMount(){
        //use a timeout, else the open click is catched by this event listener
        setTimeout(() => window.addEventListener("mousedown", this.click), 0);
        window.addEventListener("keydown", this.key)






        let lastYearCosts = this.props.history[this.props.history.length - 1].cost;

        let allOnM = {
          	"nuke":lastYearCosts.perYear.nuke + lastYearCosts.perWh.nuke,
          	"pv":lastYearCosts.perYear.pv + lastYearCosts.perWh.pv,
          	"fossil":lastYearCosts.perYear.fossil + lastYearCosts.perWh.fossil,
          	"storage":lastYearCosts.perYear.storage + lastYearCosts.perWh.storage,
            "ccgt":lastYearCosts.perYear.ccgt + lastYearCosts.perWh.ccgt,
            "wind":lastYearCosts.perYear.wind + lastYearCosts.perWh.wind,
            "fusion":lastYearCosts.perYear.fusion + lastYearCosts.perWh.fusion,
        }

        let ctx = this.pieChart.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.translate(50, 50);


        pieChart(ctx, allOnM, 'energy', {fontColor: 'white', legend: 'text'});
        ctx.translate(-50, -50);

    }

    componentWillUnmount(){
        window.removeEventListener("mousedown", this.click);
        window.removeEventListener("keydown", this.key)
    }


    render(){
        let lastYearCosts = this.props.history[this.props.history.length - 1].cost;

        let allOnM = {
          	"nuke":lastYearCosts.perYear.nuke + lastYearCosts.perWh.nuke,
          	"pv":lastYearCosts.perYear.pv + lastYearCosts.perWh.pv,
          	"fossil":lastYearCosts.perYear.fossil + lastYearCosts.perWh.fossil,
          	"storage":lastYearCosts.perYear.storage + lastYearCosts.perWh.storage,
            "ccgt":lastYearCosts.perYear.ccgt + lastYearCosts.perWh.ccgt,
            "wind":lastYearCosts.perYear.wind + lastYearCosts.perWh.wind,
            "fusion":lastYearCosts.perYear.fusion + lastYearCosts.perWh.fusion,
        }


        let taxIn = this.props.gdp * this.props.taxRate;
        let regSpend = this.props.gdp * this.props.regularTaxRate;
        let energySpend = allOnM.nuke + allOnM.pv + allOnM.fossil + allOnM.storage + allOnM.ccgt + allOnM.wind + allOnM.fusion;

        return (<div
            className="dialog vLayout"
            ref={this.me}
            style={{
                right: 50,
                top:'calc(var(--status-bar-height) + 20px)', //60
            }}
            >
        <table><tbody>
            <tr>
                <th style={{verticalAlign: 'middle'}}>{tr("Tax rate (average)")}</th>
                <td><TaxSlider oninput={this.props.onTaxRateChanged} value={this.props.taxRate}  /></td>
            </tr>
            <tr>
                <th>{tr("Taxes income")}</th>
                <td> + {valStr(taxIn, '€')}</td>
            </tr>
            <tr>
                <th>{tr("Regular government spendings")}</th>
                <td> - {valStr(regSpend, '€')}</td>
            </tr>
            <tr>
                <th>{tr("Energy maintenace (value of %d)", '', this.props.history[this.props.history.length - 1].year)}</th>
                <td><div> - {valStr(energySpend, '€')}</div><canvas ref={this.pieChart} width="250" height="100"/></td>
            </tr>
            <tr style={{borderTop: '1px solid white'}}>
                <th>{tr('Balance')}</th>
                <td>{valStr(taxIn - regSpend - energySpend, '€', {forceSign: true})}</td>
            </tr>
        </tbody></table>
        <div className="hLayout">
            <div className="button white" ref={this.bOk}  onClick={this.props.closeRequested}>{tr("Ok")}</div>
            <div className="button white" onClick={() => this.props.detailsRequested(TaxDetails)}>{tr('Details...')}</div>
        </div>
        </div>);
    }
}
