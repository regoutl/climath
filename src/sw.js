// Copyright 2020, ASBL Math for climate, All rights reserved.

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('climath').then(function(cache) {
     return true;;
   })
 );
});


self.addEventListener('fetch', function(event) {
	// event.respondWith(
	// 	caches.match(event.request).then(function(response) {
	// 		return response || fetch(event.request);
	// 	})
	// );
});
