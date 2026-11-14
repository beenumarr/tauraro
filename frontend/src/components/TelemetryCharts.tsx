import React from 'react';
import {
  Activity,
  Droplets,
  Heart,
  Wind,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  type PersonalBaseline,
  type TelemetryHistoryPoint,
  type TelemetryPayload,
} from '../types/tauraro.ts';

interface TelemetryChartsProps {
  payload: TelemetryPayload;
  baseline: PersonalBaseline;
  history: TelemetryHistoryPoint[];
  hrZScore: number;
  bpZScore: number;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({
  payload,
  baseline,
  history,
  hrZScore,
  bpZScore,
}) => {
  // Shaded reference bands for Heart Rate (Mean ± 2 SD)
  const hrUpper = baseline.hr_mean + 2 * baseline.hr_std;
  const hrLower = Math.max(40, baseline.hr_mean - 2 * baseline.hr_std);

  // Format history for Recharts
  const chartData = history && history.length > 0 ? history : [
    { time_label: 'T-11h', heart_rate_bpm: 68, systolic_bp: 115, diastolic_bp: 74, spo2_pct: 98.4, water_intake_ml: 200, urine_specific_gravity: 1.014 },
    { time_label: 'T-0h',  heart_rate_bpm: payload.heart_rate_bpm, systolic_bp: payload.systolic_bp, diastolic_bp: payload.diastolic_bp, spo2_pct: payload.spo2_pct, water_intake_ml: payload.water_intake_ml, urine_specific_gravity: payload.urine_specific_gravity },
  ];

  const getZColor = (z: number) => {
    if (Math.abs(z) >= 3.0) return 'text-[#EF4444] bg-red-500/10 border-red-500/30';
    if (Math.abs(z) >= 1.5) return 'text-[#F59E0B] bg-amber-500/10 border-amber-500/30';
    return 'text-[#10B981] bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Top Row: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Heart Rate + Z-Score */}
        <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Heart className="w-4 h-4 text-[#EF4444]" /> Heart Rate
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getZColor(hrZScore)}`}>
              Z: {hrZScore >= 0 ? `+${hrZScore.toFixed(2)}` : hrZScore.toFixed(2)}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {payload.heart_rate_bpm.toFixed(0)}
            </span>
            <span className="text-xs font-mono text-slate-400">bpm</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-2 flex items-center justify-between border-t border-[#1E293B]/80 pt-2">
            <span>Baseline: {baseline.hr_mean} ± {baseline.hr_std}</span>
            <span className="text-slate-300">HRV: {payload.hrv_ms.toFixed(0)}ms</span>
          </div>
        </div>

        {/* Card 2: Blood Pressure + Z-Score */}
        <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Activity className="w-4 h-4 text-[#06B6D4]" /> Blood Pressure
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getZColor(bpZScore)}`}>
              Z: {bpZScore >= 0 ? `+${bpZScore.toFixed(2)}` : bpZScore.toFixed(2)}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {payload.systolic_bp.toFixed(0)}/{payload.diastolic_bp.toFixed(0)}
            </span>
            <span className="text-xs font-mono text-slate-400">mmHg</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-2 flex items-center justify-between border-t border-[#1E293B]/80 pt-2">
            <span>Target: {baseline.systolic_mean.toFixed(0)}/{baseline.diastolic_mean.toFixed(0)}</span>
            <span className="text-slate-300">Skin: {payload.skin_temp_c.toFixed(1)}°C</span>
          </div>
        </div>

        {/* Card 3: SpO2 (%) + Cabin CO2 */}
        <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Wind className="w-4 h-4 text-[#3B82F6]" /> Pulse Ox SpO2
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
              payload.spo2_pct < 92 ? 'text-[#EF4444] bg-red-500/10 border-red-500/30' :
              payload.spo2_pct < 96 ? 'text-[#F59E0B] bg-amber-500/10 border-amber-500/30' :
              'text-[#10B981] bg-emerald-500/10 border-emerald-500/30'
            }`}>
              {payload.spo2_pct >= 95 ? 'Normal' : 'Hypoxia'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {payload.spo2_pct.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">%</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-2 flex items-center justify-between border-t border-[#1E293B]/80 pt-2">
            <span>CO2: {payload.cabin_co2_mmhg.toFixed(1)} mmHg</span>
            <span className="text-slate-300">Rad: {payload.radiation_msv.toFixed(2)} mSv</span>
          </div>
        </div>

        {/* Card 4: Hydration + Urine Specific Gravity */}
        <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Droplets className="w-4 h-4 text-[#06B6D4]" /> Hydration & USG
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
              payload.urine_specific_gravity >= 1.026 ? 'text-[#EF4444] bg-red-500/10 border-red-500/30' :
              payload.urine_specific_gravity >= 1.020 ? 'text-[#F59E0B] bg-amber-500/10 border-amber-500/30' :
              'text-[#10B981] bg-emerald-500/10 border-emerald-500/30'
            }`}>
              USG: {payload.urine_specific_gravity.toFixed(3)}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {payload.water_intake_ml.toFixed(0)}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {baseline.water_target_ml} mL</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-2 flex items-center justify-between border-t border-[#1E293B]/80 pt-2">
            <span>ARED: {payload.ared_exercise_mins.toFixed(0)} min</span>
            <span className="text-slate-300">Sleep: {payload.sleep_hrs.toFixed(1)}h</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: 2 Time-Series Recharts with Shaded Personal Baseline Reference Bands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Heart Rate Trend against Personal Baseline Band */}
        <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold font-sora text-white flex items-center gap-2 m-0">
                <Heart className="w-4 h-4 text-[#EF4444]" />
                Heart Rate Trajectory (12-Point Sol Trend)
              </h3>
              <p className="text-[11px] text-slate-400 font-inter mt-0.5">
                Shaded band = Cmdr. Ameer Umar Nominal Baseline ({baseline.hr_mean} ± 2 SD: [{hrLower.toFixed(0)}-{hrUpper.toFixed(0)} bpm])
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300">
              Personalized Drift Detection
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time_label" stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'JetBrains Mono' }} />
                <YAxis domain={['dataMin - 10', 'dataMax + 15']} stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                  labelStyle={{ color: '#06B6D4' }}
                />
                {/* Shaded Personal Baseline ± 2 SD Band */}
                <ReferenceArea y1={hrLower} y2={hrUpper} fill="#10B981" fillOpacity={0.12} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.3} />
                {/* Baseline Mean Line */}
                <ReferenceLine y={baseline.hr_mean} stroke="#10B981" strokeDasharray="4 4" label={{ value: `Mean ${baseline.hr_mean}`, fill: '#10B981', fontSize: 10, position: 'right' }} />
                <Area type="monotone" dataKey="heart_rate_bpm" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#hrGradient)" name="Heart Rate (bpm)" dot={{ r: 3, fill: '#EF4444' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: SpO2 & Blood Pressure Trajectory */}
        <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold font-sora text-white flex items-center gap-2 m-0">
                <Wind className="w-4 h-4 text-[#06B6D4]" />
                SpO2 & Systolic Blood Pressure Trend
              </h3>
              <p className="text-[11px] text-slate-400 font-inter mt-0.5">
                Target: SpO2 ≥ 96.0% (Nominal Mean {baseline.spo2_mean}%) • Systolic BP Mean {baseline.systolic_mean} mmHg
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300">
              Hypoxia & Orthostatic Shock Monitor
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time_label" stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'JetBrains Mono' }} />
                <YAxis domain={[80, 100]} stroke="#64748B" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                  labelStyle={{ color: '#06B6D4' }}
                />
                {/* 95% Hypoxia Safety Line */}
                <ReferenceLine y={95.0} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Hypoxia Threshold 95%', fill: '#F59E0B', fontSize: 10, position: 'right' }} />
                <Area type="monotone" dataKey="spo2_pct" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#spo2Gradient)" name="SpO2 (%)" dot={{ r: 3, fill: '#06B6D4' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
