// Copyright 2020, ASBL Math for climate, All rights reserved.


"use strict";

// import * as BuildMenu from './ui/build/buildmenu.js';
// import * as CentralArea from './ui/src/centralArea.js';
// import * as StatDock from './ui/src/oldstatdock.js';
// import {Plot, canvasEnablePloting, quantityToHuman as valStr} from './ui/build/plot.js';
import {tr, setLang} from './tr.js';

import {App} from './ui/build/app.js';

//window.location.hash : get anchor

// localStorage.clear();


setLang().then(() => {
    ReactDOM.render(
      React.createElement(App),
      document.getElementById("root")
      // document.body
    );
	// console.log(tr('%d little kitten', 'test', 2));
})

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    console.log('beforeinstallprompt');

});

if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('src/sw.js')
           .then(function() { console.log("Service Worker Registered"); });
}

//this does not seems to work
// (full screen on landscape)

// window.addEventListener('orientationchange', function() {
//     if(Math.abs(screen.orientation.angle - 180) == 90)
//         document.documentElement.requestFullscreen();
//     else
//         document.exitFullscreen();
// }, false);
