import {tr} from "../../../tr/tr.js";
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import {pieChart, stackedLineChart} from '../../charts.js';
import {Dialog} from './dialog.js';

export class Co2Dialog extends React.Component{

    /** @details props
    closeRequested => function
    */
    constructor(props){
        super(props);


        this.pieCharts = React.createRef();
    }

    componentDidMount(){
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
            palette: 'energy',
            order: ['fossil', 'ccgt', 'nuke', 'fusion', 'constructions'],
            from: this.props.history[0].year,
            to: this.props.history[this.props.history.length-1].year,
            unit: 'C',
            width: 400,
        });
    }


    render(){
        let props = this.props;
        return (
            <Dialog
                onOk={props.closeRequested}
                title="Emissions"
                style={{top:'statusbar',}}
            >
                <canvas ref={this.pieCharts} width="400" height="200"/>
            </Dialog>
        );
    }
}
