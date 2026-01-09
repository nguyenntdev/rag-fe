import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for PWA functionality
 * Handles service worker registration, updates, and install prompts
 */
export function usePWA() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [registration, setRegistration] = useState(null);

  // Check if app is already installed
  useEffect(() => {
    const checkInstalled = () => {
      // Check if running in standalone mode (installed PWA)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      // Check for iOS standalone mode
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return;
      }

      // Check for installed related apps
      if ('getInstalledRelatedApps' in navigator) {
        navigator.getInstalledRelatedApps().then((apps) => {
          if (apps.length > 0) {
            setIsInstalled(true);
          }
        }).catch(() => {
          // Silently fail
        });
      }
    };

    checkInstalled();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => {
      setIsInstalled(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('[PWA] Install prompt available');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[PWA] App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check for updates periodically
        const checkForUpdates = () => {
          reg.update().catch((error) => {
            console.error('[PWA] Update check failed:', error);
          });
        };

        // Check for updates every 5 minutes
        const updateInterval = setInterval(checkForUpdates, 5 * 60 * 1000);

        // Listen for new service worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setIsUpdateAvailable(true);
                console.log('[PWA] New version available');
              }
            });
          }
        });

        return () => clearInterval(updateInterval);
      });

      // Handle controller change (new service worker activated)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Install the PWA
  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] User response to install prompt: ${outcome}`);

      // Clear the deferred prompt
      setDeferredPrompt(null);
      setIsInstallable(false);

      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Install failed:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Update the app (activate new service worker)
  const updateApp = useCallback(() => {
    if (registration && registration.waiting) {
      // Send skip waiting message to service worker
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [registration]);

  // Clear all caches
  const clearCache = useCallback(async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }

    // Also clear via Cache API directly
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log('[PWA] All caches cleared');
    }
  }, []);

  // Cache data for offline use
  const cacheData = useCallback((data) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_DATA',
        data
      });
    }
  }, []);

  // Request persistent storage
  const requestPersistentStorage = useCallback(async () => {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      console.log(`[PWA] Persistent storage ${isPersisted ? 'granted' : 'denied'}`);
      return isPersisted;
    }
    return false;
  }, []);

  // Get storage estimate
  const getStorageEstimate = useCallback(async () => {
    if (navigator.storage && navigator.storage.estimate) {
      const { usage, quota } = await navigator.storage.estimate();
      return {
        usage: usage || 0,
        quota: quota || 0,
        usageInMB: ((usage || 0) / (1024 * 1024)).toFixed(2),
        quotaInMB: ((quota || 0) / (1024 * 1024)).toFixed(2),
        percentUsed: quota ? ((usage / quota) * 100).toFixed(2) : 0
      };
    }
    return null;
  }, []);

  return {
    // Status
    isOnline,
    isInstallable,
    isInstalled,
    isUpdateAvailable,
    isPWASupported: 'serviceWorker' in navigator,

    // Actions
    installApp,
    updateApp,
    clearCache,
    cacheData,
    requestPersistentStorage,
    getStorageEstimate
  };
}

export default usePWA;
