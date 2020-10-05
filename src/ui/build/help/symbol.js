export { _Symbol as Symbol };
function _Symbol(props) {
    return React.createElement('img', { src: 'res/symbols/' + props.src + '.svg', alt: props.src });
}