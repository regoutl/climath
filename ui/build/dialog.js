
import { tr } from "../../tr/tr.js";

/** @brief display a black box around content + buttons ok and details
props :
    onExternClick : function(e)
    onDetailsRequested : function(). if undefined, there will be no details button
    onCloseRequested : function()
    style : used to position the dialog
    title
*/
export function Dialog(props) {
    return React.createElement(
        "div",
        {
            className: "dialog vLayout",
            style: props.style
        },
        props.title && React.createElement(
            "h3",
            null,
            tr(props.title)
        ),
        props.children,
        React.createElement(
            "div",
            { className: "hLayout" },
            props.onBack && React.createElement(
                "div",
                { className: "button white", onClick: props.onBack },
                tr("Back")
            ),
            props.onOk && React.createElement(
                "div",
                { className: "button white", onClick: props.onOk },
                tr("Ok")
            ),
            props.onDetails && React.createElement(
                "div",
                { className: "button white", onClick: props.onDetails },
                tr('Details...')
            )
        )
    );
}