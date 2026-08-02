import { FeedItem } from '../../types';

interface FeedSectionProps {
  feeds: FeedItem[];
}

export function FeedSection({ feeds }: FeedSectionProps) {
  if (!feeds || feeds.length === 0) {
    return (
      <div className="info-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No feed posts found.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {feeds?.map((item, index) => (
        <div
          key={item.id || item._id || index}
          className="info-card"
          style={
            index === 0
              ? { background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(168,85,247,0.05) 100%)' }
              : undefined
          }
        >
          {item?.category && <span className="card-tag">{item?.category}</span>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Punam ✨</div>
            {item?.timestamp && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• {item?.timestamp}</span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: item.image ? '1rem' : 0 }}>
            {item?.content}
          </p>
          {item?.image && (
            <img
              src={item?.image}
              alt="Feed attachment"
              style={{
                width: '100%',
                maxHeight: '320px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginTop: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
