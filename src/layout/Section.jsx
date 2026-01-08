export default function Section({ children, className = "" }) {
    return (
      <section className={`px-6 py-24 max-w-6xl mx-auto ${className}`}>
        {children}
      </section>
    );
  }