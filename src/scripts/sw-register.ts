export function registerSW() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => console.log('SW registered', reg))
        .catch(err => console.error('SW registration failed', err));
    });
  }
}
