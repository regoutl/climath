// Copyright 2020, ASBL Math for climate, All rights reserved.

import GameWin from './gamewin.js';
import {AppContext} from './appcontext.js';
import {NewGameDialog} from './dialogs/newgamedialog.js';




/** @brief switch between full layouts*/
export class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentPage: 'newGame',
            context: {
                //controls how the equations (typically in the details dialogs) are displayed
                // valid values : ('text', 'math').
                // text : plain text description of the equation
                // math : math description, with a quick explaination of the parameters
                equationDisplay: 'text',
                toggleEquationDisplay: this.toggleEquationDisplay.bind(this),
                canEditParameters: true,
            },
            country: '',
        };
        this.parameters = null; // content of parameters.json

    }

    toggleEquationDisplay(){
        this.setState((state) => {
            let ctx = state.context;
            return {context: {...state.context, equationDisplay: ctx.equationDisplay == 'math' ? 'text' : 'math'}};
        });
    }

    //when menu ask for start
    startGame(){
        //todo : validations checks (is parameters loaded etc)

        this.setState((state) => {
            return {currentPage: 'gameWin', context: {...state.context, canEditParameters: false}}
        });
    }


    render(){
        let content;

        if(this.state.currentPage == 'gameWin'){
            content = <GameWin
                country={this.state.country}
                parameters={this.parameters}
            />;
        }
        else if(this.state.currentPage == 'newGame'){
            content = <NewGameDialog
                onStart = {this.startGame.bind(this)}
                country={this.state.country}
                parameters={this.parameters}
                onCountryChange = {(countryCode, parameters) => {this.parameters = parameters; this.setState({country: countryCode})}}
             />;
        }
        else
            throw 'todo';


        return (
            <AppContext.Provider value={this.state.context}>
                    {content}
            </AppContext.Provider>);

    }
}
