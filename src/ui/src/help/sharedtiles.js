import {tr} from '../../../tr.js';
import ReactPlot from '../reactplot.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import {AppContext} from '../appcontext.js';

/* accepted props : title, caption, plot*/
export function PlotTile(props){
    return (<div>
        <h4>{tr(props.title)}</h4>

        {props.caption && <p>{tr(props.caption)}</p>}
        <ReactPlot data={props.plot} />
        <p className="pSource">{props.plot.source}</p>
    </div>);
}

export function CentralProduction(props){
    let math = [
        <img src="data/nuke/production.svg" alt="Pv production eq" />,
        <ul>
            <li><img src="data/symbols/nameplate.svg" alt="Nuke" /> {tr('is the central pic production')}</li>
            <li><img src="data/symbols/capaFact.svg" alt="Nuke" /> {tr('is the capacity factor')}</li>
        </ul>
    ];

    let text = (<p>{tr('Production of a central is roughly constant, except for the reparations/maintenance that requires a full stop. The capacity factor model that.')}</p>);

    return (
        <MathTextTile
            title="Production"
            math={math}
            text={text}
        />);
}

//props : primEnergyEffi : float, source
export function CoolingTile(props){
    const waterVapoNrg = 2250; // J / g
    const waterTCapa = 4185; // J/ kg / K
    const waterInitTemp = 20;
    const jToVapM3 = (100 - waterInitTemp) * 1000 *waterTCapa + waterVapoNrg * 1000000;
    const primEnergyPerProduced = 1 / props.primEnergyEffi;
    const heatPerEnProduced = primEnergyPerProduced * (1 - props.primEnergyEffi); //

    let m3PerJ = heatPerEnProduced / jToVapM3;
    let m3PerWh = m3PerJ * 3600;


    let math = [
        <p>{tr('Primary energy efficiency is ') + props.primEnergyEffi}</p>,
        <p>{tr('This means that for 100 J of gas, ')+Math.round(props.primEnergyEffi*100)+ tr(' J of electricity are produced, and ') + Math.round(100 - props.primEnergyEffi*100) + tr(' J of heat must be dissipated.')}</p>,
        <p>{tr('Evacuhating this heat by boiling 20 deg water requires ')  + valStr(m3PerWh, 'm3/Wh') + tr(' produced')}</p>,
        <p className="pSource">{props.source}</p>
    ];

    let text = <p>{tr('Thermic centrals heats water in order to produce electricity. ' +
    'That hot water cannot be trashed back in a river, because it would harm the eco-system.' +
    ' Therefore, what they do is to boil it throught those big chemeys. The amount of water consumed is ') + valStr(m3PerWh, 'm3/Wh')}</p>;

    return (<MathTextTile title="Cooling" math={math} text={text} />);
}


/// display a tile with text or equation (user choosable).
/* props :
title : string
math : react component displaying the math
text : react comp. if null and equation display mode is text, hides the dock
//hideModeToggleButton : bool. default false. if true, do not displays the mode toggle button
*/
export class MathTextTile extends React.Component{
    render(){
        let props = this.props;

        if(this.context.equationDisplay == 'text' && !props.text)
            return null;


        return (
            <div className='mathTextTile'>
                <h4>
                    <span>{tr(props.title)}</span>
                    <div>
                    <img
                        onClick={this.context.toggleEquationDisplay}
                        title={tr(this.context.equationDisplay == 'math' ? 'Display as text':'Display the equation')}
                        width="32"
                        src={'res/icons/' + (this.context.equationDisplay == 'math' ? 'text.png' : 'math.png')}
                    />
                    </div>
                </h4>
                {this.context.equationDisplay == 'math' ? props.math : props.text}
            </div>);
    }
}

MathTextTile.contextType = AppContext;
