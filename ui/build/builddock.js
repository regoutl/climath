var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import { isTouchScreen, isMobile, isSmallScreen } from '../screenDetection.js';

import PvDetails from './help/pvdetails.js';
import NukeDetails from './help/nukedetails.js';
import WindDetails from './help/winddetails.js';
import CcgtDetails from './help/ccgtdetails.js';
import BatteryDetails from './help/batterydetails.js';
import FusionDetails from './help/fusiondetails.js';

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
// detailsRequested : function called when details is clicked
///////////////////////////////////////////////////////////////////////////////
// List possible target :
//     ['pv', 'nuke', 'battery', 'ccgt', 'wind', 'fusion']
///////////////////////////////////////////////////////////////////////////////

var BuildDock = function (_React$Component) {
    _inherits(BuildDock, _React$Component);

    function BuildDock(props) {
        _classCallCheck(this, BuildDock);

        return _possibleConstructorReturn(this, (BuildDock.__proto__ || Object.getPrototypeOf(BuildDock)).call(this, props));
    }

    _createClass(BuildDock, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var showdock = this.props.target !== undefined;
            var dockheight = showdock ? 150 : 32;
            var dockwidth = 350;
            var defaultRadius = 50,
                maxRadius = 100;
            var needSlider = {
                "pv": true,
                "nuke": false,
                "fusion": false,
                "battery": true,
                "ccgt": false,
                "wind": true
            };
            var detailForTech = {
                "pv": PvDetails,
                "nuke": NukeDetails,
                "fusion": FusionDetails,
                "battery": BatteryDetails,
                "ccgt": CcgtDetails,
                "wind": WindDetails
            };

            var restyle = {};
            var optionTable = undefined;
            if (this.props.target !== undefined) {
                // let Type = ; //buildDetailsChoice[this.props.target.toLowerCase()];
                optionTable = React.createElement(BuildDetailsAny, {
                    info: this.props.info,
                    confirmBuild: this.props.onConfirmBuild,
                    slider: this.props.sliderRadius,
                    restyle: restyle,
                    style: { bottom: 0, height: dockheight, width: dockwidth },
                    needsSlider: needSlider[this.props.target.toLowerCase()],
                    onBack: function onBack() {
                        _this2.props.buildMenuSelectionCallback(undefined);
                    },
                    detailsRequested: function detailsRequested() {
                        return _this2.props.detailsRequested(detailForTech[_this2.props.target.toLowerCase()]);
                    }
                });
            }

            return React.createElement(
                'div',
                null,
                React.createElement(BuildMenu, {
                    onClick: this.props.buildMenuSelectionCallback,
                    style: { bottom: dockheight + 50 + 'px' },
                    showMenu: this.props.target === undefined ? true : this.props.target
                }),
                optionTable
            );

            // if(this.props.info.theoReason !== undefined){
            //     restyle[this.props.info.theoReason] = {"color": "red"};
            // }
            //
            //
            // let hideDockButton = (<ShowDockButton
            //                     dockheight = {dockheight}
            //                     showdock = {showdock}
            //                     onClick = {() => this.setState({showdock: !showdock})}
            //                 />);
            //
            //
            // return (
            // <div className = "yLayout">
            //     <BuildMenu
            //         onClick = {this.props.buildMenuSelectionCallback}
            //         style = {{bottom: (dockheight + 50) +'px'}}
            //         showMenu = {this.props.target === undefined ?
            //                                         true : this.props.target}
            //     />
            //     {optionTable}
            // </div>);
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
        { className: 'dialog', style: props.style },
        React.createElement(
            'table',
            null,
            React.createElement(
                'tbody',
                null,
                show.map(mapLineFct(props))
            )
        ),
        props.needsSlider && React.createElement(InputSlider, { slider: props.slider }),
        React.createElement(
            'div',
            { className: 'hLayout' },
            React.createElement(
                'div',
                { className: 'button white', onClick: function onClick() {
                        return props.onBack(undefined);
                    } },
                tr('Back'),
                ' '
            ),
            React.createElement(
                'div',
                { className: 'button white', onClick: props.detailsRequested },
                tr('Details...')
            ),
            props.info.confirmOnDock && React.createElement(
                'div',
                { className: 'button white', onClick: props.confirmBuild },
                tr('Confirm')
            )
        )
    );
}

///////////////////////////////////////////////////////////////////////////////
////// function building the left build Menu  (choose the building type) //////
///////////////////////////////////////////////////////////////////////////////
var lastSelected = undefined;
var selecte = void 0;
function BuildMenu(props) {
    selecte = function selecte(target) {
        lastSelected = lastSelected === target ? undefined : target;
        return props.onClick(lastSelected);
    };

    return React.createElement(
        'div',
        { id: 'BuildMenu', className: 'vLayout', style: props.style },
        [{ name: 'Solar panels', src: 'solar.png', target: 'pv' }, { name: 'Nuclear power plant', src: 'nuke.png', target: 'nuke' }, { name: 'Battery', src: 'bat.png', target: 'battery' }, { name: 'Gas-fired power plant', src: 'ccgt.png', target: 'ccgt' }, { name: 'Wind turbine', src: 'wind.png', target: 'wind' }, { name: 'Nuclear fusion', src: 'fusion.png', target: 'fusion' }].map(function (nrj) {
            return (props.showMenu === true ? nrj.target !== undefined : props.showMenu === nrj.target || nrj.target === undefined) ? React.createElement('img', {
                src: 'res/icons/' + nrj.src,
                className: 'bBuild',
                title: tr(nrj.name),
                'data-target': nrj.target,
                key: nrj.target + nrj.src,
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