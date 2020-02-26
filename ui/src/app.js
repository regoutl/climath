import GameWin from './gamewin.js';
import {AppContext} from './appcontext.js';





/** @brief switch between full layouts*/
export class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentPage: 'gameWin',
            context: {
                //controls how the equations (typically in the details dialogs) are displayed
                // valid values : ('text', 'math').
                // text : plain text description of the equation
                // math : math description, with a quick explaination of the parameters
                equationDisplay: 'text',
                toggleEquationDisplay: this.toggleEquationDisplay.bind(this)
            }
        };
    }

    toggleEquationDisplay(){
        this.setState((state) => {
            let ctx = state.context;
            return {context: {...state.context, equationDisplay: ctx.equationDisplay == 'math' ? 'text' : 'math'}};
        });
    }

    render(){
        if(this.state.currentPage == 'gameWin'){
            return (
                <AppContext.Provider value={this.state.context}>
                        <GameWin />
                </AppContext.Provider>);
        }


        return <p>Coucou</p>;
    }
}
