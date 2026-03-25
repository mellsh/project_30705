const BASE = 'http://localhost:8000';

async function req(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || `Error ${res.status}`);
  }
  return data;ß
}

// ─── 유저 ─────────────────────────────────────────
export const userApi = {
  signup: (body) => req('POST', '/user/signup', body),
  login:  (body) => req('POST', '/user/login',  body),
  delete: (user_id) => req('DELETE', `/user/delete/${user_id}`),
  getAll: () => req('GET', '/user/get'),
  getOne: (user_id) => req('GET', `/user/get/${user_id}`),
};

// ─── 평판 ─────────────────────────────────────────
export const notorietyApi = {
  create:     (body) => req('POST', '/notoriety/notoriety', body),
  evaluate:   (body) => req('POST', '/notoriety/evaluation', body),
};

// ─── 팀 모집 ──────────────────────────────────────
export const recruitApi = {
  create:    (body) => req('POST', '/team/recruit', body),
  addRole:   (body) => req('POST', '/team/recruit/role', body),
  getAll:    () => req('GET', '/team/recruit'),
  getOne:    (id) => req('GET', `/team/recruit/${id}`),
  getRoles:  (id) => req('GET', `/team/recruit/${id}/roles`),
  delete:    (id) => req('DELETE', `/team/recruit/${id}`),
};

// ─── 팀 ───────────────────────────────────────────
export const teamApi = {
  getAll:       () => req('GET', '/team/teams'),
  getOne:       (id) => req('GET', `/team/teams/${id}`),
  addMember:    (body) => req('POST', '/team/team/member', body),
  removeMember: (team_id, user_id) =>
    req('DELETE', `/team/team/member?team_id=${team_id}&user_id=${user_id}`),
  delete:       (id) => req('DELETE', `/team/team/${id}`),
};