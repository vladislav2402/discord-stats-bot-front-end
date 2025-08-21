import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { Calendar } from 'lucide-react';

export default function HistoryCharts({ api }) {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const res = await api.history();
      setRows(res || []);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [api.base]);

  const data = useMemo(() => {
    return (rows || [])
      .slice()
      .reverse()
      .map((r) => ({
        date: r.date,
        messages: r.messages || 0,
        joins: r.joins || 0,
        leaves: r.leaves || 0,
        voice_hours: +(Number(r.voice_seconds || 0) / 3600).toFixed(2),
        members: r.members || 0,
      }));
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="glass p-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        <div className="font-semibold">History</div>
        {loading ? <div className="text-xs text-white/50 ml-auto">Loading…</div> : null}
      </div>

      {err ? <div className="glass p-4 text-red-300 text-sm">{err}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass p-4">
          <div className="text-sm text-white/70 mb-2">Messages per day</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <RTooltip />
                <Legend />
                <Line type="monotone" dataKey="messages" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-4">
          <div className="text-sm text-white/70 mb-2">Joins vs Leaves</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <RTooltip />
                <Legend />
                <Bar dataKey="joins" />
                <Bar dataKey="leaves" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-4">
          <div className="text-sm text-white/70 mb-2">Voice hours per day</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <RTooltip />
                <Legend />
                <Area type="monotone" dataKey="voice_hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
