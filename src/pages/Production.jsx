import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import ProductionForm from '../components/forms/ProductionForm';
import SummaryCard from '../components/SummaryCard';
import { useFarm } from '../context/FarmContext';
import { farmName, money, sumByAmount } from '../utils/calculations';

export default function Production() {
  const { state, dispatch } = useFarm();
  const [query, setQuery] = useState('');

  const records = useMemo(() => {
    const q = query.toLowerCase();
    return state.production.filter((item) =>
      [item.product, item.quality, item.note, farmName(state.farms, item.farmId)].join(' ').toLowerCase().includes(q)
    );
  }, [state.production, state.farms, query]);

  const totalValue = sumByAmount(records.map((item) => ({ amount: item.value })));
  const totalQuantity = records.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Production</span>
          <h1>Daily output and yield records</h1>
        </div>
        <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search production" />
      </header>

      <section className="summary-grid compact">
        <SummaryCard title="Production Entries" value={records.length} detail="Filtered records" />
        <SummaryCard title="Sale Value" value={money.format(totalValue)} detail={`${totalQuantity} total units`} tone="blue" />
      </section>

      <section className="panel">
        <h2>Add production</h2>
        <ProductionForm farms={state.farms} onSubmit={(payload) => dispatch({ type: 'add-production', payload })} />
      </section>

      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Farm</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Quality</th>
              <th>Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{farmName(state.farms, item.farmId)}</td>
                <td>{item.product}</td>
                <td>{item.quantity} {item.unit}</td>
                <td>{item.quality || 'Not set'}</td>
                <td>{money.format(item.value || 0)}</td>
                <td><button className="danger-button" onClick={() => dispatch({ type: 'delete-production', id: item.id })}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <EmptyState message="No production records found." />}
      </section>
    </div>
  );
}
