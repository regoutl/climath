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
            },
            country: '',
        };
        this.parameters = null;

        this.setCountry('be');
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

        this.setState({currentPage: 'gameWin'});
    }

    setCountry(code){
        fetch('data/' + code + '/defaultParameters.json')
        .then((response) => response.json()) //   no txt to json conv
        .then((params) => {
            this.parameters = params;
            this.setState({country: code});
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
                onCountryChange = {this.setCountry.bind(this)}
                onParamChange = {(strParam) => this.setState({strParameters: strParam})}
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
