import {
  BarChart3,
  Bell,
  Boxes,
  ClipboardList,
  Database,
  LayoutDashboard,
  Moon,
  Sprout,
  Sun,
  TrendingDown,
  TrendingUp,
  Wheat
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'farms', label: 'Farms', icon: Sprout },
  { id: 'production', label: 'Production', icon: Wheat },
  { id: 'records', label: 'Records', icon: ClipboardList },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'expenses', label: 'Expenses', icon: TrendingDown },
  { id: 'income', label: 'Income', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'reminders', label: 'Reminders', icon: Bell }
];

export default function Sidebar({ activePage, setActivePage }) {
  const { dispatch, cloudReady, syncStatus, syncError } = useFarm();

  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="brand-logo" src="/farm-logo.svg" alt="Farm Manager logo" />
        <div>
          <strong>Farm Manager</strong><br/>
          <small>Smart farm operations</small>
        </div>
      </div>

      <nav className="nav-list">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activePage === id ? 'active' : ''}`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-actions">
        <button className="ghost-button" onClick={() => dispatch({ type: 'toggle-theme' })}>
          {state.settings.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {state.settings.theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="storage-tools">
          <span className="sidebar-label">Supabase Database</span>
          <p>Farm data is saved only in Supabase for this logged-in user.</p>
          <div className="storage-select">
            <Database size={16} />
            <span>{cloudReady ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
        <small className="cloud-status">
          Last cloud sync: {syncStatus ? new Date(syncStatus).toLocaleString() : 'Waiting for first save'}
        </small>
        {syncError && <small className="sync-error">Sync error: {syncError}</small>}
      </div>
    </aside>
  );
}
