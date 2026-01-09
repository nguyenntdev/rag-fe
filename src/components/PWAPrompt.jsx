import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, RefreshCw, Wifi, WifiOff, Smartphone, CheckCircle } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

/**
 * PWA Install Prompt Component
 * Shows install prompt, update notification, and offline indicator
 */
export function PWAPrompt() {
  const { t } = useTranslation();
  const {
    isOnline,
    isInstallable,
    isInstalled,
    isUpdateAvailable,
    installApp,
    updateApp
  } = usePWA();

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show install prompt after a delay
  useEffect(() => {
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000); // Show after 30 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, dismissed]);

  // Show update prompt when available
  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [isUpdateAvailable]);

  // Show offline notice
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotice(true);
    } else {
      // Hide after a delay when back online
      const timer = setTimeout(() => {
        setShowOfflineNotice(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowInstallPrompt(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // Remember dismissal for 24 hours
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleUpdate = () => {
    updateApp();
    setShowUpdatePrompt(false);
  };

  // Check if was previously dismissed
  useEffect(() => {
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const hoursSinceDismissal = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
      if (hoursSinceDismissal < 24) {
        setDismissed(true);
      } else {
        localStorage.removeItem('pwa-install-dismissed');
      }
    }
  }, []);

  return (
    <>
      {/* Offline Notice */}
      {showOfflineNotice && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
            isOnline ? 'animate-fade-out' : 'animate-slide-down'
          }`}
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
              isOnline
                ? 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-700'
                : 'bg-amber-50 dark:bg-amber-900/50 border-amber-200 dark:border-amber-700'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {t('pwa.backOnline') || 'Đã kết nối lại'}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {t('pwa.offline') || 'Bạn đang offline'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[100] animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-heritage-gold-300" />
                  <span className="font-semibold text-white">
                    {t('pwa.installTitle') || 'Cài đặt ứng dụng'}
                  </span>
                </div>
                <button
                  onClick={handleDismissInstall}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {t('pwa.installDescription') ||
                  'Cài đặt ứng dụng Di sản Văn hóa Cà Mau để truy cập nhanh hơn và sử dụng offline.'}
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{t('pwa.benefit1') || 'Truy cập nhanh từ màn hình chính'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{t('pwa.benefit2') || 'Hoạt động khi không có mạng'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{t('pwa.benefit3') || 'Nhận thông báo về di sản mới'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDismissInstall}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.later') || 'Để sau'}
                </button>
                <button
                  onClick={handleInstall}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-heritage-red-700 rounded-xl hover:bg-heritage-red-800 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  {t('pwa.install') || 'Cài đặt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[100] animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-200" />
                  <span className="font-semibold text-white">
                    {t('pwa.updateTitle') || 'Có bản cập nhật mới'}
                  </span>
                </div>
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {t('pwa.updateDescription') ||
                  'Một phiên bản mới của ứng dụng đã sẵn sàng. Cập nhật ngay để có trải nghiệm tốt nhất.'}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.later') || 'Để sau'}
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('pwa.update') || 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini Offline Indicator (always visible when offline) */}
      {!isOnline && !showOfflineNotice && (
        <div className="fixed bottom-4 right-4 z-[90]">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 rounded-full shadow-lg border border-amber-200 dark:border-amber-700">
            <WifiOff className="w-4 h-4" />
            <span className="text-xs font-medium">Offline</span>
          </div>
        </div>
      )}
    </>
  );
}

export default PWAPrompt;
