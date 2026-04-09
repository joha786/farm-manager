import BusinessCharts from '../components/BusinessCharts';
import EmptyState from '../components/EmptyState';
import FarmImage from '../components/FarmImage';
import SummaryCard from '../components/SummaryCard';
import { useFarm } from '../context/FarmContext';
import { farmName, money, sumByAmount } from '../utils/calculations';

export default function FarmProfile({ farmId, onBack }) {
  const { state } = useFarm();
  const farm = state.farms.find((item) => item.id === farmId);

  if (!farm) {
    return (
      <div className="page-stack">
        <button className="secondary-button fit-button" onClick={onBack}>Back to farms</button>
        <EmptyState message="This farm could not be found." />
      </div>
    );
  }

  const income = state.income.filter((item) => item.farmId === farm.id);
  const expenses = state.expenses.filter((item) => item.farmId === farm.id);
  const inventory = state.inventory.filter((item) => item.farmId === farm.id);
  const production = state.production.filter((item) => item.farmId === farm.id);
  const animals = state.animals.filter((item) => item.farmId === farm.id);
  const crops = state.crops.filter((item) => item.farmId === farm.id);
  const reminders = state.reminders.filter((item) => !item.done);
  const totalIncome = sumByAmount(income);
  const totalExpenses = sumByAmount(expenses);
  const productionValue = sumByAmount(production.map((item) => ({ amount: item.value })));

  return (
    <div className="page-stack">
      <button className="secondary-button fit-button" onClick={onBack}>Back to farms</button>

      <section className="profile-hero">
        <FarmImage type={farm.type} name={farm.name} />
        <div>
          <span className="eyebrow">{farm.type}</span>
          <h1>{farm.name}</h1>
          <p>{farm.location || 'No location'} - {farm.size || 'No size set'}</p>
          <p>{farm.notes || 'No notes yet.'}</p>
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard title="Income" value={money.format(totalIncome)} detail={`${income.length} entries`} tone="blue" />
        <SummaryCard title="Expenses" value={money.format(totalExpenses)} detail={`${expenses.length} entries`} tone="red" />
        <SummaryCard title="Profit" value={money.format(totalIncome - totalExpenses)} detail="Auto calculated" />
        <SummaryCard title="Production Value" value={money.format(productionValue)} detail={`${production.length} production logs`} tone="blue" />
      </section>

      <BusinessCharts farms={[farm]} income={income} expenses={expenses} />

      <section className="profile-grid">
        <ProfilePanel title="Production">
          {production.slice(-5).map((item) => (
            <ProfileRow key={item.id} label={`${item.quantity} ${item.unit} ${item.product}`} value={item.date} />
          ))}
          {production.length === 0 && <EmptyState message="No production logs yet." />}
        </ProfilePanel>
        <ProfilePanel title="Inventory">
          {inventory.map((item) => (
            <ProfileRow key={item.id} label={item.item} value={`${item.quantity} ${item.unit}`} />
          ))}
          {inventory.length === 0 && <EmptyState message="No inventory for this farm." />}
        </ProfilePanel>
        <ProfilePanel title="Animals">
          {animals.map((item) => (
            <ProfileRow key={item.id} label={`${item.name} (${item.type})`} value={`${item.count} head/batch`} />
          ))}
          {animals.length === 0 && <EmptyState message="No animal records for this farm." />}
        </ProfilePanel>
        <ProfilePanel title="Crop Cycles">
          {crops.map((item) => (
            <ProfileRow key={item.id} label={`${item.crop} ${item.variety || ''}`} value={item.stage} />
          ))}
          {crops.length === 0 && <EmptyState message="No crop cycles for this farm." />}
        </ProfilePanel>
        <ProfilePanel title="Recent Income">
          {income.slice(-5).map((item) => (
            <ProfileRow key={item.id} label={item.category} value={money.format(item.amount)} />
          ))}
          {income.length === 0 && <EmptyState message="No income for this farm." />}
        </ProfilePanel>
        <ProfilePanel title="Open Reminders">
          {reminders.slice(0, 5).map((item) => (
            <ProfileRow key={item.id} label={item.title} value={item.dueDate} />
          ))}
          {reminders.length === 0 && <EmptyState message="No open reminders." />}
        </ProfilePanel>
      </section>
    </div>
  );
}

function ProfilePanel({ title, children }) {
  return (
    <section className="profile-panel">
      <h3>{title}</h3>
      <div className="profile-list">{children}</div>
    </section>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="profile-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
