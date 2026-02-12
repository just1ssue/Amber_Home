export default function Section({ id, title, children, right }) {
  return (
    <section id={id} className="section">
      <div className="sectionHeader">
        <h2 className="sectionTitle">{title}</h2>
        {right ? <div className="sectionRight">{right}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}
