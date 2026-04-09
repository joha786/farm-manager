import { useState } from 'react';
import EmptyState from '../components/EmptyState';
import { useFarm } from '../context/FarmContext';

export default function Reminders() {
  const { state, dispatch } = useFarm();
  const [form, setForm] = useState({ title: '', dueDate: new Date().toISOString().slice(0, 10), done: false });
  const today = new Date().toISOString().slice(0, 10);

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    dispatch({ type: 'add-reminder', payload: form });
    setForm({ ...form, title: '' });
  }

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Reminders</span>
          <h1>Local alerts and farm tasks</h1>
        </div>
      </header>

      <section className="panel">
        <h2>Add reminder</h2>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Task
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Vaccination, irrigation, harvest" />
          </label>
          <label>
            Due date
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </label>
          <div className="form-actions wide">
            <button className="primary-button" type="submit">Add reminder</button>
          </div>
        </form>
      </section>

      <section className="reminder-list">
        {state.reminders.map((item) => (
          <article key={item.id} className={`reminder-card ${item.dueDate <= today && !item.done ? 'due' : ''}`}>
            <label>
              <input type="checkbox" checked={item.done} onChange={() => dispatch({ type: 'toggle-reminder', id: item.id })} />
              <span className={item.done ? 'done' : ''}>{item.title}</span>
            </label>
            <small>{item.dueDate <= today && !item.done ? 'Due now' : `Due ${item.dueDate}`}</small>
            <button className="danger-button" onClick={() => dispatch({ type: 'delete-reminder', id: item.id })}>Delete</button>
          </article>
        ))}
        {state.reminders.length === 0 && <EmptyState message="No reminders yet." />}
      </section>
    </div>
  );
}
