import { useEffect, useState } from 'react';

export default function TransactionForm({ farms, categories, type, onSubmit }) {
  const [form, setForm] = useState({
    farmId: farms[0]?.id || '',
    category: categories[0],
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: ''
  });

  useEffect(() => {
    setForm((current) => ({ ...current, farmId: current.farmId || farms[0]?.id || '' }));
  }, [farms]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    if (!form.farmId || !form.amount) return;
    onSubmit({ ...form, amount: Number(form.amount) });
    setForm({ ...form, amount: '', note: '' });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Farm
        <select name="farmId" value={form.farmId} onChange={change}>
          {farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
        </select>
      </label>
      <label>
        Category
        <select name="category" value={form.category} onChange={change}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </label>
      <label>
        Amount
        <input name="amount" type="number" min="0" value={form.amount} onChange={change} required />
      </label>
      <label>
        Date
        <input name="date" type="date" value={form.date} onChange={change} required />
      </label>
      <label className="wide">
        Note
        <input name="note" value={form.note} onChange={change} placeholder={`${type} details`} />
      </label>
      <div className="form-actions wide">
        <button className="primary-button" type="submit">Add {type}</button>
      </div>
    </form>
  );
}
