import { useEffect, useState } from 'react';
import { FARM_TYPES } from '../../constants';

const blank = {
  name: '',
  type: FARM_TYPES[0],
  size: '',
  location: '',
  notes: '',
  createdAt: new Date().toISOString().slice(0, 10)
};

export default function FarmForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(blank);

  useEffect(() => {
    setForm(editing || blank);
  }, [editing]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    setForm(blank);
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Farm name
        <input name="name" value={form.name} onChange={change} placeholder="South Poultry House" required />
      </label>
      <label>
        Type
        <select name="type" value={form.type} onChange={change}>
          {FARM_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <label>
        Size or count
        <input name="size" value={form.size} onChange={change} placeholder="150 birds or 3 acres" />
      </label>
      <label>
        Location
        <input name="location" value={form.location} onChange={change} placeholder="West field" />
      </label>
      <label className="wide">
        Notes
        <textarea name="notes" value={form.notes} onChange={change} placeholder="Production goals, breed, crop season" />
      </label>
      <div className="form-actions wide">
        <button className="primary-button" type="submit">{editing ? 'Update farm' : 'Add farm'}</button>
        {editing && <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
