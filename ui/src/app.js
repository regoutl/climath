import GameWin from './gamewin.js';

/** @brief switch between full layouts*/
export default class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {currentPage: 'gameWin'};
    }

    render(){
        if(this.state.currentPage == 'gameWin')
            return <GameWin />;

        return <p>Coucou</p>;
    }
}
