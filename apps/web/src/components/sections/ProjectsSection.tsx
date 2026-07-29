import { ArrowUpRight } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Featured Projects</h2>
      <div className="content-grid">
        {projects.map((item) => (
          <div key={item.id} className="info-card">
            <span className="card-tag">Project #{item.id}</span>
            <h3 className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {item.title}
              <ArrowUpRight size={18} color="var(--text-muted)" />
            </h3>
            <p className="card-desc">{item.description}</p>
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
