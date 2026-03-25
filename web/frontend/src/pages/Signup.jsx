import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../api';

const ROLES = ['프론트엔드', '백엔드', '풀스택', '디자이너', 'PM', 'DevOps', '기획자', '기타'];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', name: '', age: '', mainrole: '', descript: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await userApi.signup({ ...form, age: Number(form.age) });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: 'var(--accent)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
            margin: '0 auto 16px',
            boxShadow: '0 0 32px var(--accent-glow)',
          }}>⚡</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>
            회원가입
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>
            TeamForge에 오신 걸 환영합니다
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">아이디</label>
                <input placeholder="아이디" value={form.username}
                  onChange={e => set('username', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">비밀번호</label>
                <input type="password" placeholder="비밀번호" value={form.password}
                  onChange={e => set('password', e.target.value)} required />
              </div>
            </div>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">이름</label>
                <input placeholder="이름" value={form.name}
                  onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">나이</label>
                <input type="number" placeholder="나이" value={form.age} min={1}
                  onChange={e => set('age', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">주 역할</label>
              <select value={form.mainrole} onChange={e => set('mainrole', e.target.value)} required
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', outline: 'none' }}>
                <option value="">역할 선택...</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">자기소개</label>
              <textarea
                placeholder="간단한 자기소개를 적어주세요"
                value={form.descript}
                onChange={e => set('descript', e.target.value)}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'var(--danger-dim)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: 13,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', marginTop: 4 }}
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}