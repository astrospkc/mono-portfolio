import { BlogPost } from '../../types';

interface BlogSectionProps {
  blogs: BlogPost[];
}

export function BlogSection({ blogs }: BlogSectionProps) {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Articles & Writing</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {blogs.map((item) => (
          <div key={item.id} className="info-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              <span>{item.date}</span>
              <span>{item.readTime}</span>
            </div>
            <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h3>
            <p className="card-desc" style={{ marginBottom: '1rem' }}>{item.snippet}</p>
            <div className="tag-list">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="tag-chip">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
