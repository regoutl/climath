var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Plot } from '../plot.js';
import { tr } from "../../tr.js";
import { Raw } from '../../timevarin.js';

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

var ReactPlot = function (_React$Component) {
    _inherits(ReactPlot, _React$Component);

    /*valid props :
    width, height default : 300, 200 resp
    data
    */
    function ReactPlot(props) {
        _classCallCheck(this, ReactPlot);

        var _this = _possibleConstructorReturn(this, (ReactPlot.__proto__ || Object.getPrototypeOf(ReactPlot)).call(this, props));

        _this.tvi = new Raw(_this.props.data);
        _this.cCanvas = new React.createRef();
        return _this;
    }

    _createClass(ReactPlot, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var p = new Plot(this.tvi, this.props.width || 300, this.props.height || 200);
            p.draw(this.cCanvas.current.getContext('2d'));
        }
    }, {
        key: 'downloadAsCsv',
        value: function downloadAsCsv() {
            var csv = '';
            csv += this.tvi.label + '\n';

            if (this.tvi.unit) csv += 'unit,' + this.tvi.unit + '\n';
            csv += 'source,' + this.tvi.source + '\n';
            csv += 'source valid for, [2000-' + this.tvi.histoUntill + ']\n';
            csv += 'country,belgium\n';

            if (this.tvi.comment) csv += 'note,' + this.tvi.comment + '\n';

            var years = this.tvi.years;
            years.forEach(function (v, year) {
                csv += year + 2000 + ',' + v + '\n';
            });

            download('be_' + this.tvi.label + '.csv', csv);
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'plotContainer', style: { width: this.props.width || 300 } },
                React.createElement('canvas', { ref: this.cCanvas, width: this.props.width || 300, height: this.props.height || 200 }),
                React.createElement('img', {
                    className: 'bDownloadPlotCsv',
                    src: 'res/icons/download.png',
                    width: '32',
                    title: tr('Download as csv'),
                    onClick: this.downloadAsCsv.bind(this) })
            );
        }
    }]);

    return ReactPlot;
}(React.Component);

export default ReactPlot;