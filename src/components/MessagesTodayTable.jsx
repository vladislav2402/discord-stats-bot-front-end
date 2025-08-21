import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Search } from 'lucide-react';

export default function MessagesTodayTable({ api, onSelectUser }) {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const res = await api.messagesToday();
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
    const list = rows.slice().sort((a, b) => (b.messages || 0) - (a.messages || 0));
    if (!needle) return list;
    return list.filter((r) => {
      const u = (r.username || '').toLowerCase(),
        d = (r.display_name || '').toLowerCase();
      return u.includes(needle) || d.includes(needle) || String(r.user_id).includes(needle);
    });
  }, [rows, q]);

  return (
    <div className="space-y-3">
      <div className="glass p-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        <div className="font-semibold">Messages — Today</div>
        {loading ? <div className="text-xs text-white/50 ml-auto">Loading…</div> : null}
      </div>
      {err ? <div className="glass p-4 text-red-300 text-sm">{err}</div> : null}
      <div className="glass flex items-center gap-2 px-3 py-2 w-full md:w-80">
        <Search className="w-4 h-4 text-white/60" />
        <input
          className="bg-transparent outline-none w-full text-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <div className="glass overflow-hidden">
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white/5 backdrop-blur-sm">
              <tr>
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Display</th>
                <th className="text-right px-4 py-3 font-medium">Messages</th>
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
                  <td className="px-4 py-2 text-white/70">{r.display_name || '—'}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{(r.messages || 0).toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-white/50" colSpan={4}>
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
