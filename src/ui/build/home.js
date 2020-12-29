var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Copyright 2020, ASBL Math for climate, All rights reserved.

// page index.html

import { NavBar } from './rest/navbar.js';
import { tr } from '../../tr.js';

/** @brief switch between full layouts*/
export var Home = function (_React$Component) {
    _inherits(Home, _React$Component);

    function Home(props) {
        _classCallCheck(this, Home);

        return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));
    }

    _createClass(Home, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var body = [React.createElement(NavBar, { onLangChanged: function onLangChanged() {
                    return _this2.forceUpdate();
                } }), React.createElement(
                'div',
                { className: 'pane hFlex', id: 'pane1' },
                React.createElement(
                    'div',
                    { id: 'carousel' },
                    React.createElement('img', { src: 'res/brol/earth_wind.png', alt: 'earth wind' })
                ),
                React.createElement(
                    'div',
                    { id: 'doTheMath', className: 'vFlex' },
                    React.createElement(
                        'h2',
                        null,
                        tr("How can we reach carbon neutrality by 2050 ?"),
                        ' '
                    ),
                    React.createElement(
                        'ul',
                        { className: 'default' },
                        ["Build your own low carbon scenario", "Understand the tradeoffs of each technologies", "Learn the math behind energies", "Personalize the model with your parameters"].map(function (i) {
                            return React.createElement(
                                'li',
                                { key: i.substr(0, 2) },
                                tr(i)
                            );
                        })
                    ),
                    React.createElement(
                        'a',
                        { className: 'button black', href: 'play.html' },
                        tr("Play now")
                    )
                )
            ), React.createElement('footer', null)];

            return body;
        }
    }]);

    return Home;
}(React.Component);