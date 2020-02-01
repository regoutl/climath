import MainWin from './mainwin.js';

/** @brief switch between full layouts*/
export default class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {currentPage: 'mainWin'};
    }

    render(){
        if(this.state.currentPage == 'mainWin')
            return <MainWin />;

        return <p>Coucou</p>;
    }
}
