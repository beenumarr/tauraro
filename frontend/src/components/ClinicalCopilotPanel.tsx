import React, { useState } from 'react';
import {
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Radio,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  type EvaluationResponse,
  type TelemetryPayload,
} from '../types/tauraro.ts';
import { fetchCopilotInsight } from '../api/client.ts';

interface ClinicalCopilotPanelProps {
  telemetry: TelemetryPayload;
  evaluation: EvaluationResponse;
  onTransmitPacket?: () => void;
}

export const ClinicalCopilotPanel: React.FC<ClinicalCopilotPanelProps> = ({
  telemetry,
  evaluation,
  onTransmitPacket,
}) => {
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedSbar, setCopiedSbar] = useState<boolean>(false);
  const [packetTransmitted, setPacketTransmitted] = useState<boolean>(false);

  // Synthesize copilot insight
  const handleGenerateInsight = async () => {
    setIsLoading(true);
    try {
      const res = await fetchCopilotInsight(telemetry, evaluation);
      setInsight(res.insight);
    } catch (err) {
      console.error('Failed to query copilot insight:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySbar = () => {
    navigator.clipboard.writeText(evaluation.sbar_ground_packet);
    setCopiedSbar(true);
    setTimeout(() => setCopiedSbar(false), 2500);
  };

  const handleTransmit = () => {
    setPacketTransmitted(true);
    if (onTransmitPacket) {
      onTransmitPacket();
    }
    setTimeout(() => setPacketTransmitted(false), 3000);
  };

  const isOfflineMode = evaluation.habitat_profile.sync_mode === 'STORE_AND_FORWARD_OFFLINE';

  return (
    <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Copilot Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#06B6D4]/20 border border-[#06B6D4]/40">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-sora text-white m-0">
                TAURARO 2-Layer Clinical Intelligence Engine
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                isOfflineMode
                  ? 'bg-amber-500/15 text-[#F59E0B] border-[#F59E0B]/30'
                  : 'bg-emerald-500/15 text-[#10B981] border-[#10B981]/30'
              }`}>
                {isOfflineMode ? '100% OFFLINE AUTONOMOUS EDGE' : 'REALTIME SYNCED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-inter mt-0.5">
              Deterministic mathematical triage + non-doctor action protocol + SBAR telemetry encoder
            </p>
          </div>
        </div>

        {/* Synthesize Button */}
        <button
          onClick={handleGenerateInsight}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#0891B2] hover:to-[#1D4ED8] text-[#070B14] hover:text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#06B6D4]/25 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'ANALYZING...' : insight ? 'RE-SYNTHESIZE COPILOT' : 'CONSULT FLIGHT SURGEON'}</span>
        </button>
      </div>

      {/* Layer 1 Badge: Deterministic Mathematical Triggers */}
      <div className="bg-[#070B14] rounded-2xl p-4 border border-[#1E293B] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1E293B]">
          <span className="text-xs font-mono font-bold text-[#06B6D4] flex items-center gap-1.5 uppercase">
            <Cpu className="w-4 h-4" /> Layer 1: Deterministic Math Triggers
          </span>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-400">HR Z-Score:</span>
            <strong className={`font-bold ${Math.abs(evaluation.hr_z_score) >= 2.0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
              {evaluation.hr_z_score >= 0 ? `+${evaluation.hr_z_score.toFixed(2)}` : evaluation.hr_z_score.toFixed(2)}
            </strong>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">BP Z-Score:</span>
            <strong className="text-white font-bold">
              {evaluation.bp_z_score >= 0 ? `+${evaluation.bp_z_score.toFixed(2)}` : evaluation.bp_z_score.toFixed(2)}
            </strong>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Renal Stone Risk:</span>
            <strong className={`font-bold ${evaluation.renal_stone_risk_index >= 35 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
              {evaluation.renal_stone_risk_index.toFixed(1)}/100
            </strong>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-inter leading-relaxed m-0">
          <strong className="text-white">Active Trigger Summary:</strong> {evaluation.deterministic_trigger_summary}
        </p>
      </div>

      {/* Optional Gemini 2.5 Flash / Flight Surgeon Synthesis Box */}
      {insight && (
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-[#06B6D4] flex items-center gap-1.5 uppercase">
              <Bot className="w-4 h-4" /> Flight Surgeon Clinical Differential
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Comm Latency: {evaluation.habitat_profile.latency_label}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-xs font-inter text-slate-200 leading-relaxed whitespace-pre-wrap">
            {insight}
          </div>
        </div>
      )}

      {/* Layer 2: Plain-Language Crew Action Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono uppercase text-[#10B981] flex items-center gap-1.5 m-0">
          <CheckCircle2 className="w-4 h-4" /> Layer 2: Non-Doctor Crew Action Checklist
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {evaluation.crew_action_checklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-[#070B14] p-3 rounded-xl border border-[#1E293B]"
            >
              <span className="w-5 h-5 rounded-md bg-[#10B981]/20 text-[#10B981] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs text-slate-200 font-inter leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 3: Flight Surgeon SBAR Store-and-Forward Packet */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#06B6D4]" />
            <h4 className="text-xs font-bold font-mono uppercase text-white m-0">
              Layer 3: SBAR Store-and-Forward Ground Packet
            </h4>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {evaluation.habitat_profile.sync_mode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySbar}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedSbar ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSbar ? 'COPIED' : 'COPY SBAR'}</span>
            </button>

            <button
              onClick={handleTransmit}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
                packetTransmitted
                  ? 'bg-[#10B981] text-[#070B14]'
                  : 'bg-[#06B6D4] hover:bg-[#0891B2] text-[#070B14]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{packetTransmitted ? 'PACKET QUEUED (+1)' : 'QUEUE / TRANSMIT SBAR PACKET TO MISSION CONTROL'}</span>
            </button>
          </div>
        </div>

        {/* Monospace Terminal-Style Box */}
        <pre className="bg-[#070B14] p-4 rounded-xl border border-[#1E293B] text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-[#06B6D4]/30">
          {evaluation.sbar_ground_packet}
        </pre>
      </div>
    </div>
  );
};
