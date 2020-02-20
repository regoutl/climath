export default class MapLayers extends React.Component{
    constructor(props){
        super(props);

        this.handleClick= this.handleClick.bind(this);
    }

    handleClick(e){
        this.props.setVisible(e.target.dataset.target);
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
        let isSelected = (label) => {
            if (label in bases)
                return this.props.base === label;
            else
                return this.props[label]
        }
        let mapListToIm = (label) =>
            <img
                src = {"res/icons/" + name2icon[label]}
                className = "mapButton"
                style = {{
                    filter: (isSelected(label) ? "none": 'grayscale(100%)'),
                }}
                onClick = {this.handleClick}
                data-target = {label}
                key = {label}
            />

        return (<div id="dMapLayers" title="MapLayers" className="vLayout">
            {bases.map(mapListToIm)}
            {layers.map(mapListToIm)}
        </div>);
    }
}
