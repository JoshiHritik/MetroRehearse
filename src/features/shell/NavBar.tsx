import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { getTranslation } from '../../i18n';
import {
  CalendarDays,
  PlayCircle,
  Sliders,
  FileText,
  Activity,
  Layers,
  CheckSquare,
  History,
  MapPin,
  HardDrive,
  Settings,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const NavBar: React.FC = () => {
  const { currentLang, activeEventId } = useAppStore();
  const eventId = activeEventId || 'evt-gt-vs-mi-2026';

  const navItems = [
    {
      to: '/',
      label: getTranslation(currentLang, 'nav.home', 'Events'),
      icon: CalendarDays,
      exact: true,
    },
    {
      to: `/events/${eventId}/rehearsal`,
      label: getTranslation(currentLang, 'nav.rehearsal', 'Rehearsal'),
      icon: PlayCircle,
    },
    {
      to: `/events/${eventId}/playbook`,
      label: getTranslation(currentLang, 'nav.playbook', 'Playbook'),
      icon: Sliders,
    },
    {
      to: `/events/${eventId}/order`,
      label: getTranslation(currentLang, 'nav.order', 'Event Order'),
      icon: FileText,
    },
    {
      to: `/events/${eventId}/live`,
      label: getTranslation(currentLang, 'nav.live', 'Live Ops'),
      icon: Activity,
      isLive: true,
    },
    {
      to: '/assumptions',
      label: getTranslation(currentLang, 'nav.assumptions', 'Assumptions (A)'),
      icon: Layers,
    },
    {
      to: `/events/${eventId}/review`,
      label: getTranslation(currentLang, 'nav.review', 'Review'),
      icon: CheckSquare,
    },
    {
      to: '/backtest',
      label: getTranslation(currentLang, 'nav.backtest', 'Backtest Replay'),
      icon: History,
    },
    {
      to: '/welcome',
      label: 'Network Map',
      icon: MapPin,
    },
    {
      to: '/status',
      label: 'Cache & Status',
      icon: HardDrive,
    },
    {
      to: '/help',
      label: 'Operator Guide',
      icon: HelpCircle,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav
      className="nav-bar no-print"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.4rem 1.25rem',
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-subtle)',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              fontWeight: isActive ? 700 : 500,
              textDecoration: 'none',
              color: isActive
                ? item.isLive
                  ? '#EF4444'
                  : 'var(--accent-cyan)'
                : 'var(--text-muted)',
              backgroundColor: isActive
                ? item.isLive
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'var(--bg-surface-elevated)'
                : 'transparent',
              border: isActive
                ? `1px solid ${item.isLive ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-medium)'}`
                : '1px solid transparent',
              transition: 'all var(--transition-fast)',
            })}
          >
            <Icon
              size={15}
              style={{
                color: item.isLive ? '#EF4444' : undefined,
              }}
            />
            <span>{item.label}</span>
            {item.isLive && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 6px #EF4444',
                }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

