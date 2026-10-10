// PWA installation prompt listener and trigger

let deferredPrompt: any = null;
const listeners: Array<(canInstall: boolean) => void> = [];

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notifyListeners(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners(false);
  });
}

function notifyListeners(canInstall: boolean) {
  for (const listener of listeners) {
    listener(canInstall);
  }
}

export function subscribeToInstallPrompt(listener: (canInstall: boolean) => void) {
  listeners.push(listener);
  listener(deferredPrompt !== null);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

export async function promptPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notifyListeners(false);
    return outcome === 'accepted';
  } catch {
    return false;
  }
}
