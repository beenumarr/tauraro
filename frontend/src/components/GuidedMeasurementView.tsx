import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Eye,
  Flame,
  HelpCircle,
  Package,
  Sparkles,
} from 'lucide-react';
import {
  type MeasurementGuide,
} from '../types/tauraro.ts';

interface GuidedMeasurementViewProps {
  guides: MeasurementGuide[];
  onCompleteMeasurement?: () => void;
}

export const GuidedMeasurementView: React.FC<GuidedMeasurementViewProps> = ({
  guides,
  onCompleteMeasurement,
}) => {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [activeAmslerModal, setActiveAmslerModal] = useState<boolean>(false);

  const toggleComplete = (id: string) => {
    setCompletedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id] && onCompleteMeasurement) {
        onCompleteMeasurement();
      }
      return next;
    });
  };

  const completedCount = Object.values(completedMap).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the Brazilian Space Agency & NASA Challenge Mandate */}
      <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                BRAZILIAN SPACE AGENCY & NASA HRP MANDATE
              </span>
              <span className="text-xs text-amber-400 font-mono flex items-center gap-1 font-semibold">
                <Flame className="w-3.5 h-3.5" /> Gamified Habit Tracking
              </span>
            </div>
            <h2 className="text-xl font-bold font-sora text-white mt-1.5 m-0">
              Non-Doctor Astronaut Measurement Protocol (SOP)
            </h2>
            <p className="text-xs text-slate-300 font-inter mt-1 leading-relaxed">
              Astronauts are not medical doctors. TAURARO provides step-by-step checklists, equipment hardware guides,
              gravity-specific adjustments (0g fluid globule prevention, wall-tether restraint during cuff inflation),
              and gamified compliance streak reminders.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#070B14] p-3.5 rounded-2xl border border-[#1E293B]">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Today's Sol Progress</div>
              <div className="text-xl font-extrabold font-mono text-[#06B6D4]">
                {completedCount} / {guides.length} Completed
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 4 Structured Measurement Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {guides.map((g) => {
          const isDone = !!completedMap[g.id];
          const isAmsler = g.id.includes('neuro') || g.id.includes('sans');

          return (
            <div
              key={g.id}
              className={`bg-[#0B1120] border rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between ${
                isDone
                  ? 'border-[#10B981]/50 bg-[#0B1120]/90 ring-1 ring-[#10B981]/30'
                  : 'border-[#1E293B] hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header: Title, Organ, and Cadence */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1E293B]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {g.target_organ}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#06B6D4]" /> {g.frequency}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white font-sora m-0 leading-snug">
                      {g.title}
                    </h3>
                  </div>

                  {/* Mark Complete Checkbox Button */}
                  <button
                    onClick={() => toggleComplete(g.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                      isDone
                        ? 'bg-[#10B981] text-[#070B14] shadow-md shadow-[#10B981]/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isDone ? 'COMPLETED (+1)' : 'MARK COMPLETE'}</span>
                  </button>
                </div>

                {/* Equipment & Expected Normal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 text-xs font-mono">
                  <div className="bg-[#070B14] p-2.5 rounded-xl border border-[#1E293B]">
                    <span className="text-slate-400 text-[10px] uppercase flex items-center gap-1 mb-1">
                      <Package className="w-3 h-3 text-[#06B6D4]" /> Equipment Required
                    </span>
                    <span className="text-slate-200 text-xs font-inter">{g.equipment_needed}</span>
                  </div>
                  <div className="bg-[#070B14] p-2.5 rounded-xl border border-[#1E293B]">
                    <span className="text-slate-400 text-[10px] uppercase flex items-center gap-1 mb-1">
                      <Activity className="w-3 h-3 text-[#10B981]" /> Nominal Normal Range
                    </span>
                    <span className="text-[#10B981] font-semibold text-xs">{g.normal_range_label}</span>
                  </div>
                </div>

                {/* Why It Matters */}
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 my-3">
                  <div className="text-[10px] uppercase font-mono font-bold text-[#06B6D4] flex items-center gap-1 mb-1">
                    <HelpCircle className="w-3 h-3" /> Why It Matters in Spaceflight
                  </div>
                  <p className="text-xs text-slate-300 font-inter leading-relaxed m-0">
                    {g.why_it_matters}
                  </p>
                </div>

                {/* Gravity Adjustment Alert */}
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 my-3">
                  <div className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1 mb-1">
                    ⚡ Microgravity & Lunar Gravity Adjustment
                  </div>
                  <p className="text-xs text-amber-200/90 font-inter leading-relaxed m-0">
                    {g.gravity_adjustment_note}
                  </p>
                </div>

                {/* Step-by-Step Procedure Checklist */}
                <div className="mt-3">
                  <div className="text-xs uppercase font-mono font-bold text-slate-300 mb-2">
                    Step-by-Step Procedure Checklist
                  </div>
                  <ol className="space-y-1.5 list-none p-0 m-0 text-xs font-inter text-slate-300">
                    {g.steps.map((st, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2 bg-[#070B14] p-2 rounded-lg border border-[#1E293B]">
                        <span className="w-4 h-4 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="leading-snug">{st}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Extra Interactive Tool: Amsler Grid Modal Launcher if SANS check */}
              {isAmsler && (
                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Optic Disc & Metamorphopsia Check:
                  </span>
                  <button
                    onClick={() => setActiveAmslerModal(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#06B6D4]/15 hover:bg-[#06B6D4]/25 text-[#06B6D4] border border-[#06B6D4]/40 flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch Digital Amsler Grid</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Digital Amsler Grid Modal */}
      {activeAmslerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#06B6D4]" />
                <h3 className="text-base font-bold font-sora text-white m-0">
                  Digital Amsler Grid Self-Test (SANS)
                </h3>
              </div>
              <button
                onClick={() => setActiveAmslerModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono p-1 rounded-md bg-slate-800"
              >
                ✕ CLOSE
              </button>
            </div>

            <p className="text-xs text-slate-300 font-inter leading-relaxed">
              Cover one eye. Focus directly on the central cyan dot from 35cm away. Are any grid lines wavy, distorted, or missing (metamorphopsia)?
            </p>

            {/* Custom Interactive SVG Amsler Grid */}
            <div className="flex items-center justify-center bg-black p-4 rounded-xl border border-slate-700">
              <svg viewBox="0 0 200 200" className="w-64 h-64">
                {/* Background */}
                <rect width="200" height="200" fill="#000000" />
                {/* Grid Lines */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                    <line x1="0" y1={i * 20} x2="200" y2={i * 20} stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                  </React.Fragment>
                ))}
                {/* Center Fixation Point */}
                <circle cx="100" cy="100" r="5" fill="#06B6D4" />
              </svg>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> All lines appear straight & sharp
              </span>
              <button
                onClick={() => {
                  setActiveAmslerModal(false);
                  toggleComplete('neuro-sans-04');
                }}
                className="px-4 py-2 rounded-xl bg-[#06B6D4] text-[#070B14] font-bold font-mono text-xs shadow-lg shadow-[#06B6D4]/30"
              >
                LOG NOMINAL SANS (+1)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
