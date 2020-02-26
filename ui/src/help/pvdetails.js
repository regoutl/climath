
import {tr} from '../../../tr/tr.js';
import {PlotTile, MathTextTile} from './sharedtiles.js';

function Production(props){
    let math =  [<p>Production of a PV farm of area <img src='data/symbols/area.svg'/> is : </p>,
            <img src="data/pv/production.svg" alt="Pv production eq" />,
            <ul>
                {[{img:'symbols/radFlux', descr: 'is the maximal radiant flux (W/m2)'},
                    {img:'symbols/efficiency', descr: 'is the pannel efficiency at y0'},
                    {img:'symbols/capaFactT', descr: 'is the capacity factor at that hour'},
                    {img:'symbols/decline', descr: 'is the yearly efficiency decline'},
                    {img:'symbols/year', descr: 'is the current year'},
                    {img:'symbols/year0', descr: 'is the build year'},
                ].map((i) => <li key={i.img}><img src={"data/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
            </ul>];

    let text = [<p>{tr('The production depends on :')}</p>,
        <ul className='default'>
            {[
                'The area',
                'The amount of sun. ' +
                'The amount of sun depends on the location (we call it \'radiant flux\') ' +
                'and the time of the day/year (we call it \'Capacity factor\').',
                'The panel efficiency. This decrease with time. ',
            ].map((i) => <li>{tr(i)}</li>)}
        </ul>
    ];

    return (
        <MathTextTile
            title="Production"
            math={math}
            text={text}
        />
    );
}

function RadFlux(props){
    return (            <div>
                    <h4>{tr('Radiant flux')}</h4>
                    <div className='hLayout'>
                        <div>
                            <img src="data/pv/maxRadFlux.svg" alt="max rad flux eq" />
                            <ul>
                                <li><img src='data/symbols/avgCapaFact.svg' alt='avgCapaFact' /> {tr('is the average capacity factor')}</li>
                                <li><img src='data/pv/avgGhi.svg' alt='average global hori irradiance' /> {tr(' is the average Global Horizontal Irradiance')}</li>
                            </ul>
                        </div>
                        <div>
                            <img src='data/pv/globalHorisontalIrradiance.png' alt='ghi be' width="120"/>
                            <p className="pSource">https://globalsolaratlas.info/</p>
                        </div>
                    </div>
                </div>
);
}

function CapaFact(props){
    return (<div>
        <h4>{tr('Capacity factor')}</h4>
        <p>{tr('Naturally, photovoltaic panels do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')}</p>

        <a href="data/pv/allBePvCapaFact.csv">{tr('Download the historic data for Belgium (1985-2016)')}</a>
        <p className="pSource">https://www.renewables.ninja/downloads</p>
    </div>);
}

function EffiDecl(props){
    return (            <div>
                    <h4>{tr('Efficiency decline')}</h4>
                    <p>{tr('The efficiency of a solar pannel declines with time. This simulation assumes that, after 25 years, the panel is still 95% effective.')}</p>

                    <p>{tr('The yearly efficiency decline is then simply :')}</p>
                    <img src='data/pv/decl25Todecl.svg' />
                    <p className="pSource"><a href='https://news.energysage.com/sunpower-solar-panels-complete-review'>Sumpower</a></p>
                </div>
);
}

/** @brief this class provide a lot of explainations about pv
*/
/* accepted props
productionMeans = this.simu.cProd.productionMeans
countries       = this.simu.cProd.countries
closeRequested
*/
export default function PvDetails (props){
    let pv = props.productionMeans.pv;


    return (<div className='detailContent'>
        <h3>{tr('Solar panels')}</h3>
        <p>{tr('Solar pannels are devices that transform sun into electricity.')}</p>


        <div className="hWrapLayout">
            <Production />

            <RadFlux />


            <PlotTile
                title="Efficiency evolution"
                caption="Proportion of sun power transformed into electric power."
                plot={pv.efficiency}
            />


            <PlotTile
                title="Build energy"
                caption="Solar pannel manufacturing requires some energy. "
                plot={pv.build.energy}
            />


            <PlotTile
                title="Build cost"
                caption="Solar pannel manufacturing cost."
                plot={pv.build.cost}
            />


            <PlotTile
                title="Operation and maintenance costs"
                caption="Yearly cost per m2"
                plot={pv.perYear.cost}
            />


            <CapaFact />
            <EffiDecl />
        </div>
    </div>);
}
