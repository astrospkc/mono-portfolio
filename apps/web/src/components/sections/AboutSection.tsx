import { Code, Terminal } from 'lucide-react';

export function AboutSection() {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>About Me</h2>
      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '1rem' }}>
        I am a dedicated Software Engineer specializing in backend systems architecture, high-concurrency services in Golang, and modern frontend frameworks. Passionate about building robust web applications, optimizing performance, and crafting high-quality developer tooling.
      </p>

      <div className="content-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="info-card">
          <Code size={24} color="#ec4899" style={{ marginBottom: '0.5rem' }} />
          <h3 className="card-title">Core Competencies</h3>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', fontSize: '0.9rem' }}>
            <li>Backend API Design (GoFiber v3, REST, gRPC)</li>
            <li>Monorepo Architecture (Turborepo, pnpm)</li>
            <li>Frontend Engineering (React, Vite, TypeScript)</li>
            <li>Database Management & Caching (PostgreSQL, Redis)</li>
          </ul>
        </div>

        <div className="info-card">
          <Terminal size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
          <h3 className="card-title">Development Philosophy</h3>
          <p className="card-desc">
            I believe in clean, idiomatic code, robust type safety, and minimal latency. Monorepo setups allow seamless code sharing and cohesive build pipelines across microservices and frontend clients.
          </p>
        </div>
      </div>
    </div>
  );
}
