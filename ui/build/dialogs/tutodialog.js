var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { tr } from "../../../tr/tr.js";
import { Dialog } from './dialog.js';
import { isTouchScreen } from '../../screenDetection.js';

export var TutoDialog = function (_React$Component) {
    _inherits(TutoDialog, _React$Component);

    function TutoDialog(props) {
        _classCallCheck(this, TutoDialog);

        var _this = _possibleConstructorReturn(this, (TutoDialog.__proto__ || Object.getPrototypeOf(TutoDialog)).call(this, props));

        _this.state = { slide: 0 };
        return _this;
    }

    _createClass(TutoDialog, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var props = this.props;

            //build on mobile
            var touchBuild = [React.createElement(
                'div',
                { className: 'hLayout' },
                React.createElement(
                    'div',
                    { className: 'vLayout' },
                    React.createElement('img', { src: 'res/tuto/slide2tap.png', height: '80' }),
                    React.createElement(
                        'p',
                        null,
                        tr('Tap anywhere')
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'vLayout', style: { borderLeft: '1px solid white' } },
                    React.createElement('img', { src: 'res/tuto/slide2select.png', height: '80' }),
                    React.createElement(
                        'p',
                        null,
                        tr('Select the plant you want to build')
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'vLayout', style: { borderLeft: '1px solid white' } },
                    React.createElement('img', { src: 'res/tuto/slide2done.png', height: '80' }),
                    React.createElement(
                        'p',
                        null,
                        tr('Production start soon !')
                    )
                )
            )];

            var desktopBuild = [React.createElement(
                'div',
                { className: 'hLayout' },
                React.createElement(
                    'div',
                    { className: 'vLayout' },
                    React.createElement('img', { src: 'res/tuto/slide2select.png', height: '80' }),
                    React.createElement(
                        'p',
                        null,
                        tr('Select type')
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'vLayout', style: { borderLeft: '1px solid white' } },
                    React.createElement('img', { src: 'res/tuto/slide2loc.png', height: '80' }),
                    React.createElement(
                        'p',
                        null,
                        tr('Select location')
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'vLayout', style: { borderLeft: '1px solid white' } },
                    React.createElement('img', { src: 'res/tuto/slide2done.png', height: '80' }),
                    React.createElement(
                        'p',
                        null,
                        tr('Production start soon !')
                    )
                )
            )];

            var slide = [{ title: 'Objective', body: [React.createElement(
                    'p',
                    null,
                    tr('Emmit 0 carbon between 2050 and 2070')
                ), React.createElement(
                    'p',
                    null,
                    tr('Build low carbon power plants')
                )] }, { title: 'Power plants construction', body: isTouchScreen() ? touchBuild : desktopBuild }, { title: 'Power plants types', body: [React.createElement(
                    'div',
                    { className: 'hLayout' },
                    React.createElement(
                        'div',
                        { className: 'vLayout' },
                        React.createElement(
                            'h4',
                            null,
                            tr('Renewables')
                        ),
                        React.createElement('img', { src: 'res/icons/wind.png', style: { filter: 'invert(1)' }, height: '50' }),
                        React.createElement(
                            'p',
                            null,
                            tr('Low carbon. Does not produce all time')
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'vLayout', style: { borderLeft: '1px solid white' } },
                        React.createElement(
                            'h4',
                            null,
                            tr('Storage')
                        ),
                        React.createElement('img', { src: 'res/icons/bat.png', style: { filter: 'invert(1)' }, height: '50' }),
                        React.createElement(
                            'p',
                            null,
                            tr('Store energy')
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'vLayout', style: { borderLeft: '1px solid white' } },
                        React.createElement(
                            'h4',
                            null,
                            tr('Centrals')
                        ),
                        React.createElement('img', { src: 'res/icons/ccgt.png', height: '50' }),
                        React.createElement(
                            'p',
                            null,
                            tr('Stable production. Requires water.')
                        )
                    )
                )] }];

            return React.createElement(
                Dialog,
                {
                    className: 'tuto',
                    title: slide[this.state.slide].title,
                    onNext: this.state.slide == slide.length - 1 ? undefined : function () {
                        _this2.setState(function (state) {
                            return { slide: state.slide + 1 };
                        });
                    },
                    onSkip: this.state.slide == slide.length - 1 ? undefined : function () {
                        localStorage.setItem('skipTuto', true);props.closeRequested();
                    },
                    onOk: this.state.slide == slide.length - 1 ? function () {
                        return props.closeRequested();
                    } : undefined
                },
                slide[this.state.slide].body
            );
        }
    }]);

    return TutoDialog;
}(React.Component);