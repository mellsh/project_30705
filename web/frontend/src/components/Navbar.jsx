import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1.5px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontWeight: 800,
          fontSize: 19,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          marginRight: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            background: 'var(--accent)',
            width: 28, height: 28,
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
          }}>⚡</span>
          TeamForge
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          <NavLink to="/recruits" active={isActive('/recruits')}>모집 공고</NavLink>
          <NavLink to="/teams" active={isActive('/teams')}>팀 목록</NavLink>
          {isLoggedIn && (
            <NavLink to="/recruits/create" active={isActive('/recruits/create')}>
              + 모집 만들기
            </NavLink>
          )}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <Link to={`/profile/${user.user_id}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-elevated)',
                border: '1.5px solid var(--border)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>
                <span style={{
                  width: 24, height: 24,
                  borderRadius: '50%',
                  background: 'var(--accent-dim)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {user.name?.[0] || user.username?.[0]}
                </span>
                {user.name || user.username}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">로그인</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: '6px 14px',
      borderRadius: 'var(--radius-full)',
      fontSize: 14,
      fontWeight: active ? 600 : 500,
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      background: active ? 'var(--accent-dim)' : 'transparent',
      transition: 'all 0.15s',
    }}>
      {children}
    </Link>
  );
}