"""TAURARO: Universal Space Exploration Health Monitoring & Autonomous Triage Platform
Data models aligned with NASA Human Research Program (HRP Standard Measures) and OSDR schemas.
"""

from typing import List, Literal, Optional, Union, Dict
from pydantic import BaseModel, Field, ConfigDict

# Exploration Environments
HabitatType = Literal[
    "ORBITAL_STATION",      # 0.00g, 0.4s latency (Low Earth Orbit / ISS)
    "LUNAR_SURFACE",        # 0.16g, 2.6s latency (Artemis Base Camp)
    "DEEP_SPACE_TRANSIT",   # 0.00g, 18m 20s one-way blackout (Mars Transit)
    "EARTH_ANALOG_CLINIC",  # 1.00g, rural telemedicine offline edge
]

# Clinical & Telemetry Scenarios
ScenarioType = Literal[
    "NOMINAL",
    "DEHYDRATION_RENAL_DRIFT",
    "LUNAR_DUST_HYPOXIA",
    "CODE_RED_COLLAPSE",
]

# NASA HRP Organ Systems for Spaceflight Adaptation
OrganSystemId = Literal[
    "neuro",
    "cardio",
    "renal",
    "musculo",
    "immune",
]

# Sync Modes across Communication Delays
SyncMode = Literal[
    "REALTIME_SYNCED",
    "NEAR_REALTIME_BUFFER",
    "STORE_AND_FORWARD_OFFLINE",
]

# Severity Levels
SeverityLevel = Literal[
    "NOMINAL",
    "CAUTION",
    "EMERGENCY",
]

# Organ System Health Status
OrganStatus = Literal[
    "NOMINAL",
    "CAUTION",
    "CRITICAL",
]


class HabitatProfile(BaseModel):
    """Environmental profile and operational constraints per habitat."""
    model_config = ConfigDict(extra="ignore")

    habitat_id: HabitatType = Field(description="Exploration habitat identifier")
    name: str = Field(description="Human-readable habitat name")
    gravity_g: float = Field(ge=0.0, le=2.0, description="Local gravitational field in g (e.g. 0.00, 0.16, 1.00)")
    latency_label: str = Field(description="Communication latency label (e.g. '0.4s', '2.6s', '18m 20s')")
    sync_mode: SyncMode = Field(description="Data synchronization protocol mode")
    environment_hazards: List[str] = Field(default_factory=list, description="Primary environmental and mission hazards")
    cpr_restraint_method: str = Field(description="Specific chest compression protocol adjusted for local gravitational field")
    radiation_limit_msv: float = Field(description="30-day cumulative career limit threshold in mSv")


class PersonalBaseline(BaseModel):
    """Astronaut pre-mission and personalized rolling physiological baseline."""
    model_config = ConfigDict(extra="ignore")

    crew_id: str = Field(default="CREW-042", description="Astronaut crew identification code")
    crew_name: str = Field(default="Cmdr. Ameer Umar", description="Astronaut name and rank")
    mission_day: int = Field(default=142, ge=1, description="Current mission elapsed day (Sol/Day)")
    hr_mean: float = Field(default=68.0, ge=30.0, le=150.0, description="Baseline resting heart rate (bpm)")
    hr_std: float = Field(default=4.2, ge=0.5, le=30.0, description="Baseline heart rate standard deviation")
    systolic_mean: float = Field(default=115.0, ge=70.0, le=200.0, description="Baseline systolic blood pressure (mmHg)")
    diastolic_mean: float = Field(default=74.0, ge=40.0, le=130.0, description="Baseline diastolic blood pressure (mmHg)")
    spo2_mean: float = Field(default=98.4, ge=80.0, le=100.0, description="Baseline pulse oximetry SpO2 (%)")
    water_target_ml: int = Field(default=2500, ge=1000, le=5000, description="Target daily water intake (mL)")
    kcal_target: int = Field(default=2850, ge=1500, le=5000, description="Target daily caloric intake (kcal)")
    vit_d_target_iu: int = Field(default=800, ge=200, le=5000, description="Target daily Vitamin D supplementation (IU)")
    ared_target_mins: int = Field(default=60, ge=0, le=180, description="Target daily ARED resistive exercise duration (minutes)")


class TelemetryPayload(BaseModel):
    """Real-time or buffered multimodal telemetry payload from spaceflight sensors."""
    model_config = ConfigDict(extra="ignore")

    habitat: HabitatType = Field(description="Current operational habitat")
    scenario: ScenarioType = Field(default="NOMINAL", description="Simulated or active operational scenario")
    heart_rate_bpm: float = Field(ge=20.0, le=250.0, description="Heart rate (beats per minute)")
    hrv_ms: float = Field(ge=5.0, le=250.0, description="Heart rate variability RMSSD (ms)")
    systolic_bp: float = Field(ge=50.0, le=260.0, description="Systolic blood pressure (mmHg)")
    diastolic_bp: float = Field(ge=30.0, le=160.0, description="Diastolic blood pressure (mmHg)")
    spo2_pct: float = Field(ge=50.0, le=100.0, description="Blood oxygen saturation SpO2 (%)")
    skin_temp_c: float = Field(ge=28.0, le=43.0, description="Peripheral skin / body temperature (Celsius)")
    radiation_msv: float = Field(ge=0.0, le=500.0, description="Current ambient / dosimeter radiation rate (mSv/hr or daily rate)")
    cabin_co2_mmhg: float = Field(ge=0.0, le=30.0, description="Ambient cabin CO2 partial pressure (mmHg)")
    water_intake_ml: float = Field(ge=0.0, le=10000.0, description="Logged daily water consumption (mL)")
    calories_kcal: float = Field(ge=0.0, le=10000.0, description="Logged daily caloric intake (kcal)")
    calcium_mg: float = Field(ge=0.0, le=3000.0, description="Dietary calcium intake (mg)")
    vit_d_iu: float = Field(ge=0.0, le=10000.0, description="Vitamin D intake (IU)")
    urine_specific_gravity: float = Field(ge=1.000, le=1.050, description="Urine specific gravity refractometry measure")
    sleep_hrs: float = Field(ge=0.0, le=24.0, description="Total sleep duration in past 24 hours (hours)")
    ared_exercise_mins: float = Field(ge=0.0, le=300.0, description="Completed Advanced Resistive Exercise Device duration (minutes)")
    mood_score: int = Field(ge=1, le=5, description="Self-reported psychological readiness score (1=Stressed/Exhausted to 5=Optimal)")


class OrganStatusDetail(BaseModel):
    """Detailed health status and plain-language interpretation for a specific organ system."""
    model_config = ConfigDict(extra="ignore")

    organ_id: OrganSystemId = Field(description="Target organ system identifier")
    name: str = Field(description="Human-readable organ system name (e.g. 'Renal & Fluid Balance')")
    status: OrganStatus = Field(description="Operational health status")
    z_score_summary: str = Field(description="Statistical deviation summary relative to astronaut personal baseline")
    why_it_matters_in_space: str = Field(description="Aerospace physiology rationale for non-doctor astronauts")
    plain_language_assessment: str = Field(description="Clear, non-jargon clinical assessment")
    recommended_actions: List[str] = Field(default_factory=list, description="Immediate and prioritized action items for crew")


class MeasurementGuide(BaseModel):
    """Standard operating procedure for non-doctor astronaut health measurements."""
    model_config = ConfigDict(extra="ignore")

    id: str = Field(description="Unique measurement guide identifier")
    title: str = Field(description="Measurement title")
    target_organ: OrganSystemId = Field(description="Associated organ system")
    frequency: str = Field(description="Recommended cadence (e.g. 'Twice Daily', 'Pre/Post ARED', 'Weekly')")
    equipment_needed: str = Field(description="Onboard medical hardware required")
    why_it_matters: str = Field(description="Why this measurement is vital in space environments")
    gravity_adjustment_note: str = Field(description="How to adjust procedure for 0g microgravity or 0.16g lunar gravity")
    steps: List[str] = Field(default_factory=list, description="Numbered step-by-step checklist instructions")
    normal_range_label: str = Field(description="Nominal reference range description")


class EvaluationResponse(BaseModel):
    """Comprehensive autonomous health evaluation, triage, and ground telemetry packet."""
    model_config = ConfigDict(extra="ignore")

    severity: SeverityLevel = Field(description="Overall mission and health triage severity")
    readiness_score: float = Field(ge=0.0, le=100.0, description="Overall astronaut mission readiness score (0-100)")
    hr_z_score: float = Field(description="Statistical Z-score for heart rate against baseline")
    bp_z_score: float = Field(description="Statistical Z-score for blood pressure against baseline")
    renal_stone_risk_index: float = Field(ge=0.0, le=100.0, description="Compounded nephrolithiasis risk index (0-100)")
    habitat_profile: HabitatProfile = Field(description="Active habitat operational profile")
    organs: Union[List[OrganStatusDetail], Dict[str, OrganStatusDetail]] = Field(
        default_factory=list,
        description="Detailed organ system evaluations"
    )
    deterministic_trigger_summary: str = Field(description="Clear summary of deterministic clinical threshold triggers")
    crew_action_checklist: List[str] = Field(default_factory=list, description="Prioritized checklist for crew members")
    sbar_ground_packet: str = Field(description="Structured Situation-Background-Assessment-Recommendation transmission packet")
    store_and_forward_queue_count: int = Field(default=0, ge=0, description="Number of packets queued during communication delay/blackout")


class TelemetryHistoryPoint(BaseModel):
    """Historical telemetry trend point for time-series charts."""
    model_config = ConfigDict(extra="ignore")

    time_label: str = Field(description="Relative mission timestamp, e.g. 'T-11h', 'T-0h'")
    heart_rate_bpm: float = Field(description="Heart rate in bpm")
    systolic_bp: float = Field(description="Systolic blood pressure in mmHg")
    diastolic_bp: float = Field(description="Diastolic blood pressure in mmHg")
    spo2_pct: float = Field(description="Oxygen saturation SpO2 in %")
    water_intake_ml: float = Field(description="Cumulative water intake in mL")
    urine_specific_gravity: float = Field(description="Urine specific gravity refractometry measure")


class BootstrapResponse(BaseModel):
    """Initial payload to bootstrap the mission control and astronaut UI."""
    model_config = ConfigDict(extra="ignore")

    baseline: PersonalBaseline
    habitats: Dict[HabitatType, HabitatProfile]
    measurement_guides: List[MeasurementGuide]
    initial_evaluation: EvaluationResponse
    initial_telemetry: TelemetryPayload
    history: List[TelemetryHistoryPoint]


class ScenarioResponse(BaseModel):
    """Scenario preset data response containing telemetry, evaluation, and history."""
    model_config = ConfigDict(extra="ignore")

    habitat: HabitatType
    scenario: ScenarioType
    telemetry: TelemetryPayload
    evaluation: EvaluationResponse
    history: List[TelemetryHistoryPoint]


