var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StatDock = function (_React$Component) {
    _inherits(StatDock, _React$Component);

    function StatDock() {
        _classCallCheck(this, StatDock);

        return _possibleConstructorReturn(this, (StatDock.__proto__ || Object.getPrototypeOf(StatDock)).apply(this, arguments));
    }

    _createClass(StatDock, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { style: { width: 300 } },
                "    ",
                React.createElement(
                    "select",
                    null,
                    React.createElement(
                        "option",
                        { value: "1" },
                        "Cette annee"
                    ),
                    React.createElement(
                        "option",
                        { value: "2" },
                        "Depuis 2 ans"
                    ),
                    React.createElement(
                        "option",
                        { value: "5" },
                        "Depuis 5 ans"
                    ),
                    React.createElement(
                        "option",
                        { value: "10" },
                        "Depuis 10 ans"
                    ),
                    React.createElement(
                        "option",
                        { value: "20" },
                        "Depuis 20 ans"
                    ),
                    React.createElement(
                        "option",
                        { value: "100000" },
                        "Depuis le debut"
                    )
                ),
                React.createElement(
                    "h2",
                    null,
                    "Origine de l'energie"
                ),
                React.createElement(
                    "p",
                    null,
                    "Demande : 650 TWh"
                ),
                React.createElement("canvas", { id: "cStatEnergyOri" }),
                React.createElement(
                    "h2",
                    null,
                    "Empreinte carbone"
                ),
                React.createElement(
                    "p",
                    null,
                    "Total : 10 T"
                ),
                React.createElement("canvas", { id: "cStatFootprint" }),
                React.createElement(
                    "h2",
                    null,
                    "Budget"
                ),
                React.createElement(
                    "p",
                    null,
                    "Total : 10 eur"
                ),
                React.createElement("canvas", { id: "cStatBudget" })
            );
        }
    }]);

    return StatDock;
}(React.Component);

export default StatDock;