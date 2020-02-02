var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";

function BuildDetailLine(props) {
    return React.createElement(
        "tr",
        { style: props.style },
        React.createElement(
            "th",
            null,
            tr(props.name)
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

function BuildDetailsSolar(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year :", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }, { "n": "Aire", "cn": "vBMArea" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                show.map(mapLineFct(props))
            )
        ),
        React.createElement("input", { type: "range", id: "BMRange" }),
        "// TODO:"
    );
}

function BuildDetailsNuke(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year :", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }, { "n": "Population", "cn": "vBMPop" }, { "n": "Explosion cost", "cn": "vBMExplCost" }, { "n": "Cooling", "cn": "vBMCoolingWaterRate" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
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
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year :", "cn": "vBMPerYear" }, { "n": "Capacity", "cn": "vBMStorageCapacity" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                show.map(mapLineFct(props))
            )
        ),
        React.createElement("input", { type: "range", id: "BMRange", onchange: props.radiusSliderChange }),
        "// TODO:"
    );
}

function BuildDetailsCcgt(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year :", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }, { "n": "Population", "cn": "vBMPop" }, { "n": "Cooling", "cn": "vBMCoolingWaterRate" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
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
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year :", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                show.map(mapLineFct(props))
            )
        ),
        React.createElement("input", { type: "range", id: "BMRange" }),
        "// TODO:"
    );
}

function BuildMenu(props) {
    console.log(window.innerHeight);
    var isSelected = true;
    return React.createElement(
        "div",
        { id: "BuildMenu", className: "vLayout", style: props.style },
        [{ name: 'Solar panels', src: 'solar.png', target: 'pv' }, { name: 'Nuclear power plant', src: 'nuke.png', target: 'nuke' }, { name: 'Battery', src: 'bat.png', target: 'battery' }, { name: 'Gas-fired power plant', src: 'ccgt.png', target: 'ccgt' }, { name: 'Wind turbine', src: 'wind.png', target: 'wind' }, { name: 'Nuclear fusion', src: 'fusion.png', target: 'fusion' }].map(function (nrj) {
            return React.createElement("img", {
                src: 'res/icons/' + nrj.src,
                className: "bBuild",
                title: tr(nrj.name),
                "data-target": nrj.target,
                key: nrj.target,
                onClick: function onClick() {
                    isSelected = !isSelected;
                    return props.onClick(isSelected ? target : undefined);
                }
            });
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

        var _this = _possibleConstructorReturn(this, (BuildDock.__proto__ || Object.getPrototypeOf(BuildDock)).call(this, props));

        _this.state = {
            radius: 50,
            target: "pv", //"nuke","battery","ccgt","wind","fusion", undefined
            showdock: true
        };
        return _this;
    }

    _createClass(BuildDock, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var dockheight = this.state.showdock ? 200 : 32;

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
            if (this.state.target !== undefined) {
                var Type = buildDetailsChoice[this.state.target.toLowerCase()];
                optionTable = React.createElement(Type, {
                    vBMBuild: this.props.vBMBuild,
                    vBMPerYear: this.props.vBMPerYear,
                    vBMNameplate: this.props.vBMNameplate,
                    vBMArea: this.props.vBMArea,
                    vBMPop: this.props.vBMPop,
                    vBMExplCost: this.props.vBMExplCost,
                    vBMCoolingWaterRate: this.props.vBMCoolingWaterRate,
                    vBMStorageCapacity: this.props.vBMStorageCapacity,
                    radiusSliderChange: function radiusSliderChange(radius) {
                        return _this2.props.buildMenuRadiusCallback({ radius: radius });
                    },
                    restyle: restyle
                });
            }

            return React.createElement(
                "div",
                null,
                React.createElement(BuildMenu, {
                    onClick: function onClick(type) {
                        return _this2.props.buildMenuSelectionCallback(type);
                    },
                    style: { bottom: dockheight + 'px' }
                }),
                React.createElement(
                    "div",
                    { id: "dBuildDock", style: { height: dockheight + 'px' } },
                    React.createElement(ShowDockButton, {
                        dockheight: dockheight,
                        showdock: this.state.showdock,
                        onClick: function onClick() {
                            return _this2.setState({ showdock: !_this2.state.showdock });
                        }
                    }),
                    React.createElement(
                        "div",
                        { id: "buildMenuOptionTable" },
                        this.state.showdock ? optionTable : ''
                    )
                )
            );
        }
    }]);

    return BuildDock;
}(React.Component);

export default BuildDock;