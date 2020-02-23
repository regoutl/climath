
import { tr } from '../../tr/tr.js';

export function CloseButton(props) {
    return React.createElement(
        'div',
        { style: { position: 'sticky', width: '100%', top: 0 } },
        React.createElement('img', { src: 'res/icons/close.png',
            width: '32',
            style: { position: 'absolute', top: 10, right: 10, cursor: 'pointer' },
            title: tr('Close'),
            onClick: props.closeRequested
        })
    );
}