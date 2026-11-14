"""TAURARO: Universal Space Exploration Health Monitoring & Autonomous Triage Platform
FastAPI Application Entry Point aligned with NASA HRP Standard Measures.
"""

from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.app.models import (
    BootstrapResponse,
    EvaluationResponse,
    HabitatProfile,
    HabitatType,
    MeasurementGuide,
    PersonalBaseline,
    ScenarioResponse,
    ScenarioType,
    TelemetryPayload,
)
from backend.app.simulator import (
    HABITAT_PROFILES,
    MEASUREMENT_GUIDES,
    SCENARIO_PRESETS,
)
from backend.app.engine import evaluate_telemetry
from backend.app.copilot import generate_clinical_copilot_insight

app = FastAPI(
    title="TAURARO Spaceflight Health Monitoring & Autonomous Triage API",
    description="Universal aerospace health monitoring, non-doctor astronaut guidance, and autonomous triage platform for deep space and planetary exploration.",
    version="1.0.0",
)

# Permissive CORS for React frontend development and local telemetry feeds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CopilotRequest(BaseModel):
    telemetry: TelemetryPayload
    evaluation: Optional[EvaluationResponse] = None


class CopilotResponse(BaseModel):
    insight: str
    sbar_packet: str


@app.get("/api/v1/health")
def get_health() -> Dict[str, str]:
    """System health and aerospace compliance metadata."""
    return {
        "status": "nominal",
        "platform": "TAURARO Spaceflight Health Monitoring Platform",
        "version": "1.0.0",
        "alignment": "NASA Human Research Program (HRP Standard Measures) & OSDR",
    }


@app.get("/api/v1/bootstrap", response_model=BootstrapResponse)
def get_bootstrap() -> BootstrapResponse:
    """Bootstrap initial astronaut baseline, all exploration habitats, measurement SOPs, and nominal telemetry."""
    baseline = PersonalBaseline()
    nominal_preset = SCENARIO_PRESETS["NOMINAL"]
    initial_telemetry: TelemetryPayload = nominal_preset["payload"].model_copy(deep=True)
    initial_evaluation: EvaluationResponse = evaluate_telemetry(initial_telemetry, baseline)

    return BootstrapResponse(
        baseline=baseline,
        habitats=HABITAT_PROFILES,
        measurement_guides=MEASUREMENT_GUIDES,
        initial_telemetry=initial_telemetry,
        initial_evaluation=initial_evaluation,
        history=nominal_preset["history"],
    )


@app.get("/api/v1/scenario/{habitat}/{scenario}", response_model=ScenarioResponse)
def get_scenario(habitat: HabitatType, scenario: ScenarioType) -> ScenarioResponse:
    """Load an operational aerospace scenario adapted to the specified exploration habitat."""
    if habitat not in HABITAT_PROFILES:
        raise HTTPException(status_code=400, detail=f"Invalid habitat identifier: {habitat}")
    if scenario not in SCENARIO_PRESETS:
        raise HTTPException(status_code=400, detail=f"Invalid scenario preset: {scenario}")

    preset = SCENARIO_PRESETS[scenario]
    telemetry: TelemetryPayload = preset["payload"].model_copy(deep=True)
    telemetry.habitat = habitat

    baseline = PersonalBaseline()
    evaluation = evaluate_telemetry(telemetry, baseline)

    return ScenarioResponse(
        habitat=habitat,
        scenario=scenario,
        telemetry=telemetry,
        evaluation=evaluation,
        history=preset["history"],
    )


@app.post("/api/v1/evaluate", response_model=EvaluationResponse)
def post_evaluate(payload: TelemetryPayload) -> EvaluationResponse:
    """Real-time deterministic evaluation of astronaut telemetry against baseline."""
    baseline = PersonalBaseline()
    return evaluate_telemetry(payload, baseline)


@app.post("/api/v1/copilot/insight", response_model=CopilotResponse)
def post_copilot_insight(req: CopilotRequest) -> CopilotResponse:
    """Generate autonomous flight surgeon copilot guidance and SBAR ground packet."""
    baseline = PersonalBaseline()
    evaluation = req.evaluation or evaluate_telemetry(req.telemetry, baseline)
    insight_text = generate_clinical_copilot_insight(req.telemetry, evaluation)
    return CopilotResponse(
        insight=insight_text,
        sbar_packet=evaluation.sbar_ground_packet,
    )


@app.get("/api/v1/habitats", response_model=Dict[HabitatType, HabitatProfile])
def get_habitats() -> Dict[HabitatType, HabitatProfile]:
    """Retrieve operational profiles and CPR restraint methods for all 4 exploration environments."""
    return HABITAT_PROFILES


@app.get("/api/v1/guides", response_model=List[MeasurementGuide])
def get_measurement_guides() -> List[MeasurementGuide]:
    """Retrieve all gravity-adjusted astronaut measurement standard operating procedure guides."""
    return MEASUREMENT_GUIDES

