// src/components/BotpressChatbot.jsx

import React, { useEffect } from 'react';

const BotpressChatbot = () => {
  useEffect(() => {
    // --- Begin injected script logic ---
    function onDOMReady(callback) {
      if (
        document.readyState === 'complete' ||
        document.readyState === 'interactive'
      ) {
        callback();
      } else {
        document.addEventListener('DOMContentLoaded', callback);
      }
    }

    const cleanupFns = [];

    onDOMReady(function () {
      try {
        // Load first script
        const script1 = document.createElement('script');
        script1.src =  'https://cdn.botpress.cloud/webchat/v2.5/inject.js';
        script1.async = true;

        script1.onerror = function () {
          console.error('Failed to load script:', script1.src);
        };

        // When first script loads, then load second script
        script1.onload = function () {
          if (!window.botpress) {
            console.error('window.botpress is not defined after script1 loaded');
            return;
          }

          const script2 = document.createElement('script');
          script2.src = 'https://files.bpcontent.cloud/2025/05/19/18/20250519185039-48E3E56B.js';
          script2.async = true;

          script2.onerror = function () {
            console.error('Failed to load script:', script2.src);
          };

          document.body.appendChild(script2);

          // Cleanup script2 on unload
          const cleanup2 = function cleanup() {
            if (document.body.contains(script2)) {
              document.body.removeChild(script2);
            }
            window.removeEventListener('unload', cleanup);
          };
          window.addEventListener('unload', cleanup2);
          cleanupFns.push(cleanup2);
        };

        document.body.appendChild(script1);

        // Cleanup script1 on unload
        const cleanup1 = function cleanup() {
          if (document.body.contains(script1)) {
            document.body.removeChild(script1);
          }
          window.removeEventListener('unload', cleanup);
        };
        window.addEventListener('unload', cleanup1);
        cleanupFns.push(cleanup1);

      } catch (err) {
        console.error('Error while injecting Botpress scripts:', err);
      }
    });

    // Cleanup on component unmount
    return () => {
      cleanupFns.forEach((fn) => fn());
    };
    // --- End injected script logic ---
  }, []);

  return null; // No visible UI needed
};

export default BotpressChatbot;