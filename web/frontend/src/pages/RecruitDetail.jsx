import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recruitApi } from '../api';
import { useAuth, useToast } from '../hooks';
import ToastContainer from '../components/Toast';

export default function RecruitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, show } = useToast();

  const [recruit, setRecruit] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    Promise.all([
      recruitApi.getOne(id),
      recruitApi.getRoles(id),
    ]).then(([rData, rolesData]) => {
      setRecruit(rData.recruit);
      setRoles(rolesData.roles || []);
    }).catch(err => {
      show(err.message, 'error');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('모집 공고를 삭제하시겠습니까?')) return;
    try {
      await recruitApi.delete(id);
      show('삭제되었습니다');
      navigate('/recruits');
    } catch (err) {
      show(err.message, 'error');
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    try {
      await recruitApi.addRole({ cruit_id: Number(id), cruit_rolename: newRole.trim() });
      const updated = await recruitApi.getRoles(id);
      setRoles(updated.roles || []);
      setNewRole('');
      show('역할이 추가되었습니다');
    } catch (err) {
      show(err.message, 'error');
    }
  };

  if (loading) return (
    <div className="page">
      <div className="loading-spinner"><div className="spinner" /></div>
    </div>
  );

  if (!recruit) return (
    <div className="page">
      <div className="empty-state">
        <div className="icon">❌</div>
        <p>모집 공고를 찾을 수 없습니다</p>
      </div>
    </div>
  );

  const isLeader = user && user.user_id === recruit.cruit_leader_id;
  const deadlinePassed = recruit.deadline && new Date(recruit.deadline) < new Date();

  return (
    <div className="page">
      <ToastContainer toasts={toasts} />

      {/* Back */}
      <button onClick={() => navigate('/recruits')} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
        ← 목록으로
      </button>

      {/* Header */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>
                {recruit.title}
              </h1>
              <span className={`badge ${!recruit.is_closed && !deadlinePassed ? 'badge-success' : ''}`}
                style={deadlinePassed ? { background: 'var(--danger-dim)', color: 'var(--danger)' } : {}}>
                {deadlinePassed ? '마감' : !recruit.is_closed ? '모집 중' : '완료'}
              </span>
            </div>

            {recruit.cruit_descript && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>
                {recruit.cruit_descript}
              </p>
            )}
          </div>

          {isLeader && (
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              🗑 삭제
            </button>
          )}
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {recruit.required_count && (
            <InfoItem label="모집 인원" value={`${recruit.required_count}명`} icon="👥" />
          )}
          {recruit.deadline && (
            <InfoItem label="마감일" value={new Date(recruit.deadline).toLocaleDateString('ko-KR')} icon="📅" />
          )}
          {recruit.created_at && (
            <InfoItem label="등록일" value={new Date(recruit.created_at).toLocaleDateString('ko-KR')} icon="🗓" />
          )}
        </div>
      </div>

      {/* Roles */}
      <div className="card">
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>모집 역할</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {roles.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>등록된 역할이 없습니다</p>
          ) : (
            roles.map(r => (
              <span key={r.cruit_role_id} className="tag" style={{ fontSize: 13 }}>
                🎯 {r.cruit_rolename}
              </span>
            ))
          )}
        </div>

        {isLeader && (
          <>
            <div className="divider" />
            <form onSubmit={handleAddRole} style={{ display: 'flex', gap: 10 }}>
              <input
                placeholder="역할 추가 (예: 백엔드 개발자)"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                + 추가
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
        {icon} {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{value}</span>
    </div>
  );
}