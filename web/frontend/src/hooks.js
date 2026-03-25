import { useState, useEffect, useCallback } from 'react';
import { authStore } from './store/authStore.js';

// ─── 로그인 상태 훅 ───────────────────────────────
export function useAuth() {
  const [user, setUser] = useState(authStore.getUser());

  useEffect(() => {
    return authStore.subscribe(setUser);
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    login: (userData) => authStore.login(userData),
    logout: () => authStore.logout(),
  };
}

// ─── 토스트 훅 ────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, show };
}