// Copyright 2020, ASBL Math for climate, All rights reserved.


import {tr} from '../../tr.js';

export function CloseButton(props){
    return (<div style={{position: 'sticky', width: '100%', top: 0}}>
        <img src='res/icons/close.png'
            width="32"
            style={{position:'absolute', top: 10, right: 10, cursor: 'pointer'}}
            title={tr('Close')}
            onClick={props.closeRequested}
        />
    </div>);
}
