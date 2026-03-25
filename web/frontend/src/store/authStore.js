// 간단한 로그인 상태 관리 (JWT 없이 localStorage 사용)
// user: { user_id, username, name }

const STORAGE_KEY = 'teamforge_user';

export const authStore = {
  _user: null,
  _listeners: [],

  init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) this._user = JSON.parse(saved);
    } catch {
      this._user = null;
    }
  },

  getUser() {
    return this._user;
  },

  isLoggedIn() {
    return !!this._user;
  },

  login(userData) {
    this._user = userData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    this._notify();
  },

  logout() {
    this._user = null;
    localStorage.removeItem(STORAGE_KEY);
    this._notify();
  },

  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  },

  _notify() {
    this._listeners.forEach(fn => fn(this._user));
  },
};

authStore.init();