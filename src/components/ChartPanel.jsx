export default function ChartPanel({ title, children }) {
  return (
    <section className="chart-panel">
      <h3>{title}</h3>
      <div className="chart-wrap">{children}</div>
    </section>
  );
}
