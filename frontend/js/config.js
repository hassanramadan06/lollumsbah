// Global configuration
// When the frontend is served by the backend (single-server mode),
// we use the same origin. Override by setting API_BASE in localStorage
// (e.g. localStorage.setItem('API_BASE', 'http://localhost:5000/api')).
(function () {
  const sameOrigin = `${location.protocol}//${location.host}`;
  const defaultApiBase = location.host ? `${sameOrigin}/api` : 'http://localhost:5000/api';
  const defaultUploads = location.host ? sameOrigin : 'http://localhost:5000';
  window.APP_CONFIG = {
    API_BASE: (localStorage.getItem('API_BASE') || defaultApiBase),
    UPLOADS_BASE: (localStorage.getItem('UPLOADS_BASE') || defaultUploads),
    SITE_NAME: 'Little Stars',
    CURRENCY: '$',
  };
})();
