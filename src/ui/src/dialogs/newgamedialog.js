// Copyright 2020, ASBL Math for climate, All rights reserved.

import {tr, setLang, getCurrentLang} from "../../../tr.js";
import { quantityToHuman as valStr } from '../../quantitytohuman.js';

import {Dialog} from './dialog.js';
import PvDetails from '../help/pvdetails.js';
import NukeDetails from '../help/nukedetails.js';
import CcgtDetails from '../help/ccgtdetails.js';
import WindDetails from '../help/winddetails.js';
import BatteryDetails from '../help/batterydetails.js';
import FusionDetails from '../help/fusiondetails.js';
import CurrentCountryDetails from '../help/currentcountrydetails.js';

import {CloseButton} from '../closebutton.js';

//to be checked
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


/** @brief this dialog prompt user with choice of the region and parameters
@note it prevent clicks on the page
*/
export class NewGameDialog extends React.Component{
    /** @details props
    startRequested => function(simu) : called when start was clicked. provide a simuater
    */
    constructor(props){
        super(props);

        this.state = {region: 'belgium', paramSet: 'default', edit:null};
        this.key = this.keyPressed.bind(this);

        this.setCountry('be');
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
    }
    componentWillUnmount(){
        window.removeEventListener('keydown', this.key);
    }

    // start(){
    //     promiseSimulater(this.props.scene).then(s =>{
    //         this.props.scene.setMap(s.cMap);
    //
    //         this.props.startRequested(s);
    //     })
    //     .catch(err => {
    //         alert(err);
    //     });
    // }
    //
    handleRegionChange(){

    }

    handleParamChange(){}

    setCountry(code){
        fetch('data/' + code + '/defaultParameters.json')
        .then((response) => response.json()) //   no txt to json conv
        .then((params) => {
            this.props.onCountryChange(code, params);
        });
    }

    editParam(){
        // if(this.state.paramSet == 'default')
        //     this.newParam();

        this.setState({help:PvDetails})
    }

    newParam(){
        let name = prompt('Enter name');


    }


    render(){
        if(this.state.help){
            return this._makeHelp();
        }
        else{
            return (
                <Dialog
                    title="New game"
                    onStart={this.props.onStart}
                >
                    <table id="newGameDialog"><tbody>
                    <tr>
                        <th>{tr('Region')}</th>
                        <td>
                            <select value={this.state.region} onChange={this.handleRegionChange.bind(this)}>
                                <option value="belgium">{tr('Belgium')}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>{tr('Language')}</th>
                        <td>
                            <select value={getCurrentLang()} onChange={(code) => setLang(code.target.value).then(this.props.onLangChange.bind(this))}>
                                <option value="en">English</option>
                                <option value="fr">Français</option>
                                <option value="nl">Neederlands</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>{tr('Parameters')}</th>
                        <td>
                            <div className = "button white" onClick={this.editParam.bind(this)}>{tr('Edit...')}</div>
                        </td>
                    </tr>

                    </tbody></table>
                </Dialog>
            );
        }
    }


    /** @brief returns a react component for the current help
    @note : help must be not null
    */
    _makeHelp(){
        const energies = [
            {label: 'Solar panels', target:PvDetails},
            {label: 'Wind turbines', target:WindDetails},
            {label: 'Batteries', target:BatteryDetails},
            {label: 'Nuclear power', target:NukeDetails},
            {label: 'Gas centrals', target:CcgtDetails},
            {label: 'Fusion', target:FusionDetails},
        ];

        const countries =[
            {label: 'Belgium', target:CurrentCountryDetails},

        ];

        let Help = this.state.help;
        return (
            <div
                id="editParamPage"
                className='hLayout'
            >
                <div className='vLayout' style={{minWidth: 200}}>
                    <nav className='vLayout'>
                        <h2>{tr('Energies')}</h2>
                        {energies.map((p) => <div key={p.label} onClick={() => this.setState({help: p.target})}>{tr(p.label)}</div>)}
                        <h2>{tr('Countries')}</h2>
                        {countries.map((p) => <div key={p.label} onClick={() => this.setState({help: p.target})}>{tr(p.label)}</div>)}
                    </nav>
                    <div className='button black' onClick={() => this.setState({help: null})}>{tr('Ok')}</div>
                </div>
                <Help
                    parameters = {this.props.parameters}
                />
        </div>);
    }
}
