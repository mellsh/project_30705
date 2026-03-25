import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teamApi } from '../api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamApi.getAll()
      .then(d => setTeams(d.teams || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page">
      <div className="loading-spinner"><div className="spinner" /></div>
    </div>
  );

  return (
    <div className="page-wide">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          팀 목록
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          {teams.length}개의 팀
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <div className="icon">👥</div>
          <p>아직 팀이 없습니다</p>
        </div>
      ) : (
        <div className="grid-2">
          {teams.map(t => (
            <TeamCard key={t.team_id} team={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({ team: t }) {
  return (
    <Link to={`/teams/${t.team_id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.borderColor = '';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: 14,
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}>
            ⚡
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{t.teamname}</h3>
            {t.leader_role && (
              <span className="badge" style={{ marginTop: 4, fontSize: 11 }}>
                리더: {t.leader_role}
              </span>
            )}
          </div>
        </div>

        {t.team_descript && (
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {t.team_descript}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingTop: 8,
          borderTop: '1px solid var(--border)',
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          팀 ID #{t.team_id} · 클릭하여 팀원 보기 →
        </div>
      </div>
    </Link>
  );
}