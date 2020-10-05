// Copyright 2020, ASBL Math for climate, All rights reserved.


import { tr } from '../../../tr.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';
import { Symbol as _Symbol } from './symbol.js';

function Production(props) {
    var turbinePerKm2 = 0.1 * Math.round(props.turbineDensity * 1e7);

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

    var math = [React.createElement(
        'p',
        { key: '1' },
        tr('Production at hour'),
        ' ',
        React.createElement(_Symbol, { src: 'shared/hour' }),
        ' ',
        tr('of a wind farm is'),
        ' '
    ), React.createElement(_Symbol, { key: '2', src: 'wind/productionAtH' }), React.createElement(
        'p',
        { key: 'w' },
        tr('Where', 'Mathematic formula where...'),
        ' '
    ), React.createElement(
        'ul',
        { key: '3' },
        React.createElement(
            'li',
            { key: '3' },
            ' ',
            React.createElement(_Symbol, { key: '2', src: 'shared/capaFactH' }),
            ' ',
            tr('is the capacity factor at hour h. ')
        ),
        React.createElement(
            'li',
            { key: '4' },
            ' ',
            React.createElement(_Symbol, { key: '2', src: 'shared/nameplate' }),
            ' ',
            tr('is the farm\'s maximum capacity  :'),
            React.createElement('br', null),
            React.createElement(_Symbol, { key: '5', src: 'wind/nameplate' }),
            React.createElement(
                'p',
                { key: 'f' },
                tr('Where', 'Mathematic formula where...'),
                ' '
            ),
            React.createElement(
                'ul',
                { key: 'sdf' },
                React.createElement(
                    'li',
                    { key: 'n' },
                    React.createElement(_Symbol, { key: '2', src: 'shared/number' }),
                    ' ',
                    tr('is the number of turbines.'),
                    ' '
                ),
                React.createElement(
                    'li',
                    { key: 'e' },
                    React.createElement(_Symbol, { key: '2', src: 'shared/efficiency' }),
                    ' ',
                    tr('is the efficiency of the turbines.'),
                    ' '
                ),
                React.createElement(
                    'li',
                    { key: 'w' },
                    React.createElement(_Symbol, { key: '2', src: 'wind/windPowerDensity90Percentile' }),
                    ' ',
                    tr('is the 90th percentile of wind power density.')
                ),
                React.createElement(
                    'li',
                    { key: 'a' },
                    React.createElement(_Symbol, { key: '2', src: 'shared/area' }),
                    ' ',
                    tr('is the area of the rotor. ')
                )
            )
        )
    ), React.createElement(
        'p',
        { key: '4' },
        tr('We assume %d turbine / km2, ', '', turbinePerKm2) + tr(' a height of 100m and a rotor radius of 99 meters.')
    )];

    var text = [React.createElement(
        'p',
        { key: '1' },
        tr('The production of a wind turbine depends on :')
    ), React.createElement(
        'ul',
        { key: '2', className: 'default' },
        ['its rotor size. ', 'the amount of wind it receives' + ', which depends on the turbine location  ' + 'and on the time of the day/year.', 'its efficiency.  '].map(function (i) {
            return React.createElement(
                'li',
                { key: i },
                tr(i)
            );
        })
    ), React.createElement(
        'p',
        { key: '3' },
        React.createElement('br', null),
        tr('We assume that there are, on average, %d turbine / km2', '', turbinePerKm2)
    )];

    return React.createElement(MathTextTile, {
        title: 'Production',
        math: math,
        text: text
    });
}

function CapaFact(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h4',
            null,
            tr('Capacity factor')
        ),
        React.createElement(
            'p',
            null,
            tr('Naturally, wind turbines do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')
        ),
        React.createElement(
            'a',
            { href: "data/" + props.country + "/wind/wind_onshore_capaFact.csv" },
            tr('Download the historic data')
        ),
        React.createElement(
            'p',
            { className: 'pSource' },
            'https://www.renewables.ninja/downloads'
        )
    );
}

function WindPowerDensity(props) {
    var text = [React.createElement(
        'p',
        { key: '1' },
        tr('This map shows the average wind energy at a height of 100 meters.'),
        ' '
    ), React.createElement(
        'a',
        { key: '2', href: 'data/' + props.country + '/wind/meanWPD100.png', title: tr('Click to download') },
        React.createElement('img', { src: 'data/' + props.country + '/wind/meanWPD100.png', width: '300' })
    ), React.createElement(
        'p',
        { key: '3', className: 'pSource' },
        'https://globalwindatlas.info/'
    )];
    //source (v0.9)/(v bar) = 1.3 : global wind atlas, temporal data, annual * mensual * hourly

    var math = [React.createElement(
        'p',
        { key: '1' },
        tr('This map shows the average wind power density at a height of 100 meters (W/m2).'),
        ' '
    ), React.createElement(
        'p',
        { key: '1.1' },
        tr('The 90th percentile of wind power density is approximated by :'),
        React.createElement('br', null),
        React.createElement(_Symbol, { src: 'wind/avgWindTo90' })
    ), React.createElement(
        'p',
        { key: '1.2' },
        tr('We assume '),
        React.createElement(_Symbol, { src: 'wind/avgWindTo90Coef' }),
        ' ',
        tr(' to be 1.3. ')
    ), React.createElement(
        'a',
        { key: '2', href: 'data/' + props.country + '/wind/meanWPD100.png', title: tr('Click to download') },
        React.createElement('img', { src: 'data/' + props.country + '/wind/meanWPD100.png', width: '300' })
    ), React.createElement(
        'p',
        { key: '3', className: 'pSource' },
        'https://globalwindatlas.info/'
    )];

    return React.createElement(MathTextTile, {
        title: 'Wind energy map',
        math: math,
        text: text
    });
}

/** @brief this class provide a lot of explainations about pv
*/
export default function WindDetails(props) {
    var wind = props.parameters.energies.wind;

    return React.createElement(
        'div',
        { className: 'detailContent', style: props.restyle },
        React.createElement(
            'h3',
            null,
            tr('Wind turbines (onshore @100m)')
        ),
        React.createElement(
            'p',
            null,
            tr('Wind turbines are devices that transform wind kinetic energy into electricity.')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(Production, {
                turbineDensity: wind.density.years[0] * wind.density.valMul
            }),
            React.createElement(PlotTile, {
                title: 'Efficiency',
                caption: 'Proportion of wind energy transformed into electricity. ',
                plot: wind.efficiency
            }),
            React.createElement(CapaFact, { country: props.parameters.countryCode }),
            React.createElement(WindPowerDensity, { country: props.parameters.countryCode }),
            React.createElement(PlotTile, {
                title: 'Build cost',
                caption: 'Build cost per item. ',
                plot: wind.build.cost
            }),
            React.createElement(PlotTile, {
                title: 'Maintenance cost',
                caption: 'Yearly cost per item. ',
                plot: wind.perYear.cost
            })
        )
    );
}