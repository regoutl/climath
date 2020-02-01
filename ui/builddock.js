var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BuildDock = function (_React$Component) {
	_inherits(BuildDock, _React$Component);

	function BuildDock(props) {
		_classCallCheck(this, BuildDock);

		return _possibleConstructorReturn(this, (BuildDock.__proto__ || Object.getPrototypeOf(BuildDock)).call(this, props));
	}

	_createClass(BuildDock, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "dBuildDock" },
				React.createElement(
					"h3",
					null,
					"Construire : "
				),
				React.createElement(
					"div",
					{ id: "buildMenuOptionTable" },
					React.createElement("img", { src: "res/icons/solar.jpeg", "class": "bBuild", title: "Panneaux solaires", "data-target": "pv" }),
					React.createElement("img", { src: "res/icons/nuke.png", "class": "bBuild", title: "Centrale nucleaire", "data-target": "nuke" }),
					React.createElement("img", { src: "res/icons/bat.png", "class": "bBuild", title: "Batterie", "data-target": "battery" }),
					React.createElement("img", { src: "res/icons/ccgt.png", "class": "bBuild", title: "Centrale au gaz", "data-target": "ccgt" }),
					React.createElement("img", { src: "res/icons/wind.png", "class": "bBuild", title: "Eolienne", "data-target": "wind" }),
					React.createElement("img", { src: "res/icons/fusion.png", "class": "bBuild", title: "Fusion", "data-target": "fusion" })
				),
				React.createElement(
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
								"Installation"
							),
							React.createElement("td", { "class": "vBMBuild" }),
							React.createElement(
								"td",
								null,
								React.createElement("img", { "class": "bmInf", src: "res/icons/info.png" })
							)
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Par an : "
							),
							React.createElement("td", { "class": "vBMPerYear" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Par kWh : "
							),
							React.createElement("td", { "class": "vBMPerWh" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Production "
							),
							React.createElement("td", { "class": "vBMNameplate" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Capacite "
							),
							React.createElement("td", { "class": "vBMStorageCapacity" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Riviere"
							),
							React.createElement("td", { "class": "vBMRiver" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Population"
							),
							React.createElement("td", { "class": "vBMPop" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Explosion cost"
							),
							React.createElement("td", { "class": "vBMExplCost" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Refroidissement"
							),
							React.createElement("td", { "class": "vBMCoolingWaterRate" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Aire"
							),
							React.createElement("td", { "class": "vBMArea" })
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Probleme"
							),
							React.createElement("td", { "class": "vBMTheoReason" })
						)
					),
					React.createElement("input", { type: "range", id: "BMRange" })
				)
			);
		}
	}]);

	return BuildDock;
}(React.Component);

export default BuildDock;