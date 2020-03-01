
import { tr } from '../../../tr.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';

function StorageCapacity(props) {
    var math = [React.createElement(
        'p',
        null,
        tr('The storage capacity of a battery of volume V is')
    ), React.createElement('img', { src: 'data/battery/capa.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        null,
        [{ img: 'symbols/density', descr: 'is the storage density (Wh/m3)' }, { img: 'symbols/decline', descr: 'is the yearly storage capacity decline' }, { img: 'symbols/year', descr: 'is the current year' }, { img: 'symbols/year0', descr: 'is the build year' }].map(function (i) {
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
        tr('The storage capacity depends on :')
    ), React.createElement(
        'ul',
        { className: 'default' },
        ['The size of the battery.', 'Amount of energy stored per unit volume. ', 'The battery\'s age. Batteries storage capacity declines over time. '].map(function (i) {
            return React.createElement(
                'li',
                { key: i.substr(10, 12) },
                tr(i)
            );
        })
    )];

    return React.createElement(MathTextTile, { title: 'Storage capacity', math: math, text: text });
}

function StoredEnergy(props) {
    var math = [React.createElement('img', { src: 'data/battery/storedEq.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        null,
        [{ img: 'battery/st', descr: 'is the energy stored at hour t (Wh)' }, { img: 'symbols/decline', descr: 'is the yearly storage capacity decline' }, { img: 'battery/d', descr: 'is the hourly power loss' }, { img: 'symbols/efficiency', descr: 'is the round trip efficiency' }, { img: 'battery/it', descr: 'is the energy send to load the battery (average for this hour) (W)' }, { img: 'symbols/prod', descr: 'is the energy production of the battery (average for this hour) (W)' }, { img: 'battery/capacity', descr: 'is the storage capacity' }].map(function (i) {
            return React.createElement(
                'li',
                { key: i.img },
                React.createElement('img', { src: "data/" + i.img + ".svg", alt: i.descr }),
                ' ',
                tr(i.descr)
            );
        })
    )];

    return React.createElement(MathTextTile, { title: 'Stored energy', math: math, text: null });
}

function StorageCapacityDecline(props) {
    var math = [React.createElement(
        'p',
        null,
        tr('It is estimated that, after 10 year, a battery can only store 75% of its original capacity.')
    ), React.createElement(
        'p',
        null,
        tr('The yearly storage decline is then simply :')
    ), React.createElement('img', { src: 'data/battery/decl10Todecl.svg' })];

    var text = React.createElement(
        'p',
        null,
        tr('It is estimated that, after 10 year, a battery can only store 75% of its original capacity.')
    );

    return React.createElement(MathTextTile, { title: 'Storage capacity decline', math: math, text: text });
}

function PowerLoss(props) {
    var math = [React.createElement(
        'p',
        null,
        tr('It is estimated that, every month, the stored energy decrease by 2%.')
    ), React.createElement(
        'p',
        null,
        tr('The hourly power loss is then simply :')
    ), React.createElement('img', { src: 'data/battery/lossMtoH.svg' }), React.createElement(
        'p',
        null,
        '730 = number of hour per month in a 365 day year'
    )];

    var text = React.createElement(
        'p',
        null,
        tr('It is estimated that, every month, the stored energy decrease by 2%.')
    );

    return React.createElement(MathTextTile, { title: 'Power loss', math: math, text: text });
}

function RoundTripEfficiency(props) {
    var math = [React.createElement(
        'p',
        null,
        tr('It is the ratio between the retreived energy and the energy put in.')
    ), React.createElement(
        'p',
        null,
        tr("We assume that 'half' the loss happend at load time and 'half' at unload time, hence the "),
        React.createElement('img', { src: 'data/battery/sqrtEffi.svg', alt: 'sqrt effi' }),
        tr(' in the equation')
    ), React.createElement(
        'p',
        null,
        tr('We estimate round trip efficiency to be 0.9.')
    )];
    var text = [React.createElement(
        'p',
        null,
        tr('It is the ratio between the retreived energy and the energy put in.')
    ), React.createElement(
        'p',
        null,
        tr('We estimate round trip efficiency to be 0.9.')
    )];

    return React.createElement(MathTextTile, { title: 'Round trip efficiency', math: math, text: text });
}

/** @brief this class provide a lot of explainations about pv
*/
export default function BatteryDetails(props) {
    var bat = props.productionMeans.storage.solutions.battery;

    return React.createElement(
        'div',
        { className: 'detailContent' },
        React.createElement(
            'h3',
            null,
            tr('Batteries (Li-ion)')
        ),
        React.createElement(
            'p',
            null,
            tr('Batteries are devices that store electricity.')
        ),
        React.createElement(
            'div',
            { className: 'hWrapLayout' },
            React.createElement(StorageCapacity, null),
            React.createElement(StoredEnergy, null),
            React.createElement(PlotTile, {
                title: 'Build energy',
                caption: 'Battery manufacturing requires some energy.',
                plot: bat.build.energy
            }),
            React.createElement(PlotTile, {
                title: 'Operation and maintenance costs',
                caption: 'Yearly cost per storage capacity.',
                plot: bat.perYear.cost
            }),
            React.createElement(PlotTile, {
                title: 'Storage density',
                caption: 'Energy stored per volume.',
                plot: bat.energyDensity
            }),
            React.createElement(StorageCapacityDecline, null),
            React.createElement(PowerLoss, null),
            React.createElement(RoundTripEfficiency, null)
        )
    );
}