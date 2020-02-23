import {tr} from "../../tr/tr.js";
import { quantityToHuman as valStr} from '../quantitytohuman.js';
import {isTouchScreen,isMobile,isSmallScreen,isLandscape} from '../screenDetection.js';

import PvDetails from './help/pvdetails.js';
import NukeDetails from './help/nukedetails.js';
import WindDetails from './help/winddetails.js';
import CcgtDetails from './help/ccgtdetails.js';
import BatteryDetails from './help/batterydetails.js';
import FusionDetails from './help/fusiondetails.js';

///////////////////////////////////////////////////////////////////////////////
    // List props for this Component :
    // buildMenuSelectionCallback = function setNewTarget(target)
    // target = var currentTarget
    // info{
    //     theoReason: "",
    //     buildCost: 0,
    //     buildCo2: 0,
    //     perYearCost: 0,
    //     perYearCo2: 0,
    //     nameplate: 0,
    //     pop: 0,
    //     explCost: 0,
    //     coolingWaterRate: 0,
    //     storageCapacity: 0,
    //
    // }
    // sliderRadius = {default:, min:, max:, sliderChange: r=>f(r)}
    // detailsRequested : function called when details is clicked
///////////////////////////////////////////////////////////////////////////////
// List possible target :
//     ['pv', 'nuke', 'battery', 'ccgt', 'wind', 'fusion']
///////////////////////////////////////////////////////////////////////////////
export default class BuildDock extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let showdock = this.props.target !== undefined;
        let dockheight = showdock ?
                            'var(--build-dock-height)':32;
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
        const detailForTech ={
            "pv":PvDetails,
            "nuke":NukeDetails,
            "fusion":FusionDetails,
            "battery":BatteryDetails,
            "ccgt":CcgtDetails,
            "wind":WindDetails,
        };

        let restyle = {}
        let optionTable = undefined;
        if(this.props.target !== undefined){
            // let Type = ; //buildDetailsChoice[this.props.target.toLowerCase()];
            optionTable = (<BuildDetailsAny
                info = {this.props.info}
                confirmBuild = {this.props.onConfirmBuild}
                slider = {this.props.sliderRadius}
                restyle = {restyle}
                style = {{bottom: 0, height: dockheight,width: dockwidth}}
                needsSlider= {needSlider[this.props.target.toLowerCase()]}
                onBack = {() => {this.props.buildMenuSelectionCallback(undefined)}}
                detailsRequested={() =>
                    this.props.detailsRequested(detailForTech[
                                                this.props.target.toLowerCase()])}
            />)
        }


        return (
            <div>
                <BuildMenu
                    onClick = {this.props.buildMenuSelectionCallback}
                    style = {{bottom: 'calc(var(--menu-icon-size) + var(--build-dock-height))'}}
                    showMenu = {this.props.target === undefined ?
                                                    true : this.props.target}
                />
                {optionTable}
            </div>);


        // if(this.props.info.theoReason !== undefined){
        //     restyle[this.props.info.theoReason] = {"color": "red"};
        // }
        //
        //
        // let hideDockButton = (<ShowDockButton
        //                     dockheight = {dockheight}
        //                     showdock = {showdock}
        //                     onClick = {() => this.setState({showdock: !showdock})}
        //                 />);
        //
        //
        // return (
        // <div className = "yLayout">
        //     <BuildMenu
        //         onClick = {this.props.buildMenuSelectionCallback}
        //         style = {{bottom: (dockheight + 50) +'px'}}
        //         showMenu = {this.props.target === undefined ?
        //                                         true : this.props.target}
        //     />
        //     {optionTable}
        // </div>);
    }
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
                    props.slider.sliderChange(event.target.value)}
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
        {"n":"Population",          "cn":"pop",             "unit":"H"},
        {"n":"Explosion cost",      "cn":"explCost",        "unit":"€"},
        {"n":"Cooling",             "cn":"coolingWaterRate","unit":"m3/s"},
        {"n":"Storage capacity",    "cn":"storageCapacity", "unit":"S",},
    ];

    return (<div className = "dialog" style = {props.style}>
        <table>
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
        {props.needsSlider &&  <InputSlider slider = {props.slider}/>}
        <div className='hLayout'>
            <div className='button white' onClick={()=>props.onBack(undefined)}>
                {tr('Back')}
            </div>
            <div className="button white" onClick={props.detailsRequested}>
                {tr('Details...')}
            </div>
            {props.info.confirmOnDock &&
                <div className="button white" onClick={props.confirmBuild}>
                    {tr('Confirm')}
                </div>
            }
        </div>
    </div>);
}

///////////////////////////////////////////////////////////////////////////////
////// function building the left build Menu  (choose the building type) //////
///////////////////////////////////////////////////////////////////////////////
let lastSelected = undefined;
let selecte;
function BuildMenu(props){
    selecte = (target) => {
            lastSelected = (lastSelected === target) ? undefined: target;
            return props.onClick(lastSelected)
        };

    return( <div id = "BuildMenu" className = "vLayout" style = {props.style}>
        {[
            {name: 'Solar panels',          src:'solar.png', target:'pv',     },
            {name: 'Nuclear power plant',   src:'nuke.png',  target:'nuke',   },
            {name: 'Battery',               src:'bat.png',   target:'battery',},
            {name: 'Gas-fired power plant', src:'ccgt.png',  target:'ccgt',   },
            {name: 'Wind turbine',          src:'wind.png',  target:'wind',   },
            {name: 'Nuclear fusion',        src:'fusion.png',target:'fusion', },
        ].map(nrj => (props.showMenu === true?   nrj.target !== undefined:
                    props.showMenu === nrj.target || nrj.target === undefined)?
            (<img
                src = {'res/icons/'+nrj.src}
                className = "bBuild"
                title = {tr(nrj.name)}
                data-target = {nrj.target}
                key = {nrj.target + nrj.src}
                onClick={() => selecte(nrj.target)}
            />) : '' )}
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
