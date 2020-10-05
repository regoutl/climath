// Copyright 2020, ASBL Math for climate, All rights reserved.


import {tr} from '../../../tr.js';
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

import {PlotTile, CentralProduction, CoolingTile} from './sharedtiles.js';

/** @brief this class provide a lot of explainations about pv
*/
export default function FusionDetails(props){
    let fusion = props.parameters.energies.fusion;

    const waterVapoNrg = 2250; // J / g
    const waterTCapa = 4185; // J/ kg / K
    const waterInitTemp = 20;
    const jToVapM3 = (100 - waterInitTemp) * 1000 *waterTCapa + waterVapoNrg * 1000000;
    const primEnergyPerProduced = 1 / fusion.primEnergyEffi;
    const heatPerEnProduced = primEnergyPerProduced * (1 - fusion.primEnergyEffi); //

    let m3PerJ = heatPerEnProduced / jToVapM3;
    let m3PerWh = m3PerJ * 3600;


    return (<div className='detailContent'>
        <h3>{tr('Fusion centrals')}</h3>
        <p>{tr('Fusion centrals produce electricity by fusing hydrogen.')}</p>


        <div className="hWrapLayout">
            <CentralProduction />

            <PlotTile
                title='Build cost'
                caption='Gas central construction cost. '
                plot={fusion.build.cost}
            />

            <PlotTile
                title='Operation and maintenance costs'
                caption='Cost per Wh. '
                plot={fusion.perWh.cost}
            />

            <div>
                <h4>{tr('Decommission')}</h4>
                <p>{tr('Deconstruction of a gas central have an estimated cost of 5% of the build cost')}</p>

                <p className="pSource">Source ?</p>
            </div>

            <CoolingTile primEnergyEffi={fusion.primEnergyEffi} />

        </div>
    </div>);
}
