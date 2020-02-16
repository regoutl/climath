function isTouchScreen(){
    return ('ontouchstart' in document.documentElement);
}
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
function isSmallScreen(){
    return window.innerHeight <= 760 || window.innerWidth <= 760;
}
function screenSize(){
    return {height: window.innerHeight, width: window.innerWidth,};
}

export {isTouchScreen, isMobile,isSmallScreen, screenSize}
