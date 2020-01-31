export default class StatDock extends React.Component{
    render(){
        return <div style={{width: 300}}>				<select>
        				 <option value="1">Cette annee</option>
        				 <option value="2">Depuis 2 ans</option>
        				 <option value="5">Depuis 5 ans</option>
        				 <option value="10">Depuis 10 ans</option>
        				 <option value="20">Depuis 20 ans</option>
        				 <option value="100000">Depuis le debut</option>
        				</select>
        				<h2>Origine de l'energie</h2>
        				<p>Demande : 650 TWh</p>
        				<canvas id="cStatEnergyOri" ></canvas>
        				<h2>Empreinte carbone</h2>
        				<p>Total : 10 T</p>
        				<canvas id="cStatFootprint" ></canvas>
        				<h2>Budget</h2>
        				<p>Total : 10 eur</p>
        				<canvas id="cStatBudget" ></canvas></div>;
    }
}
