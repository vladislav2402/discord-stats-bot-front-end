import { useEffect, useMemo, useState } from 'react';
import { X, UserCircle2, Clock, MessageSquare } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from 'recharts';

export default function UserDrawer({ api, userId, onClose }) {
  const [today, setToday] = useState(null);
  const [total, setTotal] = useState(null);
  const [hist, setHist] = useState([]);
  const [msgToday, setMsgToday] = useState(0);
  const [msgHist, setMsgHist] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const [t, tot, h, mt, mh] = await Promise.all([
          api.voiceUserToday(userId),
          api.voiceUserTotal(userId),
          api.voiceUserHistory(userId),
          api.messagesUserToday(userId),
          api.messagesUserHistory(userId),
        ]);
        setToday(t);
        setTotal(tot);
        setHist(Array.isArray(h) ? h : []);
        setMsgToday(mt?.messages || 0);
        setMsgHist(Array.isArray(mh) ? mh : []);
      } catch (e) {
        setErr(String(e?.message || e));
      }
    })();
  }, [userId, api.base]);

  const profile = today?.user || {};
  const secToday = Number(today?.seconds || 0);
  const secTotal = Number(total?.seconds || 0);

  const chartData = useMemo(
    () =>
      (hist || [])
        .slice()
        .reverse()
        .map((r) => ({
          date: r.date,
          seconds: r.seconds || 0,
          hours: +(Number(r.seconds || 0) / 3600).toFixed(2),
        })),
    [hist]
  );

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="ml-auto h-full w-full sm:w-[520px] bg-white/10 backdrop-blur-md border-l border-white/10 shadow-glass overflow-auto">
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <UserCircle2 className="w-10 h-10 text-white/80" />
            )}
            <div>
              <div className="font-semibold">{profile.display_name || profile.username || userId}</div>
              <div className="text-xs text-white/60">ID: {userId}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {err ? <div className="p-4 text-sm text-red-300">{err}</div> : null}

        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="glass p-4">
            <div className="text-xs text-white/60">Today</div>
            <div className="text-2xl font-semibold">{(secToday / 3600).toFixed(2)} h</div>
            <div className="text-xs text-white/50 mt-1">{secToday.toLocaleString()} s</div>
          </div>
          <div className="glass p-4">
            <div className="text-xs text-white/60">Total</div>
            <div className="text-2xl font-semibold">{(secTotal / 3600).toFixed(2)} h</div>
            <div className="text-xs text-white/50 mt-1">{secTotal.toLocaleString()} s</div>
          </div>
        </div>

        <div className="px-4">
          <div className="glass p-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <div className="text-sm">Messages today:</div>
            <div className="ml-auto text-lg font-semibold">{msgToday}</div>
          </div>
        </div>

        <div className="p-4">
          <div className="glass p-4">
            <div className="text-sm text-white/70 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Daily voice hours
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <RTooltip />
                  <Line type="monotone" dataKey="hours" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="p-4 text-xs text-white/50">
          Joined at: {profile.joined_at ? new Date(profile.joined_at).toLocaleString() : '—'}
        </div>
      </div>
    </div>
  );
}
