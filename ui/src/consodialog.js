import {tr} from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {pieChart} from '../charts.js';
import {stackedLineChart} from '../charts.js';
import OriginDetails from './help/origindetails.js';


export class ConsoDialog extends React.Component{

    /** @details props
    closeRequested => function
    detailsRequested => function. user request details
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
        if(/*this.me.current.contains(e.target) && */this.bOk.current != e.target) //the dialog was clicked
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

        this.update();
    }

    componentDidUpdate(){
        this.update();
    }

    update(){
        let lastYearConso = this.props.history[this.props.history.length - 1].consumedEnergy;

        let ctx = this.pieChart.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.translate(50, 50);

        pieChart(ctx, lastYearConso.origin, 'energy', {fontColor: 'white', legend: 'text'});

        ctx.translate(-50, -50);
    }

    componentWillUnmount(){
        window.removeEventListener("mousedown", this.click);
        window.removeEventListener("keydown", this.key)
    }


    render(){
        return (<div
                className="dialog vLayout"
                ref={this.me}
                style={{
                    left: '100px',
                    top: 'calc(var(--status-bar-height) + 20px)' //60
                }}
                >
        <h3>{tr("Power origin in %d", '', this.props.history[this.props.history.length - 1].year)}</h3>
        <canvas ref={this.pieChart} width="200" height="110"/>
        <div className="hLayout">
            <div className="button white" ref={this.bOk} onClick={this.props.closeRequested}>{tr("Ok")}</div>
            <div className="button white" onClick={() => this.props.detailsRequested(OriginDetails)}>{tr('Details...')}</div>
        </div>
        </div>);
    }
}
