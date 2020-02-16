import {tr} from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import {Simulateur, promiseSimulater} from '../../simulateur/simulateur.js';



/** @brief this dialog prompt user with choice of the region and parameters
@note it prevent clicks on the page
*/
export class NewGameDialog extends React.Component{

    /** @details props
    startRequested => function(simu) : called when start was clicked. provide a simuater
    */
    constructor(props){
        super(props);

        this.state = {region: 'belgium', paramSet: 'default'};
        this.key = this.keyPressed.bind(this);
    }

    startClicked(e){
        this.start();
    }

    keyPressed(e){
        if(e.keyCode == 13)
            this.start();
    }

    componentDidMount(){
        window.addEventListener('keydown', this.key);

        //auto start game. TMP
        this.start();
    }
    componentWillUnmount(){
        window.removeEventListener('keydown', this.key);
    }

    start(){
        promiseSimulater(this.props.scene).then(s =>{
            this.props.scene.setMap(s.cMap);

            this.props.startRequested(s);
        })
        .catch(err => {
            alert(err);
        });

    }

    handleRegionChange(){

    }

    handleParamChange(){}

    render(){
        return (
            <div style={{position: 'absolute', width: '100%', 'height':'100%', zIndex: 100000000, alignItems: 'center', justifyContent: 'center'}} className="vLayout">
                <div className="dialog vLayout" ref={this.me} style={{position: 'static', flex: '0 0'}}>
                    <h3>{tr("New game")}</h3>
                    <table><tbody>
                    <tr>
                        <th>{tr('Region')}</th>
                        <td>
                            <select value={this.state.region} onChange={this.handleRegionChange.bind(this)}>
                              <option value="belgium">{tr('Belgium')}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>{tr('Parameters')}</th>
                        <td>
                            <select value={this.state.paramSet} onChange={this.handleParamChange.bind(this)}>
                              <option value="default">{tr('Default')}</option>
                            </select>
                        </td>
                    </tr>

                    </tbody></table>
                    <div className="hLayout">
                        <div className="button white" onClick={this.startClicked.bind(this)}>{tr("Start")}</div>
                    </div>
                </div>
            </div>);
    }
}
