*** /dev/null
--- b/assets/js/perf.js
@@
+ (function () {
+   // Run ASAP after DOM is parsed
+   document.addEventListener('DOMContentLoaded', function () {
+     // 1) Images: lazy + async decoding + width/height preservation
+     var imgs = document.querySelectorAll('img');
+     for (var i = 0; i < imgs.length; i++) {
+       var im = imgs[i];
+       if (!im.hasAttribute('loading')) im.setAttribute('loading', 'lazy');
+       if (!im.hasAttribute('decoding')) im.setAttribute('decoding', 'async');
+       // Avoid layout shift: if no width/height but natural sizes known, set attributes
+       if (!im.hasAttribute('width') && im.naturalWidth) im.setAttribute('width', im.naturalWidth);
+       if (!im.hasAttribute('height') && im.naturalHeight) im.setAttribute('height', im.naturalHeight);
+     }
+ 
+     // 2) Iframes: lazy load
+     var ifr = document.querySelectorAll('iframe');
+     for (var j = 0; j < ifr.length; j++) {
+       if (!ifr[j].hasAttribute('loading')) ifr[j].setAttribute('loading', 'lazy');
+     }
+ 
+     // 3) Videos: don't preload data; show poster only until user interacts
+     var vids = document.querySelectorAll('video');
+     for (var k = 0; k < vids.length; k++) {
+       var v = vids[k];
+       if (!v.hasAttribute('preload')) v.setAttribute('preload', 'none');
+     }
+ 
+     // 4) Defer non-critical third-party widgets if any (by data-defer attribute)
+     //    Example: <script data-defer-src="https://example.com/widget.js"></script>
+     if ('requestIdleCallback' in window) {
+       requestIdleCallback(loadDeferredScripts);
+     } else {
+       setTimeout(loadDeferredScripts, 1200);
+     }
+     function loadDeferredScripts() {
+       var deferred = document.querySelectorAll('script[data-defer-src]');
+       for (var s = 0; s < deferred.length; s++) {
+         var el = deferred[s];
+         if (!el.src) el.src = el.getAttribute('data-defer-src');
+       }
+     }
+ 
+     // 5) Preload hero image if it exists (id="hero-img")
+     var hero = document.getElementById('hero-img');
+     if (hero && hero.src) {
+       var l = document.createElement('link');
+       l.rel = 'preload';
+       l.as = 'image';
+       l.href = hero.currentSrc || hero.src;
+       document.head.appendChild(l);
+     }
+   });
+ })();
