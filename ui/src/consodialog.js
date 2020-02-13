import {tr} from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {pieChart} from '../piechart.js';
import {stackedLineChart} from '../stackedlinechart.js';

let palette =     {
    nuke: 'yellow',
    pv:'rgb(70, 85,180)',
    fossil:'rgb(255, 124, 84)',
    storage:'rgb(0, 255, 250)',
    constructions:'red',
    ccgt:'rgb(169, 202, 250)',
    wind: 'white',
    fusion: 'green',
  };

export class ConsoDialog extends React.Component{

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

        pieChart(ctx, lastYearConso.origin, palette, {fontColor: 'white', legend: 'text'});

        ctx.translate(-50, -50);
    }

    componentWillUnmount(){
        window.removeEventListener("mousedown", this.click);
        window.removeEventListener("keydown", this.key)
    }


    render(){
        return (<div className="dialog vLayout" ref={this.me} style={{left: '100px', top: 110}}>
        <h3>{tr("Energy origin")}</h3>
        <canvas ref={this.pieChart} width="200" height="110"/>
        <div className="hLayout">
            <div className="button white" ref={this.bOk}>{tr("Ok")}</div>
        </div>
        </div>);
    }
}
