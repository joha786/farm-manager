export default function SummaryCard({ title, value, detail, tone = 'green' }) {
  return (
    <article className={`summary-card ${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
