
/** @brief this class provide a lot of explainations about pv
*/
export default class PvDetails extends React.Component{

    /* accepted props
    efficiency : Raw Time varying input
    */
    constructor(props){
        super(props);
        this.cEffi = React.createRef();//canvas of the effi plot
    }

    componentDidMount(){

    }
    componentWillUnmount(){

    }

    render(){
        return (<div >
            <p>{tr('Solar pannels are devices that transform sun into electricity.')}</p>
            <p>{tr('They are caracterised by their efficiency : the proportion of sun power transformed into electric power. ')}</p>
            <p>{tr('The following plot present the evolution of average solar pannel.')}</p>
            <canvas ref={this.cEffi} width="200" height="100"/>
        </div>);
    }
}
