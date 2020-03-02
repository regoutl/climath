
import { tr } from '../../../tr.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';

function Production(props) {
    var turbDensTxt = 'is turbin density. Const ' + (0.1 * Math.round(props.turbineDensity * 1e7) + ' turbine/km2');

    var math = [React.createElement(
        'p',
        { key: '1' },
        'Production of a wind farm of area ',
        React.createElement('img', { src: 'res/symbols/shared/area.svg' }),
        ' is : '
    ), React.createElement('img', { key: '2', src: 'res/symbols/wind/production.svg' }), React.createElement(
        'ul',
        { key: '3' },
        [{ img: 'wind/turbDens', descr: turbDensTxt }, { img: 'wind/rotRad', descr: 'is the rotor radius. Const. 45m' }, { img: 'wind/wpd', descr: 'is the wind power density (W/m2)' }, { img: 'shared/efficiency', descr: 'is the efficiency' }, { img: 'shared/capaFactT', descr: 'is the capacity factor at hour t' }].map(function (i) {
            return React.createElement(
                'li',
                { key: i.img },
                React.createElement('img', { src: "res/symbols/" + i.img + ".svg", alt: i.descr }),
                ' ',
                tr(i.descr)
            );
        })
    )];

    var text = [React.createElement(
        'p',
        { key: '1' },
        tr('The production depends on :')
    ), React.createElement(
        'ul',
        { key: '2', className: 'default' },
        ['The area. ', 'The number of turbines per km2.', 'The turbine size', 'The amount of wind. ' + 'The amount of wind depends on the location (we call it \'Wind power density\') ' + 'and the time of the day/year (we call it \'Capacity factor\').', 'The wind turbine efficiency.  '].map(function (i) {
            return React.createElement(
                'li',
                { key: i },
                tr(i)
            );
        })
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
            tr('Wind turbines (onshore @50m)')
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
            React.createElement(
                'div',
                null,
                React.createElement(
                    'h4',
                    null,
                    tr('Wind power density')
                ),
                React.createElement(
                    'p',
                    null,
                    'The wind power density is the wind power flux. '
                ),
                React.createElement(
                    'a',
                    { href: 'data/' + props.parameters.countryCode + '/wind/meanWindPowerDensity50.png', title: tr('Click to download') },
                    React.createElement('img', { src: 'data/' + props.parameters.countryCode + '/wind/meanWindPowerDensity50.png', width: '300' })
                ),
                React.createElement(
                    'p',
                    { className: 'pSource' },
                    'https://globalwindatlas.info/'
                )
            ),
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