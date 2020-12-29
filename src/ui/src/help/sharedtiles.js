// Copyright 2020, ASBL Math for climate, All rights reserved.

import {tr} from '../../../tr.js';
import ReactPlot from '../reactplot.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import {AppContext} from '../appcontext.js';

/* accepted props : title, caption (text above plot), plot (the data), comment (text under plot).
All props are translated by this function
*/
export function PlotTile(props){
    return (<div>
        <h4>{tr(props.title)}</h4>

        {props.caption && <p>{tr(props.caption)}</p>}
        <ReactPlot data={props.plot} />
        {props.comment && <p>{tr(props.comment)}</p>}
        <p className="pSource">{props.plot.source}</p>
    </div>);
}

export function CentralProduction(props){
    let math = [
        <img key='1' src="res/symbols/nuke/production.svg" alt="Pv production eq" />,
        <ul key='2'>
            <li><img src="res/symbols/shared/nameplate.svg" alt="Nuke" /> {tr('is the central pic production')}</li>
            <li><img src="res/symbols/shared/capaFact.svg" alt="Nuke" /> {tr('is the capacity factor')}</li>
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
        <p key='1'>{tr('Primary energy efficiency is ') + props.primEnergyEffi}</p>,
        <p key='2'>{tr('This means that for 100 J of gas, ')+Math.round(props.primEnergyEffi*100)+ tr(' J of electricity are produced, and ') + Math.round(100 - props.primEnergyEffi*100) + tr(' J of heat must be dissipated.')}</p>,
        <p key='3'>{tr('Evacuhating this heat by boiling 20 deg water requires ')  + valStr(m3PerWh, 'm3/Wh') + tr(' produced')}</p>,
        <p key='4' className="pSource">{props.source}</p>
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



/*props :
value : whatever
onChange = function(new val)
*/
export class NumberEditOrShow extends React.Component{
    render(){
        let props = this.props;

        if(this.context.canEditParameters)
            return (
                <input type='text'
                    value={props.value}
                    onChange={(e) => {
                        let v = Number(e.target.value);
                        if(Number.isNaN(v) || props.min > v || props.max < v)
                            return;
                        props.onChange(v);
                    }}

                    style={{width: 30}}
                />);
        else{
            return <span>{props.value}</span>;
        }
    }
}

NumberEditOrShow.contextType = AppContext;
