"""TAURARO: Deterministic Aerospace Physiological Evaluation Engine
Computes statistical baseline deviations, organ-system risk indexes, composite readiness scores,
and structured ground telemetry packets aligned with NASA Human Research Program measures.
"""

from typing import List, Dict
from backend.app.models import (
    EvaluationResponse,
    HabitatProfile,
    OrganStatus,
    OrganStatusDetail,
    OrganSystemId,
    PersonalBaseline,
    SeverityLevel,
    TelemetryPayload,
)
from backend.app.simulator import HABITAT_PROFILES


def calculate_renal_stone_risk(payload: TelemetryPayload, baseline: PersonalBaseline) -> float:
    """Calculate the compounded nephrolithiasis risk index (0 - 100) in microgravity.

    Combines:
    1. Hydration deficit relative to personal target (up to 35 pts)
    2. Elevated urine specific gravity (USG) crystallization threshold (up to 40 pts)
    3. Uncountered osteoclast bone calcium resorption from skipped ARED exercise (up to 15 pts)
    4. Dietary calcium/vitamin D imbalance (up to 10 pts)
    """
    # 1. Hydration deficit (0 - 35)
    water_ratio = payload.water_intake_ml / max(1.0, float(baseline.water_target_ml))
    hydration_penalty = max(0.0, (1.0 - min(1.0, water_ratio)) * 35.0)

    # 2. Elevated USG refractometry index (0 - 40)
    # Nominal is <= 1.018. Over 1.020 crystal nucleation accelerates exponentially in space.
    if payload.urine_specific_gravity <= 1.018:
        usg_penalty = max(0.0, (payload.urine_specific_gravity - 1.010) / 0.008 * 10.0)
    else:
        # 1.018 to 1.030 maps from 10 to 40 points
        usg_penalty = 10.0 + min(30.0, (payload.urine_specific_gravity - 1.018) / 0.012 * 30.0)

    # 3. ARED resistive exercise deficit (0 - 15)
    ared_ratio = payload.ared_exercise_mins / max(1.0, float(baseline.ared_target_mins))
    ared_penalty = max(0.0, (1.0 - min(1.0, ared_ratio)) * 15.0)

    # 4. Dietary calcium/vitamin D balance (0 - 10)
    calcium_penalty = 0.0
    if payload.calcium_mg > 1200.0 and payload.water_intake_ml < 2000.0:
        calcium_penalty += 6.0  # High calcium load with concentrated urine
    if payload.vit_d_iu < 600.0:
        calcium_penalty += 4.0  # Sub-optimal active calcium transport balance

    total_risk = hydration_penalty + usg_penalty + ared_penalty + calcium_penalty
    return round(min(100.0, max(0.0, total_risk)), 1)


def evaluate_telemetry(
    payload: TelemetryPayload,
    baseline: PersonalBaseline = None,
) -> EvaluationResponse:
    """Deterministic mathematical assessment of astronaut multimodal telemetry.

    Pure deterministic logic: works 100% offline with zero external dependencies.
    """
    if baseline is None:
        baseline = PersonalBaseline()

    # Active habitat profile
    habitat_profile: HabitatProfile = HABITAT_PROFILES.get(
        payload.habitat,
        HABITAT_PROFILES["ORBITAL_STATION"],
    )

    # 1. Statistical Z-scores
    hr_z_score = round((payload.heart_rate_bpm - baseline.hr_mean) / baseline.hr_std, 2)
    # NASA clinical standard: systolic BP population/individual SD ~8.0 mmHg
    bp_z_score = round((payload.systolic_bp - baseline.systolic_mean) / 8.0, 2)

    # 2. Renal Stone Risk Index (0 - 100)
    renal_risk = calculate_renal_stone_risk(payload, baseline)

    # 3. Organ Systems Evaluation
    triggers: List[str] = []
    actions: List[str] = []
    organs_list: List[OrganStatusDetail] = []

    # ------------------ CARDIOVASCULAR ------------------
    cardio_status: OrganStatus = "NOMINAL"
    cardio_z_text = f"HR {payload.heart_rate_bpm} bpm (Z: {hr_z_score:+.2f}), BP {int(payload.systolic_bp)}/{int(payload.diastolic_bp)} mmHg (Z: {bp_z_score:+.2f})"
    cardio_actions: List[str] = []

    if payload.heart_rate_bpm > 135.0 or payload.systolic_bp < 90.0 or payload.spo2_pct < 88.0:
        cardio_status = "CRITICAL"
        triggers.append("CARDIO CRITICAL: Severe hemodynamic collapse / critical tachycardia / hypotension")
        cardio_actions.extend([
            f"Activate emergency protocol immediately: {habitat_profile.cpr_restraint_method}",
            "Deploy Automated External Defibrillator (AED) and apply 12-lead bio-patch",
            "Prepare 100% O2 via high-flow non-rebreather mask at 15 L/min",
            "Administer 500 mL normal saline IV bolus via microgravity pressurizer bag if in hypovolemic shock",
        ])
    elif abs(hr_z_score) >= 2.0 or payload.systolic_bp > 130.0 or payload.systolic_bp < 100.0 or payload.spo2_pct < 95.0:
        cardio_status = "CAUTION"
        triggers.append(f"CARDIO CAUTION: Heart rate drift Z={hr_z_score:+.2f} or SpO2 depressed to {payload.spo2_pct}%")
        cardio_actions.extend([
            "Perform seated/anchored 12-lead ECG capture to rule out dysrhythmias",
            "Consume 300 mL chilled electrolyte solution to expand circulating blood volume",
            "Re-check blood pressure at wake + 30m with cuff strictly at heart level",
        ])
    else:
        cardio_actions.append("Continue nominal daily cardiovascular monitoring and scheduled ARED cardiovascular protocol.")

    organs_list.append(
        OrganStatusDetail(
            organ_id="cardio",
            name="Cardiovascular & Hemodynamics",
            status=cardio_status,
            z_score_summary=cardio_z_text,
            why_it_matters_in_space=(
                "In microgravity, ~2 liters of blood and interstitial fluid shift headward (cephalad fluid shift). "
                "Because there is no hydrostatic column, systemic vascular resistance decreases and left ventricular "
                "workload drops. Orthostatic intolerance and heart rate variability changes occur rapidly."
            ),
            plain_language_assessment=(
                f"Heart is pumping at {payload.heart_rate_bpm:.0f} bpm with blood pressure {payload.systolic_bp:.0f}/{payload.diastolic_bp:.0f} mmHg. "
                + ("Hemodynamic state is unstable with signs of shock/collapse." if cardio_status == "CRITICAL"
                   else "Mild cardiovascular strain or fluid redistribution drift detected." if cardio_status == "CAUTION"
                   else "Cardiovascular metrics are stable and well-compensated.")
            ),
            recommended_actions=cardio_actions,
        )
    )

    # ------------------ RENAL & FLUID ------------------
    renal_status: OrganStatus = "NOMINAL"
    renal_z_text = f"USG {payload.urine_specific_gravity:.3f}, Hydration {int(payload.water_intake_ml)}/{baseline.water_target_ml} mL, Risk Index: {renal_risk:.1f}/100"
    renal_actions: List[str] = []

    if renal_risk >= 70.0 or payload.urine_specific_gravity >= 1.028:
        renal_status = "CRITICAL"
        triggers.append(f"RENAL CRITICAL: Severe dehydration & hypercalciuria (Stone Risk {renal_risk}/100, USG {payload.urine_specific_gravity})")
        renal_actions.extend([
            "URGENT: Initiate aggressive oral rehydration protocol (1000 mL electrolyte fluid over 90 mins)",
            "Perform handheld bladder and kidney point-of-care ultrasound to evaluate for nephrolithiasis crystal acoustic shadowing",
            "Suspend high-dose oral calcium supplementation until USG normalizes below 1.018",
            "Log all void intervals and test urine pH via colorimetric test strip",
        ])
    elif renal_risk >= 35.0 or payload.urine_specific_gravity >= 1.022 or payload.water_intake_ml < 1800.0:
        renal_status = "CAUTION"
        triggers.append(f"RENAL CAUTION: Hydration deficit ({int(payload.water_intake_ml)} mL) driving stone risk to {renal_risk}/100")
        renal_actions.extend([
            "Drink 500 mL of water immediately plus one potassium citrate hydration packet to alkalinize urine",
            "Set smart timer for hourly 200 mL hydration reminders across rest of mission day",
            "Verify complete voiding and test morning first-void refractometry",
        ])
    else:
        renal_actions.append("Maintain baseline 2.5L daily hydration target and balanced electrolyte intake.")

    organs_list.append(
        OrganStatusDetail(
            organ_id="renal",
            name="Renal & Fluid Regulation",
            status=renal_status,
            z_score_summary=renal_z_text,
            why_it_matters_in_space=(
                "Spaceflight blunts the astronaut thirst sensation while zero gravity causes bone calcium to dump directly "
                "into the bloodstream (hypercalciuria). Concentrated urine forms calcium oxalate crystal seeds, making kidney stones "
                "one of the highest risks for mission-terminating incapacitation."
            ),
            plain_language_assessment=(
                f"Hydration intake is at {payload.water_intake_ml:.0f} mL ({payload.water_intake_ml / baseline.water_target_ml * 100:.0f}% of target) "
                f"with urine specific gravity at {payload.urine_specific_gravity:.3f}. "
                + ("CRITICAL crystallization zone: immediate rehydration required to avert kidney stone formation." if renal_status == "CRITICAL"
                   else "Elevated concentration: dehydration is compounding bone calcium load in urine." if renal_status == "CAUTION"
                   else "Optimal kidney filtration and safe urine dilution.")
            ),
            recommended_actions=renal_actions,
        )
    )

    # ------------------ NEURO-OCULAR ------------------
    neuro_status: OrganStatus = "NOMINAL"
    neuro_z_text = f"Cabin CO2 {payload.cabin_co2_mmhg:.1f} mmHg, Sleep {payload.sleep_hrs:.1f}h, Mood {payload.mood_score}/5"
    neuro_actions: List[str] = []

    if payload.mood_score <= 1 or payload.cabin_co2_mmhg > 6.0 or (payload.sleep_hrs < 4.0 and payload.scenario == "CODE_RED_COLLAPSE"):
        neuro_status = "CRITICAL"
        triggers.append(f"NEURO CRITICAL: Severe hypercapnia ({payload.cabin_co2_mmhg} mmHg) or acute collapse state")
        neuro_actions.extend([
            "Check cabin Environmental Control and Life Support System (ECLSS) CO2 scrubbers and CDRA beds immediately",
            "Don emergency portable breathing apparatus (PBA) if cabin CO2 exceeds 5.0 mmHg",
            "Perform immediate pupillary light response and cranial nerve orientation check",
        ])
    elif payload.cabin_co2_mmhg >= 4.0 or payload.sleep_hrs < 5.5 or payload.mood_score <= 2:
        neuro_status = "CAUTION"
        triggers.append(f"NEURO CAUTION: Elevated cabin CO2 ({payload.cabin_co2_mmhg} mmHg) or sleep deficit ({payload.sleep_hrs}h)")
        neuro_actions.extend([
            "Perform weekly Amsler Grid and pupillometry visual check to evaluate optic disc swelling (SANS)",
            "Increase cabin ventilation fan speed near crew quarters to disperse microgravity CO2 pockets",
            "Prioritize 60-minute sleep extension window and reduce screen exposure before circadian rest period",
        ])
    else:
        neuro_actions.append("Perform routine weekly Amsler visual acuity check and maintain 7.5+ hour sleep schedule.")

    organs_list.append(
        OrganStatusDetail(
            organ_id="neuro",
            name="Neuro-Ocular & Central Nervous System",
            status=neuro_status,
            z_score_summary=neuro_z_text,
            why_it_matters_in_space=(
                "Cephalad fluid shift increases intracranial and central venous pressures, causing Spaceflight-Associated "
                "Neuro-ocular Syndrome (SANS), optic disc edema, and visual degradation. In microgravity, exhaled CO2 forms "
                "localized pockets around an astronaut's head if ventilation is inadequate, causing severe headaches and cognitive slowdown."
            ),
            plain_language_assessment=(
                f"Cabin CO2 is at {payload.cabin_co2_mmhg:.1f} mmHg with {payload.sleep_hrs:.1f} hours of recorded sleep. "
                + ("Critical neuro-environmental hazard: evaluate crew consciousness and scrubber beds." if neuro_status == "CRITICAL"
                   else "Moderate environmental stress: mild CO2 buildup or sleep deficit may impact cognitive performance." if neuro_status == "CAUTION"
                   else "Neurological readiness is nominal with no visual or intracranial pressure alerts.")
            ),
            recommended_actions=neuro_actions,
        )
    )

    # ------------------ MUSCULOSKELETAL ------------------
    musculo_status: OrganStatus = "NOMINAL"
    musculo_z_text = f"ARED {int(payload.ared_exercise_mins)}/{baseline.ared_target_mins} mins, Calcium {int(payload.calcium_mg)} mg, Vit D {int(payload.vit_d_iu)} IU"
    musculo_actions: List[str] = []

    if payload.ared_exercise_mins == 0.0 and payload.scenario == "CODE_RED_COLLAPSE":
        musculo_status = "CRITICAL"
        triggers.append("MUSCULO CRITICAL: Complete physical incapacitation / zero musculoskeletal loading")
        musculo_actions.append("Full physical rest: suspend all resistive exercise until hemodynamic stabilization is verified.")
    elif payload.ared_exercise_mins < 45.0 or payload.calcium_mg < 800.0 or payload.vit_d_iu < 600.0:
        musculo_status = "CAUTION"
        triggers.append(f"MUSCULO CAUTION: ARED resistive duration ({int(payload.ared_exercise_mins)} mins) below bone preservation target")
        musculo_actions.extend([
            "Complete remaining ARED resistive exercises (squat, heel raise, deadlift) to mechanically load femur and spine",
            "Take daily 800 IU Vitamin D supplement with mid-mission meal to support bone remodeling",
            "Log nutritional intake to maintain 1,000 mg dietary calcium target without overloading kidneys",
        ])
    else:
        musculo_actions.append("Continue daily 60-minute high-load ARED resistive training session.")

    organs_list.append(
        OrganStatusDetail(
            organ_id="musculo",
            name="Musculoskeletal & Bone Integrity",
            status=musculo_status,
            z_score_summary=musculo_z_text,
            why_it_matters_in_space=(
                "Without mechanical axial loading from Earth gravity, astronauts lose ~1% of trabecular bone mass per month "
                "and significant antigravity muscle sarcomeres (soleus and gastrocnemius). ARED resistive exercise is the primary "
                "countermeasure preventing bone resorption and microgravity-induced osteopenia."
            ),
            plain_language_assessment=(
                f"ARED exercise completed: {payload.ared_exercise_mins:.0f} of {baseline.ared_target_mins} min target. "
                + ("Zero loading due to crew incapacitation." if musculo_status == "CRITICAL"
                   else "Sub-target resistive loading: uncountered bone resorption will accelerate calcium discharge into urine." if musculo_status == "CAUTION"
                   else "Skeletal loading is optimal; bone remodeling and muscle tone actively protected.")
            ),
            recommended_actions=musculo_actions,
        )
    )

    # ------------------ IMMUNE & HEMATOLOGIC ------------------
    immune_status: OrganStatus = "NOMINAL"
    immune_z_text = f"SpO2 {payload.spo2_pct:.1f}%, Temp {payload.skin_temp_c:.1f}°C, Rad Rate {payload.radiation_msv:.2f} mSv"
    immune_actions: List[str] = []

    if payload.skin_temp_c > 38.5 or (payload.spo2_pct < 90.0 and payload.scenario == "LUNAR_DUST_HYPOXIA"):
        immune_status = "CRITICAL"
        triggers.append(f"IMMUNE CRITICAL: Severe hypoxemia / regolith toxicity / febrile response (SpO2 {payload.spo2_pct}%, Temp {payload.skin_temp_c}°C)")
        immune_actions.extend([
            "Administer supplemental oxygen immediately to restore SpO2 above 95%",
            "Inspect airlock filtration HEPA seals and run high-efficiency cabin particulate sweep",
            "Initiate inhaled bronchodilator protocol (albuterol 2 puffs) for regolith-induced airway hyper-reactivity",
        ])
    elif payload.skin_temp_c > 37.2 or payload.radiation_msv > 0.25 or payload.sleep_hrs < 5.5:
        immune_status = "CAUTION"
        triggers.append(f"IMMUNE CAUTION: Elevated ambient radiation ({payload.radiation_msv} mSv) or low SpO2 ({payload.spo2_pct}%)")
        immune_actions.extend([
            "Check dosimeter cumulative doserate; consider retreating to water-wall radiation storm shelter if SPE active",
            "Inspect cabin air particle sensor for dust filter bypass",
            "Ensure adequate hydration and micronutrient intake (zinc, vitamin C/D) to mitigate cellular oxidative stress",
        ])
    else:
        immune_actions.append("Maintain environmental air quality checks and monitor daily personal dosimeter badge.")

    organs_list.append(
        OrganStatusDetail(
            organ_id="immune",
            name="Immune & Hematologic Defense",
            status=immune_status,
            z_score_summary=immune_z_text,
            why_it_matters_in_space=(
                "Space radiation, altered sleep cycles, and confinement suppress T-cell activation and can reactivate latent "
                "viruses (EBV, VZV). On planetary surfaces like the Moon or Mars, sharp abrasive dust particles can cause acute toxic "
                "pulmonary inflammation if tracked through the airlock into the habitat."
            ),
            plain_language_assessment=(
                f"Peripheral SpO2 is {payload.spo2_pct:.1f}%, skin temp {payload.skin_temp_c:.1f}°C, radiation {payload.radiation_msv:.2f} mSv. "
                + ("Critical respiratory or immune compromise detected: airway and dust mitigation required." if immune_status == "CRITICAL"
                   else "Mild physiological stress or ambient environmental elevation noted." if immune_status == "CAUTION"
                   else "Immune and respiratory barriers intact; vital signs within nominal limits.")
            ),
            recommended_actions=immune_actions,
        )
    )

    # 4. Composite Readiness Score (0 - 100)
    score = 100.0
    # Penalty for HR Z-score deviation
    score -= min(25.0, abs(hr_z_score) * 6.0)
    # Penalty for SpO2 depression below 98%
    score -= max(0.0, (98.0 - payload.spo2_pct) * 4.5)
    # Penalty for Blood Pressure Z-score deviation
    score -= min(15.0, abs(bp_z_score) * 4.0)
    # Penalty for Renal Stone Risk
    score -= (renal_risk / 100.0) * 20.0
    # Penalty for Sleep deficit
    score -= max(0.0, (7.5 - payload.sleep_hrs) * 3.5)
    # Penalty for Self-Reported Mood / Stress
    score -= (5 - payload.mood_score) * 2.5

    # Code red collapse floor
    if payload.scenario == "CODE_RED_COLLAPSE":
        readiness_score = 12.0
    else:
        readiness_score = round(max(5.0, min(100.0, score)), 1)

    # 5. Overall Mission Severity
    any_critical = any(o.status == "CRITICAL" for o in organs_list)
    any_caution = any(o.status == "CAUTION" for o in organs_list)

    if any_critical or payload.scenario == "CODE_RED_COLLAPSE" or readiness_score < 45.0:
        severity: SeverityLevel = "EMERGENCY"
    elif any_caution or readiness_score < 80.0 or renal_risk >= 35.0:
        severity: SeverityLevel = "CAUTION"
    else:
        severity: SeverityLevel = "NOMINAL"

    # 6. Prioritized Crew Action Checklist
    crew_checklist: List[str] = []
    if severity == "EMERGENCY":
        crew_checklist.append(f"EMERGENCY PROTOCOL: Lock into position for {habitat_profile.cpr_restraint_method}")
        crew_checklist.append("Apply automated chest compression or defibrillator patch; verify airway patency")
        crew_checklist.append(f"Transmit emergency packet to ground control (comm latency: {habitat_profile.latency_label})")
        crew_checklist.append("Administer high-flow O2 via non-rebreather mask; prepare emergency IV fluid pressurizer")
    elif severity == "CAUTION":
        if renal_status == "CAUTION":
            crew_checklist.append("Drink 500 mL water immediately with potassium citrate hydration pack")
        if cardio_status == "CAUTION":
            crew_checklist.append("Rest seated/anchored for 15 minutes; re-test blood pressure and SpO2")
        if musculo_status == "CAUTION":
            crew_checklist.append("Schedule compensatory 30-min ARED resistive session before sleep")
        if neuro_status == "CAUTION":
            crew_checklist.append("Inspect cabin CO2 CDRA scrubbers; increase local air circulation fans")
        crew_checklist.append("Repeat telemetry capture in 60 minutes to verify baseline stabilization")
    else:
        crew_checklist.append("All systems nominal: complete scheduled mission activities and daily ARED session")
        crew_checklist.append("Maintain 2,500 mL water intake and log dinner meal calories")
        crew_checklist.append("Ensure 7.5+ hour sleep rest window in shielded crew quarters")

    # 7. SBAR Ground Packet
    situation = (
        f"Cmdr. Ameer Umar (Day {baseline.mission_day}, {habitat_profile.name}) presenting with "
        f"Readiness Score {readiness_score}/100 [Overall Status: {severity}]."
    )
    background = (
        f"Habitat gravity {habitat_profile.gravity_g:.2f}g, Comm latency {habitat_profile.latency_label}, "
        f"Sync: {habitat_profile.sync_mode}. Baseline HR {baseline.hr_mean} bpm, BP {baseline.systolic_mean:.0f}/{baseline.diastolic_mean:.0f}."
    )
    assessment = (
        f"Current: HR {payload.heart_rate_bpm:.0f} bpm (Z={hr_z_score:+.2f}), BP {payload.systolic_bp:.0f}/{payload.diastolic_bp:.0f} mmHg, "
        f"SpO2 {payload.spo2_pct:.1f}%, USG {payload.urine_specific_gravity:.3f}, Renal Stone Risk {renal_risk:.1f}/100. "
        + (f"Critical findings: {'; '.join(triggers)}" if triggers else "No critical anomalies.")
    )
    recommendation = (
        f"Primary crew action: {crew_checklist[0]}. "
        + (f"Immediate local autonomous intervention required due to {habitat_profile.latency_label} communication delay."
           if habitat_profile.sync_mode == "STORE_AND_FORWARD_OFFLINE"
           else "Telemetry packet buffered for Flight Surgeon review.")
    )

    sbar_text = (
        f"[SBAR-PACKET]\n"
        f"SITUATION: {situation}\n"
        f"BACKGROUND: {background}\n"
        f"ASSESSMENT: {assessment}\n"
        f"RECOMMENDATION: {recommendation}"
    )

    # 8. Store and Forward Queue Count
    queue_count = 0
    if habitat_profile.sync_mode == "STORE_AND_FORWARD_OFFLINE":
        queue_count = 3  # Packets queued during Mars blackout or edge clinic offline state
    elif habitat_profile.sync_mode == "NEAR_REALTIME_BUFFER":
        queue_count = 1

    trigger_summary_str = " | ".join(triggers) if triggers else "Nominal: All parameters within standard deviation margins."

    return EvaluationResponse(
        severity=severity,
        readiness_score=readiness_score,
        hr_z_score=hr_z_score,
        bp_z_score=bp_z_score,
        renal_stone_risk_index=renal_risk,
        habitat_profile=habitat_profile,
        organs=organs_list,
        deterministic_trigger_summary=trigger_summary_str,
        crew_action_checklist=crew_checklist,
        sbar_ground_packet=sbar_text,
        store_and_forward_queue_count=queue_count,
    )

