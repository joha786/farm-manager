import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FarmProvider, useFarm } from './context/FarmContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Inventory from './pages/Inventory';
import FarmProfile from './pages/FarmProfile';
import Production from './pages/Production';
import Records from './pages/Records';
import Reminders from './pages/Reminders';
import Reports from './pages/Reports';
import Transactions from './pages/Transactions';

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const { syncStatus, syncError } = useFarm();
  const { profile, signOut } = useAuth();

  function navigate(page) {
    setSelectedFarmId(null);
    setActivePage(page);
  }

  function openFarmProfile(farmId) {
    setSelectedFarmId(farmId);
    setActivePage('farm-profile');
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [activePage, selectedFarmId]);

  const pages = {
    dashboard: <Dashboard />,
    farms: <Farms onViewFarm={openFarmProfile} />,
    'farm-profile': <FarmProfile farmId={selectedFarmId} onBack={() => navigate('farms')} />,
    production: <Production />,
    records: <Records />,
    inventory: <Inventory />,
    expenses: <Transactions mode="expenses" />,
    income: <Transactions mode="income" />,
    reports: <Reports />,
    reminders: <Reminders />
  };

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={navigate} />
      <main className="main-shell">
        <div className="topbar">
          <div>
            <strong>Auto-save active</strong>
            <span>{profile?.name || profile?.username || 'User'} - cloud sync: {syncStatus ? new Date(syncStatus).toLocaleString() : 'waiting'}</span>
          </div>
          <button className="secondary-button" onClick={signOut}>Logout</button>
        </div>
        {syncError && (
          <section className="notice danger-notice">
            <strong>Supabase sync failed:</strong> {syncError}
          </section>
        )}
        {pages[activePage]}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading Farm Manager...</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <FarmProvider userId={user.id}>
      <AppShell />
    </FarmProvider>
  );
}
