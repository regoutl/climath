export { _Symbol as Symbol };
// Copyright 2020, ASBL Math for climate, All rights reserved.


function _Symbol(props) {
    return React.createElement('img', { src: 'res/symbols/' + props.src + '.svg', alt: props.src });
}