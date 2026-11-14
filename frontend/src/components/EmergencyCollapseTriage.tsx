import React, { useState, useEffect, useRef } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Radio,
  ShieldAlert,
  Send,
} from 'lucide-react';
import {
  type HabitatProfile,
  type PersonalBaseline,
  type TelemetryPayload,
} from '../types/tauraro.ts';

interface EmergencyCollapseTriageProps {
  telemetry: TelemetryPayload;
  baseline: PersonalBaseline;
  habitatProfile: HabitatProfile;
  sbarPacket: string;
  onTransmitSbar?: () => void;
}

export const EmergencyCollapseTriage: React.FC<EmergencyCollapseTriageProps> = ({
  telemetry,
  baseline,
  habitatProfile,
  sbarPacket,
  onTransmitSbar,
}) => {
  // Step completion tracking
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // 110 BPM Web Audio CPR Metronome
  const [metronomeRunning, setMetronomeRunning] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [pulseState, setPulseState] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Elapsed Resuscitation Timer (Starts at 0:50 per Brazilian Space Agency video scenario)
  const [elapsedSec, setElapsedSec] = useState<number>(50);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  // Downlink packet state
  const [beaconTransmitted, setBeaconTransmitted] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // 110 BPM Metronome (~545.45 ms interval)
  useEffect(() => {
    let metronomeTimer: ReturnType<typeof setInterval>;

    if (metronomeRunning) {
      metronomeTimer = setInterval(() => {
        setPulseState((prev) => !prev);

        // Native Web Audio synth beep (880 Hz)
        if (!audioMuted) {
          try {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!audioCtxRef.current) {
              audioCtxRef.current = new AudioContextClass();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') {
              ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // 880 Hz crisp clinical tone

            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.08);
          } catch {
            // Audio policy or headless environment fallback
          }
        }
      }, 545);
    }

    return () => clearInterval(metronomeTimer);
  }, [metronomeRunning, audioMuted]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const handleTransmit = () => {
    setBeaconTransmitted(true);
    if (onTransmitSbar) {
      onTransmitSbar();
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 4-Step Non-Doctor Life-Support Wizard
  const wizardSteps = [
    {
      step: 1,
      timeframe: '0:00 - 0:30',
      title: 'Gravity-Specific Patient Restraint & Positioning',
      subtitle: `${habitatProfile.gravity_g.toFixed(2)}g Field Protocol`,
      instructions: habitatProfile.cpr_restraint_method,
      criticalNote:
        habitatProfile.gravity_g < 0.2
          ? 'CRITICAL ZERO/LOW-G RULE: Rescuer chest compressions will push you upward into the module ceiling unless you are strapped into the Crew Medical Restraint System (CMRS) or brace your feet/knees against opposite bulkheads.'
          : 'Place patient supine on rigid backboard or firm floor to prevent absorption of compression depth.',
    },
    {
      step: 2,
      timeframe: '0:30 - 1:00',
      title: 'Sensor Patch & Airway / 100% O2 Non-Rebreather Mask',
      subtitle: 'Medical Kit Sub-Pack Drawer A-2 (Red Tab)',
      instructions:
        '1. Open Drawer A-2 (Red Tab) from the Emergency Medical Pack.\n2. Apply 12-lead ECG & AED defibrillator pads (Pad 1: upper-right sternal border below clavicle; Pad 2: lower-left mid-axillary line 5th intercostal space).\n3. Don 100% O2 non-rebreather silicone mask connected to Portable Breathing Apparatus (PBA) set strictly to 10 L/min.',
      criticalNote:
        'Wipe patient skin with alcohol pad to clear microgravity floating sweat before pad adhesion to avoid electrical arcing during AED discharge.',
    },
    {
      step: 3,
      timeframe: '1:00 - 2:00',
      title: 'Acute Coronary / Arrhythmia Decision Tree & Compressions',
      subtitle: 'Aspirin / Nitro vs. 110 BPM Shock Protocol',
      instructions:
        'Plain-Language Triage Decision:\n' +
        '• IF CONSCIOUS with crushing retrosternal pain: Administer chewable Aspirin 324 mg (Drawer B-1) immediately. Administer Sublingual Nitroglycerin 0.4 mg ONLY if systolic blood pressure > 90 mmHg (Current BP: ' +
        telemetry.systolic_bp.toFixed(0) +
        '/' +
        telemetry.diastolic_bp.toFixed(0) +
        ' mmHg).\n' +
        '• IF UNRESPONSIVE / PULSELESS: Turn on AED. Press "ANALYZE". If shock advised, clear all crew and depress SHOCK button. Immediately start 110 BPM chest compressions.',
      criticalNote:
        telemetry.systolic_bp < 90
          ? 'WARNING: Current systolic BP (' +
            telemetry.systolic_bp.toFixed(0) +
            ' mmHg) is BELOW 90 mmHg. DO NOT administer Nitroglycerin—risk of profound hypovolemic shock!'
          : 'Monitor blood pressure closely before any vasodilator administration.',
    },
    {
      step: 4,
      timeframe: '2:00+',
      title: 'Autonomous Store-and-Forward Distress Beacon Queued',
      subtitle: 'Spaceflight High-Priority SBAR Telemetry Uplink',
      instructions:
        `Continuous ECG waveform, 87% SpO2 trend, and cabin CO2 logs are packaged into the high-priority SBAR ground packet. Because communication delay is ${habitatProfile.latency_label}, onboard autonomous triage operates independently.`,
      criticalNote:
        habitatProfile.sync_mode === 'STORE_AND_FORWARD_OFFLINE'
          ? 'Mars Transit Blackout: Packet buffered in store-and-forward queue. Ground assistance is 18+ minutes away—autonomous crew CPR is the sole lifeline.'
          : 'Real-time telemetry streaming to Mission Control Flight Surgeon console.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Top Emergency Status Banner */}
      <div className="bg-red-950/20 border-2 border-red-500/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.25)] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-[#EF4444] text-white animate-pulse">
                <AlertOctagon className="w-4 h-4" /> CODE RED EMERGENCY COLLAPSE
              </span>
              <span className="text-xs text-red-300 font-mono font-semibold">
                Brazilian Space Agency 0:50 Acute Chest Pain Scenario
              </span>
            </div>

            <h2 className="text-2xl font-black font-sora text-white m-0 tracking-tight">
              Acute Chest Pain & Unconscious Collapse Protocol
            </h2>

            <p className="text-xs text-red-200/90 font-inter leading-relaxed">
              Crewmate <strong className="text-white font-bold">{baseline.crew_name}</strong> (Flight Day {baseline.mission_day})
              experienced sudden severe chest pain and collapsed halfway through mission cruise.
            </p>

            {/* Acute Patient Biometrics Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs">
              <span className="px-3 py-1 rounded-lg bg-red-950/80 border border-red-700/80 text-white font-bold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#EF4444] animate-ping" />
                HR: {telemetry.heart_rate_bpm.toFixed(0)} bpm Arrhythmia
              </span>
              <span className="px-3 py-1 rounded-lg bg-red-950/80 border border-red-700/80 text-white font-bold">
                BP: {telemetry.systolic_bp.toFixed(0)}/{telemetry.diastolic_bp.toFixed(0)} mmHg Hypotension
              </span>
              <span className="px-3 py-1 rounded-lg bg-red-950/80 border border-red-700/80 text-white font-bold">
                SpO2: {telemetry.spo2_pct.toFixed(1)}% Hypoxia
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
                Gravity: {habitatProfile.gravity_g.toFixed(2)}g ({habitatProfile.name})
              </span>
            </div>
          </div>

          {/* Interactive 110 BPM Web Audio CPR Metronome & Compression Timer */}
          <div className="bg-[#070B14] p-5 rounded-2xl border-2 border-red-600/70 shadow-2xl flex flex-col items-center min-w-[260px]">
            <div className="text-[11px] font-mono font-bold uppercase text-slate-400 mb-2">
              110 BPM CPR Metronome
            </div>

            {/* Pulsing Visual Compression Ring (5 cm depth target) */}
            <div className="relative my-2 flex items-center justify-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-75 border-4 ${
                  metronomeRunning && pulseState
                    ? 'border-[#EF4444] bg-red-600/30 scale-110 shadow-[0_0_25px_#EF4444]'
                    : 'border-slate-700 bg-slate-900 scale-100'
                }`}
              >
                <Heart
                  className={`w-9 h-9 transition-colors ${
                    metronomeRunning && pulseState ? 'text-white' : 'text-slate-500'
                  }`}
                />
              </div>
              <span className="absolute -bottom-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                5 cm depth target
              </span>
            </div>

            {/* Metronome Controls */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setMetronomeRunning(!metronomeRunning)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-extrabold flex items-center gap-1.5 transition-all shadow-lg ${
                  metronomeRunning
                    ? 'bg-[#EF4444] hover:bg-red-600 text-white animate-pulse'
                    : 'bg-[#06B6D4] hover:bg-[#0891B2] text-[#070B14]'
                }`}
              >
                {metronomeRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{metronomeRunning ? 'STOP METRONOME' : 'START 110 BPM METRONOME'}</span>
              </button>

              <button
                onClick={() => setAudioMuted(!audioMuted)}
                title={audioMuted ? 'Unmute 880Hz audio tone' : 'Mute audio beep'}
                className={`p-2 rounded-xl text-xs transition-colors border ${
                  audioMuted
                    ? 'bg-slate-800 text-slate-500 border-slate-700'
                    : 'bg-emerald-500/20 text-[#10B981] border-[#10B981]/40'
                }`}
              >
                {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Resuscitation Elapsed Timer */}
            <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Arrest Elapsed:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-amber-400">
                  {formatTimer(elapsedSec)}
                </span>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setElapsedSec(0)}
                  title="Reset Timer"
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4-Step Interactive Non-Doctor Life-Support Wizard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <h3 className="text-sm font-bold font-sora text-white flex items-center gap-2 m-0">
            <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
            4-Step Non-Doctor Life-Support Wizard (Click checkbox when completed)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {Object.values(completedSteps).filter(Boolean).length} of {wizardSteps.length} Steps Verified
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {wizardSteps.map((ws) => {
            const isCompleted = !!completedSteps[ws.step];

            return (
              <div
                key={ws.step}
                className={`border rounded-2xl p-5 transition-all duration-200 relative overflow-hidden ${
                  isCompleted
                    ? 'bg-[#0B1120]/90 border-[#10B981]/60 shadow-lg shadow-[#10B981]/10'
                    : 'bg-[#0B1120] border-[#1E293B] hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Step Checkbox Button */}
                    <button
                      onClick={() => toggleStep(ws.step)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-[#10B981] text-[#070B14] shadow-md shadow-[#10B981]/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : ws.step}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                          {ws.timeframe}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {ws.subtitle}
                        </span>
                        <h4 className="text-sm font-bold text-white font-sora m-0">
                          {ws.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-200 font-inter leading-relaxed whitespace-pre-line m-0 pt-1">
                        {ws.instructions}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStep(ws.step)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isCompleted ? 'VERIFIED' : 'CONFIRM STEP'}
                  </button>
                </div>

                {/* Critical Safety Warning Callout */}
                <div className="mt-3 bg-red-950/40 border border-red-900/60 rounded-xl p-3 text-xs font-inter text-red-200/90 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                  <span className="leading-snug">{ws.criticalNote}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Downlink SBAR Beacon Queuing Box */}
      <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1E293B]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
            <Radio className="w-4 h-4 text-[#06B6D4]" /> Autonomous Distress Beacon (SBAR Uplink)
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Comm Latency: {habitatProfile.latency_label}
          </span>
        </div>

        <pre className="bg-[#070B14] p-3.5 rounded-xl border border-[#1E293B] text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
          {sbarPacket}
        </pre>

        <button
          onClick={handleTransmit}
          className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
            beaconTransmitted
              ? 'bg-[#10B981] text-[#070B14] shadow-[#10B981]/30'
              : 'bg-[#06B6D4] hover:bg-[#0891B2] text-[#070B14] shadow-[#06B6D4]/30'
          }`}
        >
          {beaconTransmitted ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>BEACON TRANSMITTED & BUFFERED IN DOWNLINK QUEUE</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>QUEUE / TRANSMIT SBAR BEACON TO FLIGHT SURGEONS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
