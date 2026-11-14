"""TAURARO: Autonomous Clinical Copilot & SBAR Synthesis Engine
Provides instant, 100% offline deterministic clinical triage, with optional Gemini 2.5 Flash
enhancement when operational uplink and API credentials are available.
"""

import os
import logging
from typing import Optional
from backend.app.models import EvaluationResponse, TelemetryPayload

logger = logging.getLogger(__name__)


def generate_deterministic_insight(payload: TelemetryPayload, evaluation: EvaluationResponse) -> str:
    """Generate instant, zero-latency clinical triage guidance for non-doctor astronauts.

    Guaranteed 100% offline reliability during Mars transit communication blackouts.
    """
    severity = evaluation.severity
    habitat = evaluation.habitat_profile.name
    gravity = evaluation.habitat_profile.gravity_g
    latency = evaluation.habitat_profile.latency_label
    cpr_method = evaluation.habitat_profile.cpr_restraint_method
    renal_risk = evaluation.renal_stone_risk_index
    readiness = evaluation.readiness_score

    if severity == "EMERGENCY":
        clinical_state = "CRITICAL HEMODYNAMIC COLLAPSE / ACUTE INSTABILITY"
        differential = (
            "Primary differential indicates acute cardiovascular insufficiency, severe hypoxemia, or profound shock. "
            "In zero/partial gravity, absence of venous hydrostatic pressure alters peripheral perfusion and compensatory vascular tone."
        )
        directives = [
            f"1. GRAVITY RESTRAINT LOCK: Immediately initiate protocol: {cpr_method}",
            "2. AIRWAY & O2: Secure airway; administer high-flow 100% oxygen via portable breathing apparatus.",
            "3. DEFIBRILLATION & MONITORING: Attach automated external defibrillator (AED) and verify cardiac rhythm on telemetry.",
            "4. AUTONOMOUS INTERVENTION: Do not wait for ground confirmation due to light-speed latency ("
            f"{latency}). Follow automated onboard resuscitation algorithm.",
        ]
    elif severity == "CAUTION":
        clinical_state = "PHYSIOLOGICAL DEVIATION / ACCUMULATING MULTISYSTEM DRIFT"
        if renal_risk >= 35.0:
            differential = (
                f"Urgent renal hazard detected (Stone Risk Index: {renal_risk:.1f}/100, USG {payload.urine_specific_gravity:.3f}). "
                "Microgravity trabecular bone calcium loss is filtering through under-hydrated kidneys, dramatically elevating "
                "nephrolithiasis crystallization risk. This is a primary preventable cause of emergency evacuation."
            )
            directives = [
                "1. HYDRATION BOLUS: Drink 500 mL water immediately fortified with potassium citrate to raise urinary pH.",
                "2. SCHEDULED SIPS: Consume 200 mL every 45 minutes until next scheduled void refractometry reading.",
                "3. SKELETAL PRESERVATION: Ensure target 60-minute ARED axial resistive loading to drive calcium back into bone matrix.",
                "4. MONITORING: Check urine specific gravity on next void; target USG below 1.018.",
            ]
        elif payload.spo2_pct < 95.0 or payload.cabin_co2_mmhg >= 4.0:
            differential = (
                f"Respiratory strain detected (SpO2 {payload.spo2_pct:.1f}%, Cabin CO2 {payload.cabin_co2_mmhg:.1f} mmHg). "
                "Elevated ambient cabin CO2 or regolith dust exposure causes pulmonary capillary constriction and hypercapnic cephalad headache."
            )
            directives = [
                "1. VENTILATION: Increase localized crew quarters fan speed to disperse stagnant microgravity CO2 gas pockets.",
                "2. LIFE SUPPORT: Check ECLSS CDRA scrubber beds for bypass or saturation anomalies.",
                "3. REST & PULSE OX: Cease strenuous physical exertion for 30 minutes; repeat continuous finger pulse oximetry.",
            ]
        else:
            differential = (
                f"Cardiovascular or circadian drift noted (HR Z-score: {evaluation.hr_z_score:+.2f}, Sleep: {payload.sleep_hrs:.1f}h). "
                "Autonomic nervous system shows elevated sympathetic tone from physical exhaustion or fluid shift deconditioning."
            )
            directives = [
                "1. FLUID BALANCE: Consume 300 mL chilled electrolyte beverage to support effective circulating blood volume.",
                "2. SLEEP WINDOW: Protect minimum 7.5-hour scheduled dark sleep period; dim workstation lighting 1 hour pre-rest.",
                "3. RE-ASSESSMENT: Repeat automated brachial cuff blood pressure at wake + 30m.",
            ]
    else:
        clinical_state = "NOMINAL SPACEFLIGHT PHYSIOLOGICAL HOMEOSTASIS"
        differential = (
            f"All organ systems are well-compensated within standard deviation limits (Readiness Score: {readiness:.1f}/100). "
            "Cardiovascular adaptation, renal dilution, and bone-preservation exercise markers are aligned with NASA HRP nominal targets."
        )
        directives = [
            "1. ROUTINE ACTIVITY: Proceed with planned mission EVA, science payloads, and habitat maintenance.",
            "2. COUNTERMEASURES: Maintain prescribed 60-min daily ARED high-load resistive session and 2.5L water intake.",
            "3. HYGIENE & LOGGING: Log daily dietary calories and test weekly Amsler visual grid.",
        ]

    directives_str = "\n".join(directives)

    return f"""### TAURARO CLINICAL COPILOT // AUTONOMOUS FLIGHT SURGEON
**Operational Status:** {clinical_state}
**Exploration Environment:** {habitat} (g: {gravity:.2f}g | Latency: {latency})
**Mission Readiness Score:** {readiness:.1f} / 100 | **Renal Stone Risk:** {renal_risk:.1f} / 100

#### Clinical Assessment & Differential
{differential}

#### Immediate Step-by-Step Countermeasures (Non-Doctor Protocol)
{directives_str}

#### Telemetry Transmission Status
{evaluation.sbar_ground_packet}
"""


def generate_clinical_copilot_insight(
    payload: TelemetryPayload,
    evaluation: EvaluationResponse,
) -> str:
    """Synthesizes clinical copilot analysis.

    Uses Gemini 2.5 Flash if GEMINI_API_KEY is present and habitat allows uplink;
    otherwise falls back instantly to the deterministic expert engine.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    # If in Mars Transit blackout or no API key, use 100% offline deterministic engine
    if not api_key or evaluation.habitat_profile.sync_mode == "STORE_AND_FORWARD_OFFLINE":
        return generate_deterministic_insight(payload, evaluation)

    try:
        from google import genai

        client = genai.Client(api_key=api_key)
        prompt = f"""You are the TAURARO Autonomous Spaceflight Medical Copilot acting as an expert NASA Flight Surgeon for astronauts who are not medical doctors.
Analyze the following astronaut telemetry:
Astronaut: Cmdr. Ameer Umar
Habitat: {evaluation.habitat_profile.name} (Gravity: {evaluation.habitat_profile.gravity_g}g, Comm Latency: {evaluation.habitat_profile.latency_label})
Telemetry:
- Heart Rate: {payload.heart_rate_bpm} bpm (Z-score: {evaluation.hr_z_score:+.2f})
- Blood Pressure: {payload.systolic_bp}/{payload.diastolic_bp} mmHg (Z-score: {evaluation.bp_z_score:+.2f})
- SpO2: {payload.spo2_pct}%
- Urine Specific Gravity: {payload.urine_specific_gravity} (Renal Stone Risk: {evaluation.renal_stone_risk_index}/100)
- Water Intake: {payload.water_intake_ml} mL
- ARED Exercise Duration: {payload.ared_exercise_mins} mins
- Cabin CO2: {payload.cabin_co2_mmhg} mmHg
- Overall Severity: {evaluation.severity}
- Readiness Score: {evaluation.readiness_score}/100
- Gravity CPR Protocol: {evaluation.habitat_profile.cpr_restraint_method}

Provide:
1. Clear non-jargon clinical explanation of what is happening.
2. Why this matters in space (fluid shifts, bone calcium dumping into kidneys, hypoxia, etc.).
3. 3-4 numbered step-by-step immediate actions the crew must take.
4. Conclude with a strict [SBAR-PACKET] format block for ground transmission.
Keep the tone calm, decisive, and actionable for non-doctor astronauts.
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        logger.warning("Gemini synthesis unavailable (%s). Falling back to deterministic engine.", e)

    return generate_deterministic_insight(payload, evaluation)

