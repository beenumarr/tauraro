import React, { useState } from 'react';
import {
  ArrowRight,
  Bone,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Flame,
  Info,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  type EvaluationResponse,
  type PersonalBaseline,
  type TelemetryPayload,
} from '../types/tauraro.ts';
import { evaluateCustomTelemetry } from '../api/client.ts';

interface NutritionRenalPanelProps {
  payload: TelemetryPayload;
  baseline: PersonalBaseline;
  evaluation: EvaluationResponse;
  onUpdateTelemetry: (updated: TelemetryPayload, evalRes: EvaluationResponse) => void;
}

export const NutritionRenalPanel: React.FC<NutritionRenalPanelProps> = ({
  payload,
  baseline,
  evaluation,
  onUpdateTelemetry,
}) => {
  // Local state for interactive sliders
  const [waterMl, setWaterMl] = useState<number>(payload.water_intake_ml);
  const [usg, setUsg] = useState<number>(payload.urine_specific_gravity);
  const [aredMins, setAredMins] = useState<number>(payload.ared_exercise_mins);
  const [kcal, setKcal] = useState<number>(payload.calories_kcal);
  const [calciumMg, setCalciumMg] = useState<number>(payload.calcium_mg);
  const [vitD, setVitD] = useState<number>(payload.vit_d_iu);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Trigger real-time calculation
  const triggerRecalculation = async (
    newWater: number,
    newUsg: number,
    newAred: number,
    newKcal: number,
    newCal: number,
    newVitD: number
  ) => {
    setIsEvaluating(true);
    const updatedPayload: TelemetryPayload = {
      ...payload,
      water_intake_ml: newWater,
      urine_specific_gravity: newUsg,
      ared_exercise_mins: newAred,
      calories_kcal: newKcal,
      calcium_mg: newCal,
      vit_d_iu: newVitD,
    };

    try {
      const newEvaluation = await evaluateCustomTelemetry(updatedPayload);
      onUpdateTelemetry(updatedPayload, newEvaluation);
    } catch (err) {
      console.error('Error evaluating custom telemetry:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleWaterChange = (val: number) => {
    setWaterMl(val);
    triggerRecalculation(val, usg, aredMins, kcal, calciumMg, vitD);
  };

  const handleUsgChange = (val: number) => {
    setUsg(val);
    triggerRecalculation(waterMl, val, aredMins, kcal, calciumMg, vitD);
  };

  const handleAredChange = (val: number) => {
    setAredMins(val);
    triggerRecalculation(waterMl, usg, val, kcal, calciumMg, vitD);
  };

  const handleKcalChange = (val: number) => {
    setKcal(val);
    triggerRecalculation(waterMl, usg, aredMins, val, calciumMg, vitD);
  };

  const handleCalciumChange = (val: number) => {
    setCalciumMg(val);
    triggerRecalculation(waterMl, usg, aredMins, kcal, val, vitD);
  };

  const handleVitDChange = (val: number) => {
    setVitD(val);
    triggerRecalculation(waterMl, usg, aredMins, kcal, calciumMg, val);
  };

  const stoneRisk = evaluation.renal_stone_risk_index;

  const getRiskColor = (score: number) => {
    if (score >= 70) return '#EF4444';
    if (score >= 35) return '#F59E0B';
    return '#10B981';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'CRITICAL STONE FORMATION RISK';
    if (score >= 35) return 'ELEVATED CRYSTALLIZATION RISK';
    return 'SAFE URINARY SOLUTE MARGIN';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Scientific Aerospace Mechanism */}
      <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
              AEROSPACE PHYSIOLOGY & NUTRITION ENGINE
            </span>
            <h2 className="text-xl font-bold font-sora text-white mt-1.5 m-0">
              Microgravity Bone Resorption & Compounding Kidney Stone Risk
            </h2>
            <p className="text-xs text-slate-300 font-inter mt-1 leading-relaxed">
              In space, unloaded bones dump ~250mg of excess calcium per day into the bloodstream. When dehydration occurs
              or ARED resistive workouts are skipped, urine becomes supersaturated with calcium oxalate crystals, triggering
              acute mission-ending nephrolithiasis. Drag the sliders below to see the risk index recalculate live!
            </p>
          </div>

          {/* Large Live Risk Gauge Callout */}
          <div
            className="p-5 rounded-2xl border text-right min-w-[240px] shadow-2xl relative"
            style={{
              backgroundColor: `${getRiskColor(stoneRisk)}15`,
              borderColor: `${getRiskColor(stoneRisk)}40`,
            }}
          >
            <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Nephrolithiasis Risk Index
            </div>
            <div
              className="text-4xl font-extrabold font-mono tracking-tight my-1"
              style={{ color: getRiskColor(stoneRisk) }}
            >
              {stoneRisk.toFixed(1)}
              <span className="text-sm text-slate-400 font-normal"> / 100</span>
            </div>
            <div
              className="text-xs font-mono font-bold uppercase tracking-wide"
              style={{ color: getRiskColor(stoneRisk) }}
            >
              {getRiskLabel(stoneRisk)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Controls & Biological Cascade */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 4 Interactive Sliders (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-[#1E293B] rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <h3 className="text-sm font-bold font-sora text-white flex items-center gap-2 m-0">
              <Droplets className="w-4 h-4 text-[#06B6D4]" />
              Interactive Nutrition, Hydration & Resistive Sliders
            </h3>
            {isEvaluating && (
              <span className="text-[11px] font-mono text-[#06B6D4] animate-pulse">
                Evaluating Z-Scores...
              </span>
            )}
          </div>

          {/* Slider 1: Daily Water Intake */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#06B6D4]" /> Daily Hydration Volume
              </span>
              <span className="text-[#06B6D4] font-bold text-sm">
                {waterMl} mL <span className="text-slate-400 text-xs">/ {baseline.water_target_ml} mL target</span>
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="3500"
              step="50"
              value={waterMl}
              onChange={(e) => handleWaterChange(Number(e.target.value))}
              aria-label="Daily Hydration Volume (mL)"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#06B6D4]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>800 mL (Severe Deficit)</span>
              <span>2500 mL (NASA Target)</span>
              <span>3500 mL (Hydrated)</span>
            </div>
          </div>

          {/* Slider 2: Urine Specific Gravity (USG) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> Urine Specific Gravity (USG Refractometry)
              </span>
              <span className={`font-bold text-sm ${usg >= 1.025 ? 'text-[#EF4444]' : usg >= 1.020 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                {usg.toFixed(3)} <span className="text-slate-400 text-xs">(Normal: 1.010 - 1.018)</span>
              </span>
            </div>
            <input
              type="range"
              min="1.008"
              max="1.032"
              step="0.001"
              value={usg}
              onChange={(e) => handleUsgChange(Number(e.target.value))}
              aria-label="Urine Specific Gravity"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1.008 (Dilute)</span>
              <span>1.018 (Warning Threshold)</span>
              <span>1.032 (Crystallization)</span>
            </div>
          </div>

          {/* Slider 3: ARED Resistive Exercise */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-[#10B981]" /> ARED High-Load Resistive Exercise
              </span>
              <span className="text-[#10B981] font-bold text-sm">
                {aredMins} mins <span className="text-slate-400 text-xs">/ {baseline.ared_target_mins} min target</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={aredMins}
              onChange={(e) => handleAredChange(Number(e.target.value))}
              aria-label="ARED Resistive Exercise Duration (minutes)"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0m (Bone Calcium Dumps!)</span>
              <span>30m (Partial)</span>
              <span>60m (NASA Target)</span>
              <span>90m</span>
            </div>
          </div>

          {/* Slider 4: Daily Caloric Intake */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Daily Caloric Intake
              </span>
              <span className="text-amber-400 font-bold text-sm">
                {kcal} kcal <span className="text-slate-400 text-xs">/ {baseline.kcal_target} kcal</span>
              </span>
            </div>
            <input
              type="range"
              min="1400"
              max="3500"
              step="50"
              value={kcal}
              onChange={(e) => handleKcalChange(Number(e.target.value))}
              aria-label="Daily Caloric Intake (kcal)"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1400 kcal (Deficit)</span>
              <span>2850 kcal (Target)</span>
              <span>3500 kcal</span>
            </div>
          </div>

          {/* Slider 5 & 6: Calcium & Vitamin D */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E293B]">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-200 flex items-center gap-1">
                  <Bone className="w-3.5 h-3.5 text-slate-400" /> Dietary Calcium
                </span>
                <span className="text-white font-bold">{calciumMg} mg</span>
              </div>
              <input
                type="range"
                min="500"
                max="2000"
                step="50"
                value={calciumMg}
                onChange={(e) => handleCalciumChange(Number(e.target.value))}
                aria-label="Dietary Calcium (mg)"
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#06B6D4]"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>500mg</span>
                <span>1000mg</span>
                <span>2000mg</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Vitamin D Supplement
                </span>
                <span className="text-white font-bold">{vitD} IU</span>
              </div>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={vitD}
                onChange={(e) => handleVitDChange(Number(e.target.value))}
                aria-label="Vitamin D Supplement (IU)"
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>200 IU</span>
                <span>800 IU</span>
                <span>2000 IU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Biological Cascade Infographic & Quick Action Protocol (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold font-mono uppercase text-[#06B6D4] flex items-center gap-1.5 mb-3 pb-2 border-b border-[#1E293B]">
              <Info className="w-4 h-4" /> Spaceflight Cascade Mechanism
            </h3>

            {/* Cascade Flow Steps */}
            <div className="space-y-3">
              <div className="bg-[#070B14] p-3 rounded-xl border border-[#1E293B]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                  <Bone className="w-4 h-4 text-[#F59E0B]" />
                  <span>1. Skeletal Calcium Resorption</span>
                </div>
                <p className="text-[11px] text-slate-400 font-inter mt-1 leading-snug">
                  Zero axial mechanical loading accelerates osteoclasts. Trabecular bone loses 1% mass per month, releasing calcium ions directly into serum.
                </p>
              </div>

              <div className="flex justify-center text-slate-500">
                <ArrowRight className="w-4 h-4 transform rotate-90" />
              </div>

              <div className="bg-[#070B14] p-3 rounded-xl border border-[#1E293B]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                  <Droplets className="w-4 h-4 text-[#06B6D4]" />
                  <span>2. Hydration & Renal Filtration</span>
                </div>
                <p className="text-[11px] text-slate-400 font-inter mt-1 leading-snug">
                  If water intake falls below 2,500 mL or USG &gt; 1.020, urine volume shrinks. Calcium oxalate and phosphate seed crystal nuclei.
                </p>
              </div>

              <div className="flex justify-center text-slate-500">
                <ArrowRight className="w-4 h-4 transform rotate-90" />
              </div>

              <div className="bg-[#070B14] p-3 rounded-xl border border-[#1E293B]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EF4444]">
                  <ShieldAlert className="w-4 h-4" />
                  <span>3. Acute Nephrolithiasis (Stone)</span>
                </div>
                <p className="text-[11px] text-slate-400 font-inter mt-1 leading-snug">
                  Calculi obstruct ureters, triggering severe renal colic, nausea, and hematuria—an emergency that cannot be surgically treated in deep space.
                </p>
              </div>
            </div>

            {/* Countermeasure Prescriptions */}
            <div className="mt-4 pt-3 border-t border-[#1E293B]">
              <span className="text-[11px] font-mono font-bold uppercase text-[#10B981] flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Required Countermeasures
              </span>
              <ul className="space-y-1.5 text-xs font-inter text-slate-300 list-none p-0 m-0">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Maintain 2,500 mL water + 1 Potassium Citrate pack
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Complete 60 min high-load ARED squat / heel-raise
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Check morning refractometer USG target &le; 1.018
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
