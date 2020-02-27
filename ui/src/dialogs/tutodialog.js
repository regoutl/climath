import {tr} from "../../../tr/tr.js";
import {Dialog} from './dialog.js';



export class TutoDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {slide:0}
    }

    render(){
        let props = this.props;

        let slide = [
            {title:'Objective', body:[
                <p>{tr('Emmit 0 carbon between 2050 and 2070')}</p>,
                <p>{tr('Build low carbon power plants')}</p>,
            ]},
            {title:'Power plants construction', body:[
                <img src='res/tuto/slide2.png' width="300"/>
            ]},
            {title:'Power plants types', body:[
                <div className='hLayout'>
                    <div className='vLayout'>
                        <h4>{tr('Renewables')}</h4>
                        <img src='res/icons/wind.png' style={{filter:'invert(1)'}} height="50" />
                        <p>{tr('Low carbon. Does not produce all time')}</p>
                    </div>
                    <div className='vLayout' style={{borderLeft: '1px solid white'}}>
                        <h4>{tr('Storage')}</h4>
                        <img src='res/icons/bat.png' style={{filter:'invert(1)'}} height="50" />
                        <p>{tr('Store energy')}</p>
                    </div>
                    <div className='vLayout' style={{borderLeft: '1px solid white'}}>
                        <h4>{tr('Centrals')}</h4>
                        <img src='res/icons/ccgt.png' height="50" />
                        <p>{tr('Stable production. Requires water.')}</p>
                    </div>
                </div>
            ]},
        ];

        return (
            <Dialog
                className='tuto'
                title={slide[this.state.slide].title}
                onNext={() => {this.state.slide == slide.length-1 ? props.closeRequested(): this.setState((state) => {return {slide: state.slide + 1}})}}
                onSkip={() => props.closeRequested()}
            >
                {slide[this.state.slide].body}
            </Dialog>);
    }
}
