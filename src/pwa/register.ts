// Service Worker registration with update prompt
import { registerSW } from 'virtual:pwa-register';

export function setupPwaServiceWorker(options?: {
  onNeedRefresh?: (reloadPage: () => void) => void;
  onOfflineReady?: () => void;
}) {
  if (typeof window === 'undefined') return;

  const updateSW = registerSW({
    onNeedRefresh() {
      // Don't interrupt if currently in live mode
      if (window.location.pathname.includes('/live')) {
        console.log('Update ready, but postponed during active Live Mode.');
        return;
      }
      if (options?.onNeedRefresh) {
        options.onNeedRefresh(() => updateSW(true));
      }
    },
    onOfflineReady() {
      options?.onOfflineReady?.();
    },
  });
}
