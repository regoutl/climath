var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../tr/tr.js";

/**
    <BuildDetailsSolar
        vBMPerYear=""
        vBMNameplate=""
        vBMArea=""
    />
*/
function BuildDetailsSolar(props) {
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Installation")
                ),
                React.createElement("td", { className: "vBMBuild" }),
                React.createElement(
                    "td",
                    null,
                    React.createElement("img", { className: "bmInf", src: "res/icons/info.png" })
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Per year :")
                ),
                React.createElement(
                    "td",
                    { className: "vBMPerYear" },
                    props.vBMPerYear
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr('Production')
                ),
                React.createElement(
                    "td",
                    { className: "vBMNameplate" },
                    props.vBMNameplate
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    "Aire"
                ),
                React.createElement(
                    "td",
                    { className: "vBMArea" },
                    props.vBMArea
                )
            )
        ),
        React.createElement("input", { type: "range", id: "BMRange" }),
        "// TODO:"
    );
}

/**
    <BuildDetailsNuke
        vBMPerYear=""
        vBMNameplate=""
        vBMPop=""
        vBMExplCost=""
        vBMCoolingWaterRate=""
    />
*/
function BuildDetailsNuke(props) {
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Installation")
                ),
                React.createElement("td", { className: "vBMBuild" }),
                React.createElement(
                    "td",
                    null,
                    React.createElement("img", { className: "bmInf", src: "res/icons/info.png" })
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Per year :")
                ),
                React.createElement(
                    "td",
                    { className: "vBMPerYear" },
                    props.vBMPerYear
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr('Production')
                ),
                React.createElement(
                    "td",
                    { className: "vBMNameplate" },
                    props.vBMNameplate
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr('Population')
                ),
                React.createElement(
                    "td",
                    { className: "vBMPop" },
                    props.vBMPop
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr('Explosion cost')
                ),
                React.createElement(
                    "td",
                    { className: "vBMExplCost" },
                    props.vBMExplCost
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr('Cooling')
                ),
                React.createElement(
                    "td",
                    { className: "vBMCoolingWaterRate" },
                    props.vBMCoolingWaterRate
                )
            )
        )
    );
}

/**
    <BuildDetailsBat
        vBMPerYear=""
        vBMStorageCapacity=""
    />
*/
function BuildDetailsBat(props) {
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Installation")
                ),
                React.createElement("td", { className: "vBMBuild" }),
                React.createElement(
                    "td",
                    null,
                    React.createElement("img", { className: "bmInf", src: "res/icons/info.png" })
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Per year :")
                ),
                React.createElement(
                    "td",
                    { className: "vBMPerYear" },
                    props.vBMPerYear
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Capacity")
                ),
                React.createElement(
                    "td",
                    { className: "vBMStorageCapacity" },
                    props.vBMStorageCapacity
                )
            )
        )
    );
}

/**
    <BuildDetailsCcgt
        vBMPerYear=""
        vBMNameplate=""
        vBMPop=""
        vBMCoolingWaterRate=""
    />
*/
function BuildDetailsCcgt(props) {
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Installation")
                ),
                React.createElement("td", { className: "vBMBuild" }),
                React.createElement(
                    "td",
                    null,
                    React.createElement("img", { className: "bmInf", src: "res/icons/info.png" })
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Per year :")
                ),
                React.createElement(
                    "td",
                    { className: "vBMPerYear" },
                    props.vBMPerYear
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Production")
                ),
                React.createElement(
                    "td",
                    { className: "vBMNameplate" },
                    props.vBMNameplate
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Population")
                ),
                React.createElement(
                    "td",
                    { className: "vBMPop" },
                    props.vBMPop
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Cooling")
                ),
                React.createElement(
                    "td",
                    { className: "vBMCoolingWaterRate" },
                    props.vBMCoolingWaterRate
                )
            )
        )
    );
}

/**
    <BuildDetailsNuke
        vBMPerYear=""
        vBMNameplate=""
    />
*/
function BuildDetailWind(props) {
    return React.createElement(
        "div",
        { id: "dBuildDetails" },
        React.createElement(
            "table",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Installation")
                ),
                React.createElement("td", { className: "vBMBuild" }),
                React.createElement(
                    "td",
                    null,
                    React.createElement("img", { className: "bmInf", src: "res/icons/info.png" })
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Per year :")
                ),
                React.createElement(
                    "td",
                    { className: "vBMPerYear" },
                    props.vBMPerYear
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    tr("Production")
                ),
                React.createElement(
                    "td",
                    { className: "vBMNameplate" },
                    props.vBMNameplate
                )
            )
        )
    );
}

function BuildMenu(props) {
    return React.createElement(
        "div",
        null,
        " ",
        [{ name: 'Solar panels', src: 'solar.jpeg', target: 'pv' }, { name: 'Nuclear power plant', src: 'nuke.png', target: 'nuke' }, { name: 'Battery', src: 'bat.png', target: 'battery' }, { name: 'Gas-fired power plant', src: 'ccgt.png', target: 'ccgt' }, { name: 'Wind turbine', src: 'wind.png', target: 'wind' }, { name: 'Nuclear fusion', src: 'fusion.png', target: 'fusion' }].map(function (nrj) {
            return React.createElement("img", {
                src: 'res/icons/' + nrj.src,
                className: "bBuild", title: tr(nrj.name),
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

        // constructor(props){
        //     super(props);
        //     this.state = {}
        // }
        value: function render() {
            // <tr><th>Probleme</th><td className = "vBMTheoReason"></td></tr>

            var optionTable = "";
            switch (this.props.target) {
                case "pv":
                    optionTable = React.createElement(BuildDetailsSolar, {
                        vBMPerYear: this.props.vBMPerYear,
                        vBMNameplate: this.props.vBMNameplate,
                        vBMArea: this.props.vBMArea
                    });
                    break;
                case "nuke":
                case "fusion":
                    optionTable = React.createElement(BuildDetailsNuke, {
                        vBMPerYear: this.props.vBMPerYear,
                        vBMNameplate: this.props.vBMNameplate,
                        vBMPop: this.props.vBMPop,
                        vBMExplCost: this.props.vBMExplCost,
                        vBMCoolingWaterRate: this.props.vBMCoolingWaterRate
                    });
                    break;
                case "battery":
                    optionTable = React.createElement(BuildDetailsBat, {
                        vBMPerYear: this.props.vBMPerYear,
                        vBMStorageCapacity: this.props.vBMStorageCapacity
                    });
                    break;
                case "ccgt":
                    optionTable = React.createElement(BuildDetailsCcgt, {
                        vBMPerYear: this.props.vBMPerYear,
                        vBMNameplate: this.props.vBMNameplate,
                        vBMPop: this.props.vBMPop,
                        vBMCoolingWaterRate: this.props.vBMCoolingWaterRate
                    });
                    break;
                case "wind":
                    optionTable = React.createElement(BuildDetailsNuke, {
                        vBMPerYear: this.props.vBMPerYear,
                        vBMNameplate: this.props.vBMNameplate
                    });
                    break;
            }
            return React.createElement(
                "div",
                { id: "dBuildDock" },
                React.createElement(
                    "h3",
                    null,
                    tr("Build"),
                    " :"
                ),
                React.createElement(BuildMenu, null),
                React.createElement(
                    "div",
                    { id: "buildMenuOptionTable" },
                    optionTable
                )
            );
        }
    }]);

    return BuildDock;
}(React.Component);

export default BuildDock;