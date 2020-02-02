import {tr} from "../../tr/tr.js";

function BuildDetailLine(props){
    return (<tr style = {props.style}>
        <th>{tr(props.name)}</th>
        <td className = {props.className} key = {props.name}>{props.value}</td>
    </tr>)
}

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

function BuildDetailsSolar(props){
    let show = [
        {"n":"Installation",    "cn":"vBMBuild",},
        {"n":"Per year :",      "cn":"vBMPerYear",},
        {"n":"Production",      "cn":"vBMNameplate",},
        {"n":"Aire",            "cn":"vBMArea",},
    ];
    return (<div id = "dBuildDetails">
        <table>
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
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
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
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
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
        <input type = "range" id = 'BMRange' onchange = {props.radiusSliderChange}/>// TODO:
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
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
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
            <tbody>
                {show.map(mapLineFct(props))}
            </tbody>
        </table>
        <input type = "range" id = 'BMRange' />// TODO:
    </div>);
}

function BuildMenu(props){
    console.log(window.innerHeight);
    let isSelected = true;
    return( <div id = "BuildMenu" className = "vLayout" style = {props.style}>
        {[
            {name: 'Solar panels',          src:'solar.png', target:'pv',     },
            {name: 'Nuclear power plant',   src:'nuke.png',  target:'nuke',   },
            {name: 'Battery',               src:'bat.png',   target:'battery',},
            {name: 'Gas-fired power plant', src:'ccgt.png',  target:'ccgt',   },
            {name: 'Wind turbine',          src:'wind.png',  target:'wind',   },
            {name: 'Nuclear fusion',        src:'fusion.png',target:'fusion', },
        ].map(nrj =>
            (<img
                src = {'res/icons/'+nrj.src}
                className = "bBuild"
                title = {tr(nrj.name)}
                data-target = {nrj.target}
                key = {nrj.target}
                onClick = {() => {
                    isSelected = !isSelected;
                    return props.onClick(isSelected ? target: undefined)}}
            />))}
    </div>);
}

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

export default class BuildDock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            radius: 50,
            target: "pv", //"nuke","battery","ccgt","wind","fusion", undefined
            showdock: true,
        };
    }

    render(){
        let dockheight = this.state.showdock ? 200:32;


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
        if(this.state.target !== undefined){
            let Type = buildDetailsChoice[this.state.target.toLowerCase()];
            optionTable = (<Type
                vBMBuild = {this.props.vBMBuild}
                vBMPerYear = {this.props.vBMPerYear}
                vBMNameplate = {this.props.vBMNameplate}
                vBMArea = {this.props.vBMArea}
                vBMPop = {this.props.vBMPop}
                vBMExplCost = {this.props.vBMExplCost}
                vBMCoolingWaterRate = {this.props.vBMCoolingWaterRate}
                vBMStorageCapacity = {this.props.vBMStorageCapacity}
                radiusSliderChange = {radius =>
                        this.props.buildMenuRadiusCallback({radius: radius})}
                restyle = {restyle}
            />)
        }

        return (
        <div>
            <BuildMenu
                onClick = {type => this.props.buildMenuSelectionCallback(type)}
                style = {{bottom: dockheight+'px'}}
            />

            <div id = "dBuildDock" style = {{height: dockheight+'px'}}>
                <ShowDockButton
                    dockheight = {dockheight}
                    showdock = {this.state.showdock}
                    onClick = {() => this.setState({showdock: !this.state.showdock})}
                />
                <div id = "buildMenuOptionTable">
                    {this.state.showdock?optionTable:''}
                </div>
            </div>
        </div>);
    }
}
