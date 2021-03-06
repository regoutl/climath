// Copyright 2020, ASBL Math for climate, All rights reserved.


import {tr} from '../../../tr.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';
import {Symbol} from  './symbol.js';

function Production(props){
    let turbinePerKm2 = 0.1*Math.round(props.turbineDensity * 1e7);

    // let math =  [
    //     <p key='1'>Production of a wind farm of area <img src='res/symbols/shared/area.svg'/> is : </p>,
    //     <img key='2' src='res/symbols/wind/production.svg' />,
    //     <ul key='3'>
    //         <li key='wind/turbDens'>
    //             <img src={"res/symbols/wind/turbDens.svg"} alt={'tubine density'} />
    //             {tr(' is turbin density. Const %d turbine/km2', '', turbinePerKm2)}
    //         </li>
    //     {[
    //         {img:'wind/rotRad', descr: 'is the rotor radius. Const. 49.5m. (General Electric: 2.5XL)'},
    //         {img:'wind/wpd', descr: 'is the wind power density (W/m2)'},
    //         {img:'shared/efficiency', descr: 'is the efficiency'},
    //         {img:'shared/capaFactT', descr: 'is the capacity factor at hour t'},
    //     ].map((i) => (
    //         <li key={i.img}>
    //             <img src={"res/symbols/" + i.img +".svg"} alt={i.descr} />
    //              {tr(i.descr)}
    //         </li>))}
    //     </ul>];
    // <p key='6'>W 0.9 is the 90 percentile of wind power density, wich we integrate over the rotor's area, epsilon is the efficiency </p>

    let math = [
        <p key='1'>{tr('Production at hour')} <Symbol src='shared/hour' /> {tr('of a wind farm is')} </p>,
        <Symbol key='2' src='wind/productionAtH' />,
        <p key='w'>{tr('Where', 'Mathematic formula where...')} </p>,
        <ul key='3'>
            <li key='3'> <Symbol key='2' src='shared/capaFactH' /> {tr('is the capacity factor at hour h. ')}</li>
            <li key='4'> <Symbol key='2' src='shared/nameplate' /> {tr('is the farm\'s maximum capacity  :')}<br />
                <Symbol key='5' src='wind/nameplate' />
                <p key='f'>{tr('Where', 'Mathematic formula where...')} </p>
                <ul key='sdf'>
                    <li key='n'><Symbol key='2' src='shared/number' /> {tr('is the number of turbines.')} </li>
                    <li key='e'><Symbol key='2' src='shared/efficiency' /> {tr('is the efficiency of the turbines.')} </li>
                    <li key='w'><Symbol key='2' src='wind/windPowerDensity90Percentile' /> {tr('is the 90th percentile of wind power density.')}</li>
                    <li key='a'><Symbol key='2' src='shared/area' /> {tr('is the area of the rotor. ')}</li>
                </ul>
            </li>
        </ul>,
        <p key='4'>{tr('We assume %d turbine / km2, ', '',  turbinePerKm2) + tr(' a height of 100m and a rotor radius of 99 meters.')}</p>
    ];

    let text = [<p key='1'>{tr('The production of a wind turbine depends on :')}</p>,
        <ul key='2' className='default'>
            {[
                'its rotor size. ',
                'the amount of wind it receives' +
                ', which depends on the turbine location  ' +
                'and on the time of the day/year.',
                'its efficiency.  ',
            ].map((i) => <li key={i}>{tr(i)}</li>)}
        </ul>,
        <p key='3'><br />{ tr('We assume that there are, on average, %d turbine / km2', '',  turbinePerKm2)}</p>
    ];

    return (
        <MathTextTile
            title="Production"
            math={math}
            text={text}
        />
    );
}

function CapaFact(props){
    return (    <div>
            <h4>{tr('Capacity factor')}</h4>
            <p>{tr('Naturally, wind turbines do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')}</p>

            <a href={"data/" + props.country + "/wind/wind_onshore_capaFact.csv"}>{tr('Download the historic data')}</a>
            <p className="pSource">https://www.renewables.ninja/downloads</p>
        </div>);
}

function WindPowerDensity(props){
    let text = [<p key='1'>{tr('This map shows the average wind energy at a height of 100 meters.')} </p>,
                <a key='2' href={'data/' + props.country + '/wind/meanWPD100.png'} title={tr('Click to download')}>
                    <img src={'data/' + props.country + '/wind/meanWPD100.png'} width="300"/>
                </a>,
                <p key='3' className="pSource">https://globalwindatlas.info/</p>
            ];
    //source (v0.9)/(v bar) = 1.3 : global wind atlas, temporal data, annual * mensual * hourly

    let math = [<p key='1'>{tr('This map shows the average wind power density at a height of 100 meters (W/m2).')} </p>,
              <p key='1.1'>{tr('The 90th percentile of wind power density is approximated by :')}<br /><Symbol src='wind/avgWindTo90'/></p>,
              <p key='1.2'>{tr('We assume ')}<Symbol src='wind/avgWindTo90Coef' /> {tr(' to be 1.3. ')}</p>,
                <a key='2' href={'data/' + props.country + '/wind/meanWPD100.png'} title={tr('Click to download')}>
                    <img src={'data/' + props.country + '/wind/meanWPD100.png'} width="300"/>
                </a>,
                <p key='3' className="pSource">https://globalwindatlas.info/</p>
            ];

    return (
      <MathTextTile
          title="Wind energy map"
          math={math}
          text={text}
      />
    );
}

/** @brief this class provide a lot of explainations about pv
*/
export default function WindDetails(props){
    let wind = props.parameters.energies.wind;


    return (<div className='detailContent' style={props.restyle}>
        <h3>{tr('Wind turbines (onshore @100m)')}</h3>
        <p>{tr('Wind turbines are devices that transform wind kinetic energy into electricity.')}</p>


        <div className="hWrapLayout">
            <Production
                turbineDensity={wind.density.years[0] * wind.density.valMul }
            />

            <PlotTile
                title='Efficiency'
                caption="Proportion of wind energy transformed into electricity. "
                plot={wind.efficiency}
            />


            <CapaFact country={props.parameters.countryCode}/>

            <WindPowerDensity country={props.parameters.countryCode} />

            <PlotTile
                title='Build cost'
                caption="Build cost per item. "
                plot={wind.build.cost}
            />

            <PlotTile
                title='Maintenance cost'
                caption="Yearly cost per item. "
                plot={wind.perYear.cost}
            />
        </div>

    </div>);
}
