import {Plot} from '../plot.js';
import {tr} from "../../tr/tr.js";
import {Raw} from '../../timevarin.js';

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


export default class ReactPlot extends React.Component{
    /*valid props :
    width, height default : 300, 200 resp
    data
    */
    constructor(props){
        super(props);


        this.tvi = new Raw(this.props.data);
        this.cCanvas = new React.createRef();
    }

    componentDidMount(){
        let p = new Plot(this.tvi, this.props.width || 300, this.props.height || 200);
        p.draw(this.cCanvas.current.getContext('2d'));
    }

    downloadAsCsv(){
        let csv = '';
        csv += this.tvi.label + '\n';

        if( this.tvi.unit)
            csv += 'unit,' + this.tvi.unit + '\n';
        csv += 'source,' + this.tvi.source + '\n';
        csv += 'source valid for, [2000-' +this.tvi.histoUntill + ']\n';
        csv += 'country,belgium\n';

        if(this.tvi.comment)
            csv += 'note,' + this.tvi.comment + '\n';


        let years = this.tvi.years;
        years.forEach((v, year) => {
            csv += (year + 2000) + ',' + v +'\n';
        });

        download('be_' + this.tvi.label + '.csv', csv);
    }

    render(){
        return (<div className='plotContainer' style={{width: this.props.width || 300}}>
            <canvas ref={this.cCanvas} width={this.props.width || 300} height={this.props.height || 200}/>
            <img
                className="bDownloadPlotCsv"
                src='res/icons/download.png'
                width='32'
                title={tr('Download as csv')}
                onClick={this.downloadAsCsv.bind(this)}/>
            </div>
        );
    }
}
