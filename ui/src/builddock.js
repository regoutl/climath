import {tr} from "../../tr/tr.js";

function BuildDetailLine(props){
    return (<tr style = {props.style}>
        <th>{tr(props.name)}</th>
        <td className = {props.className}>{props.value}</td>
    </tr>)
}

let mapLineFct = i =>
(<BuildDetailLine
    name = {i.n}
    className = {i.cn}
    value = {props[i.cn]}
    style = {props.restyle[i.cn] === undefined ? {}:props.restyle[i.cn]}
/>)

function BuildDetailsSolar(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year :",      "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
        {"n":"Aire",            "cn":"vBMArea",},
    ];
    return (<div id = "dBuildDetails">
        <table>
            {show.map(mapLineFct)}
        </table>
        <input type = "range" id = 'BMRange' />// TODO:
    </div>);
}

function BuildDetailsNuke(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year :",      "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
        {"n":"Population",      "cn":"vBMPop",},
        {"n":"Explosion cost",  "cn":"vBMExplCost",},
        {"n":"Cooling",         "cn":"vBMCoolingWaterRate",},
    ];
    return (<div id = "dBuildDetails">
        <table>
            {show.map(mapLineFct)}
        </table>
    </div>);
}

function BuildDetailsBat(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year :",      "cn":"vBMPerYear",},
        {"n":"Capacity",        "cn":"vBMStorageCapacity",},
    ];
    return (<div id = "dBuildDetails">
        <table>
            {show.map(mapLineFct)}
        </table>
        <input type = "range" id = 'BMRange' />// TODO:
    </div>);
}

function BuildDetailsCcgt(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year :",      "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
        {"n":"Population",      "cn":"vBMPop",},
        {"n":"Cooling",         "cn":"vBMCoolingWaterRate",},
    ];
    return (<div id = "dBuildDetails">
        <table>
            {show.map(mapLineFct)}
        </table>
    </div>);
}

function BuildDetailsWind(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year :",      "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
    ];
    return (<div id = "dBuildDetails">
        <table>
            {show.map(mapLineFct)}
        </table>
        <input type = "range" id = 'BMRange' />// TODO:
    </div>);
}

function BuildMenu(props){
    return( <div id = "BuildMenu" className = "vLayout"> {[
        {name: 'Solar panels',          src:'solar.jpeg', target:'pv',     },
        {name: 'Nuclear power plant',   src:'nuke.png',   target:'nuke',   },
        {name: 'Battery',               src:'bat.png',    target:'battery',},
        {name: 'Gas-fired power plant', src:'ccgt.png',   target:'ccgt',   },
        {name: 'Wind turbine',          src:'wind.png',   target:'wind',   },
        {name: 'Nuclear fusion',        src:'fusion.png', target:'fusion', },
    ].map(nrj =>
        (<img
            src = {'res/icons/'+nrj.src}
            className = "bBuild"
            title = {tr(nrj.name)}
            data-target = {nrj.target}
        />))}
    </div>);
}

export default class BuildDock extends React.Component{
    render(){
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
            let type = buildDetailsChoice(this.props.target.toLowerCase());
            optionTable = (<type
                vBMBuild = {this.props.vBMBuild}
                vBMPerYear = {this.props.vBMPerYear}
                vBMNameplate = {this.props.vBMNameplate}
                vBMArea = {this.props.vBMArea}
                vBMPop = {this.props.vBMPop}
                vBMExplCost = {this.props.vBMExplCost}
                vBMCoolingWaterRate = {this.props.vBMCoolingWaterRate}
                vBMStorageCapacity = {this.props.vBMStorageCapacity}
                restyle = {restyle}
            />)
        }

        return (
        <div>
            <BuildMenu/>
            <div id = "dBuildDock">
                <div id = "buildMenuOptionTable">
                    {optionTable}
                </div>
            </div>
        </div>);
    }
}
