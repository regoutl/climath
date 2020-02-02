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
            { className: props.className },
            props.value
        )
    );
}

var mapLineFct = function mapLineFct(i) {
    return React.createElement(BuildDetailLine, {
        name: i.n,
        className: i.cn,
        value: props[i.cn],
        style: props.restyle[i.cn] === undefined ? {} : props.restyle[i.cn]
    });
};

function BuildDetailsSolar(props) {
    var show = [{ "n": "Installation", "cn": "vBMBuild" }, { "n": "Per year :", "cn": "vBMPerYear" }, { "n": "Production", "cn": "vBMNameplate" }, { "n": "Aire", "cn": "vBMArea" }];
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            show.map(mapLineFct)
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
            show.map(mapLineFct)
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
            show.map(mapLineFct)
        ),
        React.createElement("input", { type: "range", id: "BMRange" }),
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
            show.map(mapLineFct)
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
            show.map(mapLineFct)
        ),
        React.createElement("input", { type: "range", id: "BMRange" }),
        "// TODO:"
    );
}

function BuildMenu(props) {
    return React.createElement(
        "div",
        { id: "BuildMenu", className: "vLayout" },
        " ",
        [{ name: 'Solar panels', src: 'solar.jpeg', target: 'pv' }, { name: 'Nuclear power plant', src: 'nuke.png', target: 'nuke' }, { name: 'Battery', src: 'bat.png', target: 'battery' }, { name: 'Gas-fired power plant', src: 'ccgt.png', target: 'ccgt' }, { name: 'Wind turbine', src: 'wind.png', target: 'wind' }, { name: 'Nuclear fusion', src: 'fusion.png', target: 'fusion' }].map(function (nrj) {
            return React.createElement("img", {
                src: 'res/icons/' + nrj.src,
                className: "bBuild",
                title: tr(nrj.name),
                "data-target": nrj.target
            });
        })
    );
}

var BuildDock = function (_React$Component) {
    _inherits(BuildDock, _React$Component);

    function BuildDock() {
        _classCallCheck(this, BuildDock);

        return _possibleConstructorReturn(this, (BuildDock.__proto__ || Object.getPrototypeOf(BuildDock)).apply(this, arguments));
    }

    _createClass(BuildDock, [{
        key: "render",
        value: function render() {
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
                var type = buildDetailsChoice(this.props.target.toLowerCase());
                optionTable = React.createElement("type", {
                    vBMBuild: this.props.vBMBuild,
                    vBMPerYear: this.props.vBMPerYear,
                    vBMNameplate: this.props.vBMNameplate,
                    vBMArea: this.props.vBMArea,
                    vBMPop: this.props.vBMPop,
                    vBMExplCost: this.props.vBMExplCost,
                    vBMCoolingWaterRate: this.props.vBMCoolingWaterRate,
                    vBMStorageCapacity: this.props.vBMStorageCapacity,
                    restyle: restyle
                });
            }

            return React.createElement(
                "div",
                null,
                React.createElement(BuildMenu, null),
                React.createElement(
                    "div",
                    { id: "dBuildDock" },
                    React.createElement(
                        "div",
                        { id: "buildMenuOptionTable" },
                        optionTable
                    )
                )
            );
        }
    }]);

    return BuildDock;
}(React.Component);

export default BuildDock;