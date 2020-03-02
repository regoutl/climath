
import {tr} from '../../../tr.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';

function Production(props){
    let turbDensTxt = ('is turbin density. Const ' + (0.1*Math.round(props.turbineDensity * 1e7) + ' turbine/km2'));

    let math =  [
        <p key='1'>Production of a wind farm of area <img src='res/symbols/shared/area.svg'/> is : </p>,
        <img key='2' src='res/symbols/wind/production.svg' />,
        <ul key='3'>
            {[{img:'wind/turbDens', descr: turbDensTxt},
            {img:'wind/rotRad', descr: 'is the rotor radius. Const. 45m'},
            {img:'wind/wpd', descr: 'is the wind power density (W/m2)'},
            {img:'shared/efficiency', descr: 'is the efficiency'},
            {img:'shared/capaFactT', descr: 'is the capacity factor at hour t'},
        ].map((i) => <li key={i.img}><img src={"res/symbols/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
        </ul>];

    let text = [<p key='1'>{tr('The production depends on :')}</p>,
        <ul key='2' className='default'>
            {[
                'The area. ',
                'The number of turbines per km2.',
                'The turbine size',
                'The amount of wind. ' +
                'The amount of wind depends on the location (we call it \'Wind power density\') ' +
                'and the time of the day/year (we call it \'Capacity factor\').',
                'The wind turbine efficiency.  ',
            ].map((i) => <li key={i}>{tr(i)}</li>)}
        </ul>
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

/** @brief this class provide a lot of explainations about pv
*/
export default function WindDetails(props){
    let wind = props.parameters.energies.wind;


    return (<div className='detailContent' style={props.restyle}>
        <h3>{tr('Wind turbines (onshore @50m)')}</h3>
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

            <div>
                <h4>{tr('Wind power density')}</h4>
                <p>The wind power density is the wind power flux. </p>
                <a href={'data/' + props.parameters.countryCode+ '/wind/meanWindPowerDensity50.png'} title={tr('Click to download')}>
                    <img src={'data/' + props.parameters.countryCode+ '/wind/meanWindPowerDensity50.png'} width="300"/>
                </a>
                <p className="pSource">https://globalwindatlas.info/</p>
            </div>

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
