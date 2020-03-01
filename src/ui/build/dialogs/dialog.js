
import { tr } from "../../../tr.js";

function isUndefined(v) {
    return v === undefined || v === null;
}

/** @brief display a black box around content + buttons ok and details
props :
    onExternClick : function(e)
    onDetailsRequested : function(). if undefined, there will be no details button
    onCloseRequested : function()
    style : used to position the dialog. default position is absolute. Style.top = 'statusbar' := Style.top = 60
    title : str (must be compile time cst)
*/
export function Dialog(props) {
    var style = Object.assign({}, props.style);

    if (!style) style = {};

    if (!style.position) style.position = 'absolute';

    var tx = 0,
        ty = 0;
    if (isUndefined(style.left) && isUndefined(style.right) && !style.transform) {
        style.left = '50%';
        tx = -50;
    }

    if (style.top == 'statusbar') style.top = 'calc(var(--status-bar-height) + 20px)';
    if (isUndefined(style.top) && isUndefined(style.bottom) && !style.transform) {
        style.top = '50%';
        ty = -50;
    }

    if (!style.transform && (tx != 0 || ty != 0)) {
        style.transform = 'translate(' + tx + '%, ' + ty + '%)';
    }

    return React.createElement(
        'div',
        {
            className: "dialog vLayout " + props.className,
            style: style
        },
        props.title && React.createElement(
            'h3',
            null,
            tr(props.title)
        ),
        props.children,
        React.createElement(
            'div',
            { className: 'hLayout' },
            props.onBack && React.createElement(
                'div',
                { className: 'button white', onClick: props.onBack },
                tr("Back")
            ),
            props.onOk && React.createElement(
                'div',
                { className: 'button white', onClick: props.onOk },
                tr("Ok")
            ),
            props.onDetails && React.createElement(
                'div',
                { className: 'button white', onClick: props.onDetails },
                tr('Details...')
            ),
            props.onSkip && React.createElement(
                'div',
                { className: 'button white', onClick: props.onSkip },
                tr('Skip this')
            ),
            props.onNext && React.createElement(
                'div',
                { className: 'button white', onClick: props.onNext },
                tr('Next')
            )
        )
    );
}