import {tr} from "../../tr/tr.js";

/**
    <BuildDetailsSolar
        vBMPerYear=""
        vBMNameplate=""
        vBMArea=""
    />
*/
function BuildDetailsSolar(props){
    return (<div id="dBuildDetails">
        <table>
            <tr>
                <th>{tr("Installation")}</th>
                <td className = "vBMBuild"></td>
                <td><img className="bmInf" src="res/icons/info.png"/></td>
            </tr>
            <tr>
                <th>{tr("Per year :")}</th>
                <td className = "vBMPerYear">{props.vBMPerYear}</td>
            </tr>
            <tr>
                <th>{tr('Production')}</th>
                <td className = "vBMNameplate">{props.vBMNameplate}</td>
            </tr>
            <tr>
                <th>Aire</th>
                <td className = "vBMArea">{props.vBMArea}</td>
            </tr>
        </table>
        <input type="range" id='BMRange' />// TODO:
    </div>);
}

/**
    <BuildDetailsNuke
        vBMPerYear=""
        vBMNameplate=""
        vBMPop=""
        vBMExplCost=""
        vBMCoolingWaterRate=""
    />
*/
function BuildDetailsNuke(props){
    return (<div id="dBuildDetails">
        <table>
            <tr>
                <th>{tr("Installation")}</th>
                <td className = "vBMBuild"></td>
                <td><img className="bmInf" src="res/icons/info.png"/></td>
            </tr>
            <tr>
                <th>{tr("Per year :")}</th>
                <td className = "vBMPerYear">{props.vBMPerYear}</td>
            </tr>
            <tr>
                <th>{tr('Production')}</th>
                <td className = "vBMNameplate">{props.vBMNameplate}</td>
            </tr>
            <tr>
                <th>{tr('Population')}</th>
                <td className = "vBMPop">{props.vBMPop}</td>
            </tr>
            <tr>
                <th>{tr('Explosion cost')}</th>
                <td className = "vBMExplCost">{props.vBMExplCost}</td>
            </tr>
            <tr>
                <th>{tr('Cooling')}</th>
                <td className = "vBMCoolingWaterRate">
                    {props.vBMCoolingWaterRate}
                </td>
            </tr>
        </table>
    </div>);
}

/**
    <BuildDetailsBat
        vBMPerYear=""
        vBMStorageCapacity=""
    />
*/
function BuildDetailsBat(props){
    return (<div id="dBuildDetails">
        <table>
            <tr>
                <th>{tr("Installation")}</th>
                <td className = "vBMBuild"></td>
                <td><img className="bmInf" src="res/icons/info.png"/></td>
            </tr>
            <tr>
                <th>{tr("Per year :")}</th>
                <td className = "vBMPerYear">{props.vBMPerYear}</td>
            </tr>
            <tr>
                <th>{tr("Capacity")}</th>
                <td className = "vBMStorageCapacity">
                    {props.vBMStorageCapacity}
                </td>
            </tr>
        </table>
    </div>);
}

/**
    <BuildDetailsCcgt
        vBMPerYear=""
        vBMNameplate=""
        vBMPop=""
        vBMCoolingWaterRate=""
    />
*/
function BuildDetailsCcgt(props){
    return (<div id="dBuildDetails">
        <table>
            <tr>
                <th>{tr("Installation")}</th>
                <td className = "vBMBuild"></td>
                <td><img className="bmInf" src="res/icons/info.png"/></td>
            </tr>
            <tr>
                <th>{tr("Per year :")}</th>
                <td className = "vBMPerYear">{props.vBMPerYear}</td>
            </tr>
            <tr>
                <th>{tr("Production")}</th>
                <td className = "vBMNameplate">{props.vBMNameplate}</td>
            </tr>
            <tr>
                <th>{tr("Population")}</th>
                <td className = "vBMPop">{props.vBMPop}</td>
            </tr>
            <tr>
                <th>{tr("Cooling")}</th>
                <td className = "vBMCoolingWaterRate">
                    {props.vBMCoolingWaterRate}
                </td>
            </tr>
        </table>
    </div>);
}

/**
    <BuildDetailsNuke
        vBMPerYear=""
        vBMNameplate=""
    />
*/
function BuildDetailWind(props){
    return (<div id="dBuildDetails">
        <table>
            <tr>
                <th>{tr("Installation")}</th>
                <td className = "vBMBuild"></td>
                <td><img className="bmInf" src="res/icons/info.png"/></td>
            </tr>
            <tr>
                <th>{tr("Per year :")}</th>
                <td className = "vBMPerYear">{props.vBMPerYear}</td>
            </tr>
            <tr>
                <th>{tr("Production")}</th>
                <td className = "vBMNameplate">{props.vBMNameplate}</td>
            </tr>
        </table>
    </div>);
}

function BuildMenu(props){
    return( <div> {[
        {name: 'Solar panels',          src:'solar.jpeg', target:'pv',     },
        {name: 'Nuclear power plant',   src:'nuke.png',   target:'nuke',   },
        {name: 'Battery',               src:'bat.png',    target:'battery',},
        {name: 'Gas-fired power plant', src:'ccgt.png',   target:'ccgt',   },
        {name: 'Wind turbine',          src:'wind.png',   target:'wind',   },
        {name: 'Nuclear fusion',        src:'fusion.png', target:'fusion', },
    ].map(nrj =>
        (<img
            src={'res/icons/'+nrj.src}
            className="bBuild" title={tr(nrj.name)}
            data-target={nrj.target}
        />))}
    </div>);
}

export default class BuildDock extends React.Component{
    // constructor(props){
    //     super(props);
    //     this.state = {}
    // }
    render(){
        // <tr><th>Probleme</th><td className = "vBMTheoReason"></td></tr>

        let optionTable = ""
        switch (this.props.target) {
            case "pv":
                optionTable = (<BuildDetailsSolar
                                    vBMPerYear = {this.props.vBMPerYear}
                                    vBMNameplate = {this.props.vBMNameplate}
                                    vBMArea = {this.props.vBMArea}
                                />);
                break;
            case "nuke":
            case "fusion":
                optionTable = (<BuildDetailsNuke
                            vBMPerYear = {this.props.vBMPerYear}
                            vBMNameplate = {this.props.vBMNameplate}
                            vBMPop = {this.props.vBMPop}
                            vBMExplCost = {this.props.vBMExplCost}
                            vBMCoolingWaterRate = {this.props.vBMCoolingWaterRate}
                        />);
                break;
            case "battery":
                optionTable = (<BuildDetailsBat
                                vBMPerYear = {this.props.vBMPerYear}
                                vBMStorageCapacity = {this.props.vBMStorageCapacity}
                            />);
                break;
            case "ccgt":
                optionTable = (<BuildDetailsCcgt
                            vBMPerYear = {this.props.vBMPerYear}
                            vBMNameplate = {this.props.vBMNameplate}
                            vBMPop = {this.props.vBMPop}
                            vBMCoolingWaterRate = {this.props.vBMCoolingWaterRate}
                        />);
                break;
            case "wind":
                optionTable = (<BuildDetailsNuke
                                vBMPerYear = {this.props.vBMPerYear}
                                vBMNameplate = {this.props.vBMNameplate}
                            />);
                break;
        }
        return (
        <div id="dBuildDock">

            <h3>{tr("Build")} :</h3>
            <BuildMenu/>

            <div id="buildMenuOptionTable">
                {optionTable}
            </div>
        </div>);
    }
}
