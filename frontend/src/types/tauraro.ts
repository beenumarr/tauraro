/**
 * TAURARO: Universal Space Exploration Health Monitoring & Autonomous Triage Platform
 * TypeScript models matching NASA HRP Standard Measures and backend Pydantic models.
 */

export type HabitatType =
  | 'ORBITAL_STATION'     // 0.00g, 0.4s latency (Low Earth Orbit / ISS)
  | 'LUNAR_SURFACE'       // 0.16g, 2.6s latency (Artemis Base Camp)
  | 'DEEP_SPACE_TRANSIT'  // 0.00g, 18m 20s one-way blackout (Mars Transit)
  | 'EARTH_ANALOG_CLINIC';// 1.00g, rural telemedicine offline edge

export type ScenarioType =
  | 'NOMINAL'
  | 'DEHYDRATION_RENAL_DRIFT'
  | 'LUNAR_DUST_HYPOXIA'
  | 'CODE_RED_COLLAPSE';

export type OrganSystemId =
  | 'neuro'
  | 'cardio'
  | 'renal'
  | 'musculo'
  | 'immune';

export type SyncMode =
  | 'REALTIME_SYNCED'
  | 'NEAR_REALTIME_BUFFER'
  | 'STORE_AND_FORWARD_OFFLINE';

export type SeverityLevel =
  | 'NOMINAL'
  | 'CAUTION'
  | 'EMERGENCY';

export type OrganStatus =
  | 'NOMINAL'
  | 'CAUTION'
  | 'CRITICAL';

export interface HabitatProfile {
  habitat_id: HabitatType;
  name: string;
  gravity_g: number;
  latency_label: string;
  sync_mode: SyncMode;
  environment_hazards: string[];
  cpr_restraint_method: string;
  radiation_limit_msv: number;
}

export interface PersonalBaseline {
  crew_id: string;
  crew_name: string;
  mission_day: number;
  hr_mean: number;
  hr_std: number;
  systolic_mean: number;
  diastolic_mean: number;
  spo2_mean: number;
  water_target_ml: number;
  kcal_target: number;
  vit_d_target_iu: number;
  ared_target_mins: number;
}

export interface TelemetryPayload {
  habitat: HabitatType;
  scenario: ScenarioType;
  heart_rate_bpm: number;
  hrv_ms: number;
  systolic_bp: number;
  diastolic_bp: number;
  spo2_pct: number;
  skin_temp_c: number;
  radiation_msv: number;
  cabin_co2_mmhg: number;
  water_intake_ml: number;
  calories_kcal: number;
  calcium_mg: number;
  vit_d_iu: number;
  urine_specific_gravity: number;
  sleep_hrs: number;
  ared_exercise_mins: number;
  mood_score: number;
}

export interface OrganStatusDetail {
  organ_id: OrganSystemId;
  name: string;
  status: OrganStatus;
  z_score_summary: string;
  why_it_matters_in_space: string;
  plain_language_assessment: string;
  recommended_actions: string[];
}

export interface MeasurementGuide {
  id: string;
  title: string;
  target_organ: OrganSystemId;
  frequency: string;
  equipment_needed: string;
  why_it_matters: string;
  gravity_adjustment_note: string;
  steps: string[];
  normal_range_label: string;
}

export interface EvaluationResponse {
  severity: SeverityLevel;
  readiness_score: number;
  hr_z_score: number;
  bp_z_score: number;
  renal_stone_risk_index: number;
  habitat_profile: HabitatProfile;
  organs: OrganStatusDetail[] | Record<string, OrganStatusDetail>;
  deterministic_trigger_summary: string;
  crew_action_checklist: string[];
  sbar_ground_packet: string;
  store_and_forward_queue_count: number;
}

