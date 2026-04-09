import FarmImage from './FarmImage';

export default function FarmCard({ farm, totals, onView, onEdit, onDelete }) {
  return (
    <article className="farm-card">
      <div className="farm-image">
        <FarmImage type={farm.type} name={farm.name} />
      </div>
      <div className="farm-card-body">
        <span className="pill">{farm.type}</span>
        <h3>{farm.name}</h3>
        <p>{farm.location || 'No location'} - {farm.size || 'No size set'}</p>
        <p>{farm.notes || 'No notes yet.'}</p>
        <div className="farm-stats">
          <span>Income <strong>{totals.income}</strong></span>
          <span>Expense <strong>{totals.expense}</strong></span>
          <span>Profit <strong>{totals.profit}</strong></span>
        </div>
        <div className="row-actions">
          <button className="primary-button" onClick={onView}>Open profile</button>
          <button className="secondary-button" onClick={onEdit}>Edit</button>
          <button className="danger-button" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </article>
  );
}
