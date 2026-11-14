import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Heart,
  Info,
  Shield,
  Zap,
} from 'lucide-react';
import {
  type OrganStatus,
  type OrganStatusDetail,
  type OrganSystemId,
} from '../types/tauraro.ts';

interface InteractiveBodyTwinProps {
  organs: OrganStatusDetail[] | Record<string, OrganStatusDetail>;
}

export const InteractiveBodyTwin: React.FC<InteractiveBodyTwinProps> = ({ organs }) => {
  const [selectedOrganId, setSelectedOrganId] = useState<OrganSystemId>('cardio');

  // Normalize organs into a map for fast lookup
  const organMap: Record<OrganSystemId, OrganStatusDetail | undefined> = Array.isArray(organs)
    ? organs.reduce((acc, curr) => {
        acc[curr.organ_id] = curr;
        return acc;
      }, {} as Record<OrganSystemId, OrganStatusDetail>)
    : (organs as Record<OrganSystemId, OrganStatusDetail>);

  const activeDetail = organMap[selectedOrganId] || {
    organ_id: selectedOrganId,
    name: 'Cardiovascular & Hemodynamics',
    status: 'NOMINAL' as OrganStatus,
    z_score_summary: 'Nominal physiological status',
    why_it_matters_in_space: 'In microgravity, fluid shifts toward the head, altering heart workload.',
    plain_language_assessment: 'Vitals stable; no acute cardiovascular strain.',
    recommended_actions: ['Continue planned mission tasks and daily ARED training.'],
  };

  const getStatusColor = (status: OrganStatus) => {
    if (status === 'CRITICAL') return '#EF4444';
    if (status === 'CAUTION') return '#F59E0B';
    return '#10B981';
  };

  const getStatusBadge = (status: OrganStatus) => {
    if (status === 'CRITICAL') {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-red-500/20 text-[#EF4444] border border-[#EF4444]/40 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL
        </span>
      );
    }
    if (status === 'CAUTION') {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-amber-500/20 text-[#F59E0B] border border-[#F59E0B]/40">
          <Zap className="w-3.5 h-3.5" /> CAUTION
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-[#10B981] border border-[#10B981]/40">
        <CheckCircle2 className="w-3.5 h-3.5" /> NOMINAL
      </span>
    );
  };

  // Organ colors
  const neuroColor = getStatusColor(organMap.neuro?.status || 'NOMINAL');
  const cardioColor = getStatusColor(organMap.cardio?.status || 'NOMINAL');
  const renalColor = getStatusColor(organMap.renal?.status || 'NOMINAL');
  const musculoColor = getStatusColor(organMap.musculo?.status || 'NOMINAL');
  const immuneColor = getStatusColor(organMap.immune?.status || 'NOMINAL');

  return (
    <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 lg:p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold font-sora text-white flex items-center gap-2 m-0">
            <Activity className="w-5 h-5 text-[#06B6D4]" />
            Interactive Anatomical Body Twin
          </h2>
          <p className="text-xs text-slate-400 font-inter mt-0.5">
            NASA HRP Non-Doctor Organ System Visualizer • Click any organ zone to inspect spaceflight physiological impact
          </p>
        </div>

        {/* Quick Organ System Selector Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(['cardio', 'renal', 'neuro', 'musculo', 'immune'] as OrganSystemId[]).map((id) => {
            const org = organMap[id];
            const isSelected = selectedOrganId === id;
            const status = org?.status || 'NOMINAL';
            const color = getStatusColor(status);

            return (
              <button
                key={id}
                onClick={() => setSelectedOrganId(id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-150 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-800 text-white border-[#06B6D4] shadow-md shadow-[#06B6D4]/20'
                    : 'bg-[#070B14] text-slate-400 hover:text-slate-200 border-[#1E293B]'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="capitalize">{id}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Custom Anatomical Silhouette SVG (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#070B14] rounded-2xl p-6 border border-[#1E293B]/80 relative overflow-hidden min-h-[460px]">
          {/* Subtle Background Space Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* SVG Anatomical Astronaut Silhouette */}
          <svg
            viewBox="0 0 280 440"
            className="w-full max-w-[260px] h-auto drop-shadow-[0_0_25px_rgba(6,182,212,0.15)] relative z-10"
          >
            {/* Ambient Body Aura */}
            <ellipse cx="140" cy="220" rx="90" ry="190" fill="#06B6D4" opacity="0.04" />

            {/* Astronaut Helmet & Head: NEURO ZONE */}
            <g
              onClick={() => setSelectedOrganId('neuro')}
              className="cursor-pointer transition-transform duration-200 hover:scale-105 transform-origin-center"
            >
              <ellipse
                cx="140"
                cy="60"
                rx="34"
                ry="38"
                fill="#0F172A"
                stroke={selectedOrganId === 'neuro' ? '#06B6D4' : neuroColor}
                strokeWidth={selectedOrganId === 'neuro' ? '3.5' : '2'}
              />
              {/* Visor Area */}
              <ellipse cx="140" cy="58" rx="22" ry="16" fill={neuroColor} opacity="0.25" />
              <ellipse cx="140" cy="58" rx="16" ry="10" fill={neuroColor} opacity="0.4" />
              {/* Ocular / Optic Nerve Nodes (SANS check) */}
              <circle cx="132" cy="56" r="3" fill={neuroColor} />
              <circle cx="148" cy="56" r="3" fill={neuroColor} />
              {/* Label */}
              <text x="140" y="20" textAnchor="middle" fill={neuroColor} fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                NEURO / SANS
              </text>
            </g>

            {/* Neck / Cervical Spine */}
            <rect x="133" y="98" width="14" height="12" rx="3" fill="#1E293B" />

            {/* Chest & Upper Torso: CARDIO ZONE */}
            <g
              onClick={() => setSelectedOrganId('cardio')}
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <path
                d="M 98 110 L 182 110 L 175 180 L 105 180 Z"
                fill="#0F172A"
                stroke={selectedOrganId === 'cardio' ? '#06B6D4' : cardioColor}
                strokeWidth={selectedOrganId === 'cardio' ? '3.5' : '2'}
              />
              {/* Pulsing Cardiac Core */}
              <circle cx="135" cy="142" r="14" fill={cardioColor} opacity="0.25" className="animate-ping" />
              <circle cx="135" cy="142" r="10" fill={cardioColor} opacity="0.8" />
              {/* Lungs & Vasculature lines */}
              <path d="M 115 130 Q 120 160 118 170" stroke={cardioColor} strokeWidth="2" strokeDasharray="3,2" fill="none" />
              <path d="M 165 130 Q 160 160 162 170" stroke={cardioColor} strokeWidth="2" strokeDasharray="3,2" fill="none" />
              {/* Heartbeat pulse path */}
              <path d="M 125 142 L 131 142 L 134 135 L 137 150 L 140 142 L 145 142" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <text x="210" y="145" textAnchor="start" fill={cardioColor} fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                CARDIO
              </text>
            </g>

            {/* Arms / Clavicles (Upper Musculoskeletal) */}
            <path
              d="M 98 112 Q 65 160 60 210 Q 64 212 70 210 Q 78 165 105 135"
              fill="#0F172A"
              stroke={musculoColor}
              strokeWidth="1.8"
            />
            <path
              d="M 182 112 Q 215 160 220 210 Q 216 212 210 210 Q 202 165 175 135"
              fill="#0F172A"
              stroke={musculoColor}
              strokeWidth="1.8"
            />

            {/* Midsection Core & Kidneys: RENAL ZONE */}
            <g
              onClick={() => setSelectedOrganId('renal')}
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <path
                d="M 105 180 L 175 180 L 170 240 L 110 240 Z"
                fill="#0F172A"
                stroke={selectedOrganId === 'renal' ? '#06B6D4' : renalColor}
                strokeWidth={selectedOrganId === 'renal' ? '3.5' : '2'}
              />
              {/* Kidneys */}
              <ellipse cx="122" cy="205" rx="7" ry="11" fill={renalColor} opacity="0.85" />
              <ellipse cx="158" cy="205" rx="7" ry="11" fill={renalColor} opacity="0.85" />
              {/* Bladder / Hydration Reservoir */}
              <ellipse cx="140" cy="230" rx="9" ry="6" fill={renalColor} opacity="0.6" />
              <text x="70" y="210" textAnchor="end" fill={renalColor} fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                RENAL
              </text>
            </g>

            {/* Pelvis & Lower Limbs: MUSCULOSKELETAL ZONE */}
            <g
              onClick={() => setSelectedOrganId('musculo')}
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              {/* Pelvis */}
              <path d="M 110 240 L 170 240 L 160 265 L 120 265 Z" fill="#0F172A" stroke={musculoColor} strokeWidth="1.8" />
              {/* Left Leg (Femur & Tibia/ARED load) */}
              <path
                d="M 118 265 L 134 265 L 130 350 L 138 415 L 115 415 L 116 350 Z"
                fill="#0F172A"
                stroke={selectedOrganId === 'musculo' ? '#06B6D4' : musculoColor}
                strokeWidth={selectedOrganId === 'musculo' ? '3' : '1.8'}
              />
              {/* Right Leg */}
              <path
                d="M 146 265 L 162 265 L 164 350 L 165 415 L 142 415 L 150 350 Z"
                fill="#0F172A"
                stroke={selectedOrganId === 'musculo' ? '#06B6D4' : musculoColor}
                strokeWidth={selectedOrganId === 'musculo' ? '3' : '1.8'}
              />
              {/* Axial Bone Load indicator line */}
              <line x1="140" y1="120" x2="140" y2="260" stroke={musculoColor} strokeWidth="2" strokeDasharray="4,3" />
              <text x="140" y="435" textAnchor="middle" fill={musculoColor} fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                ARED MUSCULOSKELETAL
              </text>
            </g>

            {/* Systemic Halo Aura: IMMUNE & RADIATION */}
            <g
              onClick={() => setSelectedOrganId('immune')}
              className="cursor-pointer"
            >
              <circle cx="140" cy="115" r="5" fill={immuneColor} />
              <text x="220" y="85" textAnchor="start" fill={immuneColor} fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                IMMUNE / RAD
              </text>
            </g>
          </svg>

          {/* Quick Gravity & Restraint Note */}
          <div className="mt-4 text-center z-10">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
              Active Focus: <strong className="text-white capitalize">{selectedOrganId}</strong> • Click any zone to toggle
            </span>
          </div>
        </div>

        {/* Right: Detailed Organ Inspection Card (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Header Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                  style={{ backgroundColor: `${getStatusColor(activeDetail.status)}20`, border: `1px solid ${getStatusColor(activeDetail.status)}50` }}
                >
                  {selectedOrganId === 'cardio' && <Heart className="w-5 h-5 text-[#EF4444]" />}
                  {selectedOrganId === 'renal' && <Activity className="w-5 h-5 text-[#06B6D4]" />}
                  {selectedOrganId === 'neuro' && <Brain className="w-5 h-5 text-[#F59E0B]" />}
                  {selectedOrganId === 'musculo' && <Zap className="w-5 h-5 text-[#10B981]" />}
                  {selectedOrganId === 'immune' && <Shield className="w-5 h-5 text-[#3B82F6]" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sora m-0">
                    {activeDetail.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    {activeDetail.z_score_summary}
                  </div>
                </div>
              </div>

              {getStatusBadge(activeDetail.status)}
            </div>

            {/* Plain-Language Clinical Assessment */}
            <div className="mt-4 bg-[#070B14] p-3.5 rounded-xl border border-[#1E293B]">
              <div className="text-[11px] uppercase font-mono font-bold text-[#06B6D4] flex items-center gap-1.5 mb-1">
                <Info className="w-3.5 h-3.5" /> Clinical Assessment (Non-Doctor Wording)
              </div>
              <p className="text-xs text-slate-200 font-inter leading-relaxed m-0">
                {activeDetail.plain_language_assessment}
              </p>
            </div>

            {/* Why This Matters in Space Exploration */}
            <div className="mt-4">
              <h4 className="text-xs uppercase font-mono font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <span className="text-[#06B6D4]">★</span> Why This Matters in Space Exploration
              </h4>
              <p className="text-xs text-slate-300 font-inter leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                {activeDetail.why_it_matters_in_space}
              </p>
            </div>

            {/* Non-Doctor Action Protocol Countermeasures */}
            <div className="mt-4">
              <h4 className="text-xs uppercase font-mono font-bold text-[#10B981] flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Non-Doctor Action Protocol (Immediate Countermeasures)
              </h4>
              <ul className="space-y-2 m-0 p-0 list-none">
                {activeDetail.recommended_actions.map((act, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-200 font-inter bg-[#070B14] p-2.5 rounded-lg border border-[#1E293B]"
                  >
                    <span className="w-5 h-5 rounded-md bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

