// Chrome Debug Script
// Add this to browser console to debug Chrome-specific issues

console.log('🔍 Chrome Debug Mode - MockMate');
console.log('User Agent:', navigator.userAgent);
console.log('Chrome Version:', navigator.userAgent.match(/Chrome\/([0-9.]+)/)?.[1]);
console.log('React Version:', window.React?.version || 'Not detected');

// Check for common Chrome issues
const debugChecks = {
  serviceWorker: 'serviceWorker' in navigator,
  localStorage: typeof(Storage) !== "undefined",
  indexedDB: typeof(indexedDB) !== "undefined",
  webGL: !!window.WebGLRenderingContext,
  webAssembly: typeof(WebAssembly) !== "undefined"
};

console.log('Browser Capabilities:', debugChecks);

// Monitor React errors
window.addEventListener('error', (e) => {
  console.error('❌ Error detected:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error?.stack
  });
  
  if (e.message.includes('Children')) {
    console.error('🔴 React Children Error Detected!');
    console.log('This is likely due to React version mismatch or JSX runtime issues');
  }
});

// Monitor promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Promise rejection:', e.reason);
});

// Check if React is loading correctly
setTimeout(() => {
  const reactDetected = window.React || document.querySelector('[data-reactroot]') || document.querySelector('#root')?.firstChild;
  console.log('React App Status:', reactDetected ? '✅ Loaded' : '❌ Not loaded');
  
  if (!reactDetected) {
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Clear Chrome cache (Ctrl+Shift+R)');
    console.log('2. Disable Chrome extensions');
    console.log('3. Try incognito mode');
    console.log('4. Check if Service Worker is causing issues');
  }
}, 3000);

// PWA status
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Service Workers:', registrations.length);
    registrations.forEach((reg, i) => {
      console.log(`SW ${i}:`, reg.scope, reg.active?.state);
    });
  });
}

export default {};
