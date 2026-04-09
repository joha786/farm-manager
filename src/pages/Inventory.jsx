import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import InventoryForm from '../components/forms/InventoryForm';
import { useFarm } from '../context/FarmContext';
import { farmName } from '../utils/calculations';

export default function Inventory() {
  const { state, dispatch } = useFarm();
  const [query, setQuery] = useState('');
  const items = useMemo(() => {
    const q = query.toLowerCase();
    return state.inventory.filter((item) =>
      [item.item, item.type, farmName(state.farms, item.farmId)].join(' ').toLowerCase().includes(q)
    );
  }, [state.inventory, state.farms, query]);

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Inventory</span>
          <h1>Feed, seeds, fertilizer, medicine</h1>
        </div>
        <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stock" />
      </header>

      <section className="panel">
        <h2>Add inventory item</h2>
        <InventoryForm farms={state.farms} onSubmit={(payload) => dispatch({ type: 'add-inventory', payload })} />
      </section>

      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Farm</th>
              <th>Quantity</th>
              <th>Reorder</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={Number(item.quantity) <= Number(item.reorderLevel || 0) ? 'warning-row' : ''}>
                <td>{item.item}</td>
                <td>{item.type}</td>
                <td>{farmName(state.farms, item.farmId)}</td>
                <td>{item.quantity} {item.unit}</td>
                <td>{item.reorderLevel || 0} {item.unit}</td>
                <td><button className="danger-button" onClick={() => dispatch({ type: 'delete-inventory', id: item.id })}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <EmptyState message="No inventory records found." />}
      </section>
    </div>
  );
}
