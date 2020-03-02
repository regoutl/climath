
import {tr} from '../../../tr.js';
import {PlotTile, MathTextTile, NumberEditOrShow} from './sharedtiles.js';
import {AppContext} from '../appcontext.js';

function Production(props){

    let math =  [<p key='1'>Production of a PV farm of area <img src='res/symbols/shared/area.svg'/> is : </p>,
            <img  key='2' src="res/symbols/pv/production.svg" alt="Pv production eq" />,
            <ul  key='3'>
                {[{img:'shared/radFlux', descr: 'is the maximal radiant flux (W/m2)'},
                    {img:'shared/efficiency', descr: 'is the pannel efficiency at y0'},
                    {img:'shared/capaFactT', descr: 'is the capacity factor at that hour'},
                    {img:'shared/decline', descr: 'is the yearly efficiency decline'},
                    {img:'shared/year', descr: 'is the current year'},
                    {img:'shared/year0', descr: 'is the build year'},
                ].map((i) => <li key={i.img}><img src={"res/symbols/" + i.img +".svg"} alt={i.descr} /> {tr(i.descr)}</li>)}
            </ul>];

    let text = [<p key='introTxt'>{tr('The production depends on :')}</p>,
        <ul className='default' key='list'>
            {[
                'The area',
                'The amount of sun. ' +
                'The amount of sun depends on the location (we call it \'radiant flux\') ' +
                'and the time of the day/year (we call it \'Capacity factor\').',
                'The panel efficiency. This decrease with time. ',
            ].map((i) => <li key={i}>{tr(i)}</li>)}
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
    return (
        <div>
            <h4>{tr('Radiant flux')}</h4>
            <div className='hLayout'>
                <div>
                    <img src="res/symbols/pv/maxRadFlux.svg" alt="max rad flux eq" />
                    <ul>
                        <li><img src='res/symbols/shared/avgCapaFact.svg' alt='avgCapaFact' /> {tr('is the average capacity factor')}</li>
                        <li><img src='res/symbols/pv/avgGhi.svg' alt='average global hori irradiance' /> {tr(' is the average Global Horizontal Irradiance')}</li>
                    </ul>
                </div>
                <div>
                    <a href={'data/' + props.country + '/pv/globalHorisontalIrradiance.png'}>
                        <img src={'data/' + props.country + '/pv/globalHorisontalIrradiance.png'} alt='ghi be' width="120"/>
                    </a>
                    <p className="pSource">https://globalsolaratlas.info/</p>
                </div>
            </div>
        </div>);
}

function CapaFact(props){
    return (<div>
        <h4>{tr('Capacity factor')}</h4>
        <p>{tr('Naturally, photovoltaic panels do not produce all day long. To model this, we use a hourly capacity factor for each hour of the year based on the history.')}</p>

        <a href={"data/" + props.country + "/pv/allBePvCapaFact.csv"}>{tr('Download the historic data')}</a>
        <p className="pSource">https://www.renewables.ninja/downloads</p>
    </div>);
}

class EffiDecl extends React.Component{
    render(){
        let props = this.props;
        let val = props.pv.efficiencyDecline25Years * 100;

        let shared = <p key='1'>{tr('The efficiency of a solar pannel declines with time. ' +
        'This simulation assumes that, after 25 years, the panel is still ')}
        <NumberEditOrShow
            value={val}
            onChange={(v) => {
                props.pv.efficiencyDecline25Years = v/ 100;
                this.forceUpdate();
            }}
            min={0}
            max={100}
            />
         {tr('% effective.')}</p>;

        let math = [
            shared,
            <p key='2'>{tr('The yearly efficiency decline is then simply :')}</p>,
            <img  key='3' src='res/symbols/pv/decl25Todecl.svg' />,
            <p key='4' className="pSource"><a href='https://news.energysage.com/sunpower-solar-panels-complete-review'>Sumpower</a></p>
        ];

        let text = [shared];

        return (
            <MathTextTile
                title="Efficiency decline"
                math={math}
                text={text}
            />
        );
    }
}

/** @brief this class provide a lot of explainations about pv
*/
/* accepted props
parameters : string. same format as parameters.json
*/
export default function PvDetails (props){
    let pv = props.parameters.energies.pv;


    return (<div className='detailContent'>
        <h3>{tr('Solar panels')}</h3>
        <p>{tr('Solar pannels are devices that transform sun into electricity.')}</p>


        <div className="hWrapLayout">
            <Production />

            <RadFlux country={props.parameters.countryCode} />


            <PlotTile
                title="Efficiency evolution"
                caption="Proportion of sun power transformed into electric power."
                plot={pv.efficiency}
            />


            <PlotTile
                title="Build energy"
                caption="Solar pannel manufacturing requires some energy. "
                plot={pv.build.energy}
                comment="We assume they are build in China"
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


            <CapaFact country={props.parameters.countryCode}/>
            <EffiDecl pv={pv} />
        </div>
    </div>);
}
