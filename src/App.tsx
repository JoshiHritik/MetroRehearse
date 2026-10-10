import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAppStore } from './store/appStore';
import { seedDemoData } from './db/seed';
import { setupPwaServiceWorker } from './pwa/register';
import './styles/tokens.css';
import './styles/base.css';
import './styles/print.css';

export function App() {
  const { initSettings, setIsOnline } = useAppStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      // 1. Seed initial demo data if database is empty
      await seedDemoData(false);

      // 2. Initialize language, theme, and profile from DB
      await initSettings();

      // 3. Register service worker for offline precaching
      setupPwaServiceWorker({
        onOfflineReady: () => console.log('MetroRehearse precached for airplane mode!'),
      });

      // 4. Online/Offline network event listeners
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      setIsReady(true);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    bootstrap();
  }, [initSettings, setIsOnline]);

  if (!isReady) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#0B1220',
          color: '#38BDF8',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 700,
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38BDF8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span>Initializing MetroRehearse Telemetry...</span>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
