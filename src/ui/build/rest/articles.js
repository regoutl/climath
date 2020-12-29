var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Copyright 2020, ASBL Math for climate, All rights reserved.

// page index.html

import { NavBar } from './navbar.js';
import { tr } from '../../../tr.js';

/** @brief switch between full layouts*/
export var Articles = function (_React$Component) {
    _inherits(Articles, _React$Component);

    function Articles(props) {
        _classCallCheck(this, Articles);

        return _possibleConstructorReturn(this, (Articles.__proto__ || Object.getPrototypeOf(Articles)).call(this, props));
    }

    _createClass(Articles, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var body = [React.createElement(NavBar, { onLangChanged: function onLangChanged() {
                    return _this2.forceUpdate();
                } }), React.createElement(
                'div',
                null,
                'Articles'
            ),, React.createElement('footer', null)];

            return body;
        }
    }]);

    return Articles;
}(React.Component);