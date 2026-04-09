import { useState } from 'react';
import { INVENTORY_TYPES } from '../../constants';

export default function InventoryForm({ farms, onSubmit }) {
  const [form, setForm] = useState({
    item: '',
    type: INVENTORY_TYPES[0],
    quantity: '',
    unit: 'kg',
    reorderLevel: '',
    farmId: farms[0]?.id || '',
    updatedAt: new Date().toISOString().slice(0, 10)
  });

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    if (!form.item.trim()) return;
    onSubmit({ ...form, quantity: Number(form.quantity), reorderLevel: Number(form.reorderLevel) });
    setForm({ ...form, item: '', quantity: '', reorderLevel: '' });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Item
        <input name="item" value={form.item} onChange={change} placeholder="Layer feed" required />
      </label>
      <label>
        Type
        <select name="type" value={form.type} onChange={change}>
          {INVENTORY_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <label>
        Quantity
        <input name="quantity" type="number" min="0" value={form.quantity} onChange={change} required />
      </label>
      <label>
        Unit
        <input name="unit" value={form.unit} onChange={change} />
      </label>
      <label>
        Reorder level
        <input name="reorderLevel" type="number" min="0" value={form.reorderLevel} onChange={change} />
      </label>
      <label>
        Farm
        <select name="farmId" value={form.farmId} onChange={change}>
          {farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
        </select>
      </label>
      <div className="form-actions wide">
        <button className="primary-button" type="submit">Add inventory</button>
      </div>
    </form>
  );
}
