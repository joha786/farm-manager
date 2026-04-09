import { useEffect, useState } from 'react';
import { CROP_STAGES } from '../../constants';

export default function CropForm({ farms, onSubmit }) {
  const [form, setForm] = useState({
    farmId: farms[0]?.id || '',
    crop: '',
    variety: '',
    area: '',
    stage: CROP_STAGES[0],
    plantedAt: '',
    expectedHarvest: '',
    expectedYield: '',
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
    if (!form.crop.trim()) return;
    onSubmit(form);
    setForm({ ...form, crop: '', variety: '', area: '', expectedYield: '', notes: '' });
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
        Crop
        <input name="crop" value={form.crop} onChange={change} placeholder="Rice, potato, tomato" required />
      </label>
      <label>
        Variety
        <input name="variety" value={form.variety} onChange={change} />
      </label>
      <label>
        Area
        <input name="area" value={form.area} onChange={change} placeholder="2 acres" />
      </label>
      <label>
        Stage
        <select name="stage" value={form.stage} onChange={change}>
          {CROP_STAGES.map((stage) => <option key={stage}>{stage}</option>)}
        </select>
      </label>
      <label>
        Planted
        <input name="plantedAt" type="date" value={form.plantedAt} onChange={change} />
      </label>
      <label>
        Expected harvest
        <input name="expectedHarvest" type="date" value={form.expectedHarvest} onChange={change} />
      </label>
      <label>
        Expected yield
        <input name="expectedYield" value={form.expectedYield} onChange={change} placeholder="90 maund" />
      </label>
      <label className="wide">
        Notes
        <input name="notes" value={form.notes} onChange={change} />
      </label>
      <div className="form-actions wide">
        <button className="primary-button" type="submit">Add crop cycle</button>
      </div>
    </form>
  );
}
