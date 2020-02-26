
import { tr } from '../../../tr/tr.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';

function Production(props) {
    var math = [React.createElement(
        'p',
        null,
        'Production of a PV farm of area ',
        React.createElement('img', { src: 'data/symbols/area.svg' }),
        ' is : '
    ), React.createElement('img', { src: 'data/pv/production.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        null,
        [{ img: 'symbols/radFlux', descr: 'is the maximal radiant flux (W/m2)' }, { img: 'symbols/efficiency', descr: 'is the pannel efficiency at y0' }, { img: 'symbols/capaFactT', descr: 'is the capacity factor at that hour' }, { img: 'symbols/decline', descr: 'is the yearly efficiency decline' }, { img: 'symbols/year', descr: 'is the current year' }, { img: 'symbols/year0', descr: 'is the build year' }].map(function (i) {
            return React.createElement(
                'li',
                { key: i.img },
                React.createElement('img', { src: "data/" + i.img + ".svg", alt: i.descr }),
                ' ',
                tr(i.descr)
            );
        })
    )];

    var text = [React.createElement(
        'p',
        null,
        tr('The production depends on :')
    ), React.createElement(
        'ul',
        { className: 'default' },
        ['The area', 'The amount of sun. ' + 'The amount of sun depends on the location (we call it \'radiant flux\') ' + 'and the time of the day/year (we call it \'Capacity factor\').', 'The panel efficiency. This decrease with time. '].map(function (i) {
            return React.createElement(
                'li',
                null,
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

function RadFlux(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h4',
            null,
            tr('Radiant flux')
        ),
        React.createElement(
            'div',
            { className: 'hLayout' },
            React.createElement(
                'div',
                null,
                React.createElement('img', { src: 'data/pv/maxRadFlux.svg', alt: 'max rad flux eq' }),
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/symbols/avgCapaFact.svg', alt: 'avgCapaFact' }),
                        ' ',
                        tr('is the average capacity factor')
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement('img', { src: 'data/pv/avgGhi.svg', alt: 'average global hori irradiance' }),
                        ' ',
                        tr(' is the average Global Horizontal Irradiance')
                    )
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement('img', { src: 'data/pv/globalHorisontalIrradiance.png', alt: 'ghi be', width: '120' }),
                React.createElement(
                    'p',
                    { className: 'pSource' },
                    'https://globalsolaratlas.info/'
                )
            )
        )
    );
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
            tr('Naturally, photovoltaic panels do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')
        ),
        React.createElement(
            'a',
            { href: 'data/pv/allBePvCapaFact.csv' },
            tr('Download the historic data for Belgium (1985-2016)')
        ),
        React.createElement(
            'p',
            { className: 'pSource' },
            'https://www.renewables.ninja/downloads'
        )
    );
}

function EffiDecl(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h4',
            null,
            tr('Efficiency decline')
        ),
        React.createElement(
            'p',
            null,
            tr('The efficiency of a solar pannel declines with time. This simulation assumes that, after 25 years, the panel is still 95% effective.')
        ),
        React.createElement(
            'p',
            null,
            tr('The yearly efficiency decline is then simply :')
        ),
        React.createElement('img', { src: 'data/pv/decl25Todecl.svg' }),
        React.createElement(
            'p',
            { className: 'pSource' },
            React.createElement(
                'a',
                { href: 'https://news.energysage.com/sunpower-solar-panels-complete-review' },
                'Sumpower'
            )
        )
    );
}

/** @brief this class provide a lot of explainations about pv
*/
/* accepted props
productionMeans = this.simu.cProd.productionMeans
countries       = this.simu.cProd.countries
closeRequested
*/
export default function PvDetails(props) {
    var pv = props.productionMeans.pv;

    return React.createElement(
        'div',
        { className: 'detailContent' },
        React.createElement(
            'h3',
            null,
            tr('Solar panels')
        ),
        React.createElement(
            'p',
            null,
            tr('Solar pannels are devices that transform sun into electricity.')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(Production, null),
            React.createElement(RadFlux, null),
            React.createElement(PlotTile, {
                title: 'Efficiency evolution',
                caption: 'Proportion of sun power transformed into electric power.',
                plot: pv.efficiency
            }),
            React.createElement(PlotTile, {
                title: 'Build energy',
                caption: 'Solar pannel manufacturing requires some energy. ',
                plot: pv.build.energy
            }),
            React.createElement(PlotTile, {
                title: 'Build cost',
                caption: 'Solar pannel manufacturing cost.',
                plot: pv.build.cost
            }),
            React.createElement(PlotTile, {
                title: 'Operation and maintenance costs',
                caption: 'Yearly cost per m2',
                plot: pv.perYear.cost
            }),
            React.createElement(CapaFact, null),
            React.createElement(EffiDecl, null)
        )
    );
}