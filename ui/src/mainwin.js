import StatDock from './statdock.js';
import MapView from './mapview.js';
import BuildDock from './builddock.js';
import StatusBar from './statusbar.js'


export default class MainWin extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return (
        <div className="vLayout">
            <StatusBar />

            <MapView />
            <BuildDock />
         </div>);
    }
}
