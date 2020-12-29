var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr, getCurrentLang, supportedLanguages, setLang as _setLang } from '../../../tr.js';

export var LangSelector = function (_React$Component) {
    _inherits(LangSelector, _React$Component);

    function LangSelector(props) {
        _classCallCheck(this, LangSelector);

        var _this = _possibleConstructorReturn(this, (LangSelector.__proto__ || Object.getPrototypeOf(LangSelector)).call(this, props));

        _this.state = { open: false };

        _this.esc = function (event) {
            if (event.keyCode !== 27) {
                return;
            }
            _this.close();
        };

        _this.click = function (event) {
            _this.close();
        };
        return _this;
    }

    _createClass(LangSelector, [{
        key: "open",
        value: function open() {
            this.setState({ open: true });

            window.addEventListener("keydown", this.esc);
            window.addEventListener("mousedown", this.click);
        }
    }, {
        key: "close",
        value: function close() {
            this.setState({ open: false });
            window.removeEventListener("keydown", this.esc);
            window.removeEventListener("mousedown", this.click);
        }
    }, {
        key: "setLang",
        value: function setLang(lang) {
            var _this2 = this;

            _setLang(lang).then(function () {
                _this2.props.onLangChanged();
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var chooser = "";

            if (this.state.open) {
                chooser = "open";

                chooser = React.createElement(
                    "div",
                    { id: "selectLang" },
                    supportedLanguages.map(function (lang) {
                        return React.createElement(
                            "div",
                            { onMouseDown: function onMouseDown() {
                                    return _this3.setLang(lang);
                                } },
                            React.createElement("img", { src: "res/icons/lang/" + lang + ".png", key: lang, alt: lang })
                        );
                    })
                );
            }
            var current = React.createElement(
                "div",
                { id: "currentLang", onClick: function onClick() {
                        return _this3.open();
                    } },
                React.createElement("img", { src: "res/icons/lang/" + getCurrentLang() + ".png" }),
                chooser
            );

            return current;
        }
    }]);

    return LangSelector;
}(React.Component);

export function NavBar(props) {
    return React.createElement(
        "header",
        { className: "hFlex" },
        React.createElement(
            "a",
            { href: "index.html", className: "hFlex" },
            React.createElement("img", { src: "res/icons/climath192.png", alt: "logo climath" }),
            React.createElement(
                "h1",
                null,
                "Climath"
            )
        ),
        React.createElement(
            "nav",
            { className: "hFlex" },
            React.createElement(
                "a",
                { href: "play.html" },
                tr("Play")
            ),
            React.createElement(
                "a",
                { href: "articles.html" },
                tr("Articles")
            ),
            React.createElement(
                "a",
                { href: "about.html" },
                tr("About")
            )
        ),
        React.createElement(LangSelector, { onLangChanged: props.onLangChanged })
    );
}