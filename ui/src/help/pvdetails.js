
import {tr} from '../../../tr/tr.js';
import {Plot} from '../../plot.js';

/** @brief this class provide a lot of explainations about pv
*/
export default class PvDetails extends React.Component{

    /* accepted props
    efficiency : Raw Time varying input
    */
    constructor(props){
        super(props);
        this.cEffi = React.createRef();//canvas of the effi plot
        this.cBuildEn = React.createRef();//canvas of the effi plot
        this.cBuildCost = React.createRef();//canvas of the effi plot
    }

    componentDidMount(){
        let p = new Plot(this.props.efficiency, 300, 200);
        p.draw(this.cEffi.current.getContext('2d'));

        p = new Plot(this.props.buildEnergy, 300, 200);
        p.draw(this.cBuildEn.current.getContext('2d'));

        p = new Plot(this.props.buildCost, 300, 200);
        p.draw(this.cBuildCost.current.getContext('2d'));
    }
    componentWillUnmount(){

    }

    render(){
        return (<div >
            <h3>{tr('Solar panels')}</h3>
            <p>{tr('Solar pannels are devices that transform sun into electricity.')}</p>
            <p>{tr('They are caracterised by their efficiency : the proportion of sun power transformed into electric power. ')}</p>
            <h4>{tr('Efficiency evolution')}</h4>
            <canvas ref={this.cEffi} width="300" height="200"/>
            <p className="pSource">{this.props.efficiency.comment}</p>

            <h4>{tr('Build energy')}</h4>

            <p>{tr('Solar pannel manufacturing cost some energy. ')}</p>
            <canvas ref={this.cBuildEn} width="300" height="200"/>
            <p>{tr('This implies that, depending on the country, the pollution varies')}</p>

            <h4>{tr('Build cost')}</h4>

            <p>{tr('Solar pannel manufacturing cost. ')}</p>
            <canvas ref={this.cBuildCost} width="300" height="200"/>

        </div>);
    }
}
