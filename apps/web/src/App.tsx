import { useEffect, useState } from 'react';
import { Layers, Server, Zap, Cpu, RefreshCw } from 'lucide-react';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: string;
  service: string;
}

export function App() {
  const [apiData, setApiData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: HealthResponse = await res.json();
      setApiData(data);
    } catch (err: any) {
      console.error('Failed to fetch Go API health:', err);
      setError(err.message || 'Unable to connect to Golang Backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiStatus();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="badge-row">
          <span className="badge"><Layers size={14} /> Turborepo Monorepo</span>
          <span className="badge"><Zap size={14} /> pnpm Workspaces</span>
        </div>
        <h1 className="title">Vite + React & Golang Monorepo</h1>
        <p className="subtitle">
          High-performance monorepo architecture powered by Turborepo, pnpm workspaces, Vite React frontend, and Go backend microservice.
        </p>
      </header>

      <div className="grid">
        {/* Frontend Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon icon-vite">
              <Zap size={22} color="#fff" />
            </div>
            <h2 className="card-title">Vite + React App</h2>
          </div>
          <p className="card-desc">
            Lightning-fast web frontend built with TypeScript, React 18, and Vite dev server proxied to Go API.
          </p>
          <div className="status-box">
            <div style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>App Package:</div>
            <div style={{ color: '#38bdf8' }}>apps/web (@mono/web)</div>
          </div>
        </div>

        {/* Backend Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon icon-go">
              <Server size={22} color="#fff" />
            </div>
            <h2 className="card-title">Golang Backend</h2>
          </div>
          <p className="card-desc">
            Robust and lightweight Go HTTP service configured to build and run seamlessly within Turborepo pipeline.
          </p>
          <div className="status-box">
            <div style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>API Health Status:</span>
              <button 
                onClick={fetchApiStatus} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Refresh Status"
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
              </button>
            </div>
            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>Connecting to backend...</div>
            ) : error ? (
              <div>
                <span className="status-indicator status-offline"></span>
                <span style={{ color: '#f87171' }}>Offline ({error})</span>
              </div>
            ) : (
              <div>
                <span className="status-indicator status-online"></span>
                <span style={{ color: '#4ade80' }}>Online ({apiData?.service})</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Uptime: {apiData?.uptime}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <Cpu size={24} color="#a855f7" />
          <h2 className="card-title">Monorepo Orchestration Commands</h2>
        </div>
        <div className="status-box" style={{ lineHeight: '1.8' }}>
          <div><code style={{ color: '#a855f7' }}>pnpm dev</code> &nbsp;- Run frontend and backend concurrently via Turborepo</div>
          <div><code style={{ color: '#a855f7' }}>pnpm build</code> - Build production bundles for frontend and Go binary</div>
          <div><code style={{ color: '#a855f7' }}>pnpm lint</code> &nbsp;- Typecheck TypeScript packages</div>
        </div>
      </div>
    </div>
  );
}

export default App;
