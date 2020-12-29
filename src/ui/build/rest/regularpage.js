// Copyright 2020, ASBL Math for climate, All rights reserved.


"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Index } from './index.js';
import { Articles } from './articles.js';
import { About } from './about.js';
import { setLang } from '../../../tr.js';
import { NavBar } from './navbar.js';

var StdLayout = function (_React$Component) {
    _inherits(StdLayout, _React$Component);

    function StdLayout(props) {
        _classCallCheck(this, StdLayout);

        return _possibleConstructorReturn(this, (StdLayout.__proto__ || Object.getPrototypeOf(StdLayout)).call(this, props));
    }

    _createClass(StdLayout, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var Content = this.props.content;
            return [React.createElement(NavBar, { key: 'nav', onLangChanged: function onLangChanged() {
                    return _this2.forceUpdate();
                } }), React.createElement(Content, { key: 'content' }), React.createElement(
                'footer',
                { key: 'footer' },
                '        '
            )];
        }
    }]);

    return StdLayout;
}(React.Component);

setLang().then(function () {
    var content = null;

    var path = window.location.pathname;
    //localhost remove
    if (window.location.host == "localhost") path = path.substr("climath/".length);

    path = path.substr(1);

    switch (path) {
        case "index.html":
            content = Index;
            break;
        case "articles.html":
            content = Articles;
            break;
        case "about.html":
            content = About;
            break;
        default:
            console.log("No route found");
            return;
    }

    ReactDOM.render(React.createElement(StdLayout, { content: content }),
    // document.getElementById("root")
    document.body);
});