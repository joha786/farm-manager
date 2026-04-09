import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import TransactionForm from '../components/forms/TransactionForm';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { useFarm } from '../context/FarmContext';
import { farmName, money, sumByAmount } from '../utils/calculations';

export default function Transactions({ mode }) {
  const { state, dispatch } = useFarm();
  const isExpense = mode === 'expenses';
  const records = isExpense ? state.expenses : state.income;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return records.filter((item) =>
      [item.category, item.note, farmName(state.farms, item.farmId)].join(' ').toLowerCase().includes(q)
    );
  }, [records, state.farms, query]);

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">{isExpense ? 'Expense tracking' : 'Income tracking'}</span>
          <h1>{isExpense ? 'Costs and operating spend' : 'Sales and production income'}</h1>
        </div>
        <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search entries" />
      </header>

      <section className="summary-grid compact">
        <SummaryMini label={`Total ${isExpense ? 'expenses' : 'income'}`} value={money.format(sumByAmount(records))} />
        <SummaryMini label="Filtered total" value={money.format(sumByAmount(filtered))} />
      </section>

      <section className="panel">
        <h2>Add {isExpense ? 'expense' : 'income'}</h2>
        <TransactionForm
          farms={state.farms}
          categories={isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES}
          type={isExpense ? 'expense' : 'income'}
          onSubmit={(payload) => dispatch({ type: isExpense ? 'add-expense' : 'add-income', payload })}
        />
      </section>

      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Farm</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{farmName(state.farms, item.farmId)}</td>
                <td>{item.category}</td>
                <td>{money.format(item.amount)}</td>
                <td>{item.note}</td>
                <td>
                  <button
                    className="danger-button"
                    onClick={() => dispatch({ type: isExpense ? 'delete-expense' : 'delete-income', id: item.id })}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState message="No entries found." />}
      </section>
    </div>
  );
}

function SummaryMini({ label, value }) {
  return (
    <article className="mini-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
