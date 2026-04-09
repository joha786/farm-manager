import { useEffect, useState } from 'react';
import { ANIMAL_TYPES } from '../../constants';

export default function AnimalForm({ farms, onSubmit }) {
  const [form, setForm] = useState({
    farmId: farms[0]?.id || '',
    type: ANIMAL_TYPES[0],
    name: '',
    count: 1,
    breed: '',
    health: 'Healthy',
    lastVaccination: '',
    nextCheckup: '',
    notes: ''
  });

  useEffect(() => {
    setForm((current) => ({ ...current, farmId: current.farmId || farms[0]?.id || '' }));
  }, [farms]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ ...form, count: Number(form.count || 1) });
    setForm({ ...form, name: '', breed: '', notes: '' });
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
        Animal type
        <select name="type" value={form.type} onChange={change}>
          {ANIMAL_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <label>
        Name or batch
        <input name="name" value={form.name} onChange={change} placeholder="Dairy herd, Layer batch A" required />
      </label>
      <label>
        Count
        <input name="count" type="number" min="1" value={form.count} onChange={change} />
      </label>
      <label>
        Breed
        <input name="breed" value={form.breed} onChange={change} />
      </label>
      <label>
        Health
        <input name="health" value={form.health} onChange={change} />
      </label>
      <label>
        Last vaccination
        <input name="lastVaccination" type="date" value={form.lastVaccination} onChange={change} />
      </label>
      <label>
        Next checkup
        <input name="nextCheckup" type="date" value={form.nextCheckup} onChange={change} />
      </label>
      <label className="wide">
        Notes
        <input name="notes" value={form.notes} onChange={change} />
      </label>
      <div className="form-actions wide">
        <button className="primary-button" type="submit">Add animal record</button>
      </div>
    </form>
  );
}
