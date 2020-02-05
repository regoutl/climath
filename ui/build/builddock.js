var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";

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

function BuildDetailLine(props) {
    return React.createElement(
        "tr",
        { style: props.style },
        React.createElement(
            "th",
            null,
            tr(props.name),
            " :"
        ),
        React.createElement(
            "td",
            { className: props.className, key: props.name },
            props.value
        )
    );
}

function mapLineFct(props) {
    return function (i) {
        return React.createElement(BuildDetailLine, {
            name: i.n,
            className: i.cn,
            value: props[i.cn],
            style: props.restyle[i.cn] === undefined ? {} : props.restyle[i.cn],
            key: i.n
        });
    };
}

function InputSlider(props) {
    return React.createElement("input", {
        type: "range",
        id: "BMRange",
        defaultValue: props.slider.default,
        onChange: function onChange(event) {
            return props.slider.radiusSliderChange(event.target.value);
        },
        min: props.slider.min,
        max: props.slider.max
    });
}

function BuildDetailsSolar(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }, { "n": "Aire", "cn": "vBMArea" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails", style: props.style },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                show.map(mapLineFct(props))
            )
        ),
        React.createElement(InputSlider, { slider: props.slider })
    );
}

function BuildDetailsNuke(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }, { "n": "Population", "cn": "vBMPop" }, { "n": "Explosion cost", "cn": "vBMExplCost" }, { "n": "Cooling", "cn": "vBMCoolingWaterRate" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails", style: props.style },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                show.map(mapLineFct(props))
            )
        )
    );
}

function BuildDetailsBat(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year", "cn": "vBMPerYear" }, { "n": "Capacity", "cn": "vBMStorageCapacity" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails", style: props.style },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                show.map(mapLineFct(props))
            )
        ),
        React.createElement(InputSlider, { slider: props.slider })
    );
}

function BuildDetailsCcgt(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }, { "n": "Population", "cn": "vBMPop" }, { "n": "Cooling", "cn": "vBMCoolingWaterRate" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails", style: props.style },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                show.map(mapLineFct(props))
            )
        )
    );
}

function BuildDetailsWind(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails", style: props.style },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                show.map(mapLineFct(props))
            )
        ),
        React.createElement(InputSlider, { slider: props.slider })
    );
}

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
        "div",
        { id: "BuildMenu", className: "vLayout", style: props.style },
        [{ name: 'Solar panels', src: 'solar.png', target: 'pv' }, { name: 'Nuclear power plant', src: 'nuke.png', target: 'nuke' }, { name: 'Battery', src: 'bat.png', target: 'battery' }, { name: 'Gas-fired power plant', src: 'ccgt.png', target: 'ccgt' }, { name: 'Wind turbine', src: 'wind.png', target: 'wind' }, { name: 'Nuclear fusion', src: 'fusion.png', target: 'fusion' }].map(function (nrj) {
            return props.showMenu === true || props.showMenu === nrj.target ? React.createElement("img", {
                src: 'res/icons/' + nrj.src,
                className: "bBuild",
                title: tr(nrj.name),
                "data-target": nrj.target,
                key: nrj.target,
                onClick: function onClick() {
                    return selecte(nrj.target);
                }
            }) : '';
        })
    );
}

function ShowDockButton(props) {
    return React.createElement("img", {
        src: 'res/icons/info.png',
        className: "bBuild",
        style: { bottom: props.dockheight - 16 + 'px' },
        title: tr((props.showdock ? 'Hide' : 'Show') + ' dock'),
        onClick: function onClick() {
            return props.onClick();
        },
        key: "DockButton"
    });
}

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
        key: "render",
        value: function render() {
            var _this2 = this;

            var showdock = this.props.target !== undefined; //this.state.showdock
            var dockheight = showdock ? 200 : 32;
            var defaultRadius = 50,
                maxRadius = 100;

            var restyle = {};
            if (this.props.vBMTheoReason !== undefined) {
                restyle[this.props.vBMTheoReason] = { "color": "red" };
            }

            var buildDetailsChoice = {
                "pv": BuildDetailsSolar,
                "nuke": BuildDetailsNuke,
                "fusion": BuildDetailsNuke,
                "battery": BuildDetailsBat,
                "ccgt": BuildDetailsCcgt,
                "wind": BuildDetailsWind
            };
            var optionTable = "";
            if (this.props.target !== undefined) {
                var Type = buildDetailsChoice[this.props.target.toLowerCase()];
                optionTable = React.createElement(Type, {
                    vBMBuild: this.props.vBMBuild,
                    vBMPerYear: this.props.vBMPerYear,
                    vBMNameplate: this.props.vBMNameplate,
                    vBMArea: this.props.vBMArea,
                    vBMPop: this.props.vBMPop,
                    vBMExplCost: this.props.vBMExplCost,
                    vBMCoolingWaterRate: this.props.vBMCoolingWaterRate,
                    vBMStorageCapacity: this.props.vBMStorageCapacity,
                    slider: this.props.sliderRadiusDefault,
                    restyle: restyle,
                    style: { bottom: 0, height: dockheight }
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
                "div",
                { className: "yLayout" },
                React.createElement(BuildMenu, {
                    onClick: function onClick(type) {
                        return _this2.props.buildMenuSelectionCallback(type);
                    },
                    style: { bottom: dockheight + 'px' },
                    showMenu: this.props.target === undefined ? true : this.props.target
                }),
                false ? hideDockButton : "",
                React.createElement(
                    "div",
                    { id: "dBuildDock", style: { height: dockheight + 'px' } },
                    React.createElement(
                        "div",
                        { id: "buildMenuOptionTable" },
                        showdock ? optionTable : ''
                    )
                )
            );
        }
    }]);

    return BuildDock;
}(React.Component);

export default BuildDock;