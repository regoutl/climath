
/* this shows the buttons to select the displayed layers and the legend
*/
export default function MapLayers (props){
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
        if (bases.includes(label))
            return props.base === label;
        else
            return props[label]
    }
    let mapListToIm = (label) =>
        <img
            src = {"res/icons/" + name2icon[label]}
            className = "mapButton"
            style = {{
                filter: (isSelected(label) ? "none": 'grayscale(100%)'),
            }}
            onClick = {() => props.onLayerToggled(label)}
            key = {label}
        />

    let ans = [(
    <div id="dMapLayers" title="MapLayers" className="vLayout">
        {bases.map(mapListToIm)}
        {layers.map(mapListToIm)}
    </div>)];


    if(props.base == 'popDensity'){
        ans.push(
            <div>
                
            </div>
        );

    }

    return ans;

}
