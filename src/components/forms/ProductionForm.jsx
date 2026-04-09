import { useEffect, useState } from 'react';
import { PRODUCTION_PRODUCTS } from '../../constants';

export default function ProductionForm({ farms, onSubmit }) {
  const [form, setForm] = useState({
    farmId: farms[0]?.id || '',
    product: PRODUCTION_PRODUCTS[0],
    quantity: '',
    unit: 'liter',
    date: new Date().toISOString().slice(0, 10),
    quality: '',
    value: '',
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
    if (!form.farmId || !form.quantity) return;
    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      value: Number(form.value || 0)
    });
    setForm({ ...form, quantity: '', quality: '', value: '', note: '' });
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
        Product
        <select name="product" value={form.product} onChange={change}>
          {PRODUCTION_PRODUCTS.map((product) => <option key={product}>{product}</option>)}
        </select>
      </label>
      <label>
        Quantity
        <input name="quantity" type="number" min="0" value={form.quantity} onChange={change} required />
      </label>
      <label>
        Unit
        <input name="unit" value={form.unit} onChange={change} placeholder="liter, kg, tray, maund" />
      </label>
      <label>
        Date
        <input name="date" type="date" value={form.date} onChange={change} />
      </label>
      <label>
        Quality
        <input name="quality" value={form.quality} onChange={change} placeholder="A grade, good, average" />
      </label>
      <label>
        Sale value
        <input name="value" type="number" min="0" value={form.value} onChange={change} placeholder="Optional income" />
      </label>
      <label>
        Note
        <input name="note" value={form.note} onChange={change} placeholder="Batch, buyer, weather, yield note" />
      </label>
      <div className="form-actions wide">
        <button className="primary-button" type="submit">Add production</button>
        <span className="helper-text">Sale value above 0 is also saved as income.</span>
      </div>
    </form>
  );
}
