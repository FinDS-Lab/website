(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (!im.hasAttribute('loading')) im.setAttribute('loading', 'lazy');
      if (!im.hasAttribute('decoding')) im.setAttribute('decoding', 'async');
      if (!im.hasAttribute('width') && im.naturalWidth) im.setAttribute('width', im.naturalWidth);
      if (!im.hasAttribute('height') && im.naturalHeight) im.setAttribute('height', im.naturalHeight);
    }
    var ifr = document.querySelectorAll('iframe');
    for (var j = 0; j < ifr.length; j++) {
      if (!ifr[j].hasAttribute('loading')) ifr[j].setAttribute('loading', 'lazy');
    }
    var vids = document.querySelectorAll('video');
    for (var k = 0; k < vids.length; k++) {
      var v = vids[k];
      if (!v.hasAttribute('preload')) v.setAttribute('preload', 'none');
    }
    function loadDeferredScripts() {
      var deferred = document.querySelectorAll('script[data-defer-src]');
      for (var s = 0; s < deferred.length; s++) {
        var el = deferred[s];
        if (!el.src) el.src = el.getAttribute('data-defer-src');
      }
    }
    if ('requestIdleCallback' in window) requestIdleCallback(loadDeferredScripts);
    else setTimeout(loadDeferredScripts, 1200);
    var hero = document.getElementById('hero-img');
    if (hero && hero.src) {
      var l = document.createElement('link');
      l.rel = 'preload';
      l.as = 'image';
      l.href = hero.currentSrc || hero.src;
      document.head.appendChild(l);
    }
  });
})();
