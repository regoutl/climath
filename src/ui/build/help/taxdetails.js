// Copyright 2020, ASBL Math for climate, All rights reserved.


import { tr } from '../../../tr.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

import { PlotTile, MathTextTile } from './sharedtiles.js';

function Computation(props) {
    var math = [React.createElement('img', { src: 'res/symbols/tax/in.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        null,
        [{ img: 'tax/rate', descr: 'is the tax rate' }, { img: 'tax/minRate', descr: 'is the minimum tax rate (other government spendings)' }, { img: 'tax/pop', descr: 'is the population' }, { img: 'tax/gdp', descr: 'is the gdp per capita' }, { img: 'tax/costOnM', descr: 'is the operating and maintenance cost' }].map(function (i) {
            return React.createElement(
                'li',
                { key: i.img },
                React.createElement('img', { src: "res/symbols/" + i.img + ".svg", alt: i.descr }),
                ' ',
                tr(i.descr)
            );
        })
    )];

    var text = ['Between each year you gain money, proportionnaly to your tax rate. ', 'However, the country must still run, thus not all tax money goes into your pocket.'].map(function (i) {
        return React.createElement(
            'p',
            null,
            tr(i)
        );
    });

    return React.createElement(MathTextTile, { title: 'Computation', math: math, text: text });
}

/** @brief this class provide a lot of explainations about pv
*/
export default function TaxDetails(props) {
    var be = props.parameters.countries.belgium;

    return React.createElement(
        'div',
        { className: 'detailContent' },
        React.createElement(
            'h3',
            null,
            tr('Budget')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(Computation, null),
            React.createElement(PlotTile, {
                title: 'Population',
                plot: be.pop
            }),
            React.createElement(PlotTile, {
                title: 'GDP per capita',
                plot: be.gdpPerCap
            })
        )
    );
}