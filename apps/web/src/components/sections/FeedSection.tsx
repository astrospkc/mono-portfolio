export function FeedSection() {
  return (
    <div>
      <div className="info-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(168,85,247,0.05) 100%)' }}>
        <span className="card-tag">Pinned Cheep</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Punam ✨</div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• 20 Jan 2026</span>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
          Hello World! Welcome to my monorepo portfolio.
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Building scalable backend engines with GoFiber v3 and sleek user interfaces using React & TypeScript. Explore my projects, read technical articles, or send me a direct message to my inbox below!
        </p>
      </div>

      <div className="content-grid">
        <div className="info-card">
          <span className="card-tag">Tech Stack</span>
          <h3 className="card-title">GoFiber v3 & Turborepo</h3>
          <p className="card-desc">
            Ultra-fast HTTP routing with GoFiber v3 coupled with pnpm workspace package orchestration.
          </p>
          <div className="tag-list">
            <span className="tag-chip">Golang v1.25</span>
            <span className="tag-chip">Fiber v3</span>
            <span className="tag-chip">Turborepo</span>
          </div>
        </div>

        <div className="info-card">
          <span className="card-tag">Frontend System</span>
          <h3 className="card-title">Vite + React 18</h3>
          <p className="card-desc">
            Blazing-fast client application with glassmorphic dark design and instant hot reloading.
          </p>
          <div className="tag-list">
            <span className="tag-chip">React</span>
            <span className="tag-chip">TypeScript</span>
            <span className="tag-chip">Vite</span>
          </div>
        </div>
      </div>
    </div>
  );
}
