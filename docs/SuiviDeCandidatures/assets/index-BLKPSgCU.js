// Lightweight loader to forward requests to the root JS (cache-busted)
(function(){
  try {
    const s = document.createElement('script');
    s.type = 'module';
    s.src = '/SuiviDeCandidatures/index-BLKPSgCU.js?v=2';
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  } catch (e) {
    console.error('forwarder load failed', e);
  }
})();
