import {tr} from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {pieChart} from '../charts.js';
import {stackedLineChart} from '../charts.js';

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

export class Co2Dialog extends React.Component{

    /** @details props
    closeRequested => function
    */
    constructor(props){
        super(props);

        this.click = this.onClick.bind(this);
        this.key = this.onKey.bind(this);

        this.me = React.createRef();
        this.bOk = React.createRef();
        this.pieCharts = React.createRef();
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
        const energies = ['nuke', 'pv', 'fossil', 'storage', 'ccgt', 'wind', 'fusion'];

        let ctx = this.pieCharts.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        let values = [];

        this.props.history.forEach((yearStat, i) => {
            let emi = yearStat.co2;

            let stat = {constructions: 0};
            energies.forEach((item) => {stat.constructions+=emi.build[item];});
            energies.forEach((item) => {stat[item]=emi.perWh[item] + emi.perYear[item];});

            values.push(stat);
        });


        stackedLineChart(ctx, values, {
            palette: palette,
            order: ['fossil', 'ccgt', 'nuke', 'fusion', 'constructions'],
            from: this.props.history[0].year,
            to: this.props.history[this.props.history.length-1].year,
            unit: 'C',
            width: 400,
        });
    }

    componentWillUnmount(){
        window.removeEventListener("mousedown", this.click);
        window.removeEventListener("keydown", this.key)
    }


    render(){
        return (<div className="dialog vLayout" ref={this.me} style={{left: '50%', top: 60, marginLeft: -210}}>
        <h3>Emissions</h3>
        <canvas ref={this.pieCharts} width="400" height="200"/>
        <div className="hLayout">
            <div className="button white" ref={this.bOk}>{tr("Ok")}</div>
        </div>
        </div>);
    }
}
