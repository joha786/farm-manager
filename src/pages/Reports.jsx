import { useMemo, useState } from 'react';
import BusinessCharts from '../components/BusinessCharts';
import SummaryCard from '../components/SummaryCard';
import { useFarm } from '../context/FarmContext';
import { filterTransactions, money, sumByAmount } from '../utils/calculations';

export default function Reports() {
  const { state } = useFarm();
  const [filters, setFilters] = useState({ start: '', end: '', farmId: 'all' });
  const income = useMemo(() => filterTransactions(state.income, filters), [state.income, filters]);
  const expenses = useMemo(() => filterTransactions(state.expenses, filters), [state.expenses, filters]);
  const totalIncome = sumByAmount(income);
  const totalExpenses = sumByAmount(expenses);

  function change(event) {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  }

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Reports</span>
          <h1>Filtered farm performance</h1>
        </div>
      </header>

      <section className="panel">
        <div className="form-grid">
          <label>
            From
            <input name="start" type="date" value={filters.start} onChange={change} />
          </label>
          <label>
            To
            <input name="end" type="date" value={filters.end} onChange={change} />
          </label>
          <label>
            Farm
            <select name="farmId" value={filters.farmId} onChange={change}>
              <option value="all">All farms</option>
              {state.farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard title="Filtered Income" value={money.format(totalIncome)} detail={`${income.length} records`} />
        <SummaryCard title="Filtered Expenses" value={money.format(totalExpenses)} detail={`${expenses.length} records`} tone="red" />
        <SummaryCard title="Filtered Profit" value={money.format(totalIncome - totalExpenses)} detail="Income minus expenses" tone={totalIncome - totalExpenses >= 0 ? 'green' : 'red'} />
      </section>

      <BusinessCharts farms={state.farms} income={income} expenses={expenses} />
    </div>
  );
}
