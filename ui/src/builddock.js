export default class BuildDock extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
        <div id="dBuildDock">

			<h3>Construire : </h3>
			<div id="buildMenuOptionTable">
				<img src='res/icons/solar.jpeg' class="bBuild" title="Panneaux solaires" data-target="pv"/>
				<img src='res/icons/nuke.png'  class="bBuild" title="Centrale nucleaire" data-target="nuke"/>
				<img src='res/icons/bat.png'  class="bBuild" title="Batterie" data-target="battery"/>
				<img src='res/icons/ccgt.png'  class="bBuild" title="Centrale au gaz" data-target="ccgt"/>
				<img src='res/icons/wind.png'  class="bBuild" title="Eolienne" data-target="wind"/>
				<img src='res/icons/fusion.png'  class="bBuild" title="Fusion" data-target="fusion"/>
			</div>
			<div id="dBuildDetails">
				<table>
					<tr><th>Installation</th><td class = "vBMBuild"></td><td><img class="bmInf" src="res/icons/info.png"/></td></tr>
					<tr><th>Par an : </th><td class = "vBMPerYear"></td></tr>
					<tr><th>Par kWh : </th><td class = "vBMPerWh"></td></tr>
					<tr><th>Production </th><td class = "vBMNameplate"></td></tr>
					<tr><th>Capacite </th><td class = "vBMStorageCapacity"></td></tr>
					<tr><th>Riviere</th><td class = "vBMRiver"></td></tr>
					<tr><th>Population</th><td class = "vBMPop"></td></tr>
					<tr><th>Explosion cost</th><td class = "vBMExplCost"></td></tr>
					<tr><th>Refroidissement</th><td class = "vBMCoolingWaterRate"></td></tr>
					<tr><th>Aire</th><td class = "vBMArea"></td></tr>
					<tr><th>Probleme</th><td class = "vBMTheoReason"></td></tr>
				</table>
				<input type="range" id='BMRange' />

			</div>
		</div>);
    }
}
