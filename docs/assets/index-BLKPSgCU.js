// Forwarder loader for legacy module path -> load current module
(function(){
  try {
    const s = document.createElement('script');
    s.type = 'module';
    s.src = '/SuiviDeCandidatures/index-D1UoqCUh.js?v=2';
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  } catch (e) {
    console.error('forwarder load failed', e);
  }
})();
