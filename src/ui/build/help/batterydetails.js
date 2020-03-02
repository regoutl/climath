
import { tr } from '../../../tr.js';
import { PlotTile, MathTextTile } from './sharedtiles.js';

function StorageCapacity(props) {
    var math = [React.createElement(
        'p',
        { key: '1' },
        tr('The storage capacity of a battery of volume V is')
    ), React.createElement('img', { key: '2', src: 'res/symbols/battery/capa.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        { key: '3' },
        [{ img: 'shared/density', descr: 'is the storage density (Wh/m3)' }, { img: 'shared/decline', descr: 'is the yearly storage capacity decline' }, { img: 'shared/year', descr: 'is the current year' }, { img: 'shared/year0', descr: 'is the build year' }].map(function (i) {
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
        tr('The storage capacity depends on :')
    ), React.createElement(
        'ul',
        { key: '2', className: 'default' },
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
    var math = [React.createElement('img', { key: '1', src: 'res/symbols/battery/storedEq.svg', alt: 'Pv production eq' }), React.createElement(
        'ul',
        { key: '2' },
        [{ img: 'battery/st', descr: 'is the energy stored at hour t (Wh)' }, { img: 'shared/decline', descr: 'is the yearly storage capacity decline' }, { img: 'battery/d', descr: 'is the hourly power loss' }, { img: 'shared/efficiency', descr: 'is the round trip efficiency' }, { img: 'battery/it', descr: 'is the energy send to load the battery (average for this hour) (W)' }, { img: 'shared/prod', descr: 'is the energy production of the battery (average for this hour) (W)' }, { img: 'battery/capacity', descr: 'is the storage capacity' }].map(function (i) {
            return React.createElement(
                'li',
                { key: i.img },
                React.createElement('img', { src: "res/symbols/" + i.img + ".svg", alt: i.descr }),
                ' ',
                tr(i.descr)
            );
        })
    )];

    return React.createElement(MathTextTile, { title: 'Stored energy', math: math, text: null });
}

function StorageCapacityDecline(props) {
    var shared = React.createElement(
        'p',
        { key: '1' },
        tr('It is estimated that, after 10 year, a battery can only store ' + 75 + '% of its original capacity.')
    );

    var math = [shared, React.createElement(
        'p',
        { key: '2' },
        tr('The yearly storage decline is then simply :')
    ), React.createElement('img', { key: '3', src: 'res/symbols/battery/decl10Todecl.svg' })];

    var text = shared;

    return React.createElement(MathTextTile, { title: 'Storage capacity decline', math: math, text: text });
}

function PowerLoss(props) {
    var math = [React.createElement(
        'p',
        { key: '1' },
        tr('It is estimated that, every month, the stored energy decrease by 2%.')
    ), React.createElement(
        'p',
        { key: '2' },
        tr('The hourly power loss is then simply :')
    ), React.createElement('img', { key: '3', src: 'res/symbols/battery/lossMtoH.svg' }), React.createElement(
        'p',
        { key: '4' },
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
        { key: '1' },
        tr('It is the ratio between the retreived energy and the energy put in.')
    ), React.createElement(
        'p',
        { key: '2' },
        tr("We assume that 'half' the loss happend at load time and 'half' at unload time, hence the "),
        React.createElement('img', { src: 'res/symbols/battery/sqrtEffi.svg', alt: 'sqrt effi' }),
        tr(' in the equation')
    ), React.createElement(
        'p',
        { key: '3' },
        tr('We estimate round trip efficiency to be 0.9.')
    )];
    var text = [React.createElement(
        'p',
        { key: '5' },
        tr('It is the ratio between the retreived energy and the energy put in.')
    ), React.createElement(
        'p',
        { key: '4' },
        tr('We estimate round trip efficiency to be 0.9.')
    )];

    return React.createElement(MathTextTile, { title: 'Round trip efficiency', math: math, text: text });
}

/** @brief this class provide a lot of explainations about pv
*/
export default function BatteryDetails(props) {
    var bat = props.parameters.energies.storage.battery;

    return React.createElement(
        'div',
        { className: 'detailContent', style: props.restyle },
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
                plot: bat.build.energy,
                comment: 'We assume they are build in China'
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