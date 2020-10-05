// Copyright 2020, ASBL Math for climate, All rights reserved.



import MapView from './mapview.js';
import StatusBar from './statusbar.js';
import {EndDialog} from './dialogs/enddialog.js';
import {NewGameDialog} from './dialogs/newgamedialog.js';
import {tr} from '../../tr.js';
import {CloseButton} from './closebutton.js';
import {isTouchScreen,isMobile,isSmallScreen,isLandscape} from '../screenDetection.js';

import {TutoDialog} from './dialogs/tutodialog.js';


import {Simulateur, promiseSimulater, objSum} from '../../simulateur/simulateur.js';

function NullDialog(props){
    return null;
}
function NullHelp(props){
    return null;
}


/** @brief playing window
*/
export default class GameWin extends React.Component{
    constructor(props){
        super(props);

        //those are no state bc their draw is not related to a DOM change
        this.simu= null; //the simulater, responsible for all computations

        this.state = {
            currentDialog: localStorage.getItem('skipTuto') ? NullDialog: TutoDialog,
            help: NullHelp,
        };

        promiseSimulater(this.props.parameters, this.props.country)
        .then(s =>{
            this.simu = s;

            this.forceUpdate();
        })
        .catch(err => {alert(err);});


    }




    runYear(){
        this.simu.run();
        if(this.simu.year == 2070){
            this.setState({
                currentDialog: EndDialog,
            });
        }


        this.forceUpdate();
    }

    setDialog(c){
        if(c === undefined || c === null)
            c = NullDialog;
        this.setState({currentDialog: c});
    }

    onTaxRateChanged(newVal){
        this.simu.taxRate = newVal;
        this.forceUpdate();
    }



    render(){
        if(!this.simu){
            return <p>Chargement ... </p>;
        }

        if(this.state.currentDialog == TutoDialog){
            return (
                <div className="vLayout" style={{width: '100%', height: '100%'}}>
                    {this._makeMapView()}
                    {this._makeDialog()}
                 </div>
            );
        }


        let cProd = this.simu.cProd;
        let cMap = this.simu.cMap;


        let currentDate = this.simu.year;

        let currentConso  = cProd.countries.belgium.pop.at(currentDate) *    //watt
							cProd.countries.belgium.consoPerCap.at(currentDate);

        return (
        <div className="vLayout" style={{width: '100%', height: '100%'}}>
            <StatusBar
                date = {currentDate}
                money = {this.simu.money}
                showDialog={this.setDialog.bind(this)}
                history={this.simu.stats}
                currentConso={currentConso}
            />

            {this._makeMapView()}

            {this._makeNextTurnButton()}
            {this._makeDialog()}
            {this._makeHelp()}
         </div>);
    }

    _makeMapView(){
        return (
            <MapView
                simu = {this.simu}
                onDetailsRequested = {(c) => {this.setState({help: c})}}
                showOnlyMap = {this.state.currentDialog == TutoDialog}
                onMoneyChanged= {this.forceUpdate.bind(this)}
            />
        );
    }

    /** @brief returns a react component for the currentDialog
    @note : dialog are small, optional, mutually exclusive boxes
    */
    _makeDialog(){
        if(this.state.currentDialog == EndDialog){
            let cProd = this.simu.cProd;
            let cMap = this.simu.cMap;
            let areaAll = {center:{x:0, y: 0}, radius: 100000000};

            let  energyGroundUseProp = cMap.reduceIf(['area'], areaAll, ['energy']) / cMap.reduceIf(['area'], areaAll);


            return (<EndDialog
                onClose={this.setDialog.bind(this, null)}
                history={this.simu.stats}
                energyGroundUseProp={energyGroundUseProp}
                newGame={this.setDialog.bind(this, NewGameDialog)}
                />
            );
        }
        else{
            let CurDialog = this.state.currentDialog;

            return (<CurDialog
               gdp={this.simu.gdp}
               regularTaxRate={this.simu.minTaxRate}
               taxRate={this.simu.taxRate}
               onTaxRateChanged={this.onTaxRateChanged.bind(this)}
               closeRequested={this.setDialog.bind(this, null)}
               history={this.simu.stats}
               detailsRequested = {(c) => {this.setState({help: c})}}
           />);
        }
    }

    /** @brief returns a react component for the current help
    @note : help are big, optional, mutually exclusive boxes
    */
    _makeHelp(){
        if(this.state.help != NullHelp){
            let Help = this.state.help;
            return (
                <div
                    className="dialog"
                    style={{
                        left: '5%',
                        right:'5%',
                        top: 'calc(var(--status-bar-height) + 20px)',// 60px
                        bottom: 30,
                        background:'white',
                        boxShadow: '0 0 50px 10px black',
                        color: 'black',
                        overflow: 'auto'
                    }}
                >
                <CloseButton closeRequested={() => this.setState({help: NullHelp})}/>
                <Help
                    parameters = {this.props.parameters}
                />
            </div>);
        }
        else {
            return null;
        }
    }


    _makeNextTurnButton(){
        return (<div
            id="bNextTurn"
            className="button black"
            title={tr("Go to the next year")}
            onClick={() => {localStorage.setItem('nextYearClickedOnce', true); this.runYear();}}
        >
            {tr("Next turn")}

            {   localStorage.getItem('buildMenuClickedOnce') &&
                !localStorage.getItem('nextYearClickedOnce') && //add help
                (<div className='balloon'>
                    {tr('Next year !')}
                </div>)
            }
        </div>);
    }
}
