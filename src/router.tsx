import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { TopBar } from './features/shell/TopBar';
import { NavBar } from './features/shell/NavBar';
import { Home } from './features/events/Home';
import { PlanEvent } from './features/events/PlanEvent';
import { Rehearsal } from './features/rehearsal/Rehearsal';
import { Playbook } from './features/playbook/Playbook';
import { EventOrder } from './features/order/EventOrder';
import { LiveMode } from './features/live/LiveMode';
import { AssumptionsEditor } from './features/assumptions/AssumptionsEditor';
import { Review } from './features/review/Review';
import { Backtest } from './features/review/Backtest';
import { Welcome } from './features/onboarding/Welcome';
import { Auth } from './features/onboarding/Auth';
import { Setup } from './features/onboarding/Setup';
import { Status } from './features/shell/Status';
import { Settings } from './features/shell/Settings';
import { Help } from './features/shell/Help';
import { RouteErrorBoundary } from './features/shell/ErrorBoundary';
import { Landing } from './features/landing/Landing';
import { useAppStore } from './store/appStore';

// Main App Layout
function AppLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <NavBar />
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

// Role-Guard Component
function RoleGuard({ allowedRoles }: { allowedRoles: ('planner' | 'supervisor')[] }) {
  const { activeRole } = useAppStore();
  if (!allowedRoles.includes(activeRole)) {
    // If not authorized, redirect to Home with alert/fallback
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: '/landing',
    element: <Landing />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'welcome',
        element: <Welcome />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'setup',
        element: <Setup />,
      },
      {
        path: 'events/:id/order',
        element: <EventOrder />,
      },
      {
        path: 'events/:id/live',
        element: <LiveMode />,
      },
      {
        path: 'status',
        element: <Status />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'help',
        element: <Help />,
      },
      {
        element: <RoleGuard allowedRoles={['planner', 'supervisor']} />,
        children: [
          {
            path: 'events/new',
            element: <PlanEvent />,
          },
          {
            path: 'events/:id/edit',
            element: <PlanEvent />,
          },
          {
            path: 'assumptions',
            element: <AssumptionsEditor />,
          },
          {
            path: 'events/:id/rehearsal',
            element: <Rehearsal />,
          },
          {
            path: 'events/:id/playbook',
            element: <Playbook />,
          },
          {
            path: 'events/:id/review',
            element: <Review />,
          },
          {
            path: 'backtest',
            element: <Backtest />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
