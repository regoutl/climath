var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";
import { quantityToHuman as valStr } from '../quantitytohuman.js';
import { isTouchScreen, isMobile, isSmallScreen, isLandscape } from '../screenDetection.js';

import PvDetails from './help/pvdetails.js';
import NukeDetails from './help/nukedetails.js';
import WindDetails from './help/winddetails.js';
import CcgtDetails from './help/ccgtdetails.js';
import BatteryDetails from './help/batterydetails.js';
import FusionDetails from './help/fusiondetails.js';
import { Simulateur } from '../../simulateur/simulateur.js';

import { Dialog } from './dialogs/dialog.js';

var energyIcons = [{ name: 'Solar panels', src: 'solar.png', target: 'pv' }, { name: 'Nuclear power plant', src: 'nuke.png', target: 'nuke' }, { name: 'Battery', src: 'bat.png', target: 'battery' }, { name: 'Gas-fired power plant', src: 'ccgt.png', target: 'ccgt' }, { name: 'Wind turbine', src: 'wind.png', target: 'wind' }, { name: 'Nuclear fusion', src: 'fusion.png', target: 'fusion' }];
var detailForTech = {
    "pv": PvDetails,
    "nuke": NukeDetails,
    "fusion": FusionDetails,
    "battery": BatteryDetails,
    "ccgt": CcgtDetails,
    "wind": WindDetails
};

///////////////////////////////////////////////////////////////////////////////
// List props for this Component :
// onTypeChanged = function setTargetBuild( newType)
// onDetailsRequested : function called when details is clicked
// onBuildConfirmed : function called on build confirmation
// simu : the simulater
// targetBuild
export var BuildDock = function (_React$Component) {
    _inherits(BuildDock, _React$Component);

    function BuildDock() {
        _classCallCheck(this, BuildDock);

        return _possibleConstructorReturn(this, (BuildDock.__proto__ || Object.getPrototypeOf(BuildDock)).apply(this, arguments));
    }

    _createClass(BuildDock, [{
        key: 'render',
        value: function render() {
            var props = this.props;

            var showdock = this.props.targetBuild.type;
            var dockheight = 'var(--build-dock-height)';
            var dockwidth = isMobile() || isSmallScreen() ? '95%' : 350;
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

            var restyle = {};
            var optionTable = undefined;

            if (this.props.targetBuild.type) {
                var rawInfo = this.props.simu.onBuildMenuStateChanged(this.props.targetBuild).info;

                var avgProd = rawInfo.nameplate ? rawInfo.nameplate.at(rawInfo.build.end) * rawInfo.avgCapacityFactor : 0;

                var info = {
                    theoReason: rawInfo.theorical,
                    buildCost: rawInfo.build.cost,
                    buildCo2: rawInfo.build.co2,
                    perYearCost: rawInfo.perYear.cost + rawInfo.perWh.cost * avgProd,
                    perYearCo2: rawInfo.perYear.co2 + rawInfo.perWh.co2 * avgProd,
                    avgProd: avgProd,
                    pop: rawInfo.pop_affected,
                    explCost: rawInfo.expl_cost,
                    coolingWaterRate: rawInfo.coolingWaterRate,
                    storageCapacity: rawInfo.storageCapacity ? rawInfo.storageCapacity.at(rawInfo.build.end) : 0,
                    buildDelay: rawInfo.build.end - rawInfo.build.begin
                };

                optionTable = React.createElement(
                    Dialog,
                    {
                        onBack: function onBack() {
                            props.onTypeChanged(null);
                        },
                        onDetails: function onDetails() {
                            return props.onDetailsRequested(detailForTech[props.targetBuild.type.toLowerCase()]);
                        },

                        style: { bottom: 0, left: 0, height: dockheight, width: dockwidth, overflow: 'hidden ' }
                    },
                    React.createElement(BuildDetailsAny, {
                        info: info,
                        confirmBuild: props.onBuildConfirmed,
                        slider: props.targetBuild.slider,
                        restyle: restyle,
                        needsSlider: needSlider[props.targetBuild.type.toLowerCase()]
                    })
                );
            }

            return React.createElement(
                'div',
                null,
                React.createElement(BuildMenu, {
                    onClick: this.props.onTypeChanged,
                    style: { bottom: 'calc(var(--menu-icon-size) + var(--build-dock-height))' },
                    showMenu: this.props.targetBuild.type === null ? true : this.props.targetBuild.type
                }),
                optionTable
            );

            // if(this.props.rawInfo.theoReason !== undefined){
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
            //         showMenu = {this.props.type === undefined ?
            //                                         true : this.props.type}
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
            return props.slider.onValueChanged(event.target.value);
        },
        min: props.slider.min,
        max: props.slider.max
    });
}

function BuildDetailsAny(props) {
    var show = [{ "n": "Installation cost", "cn": "buildCost", "unit": "€" }, { "n": "Installation co2", "cn": "buildCo2", "unit": "C" }, { "n": "Per year cost", "cn": "perYearCost", "unit": "€" }, { "n": "Per year co2", "cn": "perYearCo2", "unit": "C" }, { "n": "Production", "cn": "avgProd", "unit": "W" }, { "n": "Population", "cn": "pop", "unit": "H" }, { "n": "Explosion cost", "cn": "explCost", "unit": "€" }, { "n": "Cooling", "cn": "coolingWaterRate", "unit": "m3/s" }, { "n": "Storage capacity", "cn": "storageCapacity", "unit": "S" }, { "n": "Build time", "cn": "buildDelay", "unit": "y" }];

    return React.createElement(
        'table',
        null,
        React.createElement(
            'tbody',
            null,
            show.map(mapLineFct(props))
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
        localStorage.setItem('buildMenuClickedOnce', true);
        lastSelected = lastSelected === target ? null : target;
        return props.onClick(lastSelected);
    };

    return React.createElement(
        'div',
        { id: 'BuildMenu', className: 'vLayout', style: props.style },
        energyIcons.map(function (nrj) {
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
        }),
        !localStorage.getItem('buildMenuClickedOnce') && //add help
        React.createElement(
            'div',
            { className: 'balloon' },
            tr('Select what to build !')
        )
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


/// tactile build menu

function CircularBuildMenuIcon(props) {
    var index = props.index;
    var nrj = props.nrj;
    var radius = props.radius;

    var transforms = ['rotate(' + 2 * 3.14 * index / 6 + 'rad)', 'translate(' + radius + 'px, 0)', 'rotate(' + -2 * 3.14 * index / 6 + 'rad)', 'translate(-50%,-50%)'];

    var theOne = props.targetBuild.type == nrj.target;

    return React.createElement(
        'div',
        {
            style: {
                position: 'absolute',
                transform: transforms.join(' '),
                background: "rgb(255, 255, 255)",
                border: '3px solid grey',
                borderRadius: 20,
                width: 32,
                padding: 5
            },
            onTouchStart: function onTouchStart(e) {

                if (theOne) props.onBuildConfirmed();else props.onTypeChanged(nrj.target);
            }
        },
        React.createElement('img', {
            src: theOne ? 'res/icons/validate.png' : 'res/icons/' + nrj.src,
            width: '100%'
        })
    );
}

function QuickStat(props) {
    if (!props.targetBuild.type) //target is undefined
        return null;

    var radius = props.radius;

    var rawInfo = props.simu.onBuildMenuStateChanged(props.targetBuild).info;

    var avgProd = rawInfo.nameplate ? rawInfo.nameplate.at(rawInfo.build.end) * rawInfo.avgCapacityFactor : 0;

    var info = {
        theoReason: rawInfo.theorical,
        buildCost: rawInfo.build.cost,
        buildCo2: rawInfo.build.co2,
        avgProd: avgProd,
        storageCapacity: rawInfo.storageCapacity ? rawInfo.storageCapacity.at(rawInfo.build.end) : 0,
        buildDelay: rawInfo.build.end - rawInfo.build.begin
    };

    return React.createElement(
        'div',
        { style: {
                position: 'absolute',
                top: -radius,
                left: radius + 32,
                background: "white",
                border: '3px solid grey',
                borderRadius: 10,
                padding: 5
            } },
        React.createElement(
            'div',
            {
                className: 'hLayout', style: { justifyContent: 'space-between' }
            },
            React.createElement(
                'h3',
                null,
                tr(props.targetBuild.type)
            ),
            React.createElement('img', { src: 'res/icons/info.png', height: '20',
                onClick: function onClick() {
                    return props.onDetailsRequested(detailForTech[props.targetBuild.type]);
                }

            })
        ),
        React.createElement(
            'div',
            { className: 'hLayout', style: { width: 'max-content' } },
            info.storageCapacity > 0 && React.createElement(
                'div',
                null,
                React.createElement('img', { src: 'res/icons/bat.png', height: '18' }),
                valStr(info.storageCapacity, 'Wh', { compact: 2 })
            ),
            info.avgProd > 0 && React.createElement(
                'div',
                null,
                React.createElement('img', { src: 'res/icons/electricEnergy.png', height: '18' }),
                valStr(info.avgProd, 'W', { compact: 2 })
            ),
            info.buildCo2 > 0 && React.createElement(
                'div',
                null,
                React.createElement('img', { src: 'res/icons/pollution.png', height: '18' }),
                valStr(info.buildCo2, 'C', { compact: 2 })
            ),
            React.createElement(
                'div',
                null,
                React.createElement('img', { src: 'res/icons/bill.png', height: '18' }),
                valStr(info.buildCost, '€', { compact: 2 })
            )
        )
    );
}

/** @brief a circular build menu around a point
@param props : accepted fields :
    [All those of BuildDock]
    center : {x, y} coord (in px, page relative) of the center
*/
export var TouchBuildDock = function (_React$Component2) {
    _inherits(TouchBuildDock, _React$Component2);

    function TouchBuildDock() {
        _classCallCheck(this, TouchBuildDock);

        return _possibleConstructorReturn(this, (TouchBuildDock.__proto__ || Object.getPrototypeOf(TouchBuildDock)).apply(this, arguments));
    }

    _createClass(TouchBuildDock, [{
        key: 'render',
        value: function render() {
            var props = this.props;

            var radius = 60;

            return React.createElement(
                'div',
                { style: {
                        position: 'absolute',
                        top: props.center.y,
                        left: props.center.x,
                        width: 0,
                        height: 0
                    }
                },
                energyIcons.map(function (nrj, index) {
                    return React.createElement(CircularBuildMenuIcon, {
                        nrj: nrj,
                        index: index,
                        targetBuild: props.targetBuild,
                        onBuildConfirmed: props.onBuildConfirmed,
                        onTypeChanged: props.onTypeChanged,
                        radius: radius,
                        key: index
                    });
                }),
                React.createElement(QuickStat, {
                    targetBuild: props.targetBuild,
                    simu: props.simu,
                    radius: radius,
                    onDetailsRequested: props.onDetailsRequested
                })
            );
        }
    }]);

    return TouchBuildDock;
}(React.Component);