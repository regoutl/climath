import {tr} from "../../tr/tr.js";

////////Nothing to do in here
function isTouchScreen() { return ('ontouchstart' in document.documentElement); }
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
function isSmallScreen() {return window.innerHeight <= 760 || window.innerWidth <= 760}
////////

///////////////////////////////////////////////////////////////////////////////
// List props for this Component :
//     buildMenuSelectionCallback = function setNewTarget(target)
//     target = var currentTarget
//     vBMTheoReason = var currentVBMTheoReason
//     vBMBuild = var currentVBMBuild
//     vBMPerYear = var currentVBMPerYear
//     vBMNameplate = var currentVBMNameplate
//     vBMArea = var currentVBMArea
//     vBMPop = var currentVBMPop
//     vBMExplCost = var currentVBMExplCost
//     vBMCoolingWaterRate = var currentVBMCoolingWaterRate
//     vBMStorageCapacity = var currentVBMStorageCapacity
//     sliderRadius = {default:, min:, max:, sliderChange: r=>f(r)}
///////////////////////////////////////////////////////////////////////////////
// List possible target :
//     ['pv', 'nuke', 'battery', 'ccgt', 'wind', 'fusion']
///////////////////////////////////////////////////////////////////////////////
export default class BuildDock extends React.Component{
    constructor(props){
        super(props);
        //props.Radius
        this.state = {
            showdock: true,
        };
    }

    render(){
        let showdock = this.props.target !== undefined; //this.state.showdock
        let dockheight = showdock ? 200:32;
        const defaultRadius = 50, maxRadius = 100;

        let restyle = {}
        if(this.props.vBMTheoReason !== undefined){
            restyle[this.props.vBMTheoReason] = {"color": "red"};
        }

        let buildDetailsChoice = {
            "pv":BuildDetailsSolar,
            "nuke":BuildDetailsNuke,
            "fusion":BuildDetailsNuke,
            "battery":BuildDetailsBat,
            "ccgt":BuildDetailsCcgt,
            "wind":BuildDetailsWind,
        };
        let optionTable = "";
        if(this.props.target !== undefined){
            let Type = buildDetailsChoice[this.props.target.toLowerCase()];
            optionTable = (<Type
                vBMBuild = {this.props.vBMBuild}
                vBMPerYear = {this.props.vBMPerYear}
                vBMNameplate = {this.props.vBMNameplate}
                vBMArea = {this.props.vBMArea}
                vBMPop = {this.props.vBMPop}
                vBMExplCost = {this.props.vBMExplCost}
                vBMCoolingWaterRate = {this.props.vBMCoolingWaterRate}
                vBMStorageCapacity = {this.props.vBMStorageCapacity}
                slider = {this.props.sliderRadius}
                restyle = {restyle}
                style = {{bottom: 0, height: dockheight,}}
            />)
        }

        let hideDockButton = (<ShowDockButton
                            dockheight = {dockheight}
                            showdock = {showdock}
                            onClick = {() => this.setState({showdock: !showdock})}
                        />);


        return (
        <div className = "yLayout">
            <BuildMenu
                onClick = {type => this.props.buildMenuSelectionCallback(type)}
                style = {{bottom: dockheight+'px'}}
                showMenu = {this.props.target === undefined ?
                                                true : this.props.target}
            />
                {false?hideDockButton:""}
            <div id = "dBuildDock" style = {{height: dockheight+'px'}}>
                <div id = "buildMenuOptionTable">
                    {showdock?optionTable:''}
                </div>
            </div>
        </div>);
    }
}

///////////////////////////////////////////////////////////////////////////////
////////////// fcts to Build the details about the future build  //////////////
///////////////////////////////////////////////////////////////////////////////
function BuildDetailLine(props){
    return (<tr style = {props.style}>
        <th>{tr(props.name)} :</th>
        <td className = {props.className} key = {props.name}>{props.value}</td>
    </tr>)
}

/**
    function use to map [{n,cn},...]
        where n === name
              cn === className
    to BuildDetailLine() which create 1 line (<tr>) of a table
*/
function mapLineFct(props){
    return i =>
    (<BuildDetailLine
        name = {i.n}
        className = {i.cn}
        value = {props[i.cn]}
        style = {props.restyle[i.cn] === undefined ? {}:props.restyle[i.cn]}
        key = {i.n}
    />)
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

function BuildDetailsSolar(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year",        "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
        {"n":"Aire",            "cn":"vBMArea",},
    ];
    return (<div id = "dBuildDetails" style = {props.style}>
        <table>
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
        <InputSlider slider = {props.slider}/>
    </div>);
}

function BuildDetailsNuke(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year",      "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
        {"n":"Population",      "cn":"vBMPop",},
        {"n":"Explosion cost",  "cn":"vBMExplCost",},
        {"n":"Cooling",         "cn":"vBMCoolingWaterRate",},
    ];
    return (<div id = "dBuildDetails" style = {props.style}>
        <table>
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
    </div>);
}

function BuildDetailsBat(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year",      "cn":"vBMPerYear",},
        {"n":"Capacity",        "cn":"vBMStorageCapacity",},
    ];
    return (<div id = "dBuildDetails" style = {props.style}>
        <table>
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
        <InputSlider slider = {props.slider}/>
    </div>);
}

function BuildDetailsCcgt(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year",      "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
        {"n":"Population",      "cn":"vBMPop",},
        {"n":"Cooling",         "cn":"vBMCoolingWaterRate",},
    ];
    return (<div id = "dBuildDetails" style = {props.style}>
        <table>
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
    </div>);
}

function BuildDetailsWind(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year",      "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
    ];
    return (<div id = "dBuildDetails" style = {props.style}>
        <table>
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
        <InputSlider slider = {props.slider}/>
    </div>);
}

///////////////////////////////////////////////////////////////////////////////
////// function building the left build Menu  (choose the building type) //////
///////////////////////////////////////////////////////////////////////////////
let lastSelected = undefined;
let selecte;
function BuildMenu(props){
    if(isTouchScreen() || isMobile() || isSmallScreen()){
        selecte = (target) => {
            lastSelected = (lastSelected === target) ? undefined: target;
            return props.onClick(lastSelected)
        }
    }else{
        selecte = (target) => {
            lastSelected = lastSelected === target ? undefined: target;
            return props.onClick(lastSelected)
        }
    }

    return( <div id = "BuildMenu" className = "vLayout" style = {props.style}>
        {[
            {name: 'Go back',               src:'back.png',  target:undefined,},
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
                key = {nrj.target}
                onClick = {() => selecte(nrj.target)}
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
