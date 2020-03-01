import {tr} from "../../../tr.js";
import { quantityToHuman as valStr } from '../../quantitytohuman.js';
import {periodAvgCo2} from '../../../periodavgco2.js';
import {Dialog} from './dialog.js';

/** @details props
closeRequested => function
*/

export function EndDialog(props){

    let avgCo2 = periodAvgCo2(props.history, Math.max(0, props.history.length - 20), props.history.length);
    let firstYearCo2 = periodAvgCo2(props.history, 0, 1);


    //co2 increase compared to 2019, %
    let increase = Math.round(100 * (1 - avgCo2 / firstYearCo2));

    let avgTax = 0;
    props.history.forEach((year, i) => {
        avgTax += year.taxes.rate;
    });
    avgTax /= props.history.length;
    avgTax *= 100;
    avgTax = Math.round(avgTax);



    return (
        <Dialog
            style={{position: 'absolute', top: '50%', left: '50%', transform:'translate(-50%, -50%)'}}
            title='The end'
        >
            <table><tbody>
            <tr>
                <th>{tr('Objective reached at')}</th>
                <td>{increase} %</td>
            </tr>
            <tr>
                <th>{tr('Average taxes')}</th>
                <td>{avgTax }%</td>
            </tr>
            <tr>
                <th>{tr('Territory occupied')}</th>
                <td>{Math.round(props.energyGroundUseProp * 100)} %</td>
            </tr>
            <tr>
                <th>{tr('River level diminution')}</th>
                <td>0 %</td>
            </tr>
            <tr>
                <th>{tr('Nuclear refugies')}</th>
                <td>0 Hab</td>
            </tr>
            </tbody></table>
            <div className="hLayout">
                <div className="button white" onClick={props.onClose}>{tr("Continue playing")}</div>
                <div className="button white" onClick={props.newGame}>{tr("New game")}</div>
            </div>
        </Dialog>
    );

}
