// Copyright 2020, ASBL Math for climate, All rights reserved.

import {tr} from "../../tr.js";
import { quantityToHuman as valStr} from '../quantitytohuman.js';
import {isTouchScreen,isMobile,isSmallScreen,isLandscape} from '../screenDetection.js';

import PvDetails from './help/pvdetails.js';
import NukeDetails from './help/nukedetails.js';
import WindDetails from './help/winddetails.js';
import CcgtDetails from './help/ccgtdetails.js';
import BatteryDetails from './help/batterydetails.js';
import FusionDetails from './help/fusiondetails.js';
import {Simulateur} from '../../simulateur/simulateur.js';

import {Dialog} from './dialogs/dialog.js';

const energyIcons = [
    {name: 'Solar panels',          src:'solar.png',    target:'pv',     },
    {name: 'Nuclear power plant',   src:'nuke.png',     target:'nuke',   },
    {name: 'Battery',               src:'bat.png',      target:'battery',},
    {name: 'Gas-fired power plant', src:'ccgt.png',     target:'ccgt',   },
    {name: 'Wind turbine',          src:'wind.png',     target:'wind',   },
    // {name: 'Nuclear fusion',        src:'fusion.png',   target:'fusion', },
//     {name: 'Demolish',              src:'demolish.png', target:'demolish',
// },
];
const detailForTech ={
    "pv":PvDetails,
    "nuke":NukeDetails,
    "fusion":FusionDetails,
    "battery":BatteryDetails,
    "ccgt":CcgtDetails,
    "wind":WindDetails,
};


///////////////////////////////////////////////////////////////////////////////
    // List props for this Component :
    // onTypeChanged = function setTargetBuild( newType)
    // onDetailsRequested : function called when details is clicked
    // onBuildConfirmed : function called on build confirmation
    // simu : the simulater
    // targetBuild
export function BuildDock (props){
    let showdock = props.targetBuild.type;
    let dockheight = 'var(--build-dock-height)';
    let dockwidth = (isMobile() || isSmallScreen()) ? '95%':350;
    const defaultRadius = 50, maxRadius = 100;
    const needSlider = {
        "pv":true,
        "nuke":false,
        "fusion":false,
        "battery":true,
        "ccgt":false,
        "wind":true,
    };

    let restyle = {}
    let optionTable = undefined;

    if(props.targetBuild.type){
        let info;
        if(props.targetBuild.type != 'demolish'){
            const rawInfo = props.simu.buildInfo(props.targetBuild);

            let avgProd = rawInfo.nameplate ? rawInfo.nameplate.at(rawInfo.build.end) * rawInfo.avgCapacityFactor : 0;

            info={
                theoReason: rawInfo.theorical,
                buildCost: rawInfo.build.cost,
                buildCo2: rawInfo.build.co2,
                perYearCost: rawInfo.perYear.cost + rawInfo.perWh.cost * avgProd,
                perYearCo2: rawInfo.perYear.co2 + rawInfo.perWh.co2 * avgProd,
                avgProd: avgProd,
                pop: rawInfo.pop_affected,
                explCost: rawInfo.expl_cost,
                coolingWaterRate: rawInfo.coolingWaterRate,
                storageCapacity: rawInfo.storageCapacity ? rawInfo.storageCapacity.at(rawInfo.build.end) : 0,
                buildDelay: rawInfo.build.end - rawInfo.build.begin,
            };
        }
        else{

            info = {
                demolishCost: props.simu.demolishCost({center: props.targetBuild.pos, radius: props.targetBuild.radius}),
            };
        }


        optionTable = (
            <Dialog
                onBack={() => {props.onTypeChanged(null)}}
                onDetails={() => props.onDetailsRequested(detailForTech[props.targetBuild.type.toLowerCase()])}

                style = {{bottom: 0, left:0, height: dockheight,width: dockwidth, overflow: 'hidden '}}
            >
                <BuildDetailsAny
                    info = {info}
                    confirmBuild = {props.onBuildConfirmed}
                    slider = {props.targetBuild.slider}
                    restyle = {restyle}
                    needsSlider= {needSlider[props.targetBuild.type.toLowerCase()]}
                />
            </Dialog>
        )
    }


    return (
        <div>
            <BuildMenu
                onClick = {props.onTypeChanged}
                style = {{bottom: 'calc(var(--menu-icon-size) + var(--build-dock-height))'}}
                showMenu = {props.targetBuild.type === null ?
                                                true : props.targetBuild.type}
            />

            {optionTable}
        </div>);


    // if(props.rawInfo.theoReason !== undefined){
    //     restyle[this.props.info.theoReason] = {"color": "red"};
    // }
}

///////////////////////////////////////////////////////////////////////////////
////////////// fcts to Build the details about the future build  //////////////
///////////////////////////////////////////////////////////////////////////////
function BuildDetailLine(props){
    return (<tr style = {props.style}>
        <th>{tr(props.name)} :</th>
        <td className = {props.className} key = {props.name}>
            {valStr(props.value, props.unit)}
        </td>
    </tr>)
}

/**
    function use to map [{n,cn},...]
        where n === name
              cn === className
    to BuildDetailLine() which create 1 line (<tr>) of a table
*/
function mapLineFct(props){

    return i => {
        //skip the non numerical properties, or the 0
        if(props.info[i.cn] == 0 || Number.isNaN(props.info[i.cn])
                                            || props.info[i.cn] === undefined)
            return null;

        return (<BuildDetailLine
            name = {i.n}
            className = {i.cn}
            value = {props.info[i.cn]}
            style = {props.restyle[i.cn] === undefined ? {}:props.restyle[i.cn]}
            key = {i.n}
            unit={i.unit}
        />)}
}

function InputSlider(props){
    return (<input
        type = "range"
        id = 'BMRange'
        defaultValue = {props.slider.default}
        onChange = {(event) =>
                    props.slider.onValueChanged(event.target.value)}
        min = {props.slider.min}
        max = {props.slider.max}
    />);
}


function BuildDetailsAny(props){
    let show = [
        {"n":"Installation cost",   "cn":"buildCost",       "unit":"€"},
        {"n":"Installation co2",    "cn":"buildCo2",        "unit":"C"},
        {"n":"Per year cost",       "cn":"perYearCost",     "unit":"€"},
        {"n":"Per year co2",        "cn":"perYearCo2",      "unit":"C"},
        {"n":"Production",          "cn":"avgProd",         "unit":"W"},

        // {"n":"Population",          "cn":"pop",             "unit":"H"}, //disabled by desing
        {"n":"Explosion cost",      "cn":"explCost",        "unit":"€"},
        {"n":"Cooling",             "cn":"coolingWaterRate","unit":"m3/s"},
        {"n":"Storage capacity",    "cn":"storageCapacity", "unit":"S",},
        {"n":"Build time",          "cn":"buildDelay",      "unit":"y",},
        {"n":"Demolish cost",       "cn":"demolishCost",    "unit":"€",},
    ];

    return (
        <table>
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
    );
}


///////////////////////////////////////////////////////////////////////////////
////// function building the left build Menu  (choose the building type) //////
///////////////////////////////////////////////////////////////////////////////
let lastSelected = undefined;
let selecte;
function BuildMenu(props){
    selecte = (target) => {
            localStorage.setItem('buildMenuClickedOnce', true);
            lastSelected = (lastSelected === target) ? null: target;
            return props.onClick(lastSelected);
        };

    return( <div id = "BuildMenu" className = "vLayout" style = {props.style}>
        {energyIcons.map(nrj => (props.showMenu === true?   nrj.target !== undefined:
                    props.showMenu === nrj.target || nrj.target === undefined)?
            (<img
                src = {'res/icons/'+nrj.src}
                className = "bBuild"
                title = {tr(nrj.name)}
                data-target = {nrj.target}
                key = {nrj.target + nrj.src}
                onClick={() => selecte(nrj.target)}
            />) : '' )}
            {!localStorage.getItem('buildMenuClickedOnce') && //add help
                (<div className='balloon'>
                    {tr('Select what to build !')}
                </div>)
            }
    </div>);
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function ShowDockButton(props){
    return (<img
        src = {'res/icons/info.png'}
        className = "bBuild"
        style = {{bottom: (props.dockheight-16)+'px'}}
        title = {tr((props.showdock?'Hide':'Show')+' dock')}
        onClick = {() => props.onClick()}
        key = "DockButton"
    />)
}
///////////////////////////////////////////////////////////////////////////////




/// tactile build menu

function CircularBuildMenuIcon (props){
    let index = props.index;
    let nrj = props.nrj;
    let radius = props.radius;

    let transforms =[
        'rotate(' + (2*3.14*index/6) + 'rad)',
        'translate(' + radius + 'px, 0)',
        'rotate(' + (-2*3.14*index/6) + 'rad)',
        'translate(-50%,-50%)',
    ];

    let theOne = props.targetBuild.type == nrj.target;

    return (
        <div
            style={{
                position: 'absolute',
                transform: transforms.join(' '),
                background: "rgb(255, 255, 255)",
                border: '3px solid grey',
                borderRadius: 20,
                width: 32,
                padding: 5
            }}
            onTouchStart={(e) => {
                if(theOne)
                    props.onBuildConfirmed();
                else
                    props.onTypeChanged( nrj.target);
            }}
        >
            <img
                src={theOne ? 'res/icons/validate.png' : 'res/icons/'+nrj.src}
                width="100%"
            />
        </div>);
}

function QuickStat(props){
    if(!props.targetBuild.type) //target is undefined
        return null;

    let radius = props.radius;

    const rawInfo = props.simu.buildInfo(props.targetBuild);

    let avgProd = rawInfo.nameplate ? rawInfo.nameplate.at(rawInfo.build.end) * rawInfo.avgCapacityFactor : 0;

    let info={
        theoReason: rawInfo.theorical,
        buildCost: rawInfo.build.cost,
        buildCo2: rawInfo.build.co2,
        avgProd: avgProd,
        storageCapacity: rawInfo.storageCapacity ? rawInfo.storageCapacity.at(rawInfo.build.end) : 0,
        buildDelay: rawInfo.build.end - rawInfo.build.begin,
    };

    return (
        <div style={{
            position: 'absolute',
            top: -radius,
            left: radius + 32,
            background: "white",
            border: '3px solid grey',
            borderRadius: 10,
            padding: 5
        }}>
            <div
                className='hLayout' style={{justifyContent: 'space-between'}}
            >
                <h3>{tr(props.targetBuild.type)}</h3>
                <img src='res/icons/info.png' height="20"
                    onClick={() =>
                        props.onDetailsRequested(detailForTech[props.targetBuild.type])}

                />
            </div>
            <div className='hLayout' style={{width: 'max-content'}}>
                {info.storageCapacity > 0 && <div>
                    <img src='res/icons/bat.png' height="18"/>
                    {valStr(info.storageCapacity, 'Wh',  {compact:2})}
                </div>}

                {info.avgProd > 0 && <div>
                    <img src='res/icons/electricEnergy.png' height="18"/>
                    {valStr(info.avgProd, 'W',  {compact:2})}
                </div>}
                {info.buildCo2 > 0 && <div>
                    <img src='res/icons/pollution.png' height="18"/>
                    {valStr(info.buildCo2, 'C', {compact:2})}
                </div>}
                <div>
                    <img src='res/icons/bill.png' height="18"/>
                    {valStr(info.buildCost, '€', {compact:2})}
                </div>
            </div>
        </div>);
}

/** @brief a circular build menu around a point
@param props : accepted fields :
    [All those of BuildDock]
    center : {x, y} coord (in px, page relative) of the center
*/
export class TouchBuildDock extends React.Component{
    render(){
        let props = this.props;

        const radius = 60;

        return (
            <div style={{
                position:'absolute',
                top: props.center.y,
                left: props.center.x ,
                width: 0,
                height: 0
            }}
            >
                {energyIcons.map((nrj, index) => {
                    return (
                    <CircularBuildMenuIcon
                        nrj={nrj}
                        index={index}
                        targetBuild={props.targetBuild}
                        onBuildConfirmed={props.onBuildConfirmed}
                        onTypeChanged={props.onTypeChanged}
                        radius={radius}
                        key={index}
                    />);
                })}

                <QuickStat
                    targetBuild={props.targetBuild}
                    simu={props.simu}
                    radius={radius}
                    onDetailsRequested={props.onDetailsRequested}
                />
            </div>)
    }
}
