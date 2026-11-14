import React from 'react';
import {
  AlertOctagon,
  ChevronDown,
  Globe,
  Radio,
  Rocket,
  Shield,
  Activity,
} from 'lucide-react';
import {
  type HabitatType,
  type ScenarioType,
  type SeverityLevel,
} from '../types/tauraro.ts';

interface HeaderCommandBarProps {
  currentHabitat: HabitatType;
  currentScenario: ScenarioType;
  severity: SeverityLevel;
  readinessScore: number;
  activeTab: string;
  onSelectHabitat: (h: HabitatType) => void;
  onSelectScenario: (s: ScenarioType) => void;
  onSelectTab: (tab: string) => void;
  onTriggerCodeRed: () => void;
}

export const HeaderCommandBar: React.FC<HeaderCommandBarProps> = ({
  currentHabitat,
  currentScenario,
  severity,
  readinessScore,
  activeTab,
  onSelectHabitat,
  onSelectScenario,
  onSelectTab,
  onTriggerCodeRed,
}) => {
  const habitats: { id: HabitatType; label: string; desc: string; icon: string; g: string }[] = [
    { id: 'ORBITAL_STATION', label: 'Orbital Station', desc: 'ISS / Commercial LEO (0.00g, 0.4s sync)', icon: '🛰️', g: '0.00g' },
    { id: 'LUNAR_SURFACE', label: 'Lunar Surface', desc: 'Artemis Base Camp (0.16g, 2.6s buffer)', icon: '🌕', g: '0.16g' },
    { id: 'DEEP_SPACE_TRANSIT', label: 'Deep Space Transit', desc: 'Mars Cruise (0.00g, 18m blackout)', icon: '🚀', g: '0.00g' },
    { id: 'EARTH_ANALOG_CLINIC', label: 'Earth Analog Clinic', desc: 'Rural Telemedicine (1.00g offline edge)', icon: '🏔️', g: '1.00g' },
  ];

  const scenarios: { id: ScenarioType; label: string; tag: string }[] = [
    { id: 'NOMINAL', label: 'Nominal Baseline', tag: 'Safe' },
    { id: 'DEHYDRATION_RENAL_DRIFT', label: 'Renal Drift / Dehydration', tag: 'Drift' },
    { id: 'LUNAR_DUST_HYPOXIA', label: 'Lunar Dust Hypoxia', tag: 'Hypoxia' },
    { id: 'CODE_RED_COLLAPSE', label: 'Code Red Collapse', tag: 'Emergency' },
  ];

  return (
    <header className="border-b border-[#1E293B] bg-[#0B1120] sticky top-0 z-50 px-4 lg:px-6 py-2.5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: TAURARO Star Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#2563EB] flex items-center justify-center shadow-lg shadow-[#06B6D4]/25 border border-[#06B6D4]/40 font-bold text-white text-lg">
            ★
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sora">
                TAURARO
              </span>
              <span className="px-2 py-0.5 text-[9px] uppercase font-mono font-bold tracking-wider rounded bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                NASA HRP + OSDR ALIGNED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-inter">
              Universal Space Exploration Health & Autonomous Triage Platform
            </p>
          </div>
        </div>

        {/* Center: Exploration Habitat Switcher Dropdown / Pills */}
        <div className="flex items-center gap-2 bg-[#070B14] p-1.5 rounded-xl border border-[#1E293B]">
          <span className="text-[11px] font-mono text-slate-400 px-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span className="hidden sm:inline">Habitat:</span>
          </span>
          <div className="relative">
            <select
              value={currentHabitat}
              onChange={(e) => onSelectHabitat(e.target.value as HabitatType)}
              aria-label="Exploration Habitat Selector"
              className="appearance-none bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border border-[#1E293B] focus:outline-none focus:border-[#06B6D4] transition-colors cursor-pointer font-inter"
            >
              {habitats.map((h) => (
                <option key={h.id} value={h.id} className="bg-[#0B1120] text-white py-1">
                  {h.icon} {h.label} [{h.g}]
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right: Live Scenario Simulator Selector & Emergency CODE RED button */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#070B14] px-2 py-1.5 rounded-xl border border-[#1E293B]">
            <Radio className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span className="text-[11px] font-mono text-slate-400 mr-1">Scenario:</span>
            <select
              value={currentScenario}
              onChange={(e) => onSelectScenario(e.target.value as ScenarioType)}
              aria-label="Clinical Telemetry Scenario Simulator"
              className="appearance-none bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold py-1 pl-2.5 pr-7 rounded-md border border-[#1E293B] focus:outline-none focus:border-[#06B6D4] transition-colors cursor-pointer font-inter"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-[#0B1120] text-white py-1">
                  {sc.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-4 pointer-events-none" />
          </div>

          {/* High-Visibility Crimson Button: CODE RED COLLAPSE */}
          <button
            onClick={onTriggerCodeRed}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold font-mono tracking-wide transition-all duration-200 flex items-center gap-2 shadow-lg ${
              currentScenario === 'CODE_RED_COLLAPSE'
                ? 'bg-[#EF4444] text-white ring-2 ring-red-400 ring-offset-2 ring-offset-[#070B14] animate-pulse'
                : 'bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-700/80 hover:text-white'
            }`}
            title="Immediately trigger Brazilian Space Agency 0:50 acute chest pain & collapse protocol"
          >
            <AlertOctagon className="w-4 h-4 text-[#EF4444]" />
            <span>🚨 CODE RED COLLAPSE</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-[#1E293B]/70">
        <nav className="flex items-center gap-1 overflow-x-auto py-0.5">
          {[
            { id: 'twin', label: 'Interactive Body Twin & Telemetry', icon: Activity },
            { id: 'sop', label: 'Guided Self-Measurement ("How to Measure")', icon: Rocket },
            { id: 'nutrition', label: 'Space Nutrition & Renal/Bone Protection', icon: Shield },
            { id: 'cpr', label: '🚨 Emergency Collapse Triage (0g CPR)', icon: AlertOctagon },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                  active
                    ? 'bg-[#06B6D4]/15 text-[#06B6D4] font-semibold border border-[#06B6D4]/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status Strip on Right */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Readiness: <strong className={readinessScore >= 80 ? 'text-[#10B981]' : readinessScore >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}>{readinessScore.toFixed(0)}%</strong>
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${
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
    </header>
  );
};
