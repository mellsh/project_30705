import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recruitApi } from '../api';
import { useAuth, useToast } from '../hooks';
import ToastContainer from '../components/Toast';

export default function CreateRecruit() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toasts, show } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    cruit_descript: '',
    required_count: '',
    deadline: '',
  });

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="icon">🔒</div>
          <p>로그인 후 이용할 수 있습니다</p>
        </div>
      </div>
    );
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await recruitApi.create({
        ...form,
        required_count: Number(form.required_count),
        cruit_leader_id: user.user_id,
        deadline: form.deadline || null,
      });
      show('모집 공고가 생성되었습니다');
      setTimeout(() => navigate('/recruits'), 800);
    } catch (err) {
      show(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <ToastContainer toasts={toasts} />

      <button onClick={() => navigate('/recruits')} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
        ← 목록으로
      </button>

      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 24 }}>
        모집 공고 만들기
      </h1>

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">공고 제목</label>
            <input
              placeholder="예: React 프론트엔드 개발자 모집"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">공고 설명</label>
            <textarea
              placeholder="프로젝트 소개 및 모집 내용을 작성해주세요"
              value={form.cruit_descript}
              onChange={e => set('cruit_descript', e.target.value)}
              rows={5}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">모집 인원</label>
              <input
                type="number"
                placeholder="모집 인원 수"
                value={form.required_count}
                min={1}
                onChange={e => set('required_count', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">마감일</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => set('deadline', e.target.value)}
              />
            </div>
          </div>

          <div style={{
            padding: '12px 16px',
            background: 'var(--accent-dim)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            color: 'var(--accent)',
            marginBottom: 20,
          }}>
            💡 모집 공고 생성 시 팀도 자동으로 만들어집니다
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}
          >
            {loading ? '생성 중...' : '모집 공고 만들기'}
          </button>
        </form>
      </div>
    </div>
  );
}