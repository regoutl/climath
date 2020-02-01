

export default class StatusBar extends React.Component{
    constructor(props){
        super(props);

        this.state = {showStats:true, showBM:true};
    }

    render(){
        return (
        <div id="statusBar" className="hLayout" >
            <div className="vYear">2019</div>
            <div className="vMoney">10 miles euro</div>
        </div>);
    }
}
