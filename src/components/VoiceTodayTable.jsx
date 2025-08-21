import { useEffect, useMemo, useState } from 'react';
import { Search, Mic } from 'lucide-react';

export default function VoiceTodayTable({ api, onSelectUser }) {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const res = await api.voiceToday();
      setRows(Array.isArray(res) ? res : []);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [api.base]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = rows.slice().sort((a, b) => (b.seconds || 0) - (a.seconds || 0));
    if (!needle) return list;
    return list.filter((r) => {
      const u = (r.username || '').toLowerCase();
      const d = (r.display_name || '').toLowerCase();
      return u.includes(needle) || d.includes(needle) || String(r.user_id).includes(needle);
    });
  }, [rows, q]);

  const fmtSec = (s) => {
    const sec = Number(s || 0);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const rem = sec % 60;
    return `${h}h ${m}m ${rem}s`;
  };

  return (
    <div className="space-y-3">
      <div className="glass p-4 flex items-center gap-2">
        <Mic className="w-5 h-5" />
        <div className="font-semibold">Voice — Today</div>
        {loading ? <div className="text-xs text-white/50 ml-auto">Loading…</div> : null}
      </div>

      {err ? <div className="glass p-4 text-red-300 text-sm">{err}</div> : null}

      <div className="flex items-center gap-2">
        <div className="glass flex items-center gap-2 px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search user by name or ID…"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      <div className="glass overflow-hidden">
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white/5 backdrop-blur-sm">
              <tr>
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Display</th>
                <th className="text-right px-4 py-3 font-medium">Seconds</th>
                <th className="text-right px-4 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r.user_id}
                  className="hover:bg-white/5 cursor-pointer"
                  onClick={() => onSelectUser?.(r.user_id)}
                >
                  <td className="px-4 py-2 text-white/60">{i + 1}</td>
                  <td className="px-4 py-2">{r.username || '—'}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img src={r.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                    {r.username || '—'}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">{(r.seconds || 0).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{fmtSec(r.seconds)}</td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-white/50" colSpan={5}>
                    No data
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
