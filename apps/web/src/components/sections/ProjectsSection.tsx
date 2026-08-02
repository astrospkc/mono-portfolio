import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Featured Projects</h2>
      <div className="content-grid">
        {projects && projects.length > 0 ? projects?.map((item, index) => {
          const repoUrl = item?.github_link || (item?.link?.includes('github.com') ? item?.link : undefined);
          const demoUrl = item?.demo_link || (!item?.link?.includes('github.com') ? item?.link : undefined);

          return (
            <div key={item.id || item._id || index} className="info-card">
              {item?.image && (
                <img
                  src={item?.image}
                  alt={item?.title}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }}
                />
              )}
              <span className="card-tag">Project #{item.id || index + 1}</span>
              <h3 className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item?.title}
                <ArrowUpRight size={18} color="var(--text-muted)" />
              </h3>
              <p className="card-desc">{item?.description}</p>

              <div className="tag-list" style={{ marginBottom: '0.75rem' }}>
                {item?.tags?.map((tag, idx) => (
                  <span key={idx} className="tag-chip">{tag}</span>
                ))}
              </div>

              {(repoUrl || demoUrl) && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  {repoUrl && (
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                      <Github size={15} /> Code Repo
                    </a>
                  )}
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#4ade80', fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                      <ExternalLink size={15} /> Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        }) : <>
          No Projects Available
        </>}
      </div>
    </div>
  );
}
