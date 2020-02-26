
/* this shows the buttons to select the displayed layers and the legend
*/
export default function MapLayers(props) {
    var bases = ['groundUse', 'popDensity', 'windPowDensAt50'];
    var layers = ['energyGrid', 'flows'];

    var name2icon = {
        'groundUse': 'groundUse.jpg',
        'popDensity': 'pop.png',
        'windPowDensAt50': 'windbis.jpeg',
        'energyGrid': 'electricEnergy.png',
        'flows': 'flows.png'
    };
    var isSelected = function isSelected(label) {
        if (bases.includes(label)) return props.base === label;else return props[label];
    };
    var mapListToIm = function mapListToIm(label) {
        return React.createElement('img', {
            src: "res/icons/" + name2icon[label],
            className: 'mapButton',
            style: {
                filter: isSelected(label) ? "none" : 'grayscale(100%)'
            },
            onClick: function onClick() {
                return props.onLayerToggled(label);
            },
            key: label
        });
    };

    var ans = [React.createElement(
        'div',
        { id: 'dMapLayers', title: 'MapLayers', className: 'vLayout' },
        bases.map(mapListToIm),
        layers.map(mapListToIm)
    )];

    if (props.base == 'popDensity') {
        ans.push(React.createElement('div', null));
    }

    return ans;
}