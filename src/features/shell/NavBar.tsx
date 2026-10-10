import React from 'react';
import { NavLink } from 'react-router-dom';
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
        gap: '0.35rem',
        padding: '0.45rem 1.25rem',
        backgroundColor: '#FFFFFF',
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
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: isActive ? 700 : 500,
              textDecoration: 'none',
              color: isActive
                ? item.isLive
                  ? 'var(--status-critical)'
                  : 'var(--accent-purple)'
                : 'var(--text-muted)',
              backgroundColor: isActive
                ? item.isLive
                  ? 'var(--status-critical-bg)'
                  : 'rgba(107, 56, 251, 0.08)'
                : 'transparent',
              border: isActive
                ? `1px solid ${item.isLive ? 'var(--status-critical-border)' : 'rgba(107, 56, 251, 0.25)'}`
                : '1px solid transparent',
              transition: 'all var(--transition-fast)',
            })}
          >
            <Icon
              size={14}
              style={{
                color: item.isLive ? 'var(--status-critical)' : undefined,
              }}
            />
            <span>{item.label}</span>
            {item.isLive && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-critical)',
                  boxShadow: '0 0 6px var(--status-critical)',
                }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
