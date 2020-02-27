
import {tr} from "../../../tr/tr.js";

function isUndefined(v){
    return v === undefined ||v === null;
}

/** @brief display a black box around content + buttons ok and details
props :
    onExternClick : function(e)
    onDetailsRequested : function(). if undefined, there will be no details button
    onCloseRequested : function()
    style : used to position the dialog. default position is absolute. Style.top = 'statusbar' := Style.top = 60
    title : str (must be compile time cst)
*/
export function Dialog(props){
    let style = {...props.style};


    if(!style)
        style= {};

    if(!style.position)
        style.position = 'absolute';

    let tx = 0, ty = 0;
    if(isUndefined(style.left) && isUndefined(style.right) && !style.transform){
        style.left = '50%';
        tx = -50;
    }

    if(style.top == 'statusbar')
        style.top = 'calc(var(--status-bar-height) + 20px)';
    if(isUndefined(style.top) && isUndefined(style.bottom) && !style.transform){
        style.top = '50%';
        ty = -50;
    }

    if(!style.transform && (tx != 0 || ty != 0)){
        style.transform = `translate(${tx}%, ${ty}%)`;
    }


    return (
        <div
            className={"dialog vLayout "+props.className}
            style={style}
        >
            {props.title && <h3>{tr(props.title)}</h3>}
            {props.children}
            <div className="hLayout">
                {props.onBack &&<div className="button white" onClick={props.onBack}>{tr("Back")}</div>}
                {props.onOk &&<div className="button white" onClick={props.onOk}>{tr("Ok")}</div>}
                {props.onDetails && <div className="button white" onClick={props.onDetails}>{tr('Details...')}</div>}
                {props.onSkip && <div className="button white" onClick={props.onSkip}>{tr('Skip this')}</div>}
                {props.onNext && <div className="button white" onClick={props.onNext}>{tr('Next')}</div>}
            </div>
        </div>
    );
}
