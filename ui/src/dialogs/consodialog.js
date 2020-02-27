import {tr} from "../../../tr/tr.js";
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import {pieChart, stackedLineChart} from '../../charts.js';
import OriginDetails from '../help/origindetails.js';
import {Dialog} from './dialog.js';

export class ConsoDialog extends React.Component{

    /** @details props
    closeRequested => function
    detailsRequested => function. user request details
    */
    constructor(props){
        super(props);

        this.pieChart = React.createRef();
    }

    componentDidMount(){
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


    render(){
        let props = this.props;

        return (
        <Dialog
            style={{
                left: '100px',
                top:'statusbar',
            }}
            onOk={props.closeRequested}
            onDetails={() => this.props.detailsRequested(OriginDetails)}
        >
            <h3>{tr("Power origin in %d", '', this.props.history[this.props.history.length - 1].year)}</h3>
            <canvas ref={this.pieChart} width="200" height="110" style={{width: 200}}/>
        </Dialog>);
    }
}
