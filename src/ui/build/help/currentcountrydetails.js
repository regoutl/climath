// Copyright 2020, ASBL Math for climate, All rights reserved.


import { tr } from '../../../tr.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

function Demand(props) {
    var math = [React.createElement('img', { src: 'res/symbols/conso/eq.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        null,
        [{ img: 'tax/pop', descr: 'is the population' }, { img: 'conso/powerDemandPerCap', descr: 'is the power consumption per capita' }].map(function (i) {
            return React.createElement(
                'li',
                { key: i.img },
                React.createElement('img', { src: "res/symbols/" + i.img + ".svg", alt: i.descr }),
                ' ',
                tr(i.descr)
            );
        })
    )];

    var text = React.createElement(
        'p',
        null,
        tr('The energy demand represent how much energy your population consumes. ')
    );

    return React.createElement(MathTextTile, { title: 'Energy demand', math: math, text: text });
}

/** @brief this class provide a lot of explainations about pv
*/
export default function CurrentCountryDetails(props) {
    var be = props.parameters.countries.belgium;

    return React.createElement(
        'div',
        { className: 'detailContent' },
        React.createElement(
            'h3',
            null,
            tr('Country')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(PlotTile, {
                title: 'Population',
                plot: be.pop
            }),
            React.createElement(PlotTile, {
                title: 'Power consumption per capita',
                plot: be.consoPerCap
            }),
            React.createElement(PlotTile, {
                title: 'Gdp per capita',
                plot: be.gdpPerCap
            })
        )
    );
}