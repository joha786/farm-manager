import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import FarmCard from '../components/FarmCard';
import FarmForm from '../components/forms/FarmForm';
import { useFarm } from '../context/FarmContext';
import { money, sumByAmount } from '../utils/calculations';

export default function Farms({ onViewFarm }) {
  const { state, dispatch } = useFarm();
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');

  const farms = useMemo(() => {
    const q = query.toLowerCase();
    return state.farms.filter((farm) =>
      [farm.name, farm.type, farm.location].join(' ').toLowerCase().includes(q)
    );
  }, [state.farms, query]);

  function totalsFor(farmId) {
    const income = sumByAmount(state.income.filter((item) => item.farmId === farmId));
    const expense = sumByAmount(state.expenses.filter((item) => item.farmId === farmId));
    return {
      income: money.format(income),
      expense: money.format(expense),
      profit: money.format(income - expense)
    };
  }

  function editFarm(farm) {
    setEditing(farm);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Farm management</span>
          <h1>Farms and production units</h1>
        </div>
        <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search farms" />
      </header>

      <section className="panel">
        <h2>{editing ? 'Edit farm' : 'Add farm'}</h2>
        {editing && <p className="edit-banner">Editing {editing.name}. Update the details and click Update farm.</p>}
        <FarmForm
          editing={editing}
          onSubmit={(farm) => {
            dispatch({ type: editing ? 'update-farm' : 'add-farm', payload: farm });
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      </section>

      <section className="farm-grid">
        {farms.map((farm) => (
          <FarmCard
            key={farm.id}
            farm={farm}
            totals={totalsFor(farm.id)}
            onView={() => onViewFarm(farm.id)}
            onEdit={() => editFarm(farm)}
            onDelete={() => {
              if (confirm(`Delete ${farm.name} and related records?`)) dispatch({ type: 'delete-farm', id: farm.id });
            }}
          />
        ))}
      </section>
      {farms.length === 0 && <EmptyState message="No farms match your search." />}
    </div>
  );
}
