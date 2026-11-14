import { useEffect, useState } from 'react';
import {
  type BootstrapResponse,
  type EvaluationResponse,
  type HabitatProfile,
  type HabitatType,
  type MeasurementGuide,
  type PersonalBaseline,
  type ScenarioResponse,
  type ScenarioType,
  type TelemetryHistoryPoint,
  type TelemetryPayload,
} from './types/tauraro.ts';
import {
  FALLBACK_GUIDES,
  FALLBACK_HABITATS,
  fetchBootstrap,
  fetchScenario,
} from './api/client.ts';
import { HeaderCommandBar } from './components/HeaderCommandBar.tsx';
import { HabitatStatusRibbon } from './components/HabitatStatusRibbon.tsx';
import { InteractiveBodyTwin } from './components/InteractiveBodyTwin.tsx';
import { TelemetryCharts } from './components/TelemetryCharts.tsx';
import { GuidedMeasurementView } from './components/GuidedMeasurementView.tsx';
import { NutritionRenalPanel } from './components/NutritionRenalPanel.tsx';
import { EmergencyCollapseTriage } from './components/EmergencyCollapseTriage.tsx';
import { ClinicalCopilotPanel } from './components/ClinicalCopilotPanel.tsx';

export function App() {
  const [currentHabitat, setCurrentHabitat] = useState<HabitatType>('ORBITAL_STATION');
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('NOMINAL');
  const [activeTab, setActiveTab] = useState<string>('twin');
  const [streakCount, setStreakCount] = useState<number>(14);
  const [extraQueueCount, setExtraQueueCount] = useState<number>(0);

  // Core application state
  const [baseline, setBaseline] = useState<PersonalBaseline>({
    crew_id: 'CREW-042',
    crew_name: 'Cmdr. Ameer Umar',
    mission_day: 142,
    hr_mean: 68.0,
    hr_std: 4.2,
    systolic_mean: 115.0,
    diastolic_mean: 74.0,
    spo2_mean: 98.4,
    water_target_ml: 2500,
    kcal_target: 2850,
    vit_d_target_iu: 800,
    ared_target_mins: 60,
  });

  const [habitats, setHabitats] = useState<Record<HabitatType, HabitatProfile>>(FALLBACK_HABITATS);
  const [guides, setGuides] = useState<MeasurementGuide[]>(FALLBACK_GUIDES);
  const [telemetry, setTelemetry] = useState<TelemetryPayload>({
    habitat: 'ORBITAL_STATION',
    scenario: 'NOMINAL',
    heart_rate_bpm: 68.0,
    hrv_ms: 65.0,
    systolic_bp: 115.0,
    diastolic_bp: 74.0,
    spo2_pct: 98.4,
    skin_temp_c: 36.6,
    radiation_msv: 0.12,
    cabin_co2_mmhg: 3.1,
    water_intake_ml: 2450.0,
    calories_kcal: 2780.0,
    calcium_mg: 1050.0,
    vit_d_iu: 800.0,
    urine_specific_gravity: 1.014,
    sleep_hrs: 7.5,
    ared_exercise_mins: 60.0,
    mood_score: 5,
  });

  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [history, setHistory] = useState<TelemetryHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial bootstrap state
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const boot: BootstrapResponse = await fetchBootstrap();
        setBaseline(boot.baseline);
        setHabitats(boot.habitats);
        if (boot.measurement_guides && boot.measurement_guides.length > 0) {
          setGuides(boot.measurement_guides);
        }
        setTelemetry(boot.initial_telemetry);
        setEvaluation(boot.initial_evaluation);
        setHistory(boot.history);
      } catch (err) {
        console.error('Failed to bootstrap TAURARO platform:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Handle switching exploration habitat
  const handleSelectHabitat = async (h: HabitatType) => {
    setCurrentHabitat(h);
    try {
      const resp: ScenarioResponse = await fetchScenario(h, currentScenario);
      setTelemetry(resp.telemetry);
      setEvaluation(resp.evaluation);
      setHistory(resp.history);
    } catch (err) {
      console.error('Error switching habitat:', err);
    }
  };

  // Handle switching scenario preset (auto-switches to CPR tab on CODE_RED_COLLAPSE)
  const handleSelectScenario = async (sc: ScenarioType) => {
    setCurrentScenario(sc);
    if (sc === 'CODE_RED_COLLAPSE') {
      setActiveTab('cpr');
    }
    try {
      const resp: ScenarioResponse = await fetchScenario(currentHabitat, sc);
      setTelemetry(resp.telemetry);
      setEvaluation(resp.evaluation);
      setHistory(resp.history);
    } catch (err) {
      console.error('Error switching scenario:', err);
    }
  };

  // Trigger high-visibility Code Red Collapse
  const handleTriggerCodeRed = async () => {
    setCurrentScenario('CODE_RED_COLLAPSE');
    setActiveTab('cpr');
    try {
      const resp: ScenarioResponse = await fetchScenario(currentHabitat, 'CODE_RED_COLLAPSE');
      setTelemetry(resp.telemetry);
      setEvaluation(resp.evaluation);
      setHistory(resp.history);
    } catch (err) {
      console.error('Error triggering Code Red:', err);
    }
  };

  // Handle live custom slider updates in Nutrition/Renal panel
  const handleUpdateTelemetry = (updatedTelemetry: TelemetryPayload, newEvaluation: EvaluationResponse) => {
    setTelemetry(updatedTelemetry);
    setEvaluation(newEvaluation);
  };

  const handleTransmitPacket = () => {
    setExtraQueueCount((prev) => prev + 1);
  };

  const activeProfile: HabitatProfile = habitats[currentHabitat] || FALLBACK_HABITATS.ORBITAL_STATION;
  const currentSeverity = evaluation?.severity || 'NOMINAL';
  const currentReadiness = evaluation?.readiness_score || 95.0;
  const totalQueueCount = (evaluation?.store_and_forward_queue_count || 0) + extraQueueCount;

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col font-inter selection:bg-[#06B6D4]/30 selection:text-white">
      {/* 1. Header Command Bar */}
      <HeaderCommandBar
        currentHabitat={currentHabitat}
        currentScenario={currentScenario}
        severity={currentSeverity}
        readinessScore={currentReadiness}
        activeTab={activeTab}
        onSelectHabitat={handleSelectHabitat}
        onSelectScenario={handleSelectScenario}
        onSelectTab={setActiveTab}
        onTriggerCodeRed={handleTriggerCodeRed}
      />

      {/* 2. Habitat Status Ribbon */}
      <HabitatStatusRibbon
        baseline={baseline}
        habitatProfile={activeProfile}
        severity={currentSeverity}
        readinessScore={currentReadiness}
        streakCount={streakCount}
        queueCount={totalQueueCount}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#06B6D4] border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-mono text-slate-400">
              Initializing TAURARO Mission Control Telemetry...
            </div>
          </div>
        ) : (
          <>
            {/* Tab 1: Interactive Body Twin & Telemetry */}
            {activeTab === 'twin' && evaluation && (
              <div className="space-y-8">
                <InteractiveBodyTwin organs={evaluation.organs} />
                <TelemetryCharts
                  payload={telemetry}
                  baseline={baseline}
                  history={history}
                  hrZScore={evaluation.hr_z_score}
                  bpZScore={evaluation.bp_z_score}
                />
                <ClinicalCopilotPanel
                  telemetry={telemetry}
                  evaluation={evaluation}
                  onTransmitPacket={handleTransmitPacket}
                />
              </div>
            )}

            {/* Tab 2: Guided Self-Measurement ("How to Measure") */}
            {activeTab === 'sop' && (
              <GuidedMeasurementView
                guides={guides}
                onCompleteMeasurement={() => setStreakCount((prev) => prev + 1)}
              />
            )}

            {/* Tab 3: Space Nutrition, Hydration & Renal/Bone Protection */}
            {activeTab === 'nutrition' && evaluation && (
              <div className="space-y-8">
                <NutritionRenalPanel
                  payload={telemetry}
                  baseline={baseline}
                  evaluation={evaluation}
                  onUpdateTelemetry={handleUpdateTelemetry}
                />
                <ClinicalCopilotPanel
                  telemetry={telemetry}
                  evaluation={evaluation}
                  onTransmitPacket={handleTransmitPacket}
                />
              </div>
            )}

            {/* Tab 4: 🚨 Emergency Collapse Triage (0g CPR) */}
            {activeTab === 'cpr' && (
              <div className="space-y-8">
                <EmergencyCollapseTriage
                  telemetry={telemetry}
                  baseline={baseline}
                  habitatProfile={activeProfile}
                  sbarPacket={evaluation?.sbar_ground_packet || ''}
                  onTransmitSbar={handleTransmitPacket}
                />
                {evaluation && (
                  <ClinicalCopilotPanel
                    telemetry={telemetry}
                    evaluation={evaluation}
                    onTransmitPacket={handleTransmitPacket}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Aerospace Compliance Bar */}
      <footer className="border-t border-[#1E293B] bg-[#0B1120] px-6 py-4 text-xs font-mono text-slate-400 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span>TAURARO // 2026 NASA International Space Apps Challenge</span>
          <span className="text-[#06B6D4]">Aligned with NASA HRP Standard Measures & Open Science Data Repository (OSDR)</span>
          <span>Offline Edge Resilient • Sol 142</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
