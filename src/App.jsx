import { useMemo, useState } from 'react';
import { makeApi } from './lib/api';
import NowPanel from './components/NowPanel';
import HistoryCharts from './components/HistoryCharts';
import VoiceTodayTable from './components/VoiceTodayTable';
import UserDrawer from './components/UserDrawer';
import MessagesTodayTable from './components/MessagesTodayTable';

export default function App() {
  const [apiBase, setApiBase] = useState('http://0.0.0.0:8000');
  const api = useMemo(() => makeApi(apiBase), [apiBase]);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(56,189,248,0.2),transparent),radial-gradient(1000px_500px_at_120%_10%,rgba(168,85,247,0.15),transparent)]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <NowPanel api={api} onApiBaseChange={setApiBase} />

        <HistoryCharts api={api} />

        <VoiceTodayTable api={api} onSelectUser={setSelectedUser} />
        <MessagesTodayTable api={api} onSelectUser={setSelectedUser} />
      </div>

      <UserDrawer api={api} userId={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
