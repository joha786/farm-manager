import BusinessCharts from '../components/BusinessCharts';
import FarmImage from '../components/FarmImage';
import SummaryCard from '../components/SummaryCard';
import { useFarm } from '../context/FarmContext';
import { money, sumByAmount } from '../utils/calculations';

export default function Dashboard() {
  const { state } = useFarm();
  const income = sumByAmount(state.income);
  const expenses = sumByAmount(state.expenses);
  const profit = income - expenses;
  const lowStock = state.inventory.filter((item) => Number(item.quantity) <= Number(item.reorderLevel || 0));
  const productionValue = sumByAmount(state.production.map((item) => ({ amount: item.value })));
  const animalCount = state.animals.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const activeCrops = state.crops.filter((item) => item.stage !== 'Harvested').length;

  return (
    <div className="page-stack">
      <section className="dashboard-hero">
        <FarmImage type="Rice Field" name="dashboard" />
        <div>
          <span className="eyebrow">Local farm records</span>
          <h1>Today's farm position</h1>
          <p>Track production, stock, income, expenses, reports, and backups from this browser.</p>
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard title="Total Farms" value={state.farms.length} detail="Active operations" />
        <SummaryCard title="Income" value={money.format(income)} detail={`${state.income.length} entries`} tone="blue" />
        <SummaryCard title="Expenses" value={money.format(expenses)} detail={`${state.expenses.length} entries`} tone="red" />
        <SummaryCard title="Profit" value={money.format(profit)} detail="Income minus expenses" tone={profit >= 0 ? 'green' : 'red'} />
      </section>

      {lowStock.length > 0 && (
        <section className="notice">
          <strong>Stock alert:</strong> {lowStock.map((item) => item.item).join(', ')} should be reordered soon.
        </section>
      )}

      <section className="operations-strip">
        <article>
          <span>Production value</span>
          <strong>{money.format(productionValue)}</strong>
          <small>{state.production.length} output logs</small>
        </article>
        <article>
          <span>Animal count</span>
          <strong>{animalCount}</strong>
          <small>{state.animals.length} animal records</small>
        </article>
        <article>
          <span>Active crops</span>
          <strong>{activeCrops}</strong>
          <small>{state.crops.length} crop cycles</small>
        </article>
      </section>

      <BusinessCharts farms={state.farms} income={state.income} expenses={state.expenses} />
    </div>
  );
}
