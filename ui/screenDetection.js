function isTouchScreen(){
    return ('ontouchstart' in document.documentElement);
}
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
function isSmallScreen(){
    return window.innerHeight <= 460 || window.innerWidth <= 460;
}
function screenSize(){
    return {height: window.innerHeight, width: window.innerWidth,};
}
function isLandscape(){
    return window.innerHeight < window.innerWidth;
}

export {isTouchScreen, isMobile,isSmallScreen, screenSize, isLandscape}
