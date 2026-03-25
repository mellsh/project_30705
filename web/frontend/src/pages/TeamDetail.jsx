import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamApi, userApi } from '../api';
import { useAuth, useToast } from '../hooks';
import ToastContainer from '../components/Toast';

const ROLE_COLORS = {
  '프론트엔드': '#4f8eff', '백엔드': '#3ecf8e', '풀스택': '#f5a623',
  '디자이너': '#a855f7', 'PM': '#ff5c6a', 'DevOps': '#06b6d4',
};

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, show } = useToast();

  const [members, setMembers] = useState([]);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addForm, setAddForm] = useState({ user_id: '', member_role: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTeam = async () => {
    try {
      const data = await teamApi.getOne(Number(id));
      const list = data.team_members || [];
      setMembers(list);
      if (list.length > 0) {
        setTeam({ team_id: list[0].team_id, teamname: list[0].teamname, team_descript: list[0].team_descript });
      }
    } catch (err) {
      show(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Also load team info from teams list if no members
  useEffect(() => {
    fetchTeam();
  }, [id]);

  const isLeader = user && members.some(m => m.user_id === user.user_id && m.member_role === 'leader');

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await teamApi.addMember({
        team_id: Number(id),
        user_id: Number(addForm.user_id),
        member_role: addForm.member_role,
      });
      show('팀원이 추가되었습니다');
      setAddForm({ user_id: '', member_role: '' });
      setShowAddForm(false);
      await fetchTeam();
    } catch (err) {
      show(err.message, 'error');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('팀원을 삭제하시겠습니까?')) return;
    try {
      await teamApi.removeMember(Number(id), userId);
      show('팀원이 삭제되었습니다');
      await fetchTeam();
    } catch (err) {
      show(err.message, 'error');
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm('팀을 삭제하시겠습니까? 모든 팀원 정보도 삭제됩니다.')) return;
    try {
      await teamApi.delete(Number(id));
      show('팀이 삭제되었습니다');
      navigate('/teams');
    } catch (err) {
      show(err.message, 'error');
    }
  };

  if (loading) return (
    <div className="page"><div className="loading-spinner"><div className="spinner" /></div></div>
  );

  return (
    <div className="page">
      <ToastContainer toasts={toasts} />

      <button onClick={() => navigate('/teams')} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
        ← 팀 목록으로
      </button>

      {/* Team Header */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: 18,
              background: 'var(--accent-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }}>⚡</div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>
                {team?.teamname || `팀 #${id}`}
              </h1>
              {team?.team_descript && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
                  {team.team_descript}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {user && (
              <button onClick={() => setShowAddForm(v => !v)} className="btn btn-ghost btn-sm">
                {showAddForm ? '취소' : '+ 팀원 추가'}
              </button>
            )}
            {isLeader && (
              <button onClick={handleDeleteTeam} className="btn btn-danger btn-sm">
                팀 해산
              </button>
            )}
          </div>
        </div>

        {/* Add Member Form */}
        {showAddForm && (
          <form onSubmit={handleAddMember} style={{
            marginTop: 20,
            paddingTop: 20,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
          }}>
            <input
              type="number"
              placeholder="User ID"
              value={addForm.user_id}
              onChange={e => setAddForm(p => ({ ...p, user_id: e.target.value }))}
              style={{ flex: '1 1 120px', minWidth: 120 }}
              required
            />
            <input
              placeholder="역할 (예: 백엔드)"
              value={addForm.member_role}
              onChange={e => setAddForm(p => ({ ...p, member_role: e.target.value }))}
              style={{ flex: '2 1 180px' }}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">추가</button>
          </form>
        )}
      </div>

      {/* Members */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>
            팀원 <span style={{ color: 'var(--accent)', marginLeft: 6, fontSize: 14 }}>{members.length}명</span>
          </h2>
        </div>

        {members.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 20px' }}>
            <div className="icon" style={{ fontSize: 32 }}>👤</div>
            <p>팀원이 없습니다</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {members.map((m, i) => {
              const roleColor = ROLE_COLORS[m.member_role] || 'var(--accent)';
              const isSelf = user && user.user_id === m.user_id;
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1.5px solid var(--border)',
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    background: `${roleColor}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: roleColor,
                    fontWeight: 700,
                    fontSize: 15,
                    flexShrink: 0,
                  }}>
                    {m.username?.[0]?.toUpperCase() || '?'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{m.username}</span>
                      {isSelf && <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>나</span>}
                    </div>
                    <span style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 600,
                      color: roleColor,
                      background: `${roleColor}18`,
                      padding: '2px 8px',
                      borderRadius: 99,
                      marginTop: 3,
                    }}>
                      {m.member_role}
                    </span>
                  </div>

                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID #{m.user_id}</span>

                  {isLeader && !isSelf && (
                    <button
                      onClick={() => handleRemoveMember(m.user_id)}
                      className="btn btn-danger btn-sm"
                      style={{ fontSize: 12, padding: '4px 10px' }}
                    >
                      삭제
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}