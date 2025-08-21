import { memo } from 'react';

export default memo(function KpiCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="glass p-5 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="text-white/70 text-sm">{label}</div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {sub ? <div className="text-xs text-white/50 mt-1">{sub}</div> : null}
      </div>
    </div>
  );
});
