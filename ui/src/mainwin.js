import StatDock from './statdock.js';
import MapView from './mapview.js';
import BuildDock from './builddock.js';


export default class MainWin extends React.Component{
    constructor(props){
        super(props);

        this.state = {showStats:true, showBM:true};
    }

    render(){
        return (
        <div className="hLayout">
            {this.state.showStats && <StatDock />}

            <MapView />
            {this.state.showBM && <BuildDock />}
         </div>);
    }
}
