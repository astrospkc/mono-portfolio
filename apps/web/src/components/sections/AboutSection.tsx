import { Code, Terminal } from 'lucide-react';

export function AboutSection() {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>About Me</h2>
      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '1rem' }}>
        I spend most of my time building, learning, and occasionally breaking things just to understand how they work.
      </p>

      <div className="content-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="info-card">
          <Code size={24} color="#ec4899" style={{ marginBottom: '0.5rem' }} />
          <h3 className="card-title">Core Competencies</h3>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8', fontSize: '0.9rem' }}>
            <li>Languages (Python,Golang, TypeScript, C++)</li>
            <li>Backend API Design (GoFiber v3, REST)</li>
            <li>Monorepo Architecture (Turborepo)</li>
            <li>Frontend Engineering (React, Vite, TypeScript)</li>
            <li>Database Management & Caching (Mongodb,PostgreSQL, Redis)</li>
          </ul>
        </div>

        <div className="info-card">
          <Terminal size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
          <h3 className="card-title">Development Philosophy</h3>
          <p className="card-desc">
            I am a backend-focused full-stack engineer who loves building robust, scalable applications. My sweet spot is designing clean APIs, architecting resilient microservices, and making sure the backend feels snappy and reliable. I enjoy diving into complex problems, optimizing performance, and wrangling databases — but I’m just as happy jumping to the frontend to build intuitive UIs that put the backend power to good use.
          </p>
        </div>
      </div>
    </div>
  );
}
