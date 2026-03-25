import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi, notorietyApi } from '../api';
import { useAuth, useToast } from '../hooks';
import ToastContainer from '../components/Toast';

const ROLE_ICONS = {
  '프론트엔드': '🖥', '백엔드': '⚙️', '풀스택': '🔧', '디자이너': '🎨',
  'PM': '📊', 'DevOps': '🚀', '기획자': '📝', '기타': '👤',
};

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const { toasts, show } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Notoriety form
  const [notoriety, setNotoriety] = useState('');
  const [evalNotorietyId, setEvalNotorietyId] = useState('');
  const [evalText, setEvalText] = useState('');

  useEffect(() => {
    userApi.getOne(Number(id))
      .then(d => setProfile(d.users?.[0] || null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCreateNotoriety = async (e) => {
    e.preventDefault();
    if (!notoriety.trim()) return;
    try {
      await notorietyApi.create({ user_id: Number(id), notoriety: notoriety.trim() });
      show('평판이 추가되었습니다');
      setNotoriety('');
    } catch (err) {
      show(err.message, 'error');
    }
  };

  const handleCreateEval = async (e) => {
    e.preventDefault();
    try {
      await notorietyApi.evaluate({
        notorietyid: Number(evalNotorietyId),
        evaluations: evalText.trim(),
      });
      show('평가가 작성되었습니다');
      setEvalNotorietyId('');
      setEvalText('');
    } catch (err) {
      show(err.message, 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      await userApi.delete(Number(id));
      show('계정이 삭제되었습니다');
      // logout handled by user
      navigate('/login');
    } catch (err) {
      show(err.message, 'error');
    }
  };

  if (loading) return (
    <div className="page"><div className="loading-spinner"><div className="spinner" /></div></div>
  );

  if (!profile) return (
    <div className="page">
      <div className="empty-state">
        <div className="icon">❌</div>
        <p>유저를 찾을 수 없습니다</p>
      </div>
    </div>
  );

  const isSelf = me && me.user_id === profile.user_id;
  const roleIcon = ROLE_ICONS[profile.mainrole] || '👤';

  return (
    <div className="page">
      <ToastContainer toasts={toasts} />

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: 24,
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
            flexShrink: 0,
          }}>
            {roleIcon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>{profile.name}</h1>
              {isSelf && <span className="badge" style={{ fontSize: 11 }}>나</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              @{profile.username}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
              {profile.mainrole && <span className="tag">{roleIcon} {profile.mainrole}</span>}
              {profile.age && <span className="tag">🎂 {profile.age}세</span>}
              <span className="tag">ID #{profile.user_id}</span>
            </div>
          </div>

          {isSelf && (
            <button onClick={handleDeleteAccount} className="btn btn-danger btn-sm">
              계정 삭제
            </button>
          )}
        </div>

        {profile.descript && (
          <>
            <div className="divider" />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
              {profile.descript}
            </p>
          </>
        )}
      </div>

      {/* Notoriety Section */}
      {me && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>평판 등록</h2>
            <form onSubmit={handleCreateNotoriety} style={{ display: 'flex', gap: 10 }}>
              <input
                placeholder="평판을 입력하세요 (예: 협업 능력이 뛰어남)"
                value={notoriety}
                onChange={e => setNotoriety(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                등록
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>평가 작성</h2>
            <form onSubmit={handleCreateEval}>
              <div className="form-group">
                <label className="form-label">평판 ID</label>
                <input
                  type="number"
                  placeholder="평판 ID를 입력하세요"
                  value={evalNotorietyId}
                  onChange={e => setEvalNotorietyId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">평가 내용</label>
                <textarea
                  placeholder="평가 내용을 작성해주세요"
                  value={evalText}
                  onChange={e => setEvalText(e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">평가 작성</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}