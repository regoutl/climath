// Copyright 2020, ASBL Math for climate, All rights reserved.

import {tr} from '../../tr.js';

/* this shows the buttons to select the displayed layers and the legend
*/
export default class MapLayers extends React.Component{
    constructor(props){
        super(props);
        this.state = {open: false};
    }

    render(){
        let props = this.props;

        let ans = [];
        if(this.state.open){
            let bases = ['groundUse', 'popDensity', 'windPowDensAt100'];
            let layers = ['energyGrid', 'flows'];

            let name2icon = {
                'groundUse':'groundUse.jpg',
                'popDensity':'pop.png',
                'windPowDensAt100':'windbis.jpeg',
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
                    onClick = {() => {this.setState({open: false}); props.onLayerToggled(label);}}
                    key = {label}
                    title={tr("Show " + label)}
                />

            ans.push(
                <div id="dMapLayers" className="vLayout">
                    {bases.map(mapListToIm)}
                    {layers.map(mapListToIm)}
                </div>);
        }
        else{
            ans.push(
                <div id="dMapLayers" title={tr("Choose displayed layers")} className="vLayout" key="mapLayerBox">
                    <img
                        key="coucou"
                        src='res/icons/layers.png'
                        className = "mapButton"
                        onClick={() => this.setState({open: true})}
                    />
                </div>);
        }


        if(props.base == 'popDensity'){
            ans.push(
                <div key='legend'>

                </div>
            );

        }

        return ans;
    }

}
