import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recruitApi } from '../api';
import { useAuth } from '../hooks';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function RecruitList() {
  const [recruits, setRecruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    recruitApi.getAll()
      .then(d => setRecruits(d.recruits || []))
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            팀원 모집
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {recruits.length}개의 모집 공고
          </p>
        </div>
        {isLoggedIn && (
          <Link to="/recruits/create" className="btn btn-primary">
            + 모집 만들기
          </Link>
        )}
      </div>

      {recruits.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>아직 모집 공고가 없습니다</p>
          {isLoggedIn && (
            <button className="btn btn-primary" style={{ marginTop: 16 }}
              onClick={() => navigate('/recruits/create')}>
              첫 모집 만들기
            </button>
          )}
        </div>
      ) : (
        <div className="grid-2">
          {recruits.map(r => (
            <RecruitCard key={r.cruit_id} recruit={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecruitCard({ recruit: r }) {
  const isOpen = !r.is_closed;
  const deadlinePassed = r.deadline && new Date(r.deadline) < new Date();

  return (
    <Link to={`/recruits/${r.cruit_id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 22,
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{r.title}</h3>
          <span className={`badge ${isOpen && !deadlinePassed ? 'badge-success' : ''}`}
            style={deadlinePassed ? { background: 'var(--danger-dim)', color: 'var(--danger)' } : {}}>
            {deadlinePassed ? '마감' : isOpen ? '모집 중' : '완료'}
          </span>
        </div>

        {r.cruit_descript && (
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {r.cruit_descript}
          </p>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          {r.required_count && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              👥 {r.required_count}명 모집
            </span>
          )}
          {r.deadline && (
            <span style={{ fontSize: 12, color: deadlinePassed ? 'var(--danger)' : 'var(--text-muted)' }}>
              📅 {new Date(r.deadline).toLocaleDateString('ko-KR')}
            </span>
          )}
          {r.created_at && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {timeAgo(r.created_at)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}