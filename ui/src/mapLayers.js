export default class MapLayers extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let bases = ['groundUse', 'popDensity', 'windPowDensAt50'];
        let layers = ['energyGrid', 'flows'];

        let name2icon = {
            'groundUse':'groundUse.jpg',
            'popDensity':'pop.png',
            'windPowDensAt50':'windbis.jpeg',
            'energyGrid':'electricEnergy.png',
            'flows':'flows.png',
        }


        const baseEls = bases.map((label) =>
            <img src={"res/icons/" + name2icon[label] } className="mapButton"/>
        );

        const extraEls = layers.map((label) =>
            <img src={"res/icons/" + name2icon[label] } className="mapButton"/>
        );

        return (<div id="dMapLayers" title="MapLayers" className="vLayout">
            {baseEls}
            {extraEls}
        </div>);
    }
}
