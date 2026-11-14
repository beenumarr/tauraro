/**
 * TAURARO API Client
 * Connects to the FastAPI backend with seamless offline fallback resilience.
 */

import {
  type BootstrapResponse,
  type EvaluationResponse,
  type HabitatProfile,
  type HabitatType,
  type MeasurementGuide,
  type PersonalBaseline,
  type ScenarioResponse,
  type ScenarioType,
  type TelemetryPayload,
} from '../types/tauraro.ts';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Default baseline fallback
const DEFAULT_BASELINE: PersonalBaseline = {
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
};

export const FALLBACK_HABITATS: Record<HabitatType, HabitatProfile> = {
  ORBITAL_STATION: {
    habitat_id: 'ORBITAL_STATION',
    name: 'Low Earth Orbit Station (ISS / Commercial LEO)',
    gravity_g: 0.0,
    latency_label: '0.4s (Real-Time Synchronized)',
    sync_mode: 'REALTIME_SYNCED',
    environment_hazards: [
      'Microgravity cephalad fluid redistribution (puffy face syndrome)',
      'Progressive trabecular bone calcium loss (~1-1.5% per month)',
      'Postural muscle sarcomere atrophy without high-load resistive exercise',
      'Continuous Low Earth Orbit cosmic ionizing radiation',
    ],
    cpr_restraint_method:
      'Crew Medical Restraint System (CMRS) with torso harness, or reverse handstand technique against opposite bulkhead to deliver 50-60mm compression depth.',
    radiation_limit_msv: 50.0,
  },
  LUNAR_SURFACE: {
    habitat_id: 'LUNAR_SURFACE',
    name: 'Artemis Base Camp (Lunar South Pole Shackleton Rim)',
    gravity_g: 0.16,
    latency_label: '2.6s (Near Real-Time Buffer)',
    sync_mode: 'NEAR_REALTIME_BUFFER',
    environment_hazards: [
      'Sub-micron jagged, highly abrasive lunar regolith dust airlock infiltration',
      '1/6th gravity neuromuscular gait adaptation and increased fall hazard',
      'Solar Particle Events (SPE) requiring solar storm storm-shelter retreat',
    ],
    cpr_restraint_method:
      'Torso-brace straddle technique with knee-wedge retaining straps under floor tie-downs to counteract 0.16g upward recoil.',
    radiation_limit_msv: 65.0,
  },
  DEEP_SPACE_TRANSIT: {
    habitat_id: 'DEEP_SPACE_TRANSIT',
    name: 'Deep-Space Mars Transit Vehicle (Heliocentric Cruise)',
    gravity_g: 0.0,
    latency_label: '18m 20s (Mars-Earth Blackout)',
    sync_mode: 'STORE_AND_FORWARD_OFFLINE',
    environment_hazards: [
      'Unshielded Galactic Cosmic Rays (HZE nuclei)',
      'Severe communication blackout (up to 24-minute roundtrip light delay)',
      'Absolute zero medical evacuation capability to Earth emergency rooms',
      'Prolonged sensory isolation and confinement',
    ],
    cpr_restraint_method:
      'Bulkhead-tethered rigid compression bracket: Rescuer locks pelvic harness onto workstation hardpoint directly above patient.',
    radiation_limit_msv: 100.0,
  },
  EARTH_ANALOG_CLINIC: {
    habitat_id: 'EARTH_ANALOG_CLINIC',
    name: 'Extreme Terrestrial Analog / Low-Resource Rural Telemedicine',
    gravity_g: 1.0,
    latency_label: 'Offline Edge / Telehealth',
    sync_mode: 'STORE_AND_FORWARD_OFFLINE',
    environment_hazards: [
      'Geographical isolation and severe transport weather barriers',
      'Intermittent low-bandwidth satellite/cellular uplink',
      'Absence of on-site physician or intensive care imaging',
    ],
    cpr_restraint_method:
      'Standard AHA/ERC BLS: Supine on rigid backboard or firm floor, 100-120 bpm at 5-6 cm depth with full chest recoil.',
    radiation_limit_msv: 20.0,
  },
};

export const FALLBACK_GUIDES: MeasurementGuide[] = [
  {
    id: 'bp-brachial-01',
    title: 'Brachial Blood Pressure & Orthostatic Pulse Check',
    target_organ: 'cardio',
    frequency: 'Twice Daily (Wake + 30m, and Pre-Sleep)',
    equipment_needed: 'Space-Certified Pneumatic Arm Cuff with Bluetooth Telemetry Link',
    why_it_matters:
      'In microgravity, ~2 liters of blood and interstitial fluid shift headward (cephalad fluid shift). Because there is no hydrostatic pressure column, systemic vascular resistance decreases and left ventricular workload drops.',
    gravity_adjustment_note:
      'In 0g and 0.16g, anchor the astronaut to the wall restraint rail using thigh straps. Keep cuff strictly level with the heart.',
    steps: [
      'Attach thigh restraint strap to bulkhead foot loop to prevent floating.',
      'Slide cuff onto bare upper arm, 2 cm above antecubital fossa.',
      'Fasten cuff snug and verify wireless telemetry sync.',
      'Rest arm across mid-sternum at heart level and initiate 90s cycle.',
    ],
    normal_range_label: '110-125 / 70-80 mmHg (Pulse: 60-80 bpm)',
  },
  {
    id: 'usg-refractometer-02',
    title: 'Hydration & Colorimetric Urine Specific Gravity (USG) Assay',
    target_organ: 'renal',
    frequency: 'Morning First-Void & Post-ARED Exercise Session',
    equipment_needed: 'Handheld Digital Clinical Refractometer & Multi-Reagent Dry Chem Strip',
    why_it_matters:
      'Spaceflight deconditions thirst receptors while microgravity accelerates skeletal osteoclast calcium resorption, compounding kidney stone crystallization.',
    gravity_adjustment_note:
      'Fluids form floating spherical droplets in microgravity. All sample collection must utilize the Waste Collection System (WCS) syringe adapter.',
    steps: [
      'Mount sterile single-use syringe onto WCS port septum.',
      'Aspirate exactly 1.0 mL void sample into syringe without bubbles.',
      'Dispense 2 drops onto refractometer prism well and depress READ.',
      'Record reading and dispose syringe into biohazard canister.',
    ],
    normal_range_label: '1.010 - 1.018 USG (Urine pH: 6.0 - 7.0)',
  },
];

export async function fetchBootstrap(): Promise<BootstrapResponse> {
  try {
    const res = await fetch(`${API_BASE}/bootstrap`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    console.warn('Backend unavailable, using client-side bootstrap fallback');
  }

  // Pure client fallback
  const initialTelemetry: TelemetryPayload = {
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
  };

  const initialEvaluation = clientEvaluate(initialTelemetry, DEFAULT_BASELINE);

  return {
    baseline: DEFAULT_BASELINE,
    habitats: FALLBACK_HABITATS,
    measurement_guides: FALLBACK_GUIDES,
    initial_telemetry: initialTelemetry,
    initial_evaluation: initialEvaluation,
    history: [
      { time_label: 'T-11h', heart_rate_bpm: 67, systolic_bp: 114, diastolic_bp: 73, spo2_pct: 98.5, water_intake_ml: 200, urine_specific_gravity: 1.013 },
      { time_label: 'T-8h', heart_rate_bpm: 82, systolic_bp: 122, diastolic_bp: 78, spo2_pct: 98.4, water_intake_ml: 950, urine_specific_gravity: 1.015 },
      { time_label: 'T-4h', heart_rate_bpm: 67, systolic_bp: 113, diastolic_bp: 72, spo2_pct: 98.5, water_intake_ml: 1900, urine_specific_gravity: 1.014 },
      { time_label: 'T-0h', heart_rate_bpm: 68, systolic_bp: 115, diastolic_bp: 74, spo2_pct: 98.4, water_intake_ml: 2450, urine_specific_gravity: 1.014 },
    ],
  };
}

export async function fetchScenario(
  habitat: HabitatType,
  scenario: ScenarioType
): Promise<ScenarioResponse> {
  try {
    const res = await fetch(`${API_BASE}/scenario/${habitat}/${scenario}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    console.warn(`Backend unavailable for scenario ${scenario}, using local fallback evaluation`);
  }

  // Local fallback preset mapping
  let baseHR = 68;
  let baseSys = 115;
  let baseDia = 74;
  let baseSpO2 = 98.4;
  let baseWater = 2450;
  let baseUSG = 1.014;
  let baseARED = 60;
  let baseCO2 = 3.1;
  let mood = 5;

  if (scenario === 'DEHYDRATION_RENAL_DRIFT') {
    baseHR = 96;
    baseSys = 104;
    baseDia = 68;
    baseSpO2 = 97.2;
    baseWater = 1200;
    baseUSG = 1.027;
    baseARED = 25;
    baseCO2 = 3.4;
    mood = 3;
  } else if (scenario === 'LUNAR_DUST_HYPOXIA') {
    baseHR = 112;
    baseSys = 128;
    baseDia = 84;
    baseSpO2 = 91.5;
    baseWater = 2100;
    baseUSG = 1.018;
    baseARED = 45;
    baseCO2 = 4.8;
    mood = 2;
  } else if (scenario === 'CODE_RED_COLLAPSE') {
    baseHR = 148;
    baseSys = 84;
    baseDia = 50;
    baseSpO2 = 87.0;
    baseWater = 1100;
    baseUSG = 1.026;
    baseARED = 0;
    baseCO2 = 3.8;
    mood = 1;
  }

  const telemetry: TelemetryPayload = {
    habitat,
    scenario,
    heart_rate_bpm: baseHR,
    hrv_ms: scenario === 'CODE_RED_COLLAPSE' ? 12 : scenario === 'NOMINAL' ? 65 : 34,
    systolic_bp: baseSys,
    diastolic_bp: baseDia,
    spo2_pct: baseSpO2,
    skin_temp_c: scenario === 'CODE_RED_COLLAPSE' ? 35.8 : 36.7,
    radiation_msv: habitat === 'DEEP_SPACE_TRANSIT' ? 0.28 : 0.12,
    cabin_co2_mmhg: baseCO2,
    water_intake_ml: baseWater,
    calories_kcal: 2600,
    calcium_mg: 1050,
    vit_d_iu: 800,
    urine_specific_gravity: baseUSG,
    sleep_hrs: scenario === 'CODE_RED_COLLAPSE' ? 4.2 : 7.2,
    ared_exercise_mins: baseARED,
    mood_score: mood,
  };

  const evaluation = clientEvaluate(telemetry, DEFAULT_BASELINE);

  return {
    habitat,
    scenario,
    telemetry,
    evaluation,
    history: [
      { time_label: 'T-11h', heart_rate_bpm: 68, systolic_bp: 114, diastolic_bp: 73, spo2_pct: 98.4, water_intake_ml: 200, urine_specific_gravity: 1.014 },
      { time_label: 'T-6h', heart_rate_bpm: Math.round((68 + baseHR) / 2), systolic_bp: Math.round((115 + baseSys) / 2), diastolic_bp: Math.round((74 + baseDia) / 2), spo2_pct: Math.round((98.4 + baseSpO2) / 2), water_intake_ml: Math.round(baseWater * 0.6), urine_specific_gravity: Number(((1.014 + baseUSG) / 2).toFixed(3)) },
      { time_label: 'T-0h', heart_rate_bpm: baseHR, systolic_bp: baseSys, diastolic_bp: baseDia, spo2_pct: baseSpO2, water_intake_ml: baseWater, urine_specific_gravity: baseUSG },
    ],
  };
}

export async function evaluateTelemetry(payload: TelemetryPayload): Promise<EvaluationResponse> {
  try {
    const res = await fetch(`${API_BASE}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    console.warn('Backend unavailable, running client-side deterministic evaluation');
  }

  return clientEvaluate(payload, DEFAULT_BASELINE);
}

export const evaluateCustomTelemetry = evaluateTelemetry;

export async function fetchCopilotInsight(
  telemetry: TelemetryPayload,
  evaluation?: EvaluationResponse
): Promise<{ insight: string; sbar_packet: string }> {
  try {
    const res = await fetch(`${API_BASE}/copilot/insight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telemetry, evaluation }),
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    console.warn('Copilot endpoint offline; synthesizing local clinical insight');
  }

  const evalRes = evaluation || clientEvaluate(telemetry, DEFAULT_BASELINE);
  const insight = `### TAURARO CLINICAL COPILOT // AUTONOMOUS FLIGHT SURGEON
**Operational Status:** ${evalRes.severity === 'EMERGENCY' ? 'CRITICAL EMERGENCY' : evalRes.severity === 'CAUTION' ? 'MODERATE DEVIATION' : 'NOMINAL STABLE'}
**Exploration Environment:** ${evalRes.habitat_profile.name} (Gravity: ${evalRes.habitat_profile.gravity_g}g | Latency: ${evalRes.habitat_profile.latency_label})
**Mission Readiness Score:** ${evalRes.readiness_score}/100 | **Renal Stone Risk:** ${evalRes.renal_stone_risk_index}/100

#### Clinical Assessment
${evalRes.deterministic_trigger_summary}

#### Immediate Action Checklist
${evalRes.crew_action_checklist.map((a, i) => `${i + 1}. ${a}`).join('\n')}

#### Downlink Ground Packet
${evalRes.sbar_ground_packet}
`;

  return { insight, sbar_packet: evalRes.sbar_ground_packet };
}

/**
 * Pure client-side mathematical evaluation matching backend logic
 */
function clientEvaluate(payload: TelemetryPayload, baseline: PersonalBaseline): EvaluationResponse {
  const habitatProfile = FALLBACK_HABITATS[payload.habitat] || FALLBACK_HABITATS.ORBITAL_STATION;
  const hr_z_score = Number(((payload.heart_rate_bpm - baseline.hr_mean) / baseline.hr_std).toFixed(2));
  const bp_z_score = Number(((payload.systolic_bp - baseline.systolic_mean) / 8.0).toFixed(2));

  // Renal stone risk calculation
  const waterRatio = payload.water_intake_ml / baseline.water_target_ml;
  const hydPenalty = Math.max(0, (1.0 - Math.min(1.0, waterRatio)) * 35.0);
  let usgPenalty = 0;
  if (payload.urine_specific_gravity <= 1.018) {
    usgPenalty = Math.max(0, ((payload.urine_specific_gravity - 1.010) / 0.008) * 10.0);
  } else {
    usgPenalty = 10.0 + Math.min(30.0, ((payload.urine_specific_gravity - 1.018) / 0.012) * 30.0);
  }
  const aredRatio = payload.ared_exercise_mins / baseline.ared_target_mins;
  const aredPenalty = Math.max(0, (1.0 - Math.min(1.0, aredRatio)) * 15.0);
  const renalRisk = Number(Math.min(100.0, Math.max(0.0, hydPenalty + usgPenalty + aredPenalty)).toFixed(1));

  // Severity
  const isEmergency =
    payload.scenario === 'CODE_RED_COLLAPSE' ||
    payload.heart_rate_bpm > 135 ||
    payload.systolic_bp < 90 ||
    payload.spo2_pct < 88;
  const isCaution =
    renalRisk >= 35.0 ||
    payload.spo2_pct < 95.0 ||
    Math.abs(hr_z_score) >= 2.0 ||
    payload.urine_specific_gravity >= 1.022;

  const severity = isEmergency ? 'EMERGENCY' : isCaution ? 'CAUTION' : 'NOMINAL';
  const readiness =
    payload.scenario === 'CODE_RED_COLLAPSE'
      ? 12.0
      : Number(Math.max(5.0, Math.min(100.0, 100.0 - Math.min(25, Math.abs(hr_z_score) * 6) - (renalRisk / 100) * 20)).toFixed(1));

  const organs = [
    {
      organ_id: 'cardio' as const,
      name: 'Cardiovascular & Hemodynamics',
      status: (isEmergency ? 'CRITICAL' : Math.abs(hr_z_score) >= 2.0 ? 'CAUTION' : 'NOMINAL') as any,
      z_score_summary: `HR ${payload.heart_rate_bpm} bpm (Z: ${hr_z_score >= 0 ? '+' : ''}${hr_z_score})`,
      why_it_matters_in_space: 'Cephalad fluid shift reduces cardiac workload; zero-g causes vascular deconditioning and orthostatic intolerance.',
      plain_language_assessment: `Heart rate is ${payload.heart_rate_bpm} bpm. BP is ${payload.systolic_bp}/${payload.diastolic_bp} mmHg.`,
      recommended_actions: isEmergency ? [habitatProfile.cpr_restraint_method, 'Attach AED and administer 100% O2'] : ['Continue routine cardiac monitoring'],
    },
    {
      organ_id: 'renal' as const,
      name: 'Renal & Fluid Regulation',
      status: (renalRisk >= 70 ? 'CRITICAL' : renalRisk >= 35 ? 'CAUTION' : 'NOMINAL') as any,
      z_score_summary: `Stone Risk Index: ${renalRisk}/100, USG ${payload.urine_specific_gravity}`,
      why_it_matters_in_space: 'Microgravity unleashes skeletal calcium into blood; dehydration rapidly precipitates calcium oxalate kidney stones.',
      plain_language_assessment: `Hydration is at ${payload.water_intake_ml} mL. Renal stone risk index is ${renalRisk}/100.`,
      recommended_actions: renalRisk >= 35 ? ['Consume 500 mL water immediately with potassium citrate'] : ['Maintain 2.5L daily hydration target'],
    },
    {
      organ_id: 'neuro' as const,
      name: 'Neuro-Ocular & Central Nervous System',
      status: (payload.cabin_co2_mmhg >= 4.5 ? 'CAUTION' : 'NOMINAL') as any,
      z_score_summary: `Cabin CO2: ${payload.cabin_co2_mmhg} mmHg, Sleep: ${payload.sleep_hrs}h`,
      why_it_matters_in_space: 'Elevated ICP and localized CO2 pockets trigger SANS optic disc edema and cognitive fatigue.',
      plain_language_assessment: `Cabin CO2 is ${payload.cabin_co2_mmhg} mmHg. Sleep logged: ${payload.sleep_hrs} hours.`,
      recommended_actions: ['Perform weekly Amsler visual acuity check', 'Increase cabin circulation fans'],
    },
    {
      organ_id: 'musculo' as const,
      name: 'Musculoskeletal & Bone Integrity',
      status: (payload.ared_exercise_mins < 45 ? 'CAUTION' : 'NOMINAL') as any,
      z_score_summary: `ARED Duration: ${payload.ared_exercise_mins}/60 min target`,
      why_it_matters_in_space: 'Without resistive loading, bones lose ~1% mass/month and dump excess calcium into the renal tract.',
      plain_language_assessment: `Completed ${payload.ared_exercise_mins} of 60 mins prescribed high-load resistance.`,
      recommended_actions: ['Ensure 60-min daily ARED high-load squat/deadlift training'],
    },
    {
      organ_id: 'immune' as const,
      name: 'Immune & Hematologic Defense',
      status: (payload.spo2_pct < 92 ? 'CRITICAL' : payload.spo2_pct < 95 ? 'CAUTION' : 'NOMINAL') as any,
      z_score_summary: `SpO2 ${payload.spo2_pct}%, Temp ${payload.skin_temp_c}°C`,
      why_it_matters_in_space: 'Radiation and confinement suppress immune cells; planetary regolith dust inflames upper airways.',
      plain_language_assessment: `Peripheral SpO2 is ${payload.spo2_pct}%. Skin temperature is ${payload.skin_temp_c}°C.`,
      recommended_actions: ['Check airlock dust filter seals and maintain dosimeter tracking'],
    },
  ];

  return {
    severity,
    readiness_score: readiness,
    hr_z_score,
    bp_z_score,
    renal_stone_risk_index: renalRisk,
    habitat_profile: habitatProfile,
    organs,
    deterministic_trigger_summary: isEmergency
      ? 'CRITICAL: Severe hemodynamic collapse / hypoxemia'
      : isCaution
        ? 'CAUTION: Dehydration and elevated nephrolithiasis risk index'
        : 'NOMINAL: All parameters within standard deviation margins',
    crew_action_checklist: isEmergency
      ? [habitatProfile.cpr_restraint_method, 'Attach AED and administer 100% O2', 'Transmit emergency SBAR ground packet']
      : isCaution
        ? ['Drink 500 mL water with potassium citrate', 'Rest 15 minutes and repeat blood pressure measurement']
        : ['Continue scheduled mission activities and daily ARED resistive training'],
    sbar_ground_packet: `[SBAR-PACKET] SITUATION: Cmdr. Ameer Umar presenting with Readiness ${readiness}/100. BACKGROUND: ${habitatProfile.name}, Gravity ${habitatProfile.gravity_g}g. ASSESSMENT: HR ${payload.heart_rate_bpm} bpm, BP ${payload.systolic_bp}/${payload.diastolic_bp}, SpO2 ${payload.spo2_pct}%, USG ${payload.urine_specific_gravity}. RECOMMENDATION: Execute immediate checklist actions.`,
    store_and_forward_queue_count: habitatProfile.sync_mode === 'STORE_AND_FORWARD_OFFLINE' ? 3 : 0,
  };
}

