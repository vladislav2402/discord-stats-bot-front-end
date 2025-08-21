import { useEffect, useState } from 'react';
import KpiCard from './KpiCard';
import { RefreshCw, Users, User, MessageSquare, Clock, Server } from 'lucide-react';

export default function NowPanel({ api, onApiBaseChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [apiBase, setApiBase] = useState(api.base);
  const [updatedAt, setUpdatedAt] = useState(null);

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const res = await api.now();
      setData(res);
      setUpdatedAt(new Date());
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

  const fmt = (n) => (typeof n === 'number' ? n.toLocaleString() : n ?? '—');

  return (
    <div className="space-y-4">
      <div className="glass p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Server className="w-5 h-5" /> Discord Metrics — Now
        </div>
        <div className="flex items-center gap-2">
          <input
            value={apiBase}
            onChange={(e) => setApiBase(e.target.value)}
            onBlur={() => onApiBaseChange(apiBase)}
            placeholder="API base (http://0.0.0.0:8000)"
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            onClick={load}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm hover:bg-white/15 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => window.open(api.exportTodayXlsxUrl(), '_blank')}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm hover:bg-white/15 transition"
          >
            Export Today XLSX
          </button>
          <button
            onClick={() => window.open(api.exportAllXlsxUrl(), '_blank')}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm hover:bg-white/15 transition"
          >
            Export All XLSX
          </button>
        </div>
      </div>

      {err ? <div className="glass p-4 text-red-300 text-sm">{err}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard icon={Users} label="Members" value={fmt(data?.members)} />
        <KpiCard icon={User} label="Joins (24h)" value={fmt(data?.joins)} sub={`Leaves: ${fmt(data?.leaves)}`} />
        <KpiCard icon={User} label="Net Δ" value={fmt(data?.diff)} />
        <KpiCard icon={MessageSquare} label="Messages Today" value={fmt(data?.messages_today)} />
        <KpiCard icon={MessageSquare} label="Messages Total" value={fmt(data?.messages_total)} />
        <KpiCard icon={Clock} label="Voice Today" value={`${data ? data.voice_hours_today.toFixed(2) : '0.00'} h`} />
      </div>

      <div className="text-xs text-white/40">
        API: <span className="text-white/60">{api.base}</span>
        {updatedAt ? <> · Updated: {updatedAt.toLocaleTimeString()}</> : null}
      </div>
    </div>
  );
}
