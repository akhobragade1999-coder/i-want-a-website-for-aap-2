import React from 'react';
import '../css/custom.css';
import '../js/data.js';
import '../js/storage.js';
import '../js/qr.js';
import '../js/app.js';

// Initialize Easy Online Services Reactive App
if (typeof window !== 'undefined' && window.App) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      window.App.init();
    });
  } else {
    window.App.init();
  }
}
