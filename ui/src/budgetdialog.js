import {tr} from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';


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

    constructor(props){
        super(props);

    }


    render(){
        return (<div className="dialog vLayout">
        <table>
            <tr>
                <th>{tr("Gross national product")}</th>
                <td>{valStr(this.props.gdp, '€')}</td>
            </tr>
            <tr>
                <th>{tr("Tax rate (average)")}</th>
                <td><TaxSlider oninput={this.props.onTaxRateChanged} value={this.props.taxRate}  /></td>
            </tr>
            <tr>
                <th>{tr("Taxes income")}</th>
                <td> + {valStr(this.props.gdp * this.props.taxRate, '€')}</td>
            </tr>
            <tr>
                <th>{tr("Regular government spendings")}</th>
                <td> - {valStr(this.props.gdp * this.props.regularTaxRate, '€')}</td>
            </tr>
        </table>
        <div className="button">{tr("Ok")}</div>
        </div>);
    }
}
