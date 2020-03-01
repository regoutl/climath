import { tr } from "../../../tr.js";
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import { periodAvgCo2 } from '../../../periodavgco2.js';
import { Dialog } from './dialog.js';

/** @details props
closeRequested => function
*/

export function EndDialog(props) {

    var avgCo2 = periodAvgCo2(props.history, Math.max(0, props.history.length - 20), props.history.length);
    var firstYearCo2 = periodAvgCo2(props.history, 0, 1);

    //co2 increase compared to 2019, %
    var increase = Math.round(100 * (1 - avgCo2 / firstYearCo2));

    var avgTax = 0;
    props.history.forEach(function (year, i) {
        avgTax += year.taxes.rate;
    });
    avgTax /= props.history.length;
    avgTax *= 100;
    avgTax = Math.round(avgTax);

    return React.createElement(
        Dialog,
        {
            style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            title: 'The end'
        },
        React.createElement(
            'table',
            null,
            React.createElement(
                'tbody',
                null,
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        tr('Objective reached at')
                    ),
                    React.createElement(
                        'td',
                        null,
                        increase,
                        ' %'
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        tr('Average taxes')
                    ),
                    React.createElement(
                        'td',
                        null,
                        avgTax,
                        '%'
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        tr('Territory occupied')
                    ),
                    React.createElement(
                        'td',
                        null,
                        Math.round(props.energyGroundUseProp * 100),
                        ' %'
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        tr('River level diminution')
                    ),
                    React.createElement(
                        'td',
                        null,
                        '0 %'
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        tr('Nuclear refugies')
                    ),
                    React.createElement(
                        'td',
                        null,
                        '0 Hab'
                    )
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'hLayout' },
            React.createElement(
                'div',
                { className: 'button white', onClick: props.onClose },
                tr("Continue playing")
            ),
            React.createElement(
                'div',
                { className: 'button white', onClick: props.newGame },
                tr("New game")
            )
        )
    );
}