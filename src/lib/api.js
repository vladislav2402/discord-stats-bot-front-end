// src/lib/api.js
export function makeApi(base) {
  const apiBase = (base || '').replace(/\/$/, '');
  const get = async (path) => {
    const res = await fetch(`${apiBase}${path}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  };
  return {
    base: apiBase || '',
    now: () => get('/api/now'),
    history: () => get('/api/history'),
    voiceToday: () => get('/api/voice/users/today'),
    voiceByDate: (dateStr) => get(`/api/voice/by-date?date=${encodeURIComponent(dateStr)}`),
    voiceUserToday: (uid) => get(`/api/voice/user/${uid}/today`),
    voiceUserTotal: (uid) => get(`/api/voice/user/${uid}/total`),
    voiceUserHistory: (uid) => get(`/api/voice/user/${uid}/history`),

    messagesToday: () => get('/api/messages/users/today'),
    messagesUserToday: (uid) => get(`/api/messages/user/${uid}/today`),
    messagesUserHistory: (uid) => get(`/api/messages/user/${uid}/history`),
    usersTodaySearch: (q) => get(`/api/users/today/search?q=${encodeURIComponent(q || '')}`),

    exportAllXlsxUrl: () => `${apiBase}/api/export.xlsx`,

    exportTodayXlsxUrl: () => `${apiBase}/api/export/xlsx`,

    exportXlsxUrl: () => `${apiBase}/api/export.xlsx`,
    exportTodayXlsx: () => `${apiBase}/api/export/xlsx`,
  };
}
