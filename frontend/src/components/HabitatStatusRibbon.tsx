import React from 'react';
import {
  Flame,
  Gauge,
  Inbox,
  Radio,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  type HabitatProfile,
  type PersonalBaseline,
  type SeverityLevel,
} from '../types/tauraro.ts';

interface HabitatStatusRibbonProps {
  baseline: PersonalBaseline;
  habitatProfile: HabitatProfile;
  severity: SeverityLevel;
  readinessScore: number;
  streakCount?: number;
  queueCount?: number;
}

export const HabitatStatusRibbon: React.FC<HabitatStatusRibbonProps> = ({
  baseline,
  habitatProfile,
  severity,
  readinessScore,
  streakCount = 14,
  queueCount = 0,
}) => {
  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-[#10B981]';
    if (score >= 50) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  const getSyncIcon = (mode: string) => {
    if (mode === 'REALTIME_SYNCED') {
      return <Wifi className="w-3.5 h-3.5 text-[#10B981]" />;
    }
    if (mode === 'NEAR_REALTIME_BUFFER') {
      return <Radio className="w-3.5 h-3.5 text-[#F59E0B]" />;
    }
    return <WifiOff className="w-3.5 h-3.5 text-[#EF4444]" />;
  };

  return (
    <div className="bg-[#0F172A] border-b border-[#1E293B] px-4 lg:px-6 py-2.5 text-xs text-slate-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Astronaut Profile & Mission Day */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-white font-inter">{baseline.crew_name}</span>
              <span className="text-slate-400 font-mono text-[11px] ml-1.5">
                | Flight Day {baseline.mission_day}
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Gamified Measurement Compliance Streak */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>🔥 {streakCount}-Sol Measurement Streak</span>
          </div>
        </div>

        {/* Center / Right: Environmental Metrics Ribbons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Gravity Field Badge */}
          <div className="flex items-center gap-1.5 bg-[#070B14] px-2.5 py-1 rounded-lg border border-[#1E293B] font-mono">
            <Gauge className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span className="text-slate-400">Gravity:</span>
            <span className="font-bold text-white">{habitatProfile.gravity_g.toFixed(2)}g</span>
          </div>

          {/* Comm Latency & Sync Mode Badge */}
          <div className="flex items-center gap-1.5 bg-[#070B14] px-2.5 py-1 rounded-lg border border-[#1E293B] font-mono">
            {getSyncIcon(habitatProfile.sync_mode)}
            <span className="text-slate-400">Latency:</span>
            <span className="font-semibold text-white">{habitatProfile.latency_label}</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {habitatProfile.sync_mode}
            </span>
          </div>

          {/* SBAR Ground Packet Queue Counter */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono ${
            queueCount > 0
              ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
              : 'bg-[#070B14] border-[#1E293B] text-slate-400'
          }`}>
            <Inbox className="w-3.5 h-3.5" />
            <span>SBAR Uplink Queue:</span>
            <strong className="text-white font-bold">{queueCount}</strong>
          </div>

          {/* Overall Readiness Score Indicator */}
          <div className="flex items-center gap-2 bg-[#070B14] px-3 py-1 rounded-lg border border-[#1E293B]">
            <span className="text-slate-400 text-[11px] uppercase font-mono">Readiness:</span>
            <span className={`font-mono font-bold text-sm ${getReadinessColor(readinessScore)}`}>
              {readinessScore.toFixed(0)}%
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono border ml-1 ${
              severity === 'EMERGENCY'
                ? 'bg-red-500/20 text-[#EF4444] border-red-500/40 animate-pulse'
                : severity === 'CAUTION'
                ? 'bg-amber-500/20 text-[#F59E0B] border-amber-500/40'
                : 'bg-emerald-500/20 text-[#10B981] border-emerald-500/40'
            }`}>
              {severity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
