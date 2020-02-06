var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';

////////Nothing to do in here
function isTouchScreen() {
    return 'ontouchstart' in document.documentElement;
}
function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
}
function isSmallScreen() {
    return window.innerHeight <= 760 || window.innerWidth <= 760;
}
////////

///////////////////////////////////////////////////////////////////////////////
// List props for this Component :
// buildMenuSelectionCallback = function setNewTarget(target)
// target = var currentTarget
// info{
//     theoReason: "",
//     buildCost: 0,
//     buildCo2: 0,
//     perYearCost: 0,
//     perYearCo2: 0,
//     nameplate: 0,
//     pop: 0,
//     explCost: 0,
//     coolingWaterRate: 0,
//     storageCapacity: 0,
//
// }
// sliderRadius = {default:, min:, max:, sliderChange: r=>f(r)}
///////////////////////////////////////////////////////////////////////////////
// List possible target :
//     ['pv', 'nuke', 'battery', 'ccgt', 'wind', 'fusion']
///////////////////////////////////////////////////////////////////////////////

var BuildDock = function (_React$Component) {
    _inherits(BuildDock, _React$Component);

    function BuildDock(props) {
        _classCallCheck(this, BuildDock);

        //props.Radius
        var _this = _possibleConstructorReturn(this, (BuildDock.__proto__ || Object.getPrototypeOf(BuildDock)).call(this, props));

        _this.state = {
            showdock: true
        };
        return _this;
    }

    _createClass(BuildDock, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var showdock = this.props.target !== undefined; //this.state.showdock
            var dockheight = showdock ? 200 : 32;
            var defaultRadius = 50,
                maxRadius = 100;

            var restyle = {};
            if (this.props.info.theoReason !== undefined) {
                restyle[this.props.info.theoReason] = { "color": "red" };
            }

            var needSlider = {
                "pv": true,
                "nuke": false,
                "fusion": false,
                "battery": true,
                "ccgt": false,
                "wind": true
            };
            var optionTable = "";
            if (this.props.target !== undefined) {
                // let Type = ; //buildDetailsChoice[this.props.target.toLowerCase()];
                optionTable = React.createElement(BuildDetailsAny, {
                    info: this.props.info,
                    slider: this.props.sliderRadius,
                    restyle: restyle,
                    style: { bottom: 0, height: dockheight },
                    needsSlider: needSlider[this.props.target.toLowerCase()]
                });
            }

            var hideDockButton = React.createElement(ShowDockButton, {
                dockheight: dockheight,
                showdock: showdock,
                onClick: function onClick() {
                    return _this2.setState({ showdock: !showdock });
                }
            });

            return React.createElement(
                'div',
                { className: 'yLayout' },
                React.createElement(BuildMenu, {
                    onClick: function onClick(type) {
                        return _this2.props.buildMenuSelectionCallback(type);
                    },
                    style: { bottom: dockheight + 'px' },
                    showMenu: this.props.target === undefined ? true : this.props.target
                }),
                false ? hideDockButton : "",
                React.createElement(
                    'div',
                    { id: 'dBuildDock', style: { height: dockheight + 'px' } },
                    React.createElement(
                        'div',
                        { id: 'buildMenuOptionTable' },
                        showdock ? optionTable : ''
                    )
                )
            );
        }
    }]);

    return BuildDock;
}(React.Component);

///////////////////////////////////////////////////////////////////////////////
////////////// fcts to Build the details about the future build  //////////////
///////////////////////////////////////////////////////////////////////////////


export default BuildDock;
function BuildDetailLine(props) {
    return React.createElement(
        'tr',
        { style: props.style },
        React.createElement(
            'th',
            null,
            tr(props.name),
            ' :'
        ),
        React.createElement(
            'td',
            { className: props.className, key: props.name },
            valStr(props.value, props.unit)
        )
    );
}

/**
    function use to map [{n,cn},...]
        where n === name
              cn === className
    to BuildDetailLine() which create 1 line (<tr>) of a table
*/
function mapLineFct(props) {

    return function (i) {
        //skip the non numerical properties, or the 0
        if (props.info[i.cn] == 0 || Number.isNaN(props.info[i.cn]) || props.info[i.cn] === undefined) return null;

        return React.createElement(BuildDetailLine, {
            name: i.n,
            className: i.cn,
            value: props.info[i.cn],
            style: props.restyle[i.cn] === undefined ? {} : props.restyle[i.cn],
            key: i.n,
            unit: i.unit
        });
    };
}

function InputSlider(props) {
    return React.createElement('input', {
        type: 'range',
        id: 'BMRange',
        defaultValue: props.slider.default,
        onChange: function onChange(event) {
            return props.slider.sliderChange(event.target.value);
        },
        min: props.slider.min,
        max: props.slider.max
    });
}

function BuildDetailsAny(props) {
    var show = [{ "n": "Installation cost", "cn": "buildCost", "unit": "€" }, { "n": "Installation co2", "cn": "buildCo2", "unit": "C" }, { "n": "Per year cost", "cn": "perYearCost", "unit": "€" }, { "n": "Per year co2", "cn": "perYearCo2", "unit": "C" }, { "n": "Production", "cn": "avgProd", "unit": "W" }, { "n": "Population", "cn": "pop", "unit": "H" }, { "n": "Explosion cost", "cn": "explCost", "unit": "€" }, { "n": "Cooling", "cn": "coolingWaterRate", "unit": "m3/s" }, { "n": "Storage capacity", "cn": "storageCapacity", "unit": "S" }];

    return React.createElement(
        'div',
        { id: 'dBuildDetails', style: props.style },
        React.createElement(
            'table',
            null,
            React.createElement(
                'tbody',
                null,
                show.map(mapLineFct(props))
            )
        ),
        props.needsSlider && React.createElement(InputSlider, { slider: props.slider })
    );
}

// function BuildDetailsSolar(props){
//     let show = [
//         {"n":"Installation cost",    "cn":"buildCost",        "unit":"€"},
//         {"n":"Installation co2",    "cn":"buildCo2",        "unit":"C"},
//         {"n":"Per year cost",        "cn":"perYearCost",          "unit":"€"},
//         {"n":"Per year co2",        "cn":"perYearCo2",          "unit":"C"},
//         {"n":"Production",          "cn":"avgProd",        "unit":"W"},
//     ];
//
//     return (<div id = "dBuildDetails" style = {props.style}>
//         <table>
//             <tbody>
//                 {show.map(mapLineFct(props))}
//             </tbody>
//         </table>
//         <InputSlider slider = {props.slider}/>
//     </div>);
// }

// function BuildDetailsNuke(props){
//     let show = [
//         {"n":"Installation",    "cn":"build",},
//         {"n":"Per year",      "cn":"perYear",},
//         {"n":"Production",      "cn":"nameplate",},
//         {"n":"Population",      "cn":"pop",},
//         {"n":"Explosion cost",  "cn":"explCost",},
//         {"n":"Cooling",         "cn":"coolingWaterRate",},
//     ];
//     return (<div id = "dBuildDetails" style = {props.style}>
//         <table>
//             <tbody>
//                 {show.map(mapLineFct(props))}
//             </tbody>
//         </table>
//     </div>);
// }

// function BuildDetailsBat(props){
//     let show = [
//         {"n":"Installation",    "cn":"build",},
//         {"n":"Per year",      "cn":"perYear",},
//         {"n":"Capacity",        "cn":"storageCapacity",},
//     ];
//     return (<div id = "dBuildDetails" style = {props.style}>
//         <table>
//             <tbody>
//                 {show.map(mapLineFct(props))}
//             </tbody>
//         </table>
//         <InputSlider slider = {props.slider}/>
//     </div>);
// }

// function BuildDetailsCcgt(props){
//     let show = [
//         {"n":"Installation",    "cn":"build",},
//         {"n":"Per year",      "cn":"perYear",},
//         {"n":"Production",      "cn":"nameplate",},
//         {"n":"Population",      "cn":"pop",},
//         {"n":"Cooling",         "cn":"coolingWaterRate",},
//     ];
//     return (<div id = "dBuildDetails" style = {props.style}>
//         <table>
//             <tbody>
//                 {show.map(mapLineFct(props))}
//             </tbody>
//         </table>
//     </div>);
// }

// function BuildDetailsWind(props){
//     let show = [
//         {"n":"Installation",    "cn":"build",},
//         {"n":"Per year",      "cn":"perYear",},
//         {"n":"Production",      "cn":"nameplate",},
//     ];
//     return (<div id = "dBuildDetails" style = {props.style}>
//         <table>
//             <tbody>
//                 {show.map(mapLineFct(props))}
//             </tbody>
//         </table>
//         <InputSlider slider = {props.slider}/>
//     </div>);
// }

///////////////////////////////////////////////////////////////////////////////
////// function building the left build Menu  (choose the building type) //////
///////////////////////////////////////////////////////////////////////////////
var lastSelected = undefined;
var selecte = void 0;
function BuildMenu(props) {
    if (isTouchScreen() || isMobile() || isSmallScreen()) {
        selecte = function selecte(target) {
            lastSelected = lastSelected === target ? undefined : target;
            return props.onClick(lastSelected);
        };
    } else {
        selecte = function selecte(target) {
            lastSelected = lastSelected === target ? undefined : target;
            return props.onClick(lastSelected);
        };
    }

    return React.createElement(
        'div',
        { id: 'BuildMenu', className: 'vLayout', style: props.style },
        [{ name: 'Go back', src: 'back.png', target: undefined }, { name: 'Solar panels', src: 'solar.png', target: 'pv' }, { name: 'Nuclear power plant', src: 'nuke.png', target: 'nuke' }, { name: 'Battery', src: 'bat.png', target: 'battery' }, { name: 'Gas-fired power plant', src: 'ccgt.png', target: 'ccgt' }, { name: 'Wind turbine', src: 'wind.png', target: 'wind' }, { name: 'Nuclear fusion', src: 'fusion.png', target: 'fusion' }].map(function (nrj) {
            return (props.showMenu === true ? nrj.target !== undefined : props.showMenu === nrj.target || nrj.target === undefined) ? React.createElement('img', {
                src: 'res/icons/' + nrj.src,
                className: 'bBuild',
                title: tr(nrj.name),
                'data-target': nrj.target,
                key: nrj.target,
                onClick: function onClick() {
                    return selecte(nrj.target);
                }
            }) : '';
        })
    );
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function ShowDockButton(props) {
    return React.createElement('img', {
        src: 'res/icons/info.png',
        className: 'bBuild',
        style: { bottom: props.dockheight - 16 + 'px' },
        title: tr((props.showdock ? 'Hide' : 'Show') + ' dock'),
        onClick: function onClick() {
            return props.onClick();
        },
        key: 'DockButton'
    });
}
///////////////////////////////////////////////////////////////////////////////