"""TAURARO: Environmental Simulation & Aerospace Clinical Telemetry Presets
Provides habitat profiles, 12-point historical telemetry series, and non-doctor astronaut measurement SOPs.
"""

from typing import Dict, List
from backend.app.models import (
    HabitatProfile,
    HabitatType,
    MeasurementGuide,
    ScenarioType,
    TelemetryHistoryPoint,
    TelemetryPayload,
)

# ---------------------------------------------------------------------------
# Habitat Operational Profiles
# ---------------------------------------------------------------------------
HABITAT_PROFILES: Dict[HabitatType, HabitatProfile] = {
    "ORBITAL_STATION": HabitatProfile(
        habitat_id="ORBITAL_STATION",
        name="Low Earth Orbit Station (ISS / Commercial LEO)",
        gravity_g=0.00,
        latency_label="0.4s (Real-Time Synchronized)",
        sync_mode="REALTIME_SYNCED",
        environment_hazards=[
            "Microgravity cephalad fluid redistribution (puffy face syndrome)",
            "Progressive trabecular bone calcium loss (~1-1.5% per month)",
            "Postural muscle sarcomere atrophy without high-load resistive exercise",
            "Continuous Low Earth Orbit cosmic ionizing radiation (0.4-0.8 mSv/day)",
            "High-frequency micro-meteoroid orbital debris (MMOD) shielding risk",
        ],
        cpr_restraint_method=(
            "Crew Medical Restraint System (CMRS) with patient torso harness strap-in, "
            "or reverse handstand technique: rescuer plants feet firmly against opposite "
            "overhead module bulkhead and uses leg extension to deliver 50-60mm compression "
            "depth directly into patient's sternum without rescuer upward rebound."
        ),
        radiation_limit_msv=50.0,
    ),
    "LUNAR_SURFACE": HabitatProfile(
        habitat_id="LUNAR_SURFACE",
        name="Artemis Base Camp (Lunar South Pole Shackleton Rim)",
        gravity_g=0.16,
        latency_label="2.6s (Near Real-Time Buffer)",
        sync_mode="NEAR_REALTIME_BUFFER",
        environment_hazards=[
            "Sub-micron jagged, highly abrasive lunar regolith dust airlock infiltration",
            "1/6th gravity neuromuscular gait adaptation and increased fall hazard",
            "Unshielded Solar Particle Events (SPE) requiring solar storm storm-shelter retreat",
            "Extreme lunar day/night thermal swing (-130°C to +120°C)",
            "Secondary bremsstrahlung radiation from lunar surface regolith backscatter",
        ],
        cpr_restraint_method=(
            "Torso-brace straddle technique: Rescuer kneels straddling patient on habitat deck, "
            "securing knee-wedge retaining straps under floor tie-downs. In 0.16g, body weight alone "
            "is insufficient to compress chest 5cm; rescuer must rely on anchored mechanical leverage."
        ),
        radiation_limit_msv=65.0,
    ),
    "DEEP_SPACE_TRANSIT": HabitatProfile(
        habitat_id="DEEP_SPACE_TRANSIT",
        name="Deep-Space Mars Transit Vehicle (Heliocentric Cruise)",
        gravity_g=0.00,
        latency_label="18m 20s (Mars-Earth Blackout)",
        sync_mode="STORE_AND_FORWARD_OFFLINE",
        environment_hazards=[
            "Unattenuated Galactic Cosmic Rays (high-Z and energy HZE nuclei)",
            "Severe communication delay (up to 24-minute roundtrip light delay)",
            "Absolute zero medical evacuation capability to Earth emergency rooms",
            "High psychological confinement, sensory monotony, and circadian disruption",
            "Closed-loop life support chemical micro-contaminant accumulation",
        ],
        cpr_restraint_method=(
            "Bulkhead-tethered rigid compression bracket: Rescuer locks pelvic harness onto "
            "the medical workstation hardpoint directly above the patient. Rescuer cannot exert "
            "adequate downward force without positive harness lock-in. Metronome guidance fixed at 110 bpm."
        ),
        radiation_limit_msv=100.0,
    ),
    "EARTH_ANALOG_CLINIC": HabitatProfile(
        habitat_id="EARTH_ANALOG_CLINIC",
        name="Extreme Terrestrial Analog / Low-Resource Rural Telemedicine",
        gravity_g=1.00,
        latency_label="Offline Edge / Store-and-Forward Telehealth",
        sync_mode="STORE_AND_FORWARD_OFFLINE",
        environment_hazards=[
            "Geographical isolation and severe transport weather barriers",
            "Intermittent low-bandwidth satellite/cellular uplink",
            "Absence of on-site physician or advanced intensive care imaging",
            "Dependence on edge battery power and ruggedized handheld diagnostic kits",
        ],
        cpr_restraint_method=(
            "Standard AHA/ERC BLS: Place patient supine on rigid backboard or firm floor. "
            "Rescuer kneels alongside victim's chest, delivers 100-120 compressions/min "
            "at 5-6 cm depth using upper body weight with complete chest recoil between compressions."
        ),
        radiation_limit_msv=20.0,
    ),
}

# ---------------------------------------------------------------------------
# Scenario Presets and 12-Point Historical Trend Series
# ---------------------------------------------------------------------------
SCENARIO_PRESETS: Dict[ScenarioType, Dict] = {
    "NOMINAL": {
        "payload": TelemetryPayload(
            habitat="ORBITAL_STATION",
            scenario="NOMINAL",
            heart_rate_bpm=68.0,
            hrv_ms=65.0,
            systolic_bp=115.0,
            diastolic_bp=74.0,
            spo2_pct=98.4,
            skin_temp_c=36.6,
            radiation_msv=0.12,
            cabin_co2_mmhg=3.1,
            water_intake_ml=2450.0,
            calories_kcal=2780.0,
            calcium_mg=1050.0,
            vit_d_iu=800.0,
            urine_specific_gravity=1.014,
            sleep_hrs=7.5,
            ared_exercise_mins=60.0,
            mood_score=5,
        ),
        "history": [
            TelemetryHistoryPoint(time_label="T-11h", heart_rate_bpm=67.0, systolic_bp=114.0, diastolic_bp=73.0, spo2_pct=98.5, water_intake_ml=200.0, urine_specific_gravity=1.013),
            TelemetryHistoryPoint(time_label="T-10h", heart_rate_bpm=68.0, systolic_bp=115.0, diastolic_bp=74.0, spo2_pct=98.3, water_intake_ml=450.0, urine_specific_gravity=1.014),
            TelemetryHistoryPoint(time_label="T-9h",  heart_rate_bpm=71.0, systolic_bp=116.0, diastolic_bp=75.0, spo2_pct=98.6, water_intake_ml=700.0, urine_specific_gravity=1.014),
            TelemetryHistoryPoint(time_label="T-8h",  heart_rate_bpm=82.0, systolic_bp=122.0, diastolic_bp=78.0, spo2_pct=98.4, water_intake_ml=950.0, urine_specific_gravity=1.015),
            TelemetryHistoryPoint(time_label="T-7h",  heart_rate_bpm=70.0, systolic_bp=116.0, diastolic_bp=74.0, spo2_pct=98.5, water_intake_ml=1200.0, urine_specific_gravity=1.014),
            TelemetryHistoryPoint(time_label="T-6h",  heart_rate_bpm=68.0, systolic_bp=114.0, diastolic_bp=73.0, spo2_pct=98.3, water_intake_ml=1450.0, urine_specific_gravity=1.014),
            TelemetryHistoryPoint(time_label="T-5h",  heart_rate_bpm=69.0, systolic_bp=115.0, diastolic_bp=74.0, spo2_pct=98.4, water_intake_ml=1700.0, urine_specific_gravity=1.013),
            TelemetryHistoryPoint(time_label="T-4h",  heart_rate_bpm=67.0, systolic_bp=113.0, diastolic_bp=72.0, spo2_pct=98.5, water_intake_ml=1900.0, urine_specific_gravity=1.014),
            TelemetryHistoryPoint(time_label="T-3h",  heart_rate_bpm=69.0, systolic_bp=115.0, diastolic_bp=74.0, spo2_pct=98.4, water_intake_ml=2100.0, urine_specific_gravity=1.014),
            TelemetryHistoryPoint(time_label="T-2h",  heart_rate_bpm=68.0, systolic_bp=114.0, diastolic_bp=73.0, spo2_pct=98.5, water_intake_ml=2250.0, urine_specific_gravity=1.014),
            TelemetryHistoryPoint(time_label="T-1h",  heart_rate_bpm=67.0, systolic_bp=115.0, diastolic_bp=74.0, spo2_pct=98.3, water_intake_ml=2400.0, urine_specific_gravity=1.013),
            TelemetryHistoryPoint(time_label="T-0h",  heart_rate_bpm=68.0, systolic_bp=115.0, diastolic_bp=74.0, spo2_pct=98.4, water_intake_ml=2450.0, urine_specific_gravity=1.014),
        ],
    },
    "DEHYDRATION_RENAL_DRIFT": {
        "payload": TelemetryPayload(
            habitat="ORBITAL_STATION",
            scenario="DEHYDRATION_RENAL_DRIFT",
            heart_rate_bpm=96.0,
            hrv_ms=38.0,
            systolic_bp=104.0,
            diastolic_bp=68.0,
            spo2_pct=97.2,
            skin_temp_c=36.9,
            radiation_msv=0.15,
            cabin_co2_mmhg=3.4,
            water_intake_ml=1200.0,
            calories_kcal=1950.0,
            calcium_mg=1250.0,
            vit_d_iu=400.0,
            urine_specific_gravity=1.027,
            sleep_hrs=5.4,
            ared_exercise_mins=25.0,
            mood_score=3,
        ),
        "history": [
            TelemetryHistoryPoint(time_label="T-11h", heart_rate_bpm=70.0, systolic_bp=114.0, diastolic_bp=74.0, spo2_pct=98.2, water_intake_ml=150.0, urine_specific_gravity=1.016),
            TelemetryHistoryPoint(time_label="T-10h", heart_rate_bpm=72.0, systolic_bp=112.0, diastolic_bp=73.0, spo2_pct=98.1, water_intake_ml=250.0, urine_specific_gravity=1.017),
            TelemetryHistoryPoint(time_label="T-9h",  heart_rate_bpm=75.0, systolic_bp=111.0, diastolic_bp=72.0, spo2_pct=98.0, water_intake_ml=400.0, urine_specific_gravity=1.018),
            TelemetryHistoryPoint(time_label="T-8h",  heart_rate_bpm=78.0, systolic_bp=110.0, diastolic_bp=71.0, spo2_pct=97.9, water_intake_ml=550.0, urine_specific_gravity=1.020),
            TelemetryHistoryPoint(time_label="T-7h",  heart_rate_bpm=80.0, systolic_bp=109.0, diastolic_bp=70.0, spo2_pct=97.8, water_intake_ml=650.0, urine_specific_gravity=1.021),
            TelemetryHistoryPoint(time_label="T-6h",  heart_rate_bpm=83.0, systolic_bp=108.0, diastolic_bp=70.0, spo2_pct=97.6, water_intake_ml=750.0, urine_specific_gravity=1.022),
            TelemetryHistoryPoint(time_label="T-5h",  heart_rate_bpm=86.0, systolic_bp=107.0, diastolic_bp=69.0, spo2_pct=97.5, water_intake_ml=850.0, urine_specific_gravity=1.023),
            TelemetryHistoryPoint(time_label="T-4h",  heart_rate_bpm=89.0, systolic_bp=106.0, diastolic_bp=69.0, spo2_pct=97.5, water_intake_ml=950.0, urine_specific_gravity=1.024),
            TelemetryHistoryPoint(time_label="T-3h",  heart_rate_bpm=91.0, systolic_bp=105.0, diastolic_bp=68.0, spo2_pct=97.4, water_intake_ml=1050.0, urine_specific_gravity=1.025),
            TelemetryHistoryPoint(time_label="T-2h",  heart_rate_bpm=93.0, systolic_bp=105.0, diastolic_bp=68.0, spo2_pct=97.3, water_intake_ml=1100.0, urine_specific_gravity=1.026),
            TelemetryHistoryPoint(time_label="T-1h",  heart_rate_bpm=95.0, systolic_bp=104.0, diastolic_bp=67.0, spo2_pct=97.2, water_intake_ml=1150.0, urine_specific_gravity=1.027),
            TelemetryHistoryPoint(time_label="T-0h",  heart_rate_bpm=96.0, systolic_bp=104.0, diastolic_bp=68.0, spo2_pct=97.2, water_intake_ml=1200.0, urine_specific_gravity=1.027),
        ],
    },
    "LUNAR_DUST_HYPOXIA": {
        "payload": TelemetryPayload(
            habitat="LUNAR_SURFACE",
            scenario="LUNAR_DUST_HYPOXIA",
            heart_rate_bpm=112.0,
            hrv_ms=29.0,
            systolic_bp=128.0,
            diastolic_bp=84.0,
            spo2_pct=91.5,
            skin_temp_c=37.3,
            radiation_msv=0.28,
            cabin_co2_mmhg=4.8,
            water_intake_ml=2100.0,
            calories_kcal=2400.0,
            calcium_mg=950.0,
            vit_d_iu=800.0,
            urine_specific_gravity=1.018,
            sleep_hrs=6.0,
            ared_exercise_mins=45.0,
            mood_score=2,
        ),
        "history": [
            TelemetryHistoryPoint(time_label="T-11h", heart_rate_bpm=72.0, systolic_bp=116.0, diastolic_bp=75.0, spo2_pct=98.2, water_intake_ml=200.0, urine_specific_gravity=1.015),
            TelemetryHistoryPoint(time_label="T-10h", heart_rate_bpm=74.0, systolic_bp=117.0, diastolic_bp=76.0, spo2_pct=98.1, water_intake_ml=450.0, urine_specific_gravity=1.015),
            TelemetryHistoryPoint(time_label="T-9h",  heart_rate_bpm=76.0, systolic_bp=118.0, diastolic_bp=76.0, spo2_pct=98.0, water_intake_ml=750.0, urine_specific_gravity=1.016),
            TelemetryHistoryPoint(time_label="T-8h",  heart_rate_bpm=80.0, systolic_bp=119.0, diastolic_bp=77.0, spo2_pct=97.9, water_intake_ml=1000.0, urine_specific_gravity=1.016),
            TelemetryHistoryPoint(time_label="T-7h",  heart_rate_bpm=82.0, systolic_bp=120.0, diastolic_bp=78.0, spo2_pct=97.5, water_intake_ml=1250.0, urine_specific_gravity=1.017),
            TelemetryHistoryPoint(time_label="T-6h",  heart_rate_bpm=85.0, systolic_bp=121.0, diastolic_bp=78.0, spo2_pct=97.0, water_intake_ml=1450.0, urine_specific_gravity=1.017),
            TelemetryHistoryPoint(time_label="T-5h",  heart_rate_bpm=89.0, systolic_bp=122.0, diastolic_bp=80.0, spo2_pct=96.2, water_intake_ml=1650.0, urine_specific_gravity=1.017),
            TelemetryHistoryPoint(time_label="T-4h",  heart_rate_bpm=94.0, systolic_bp=124.0, diastolic_bp=81.0, spo2_pct=95.1, water_intake_ml=1800.0, urine_specific_gravity=1.018),
            TelemetryHistoryPoint(time_label="T-3h",  heart_rate_bpm=99.0, systolic_bp=125.0, diastolic_bp=82.0, spo2_pct=94.0, water_intake_ml=1900.0, urine_specific_gravity=1.018),
            TelemetryHistoryPoint(time_label="T-2h",  heart_rate_bpm=104.0, systolic_bp=126.0, diastolic_bp=83.0, spo2_pct=93.1, water_intake_ml=2000.0, urine_specific_gravity=1.018),
            TelemetryHistoryPoint(time_label="T-1h",  heart_rate_bpm=108.0, systolic_bp=127.0, diastolic_bp=84.0, spo2_pct=92.3, water_intake_ml=2050.0, urine_specific_gravity=1.018),
            TelemetryHistoryPoint(time_label="T-0h",  heart_rate_bpm=112.0, systolic_bp=128.0, diastolic_bp=84.0, spo2_pct=91.5, water_intake_ml=2100.0, urine_specific_gravity=1.018),
        ],
    },
    "CODE_RED_COLLAPSE": {
        "payload": TelemetryPayload(
            habitat="DEEP_SPACE_TRANSIT",
            scenario="CODE_RED_COLLAPSE",
            heart_rate_bpm=148.0,
            hrv_ms=12.0,
            systolic_bp=84.0,
            diastolic_bp=50.0,
            spo2_pct=87.0,
            skin_temp_c=35.8,
            radiation_msv=0.18,
            cabin_co2_mmhg=3.8,
            water_intake_ml=1100.0,
            calories_kcal=1600.0,
            calcium_mg=800.0,
            vit_d_iu=400.0,
            urine_specific_gravity=1.026,
            sleep_hrs=4.2,
            ared_exercise_mins=0.0,
            mood_score=1,
        ),
        "history": [
            TelemetryHistoryPoint(time_label="T-11h", heart_rate_bpm=72.0, systolic_bp=118.0, diastolic_bp=75.0, spo2_pct=98.0, water_intake_ml=200.0, urine_specific_gravity=1.016),
            TelemetryHistoryPoint(time_label="T-10h", heart_rate_bpm=74.0, systolic_bp=119.0, diastolic_bp=76.0, spo2_pct=97.9, water_intake_ml=400.0, urine_specific_gravity=1.017),
            TelemetryHistoryPoint(time_label="T-9h",  heart_rate_bpm=75.0, systolic_bp=117.0, diastolic_bp=75.0, spo2_pct=97.8, water_intake_ml=600.0, urine_specific_gravity=1.018),
            TelemetryHistoryPoint(time_label="T-8h",  heart_rate_bpm=78.0, systolic_bp=116.0, diastolic_bp=74.0, spo2_pct=97.5, water_intake_ml=750.0, urine_specific_gravity=1.019),
            TelemetryHistoryPoint(time_label="T-7h",  heart_rate_bpm=80.0, systolic_bp=115.0, diastolic_bp=74.0, spo2_pct=97.3, water_intake_ml=850.0, urine_specific_gravity=1.020),
            TelemetryHistoryPoint(time_label="T-6h",  heart_rate_bpm=82.0, systolic_bp=114.0, diastolic_bp=73.0, spo2_pct=97.0, water_intake_ml=950.0, urine_specific_gravity=1.021),
            TelemetryHistoryPoint(time_label="T-5h",  heart_rate_bpm=85.0, systolic_bp=112.0, diastolic_bp=72.0, spo2_pct=96.7, water_intake_ml=1000.0, urine_specific_gravity=1.022),
            TelemetryHistoryPoint(time_label="T-4h",  heart_rate_bpm=88.0, systolic_bp=110.0, diastolic_bp=70.0, spo2_pct=96.0, water_intake_ml=1050.0, urine_specific_gravity=1.024),
            TelemetryHistoryPoint(time_label="T-3h",  heart_rate_bpm=96.0, systolic_bp=108.0, diastolic_bp=68.0, spo2_pct=94.5, water_intake_ml=1100.0, urine_specific_gravity=1.025),
            TelemetryHistoryPoint(time_label="T-2h",  heart_rate_bpm=115.0, systolic_bp=102.0, diastolic_bp=64.0, spo2_pct=92.0, water_intake_ml=1100.0, urine_specific_gravity=1.025),
            TelemetryHistoryPoint(time_label="T-1h",  heart_rate_bpm=136.0, systolic_bp=92.0,  diastolic_bp=58.0, spo2_pct=89.0, water_intake_ml=1100.0, urine_specific_gravity=1.026),
            TelemetryHistoryPoint(time_label="T-0h",  heart_rate_bpm=148.0, systolic_bp=84.0,  diastolic_bp=50.0, spo2_pct=87.0, water_intake_ml=1100.0, urine_specific_gravity=1.026),
        ],
    },
}

# ---------------------------------------------------------------------------
# Non-Doctor Astronaut Clinical Measurement SOP Guides
# ---------------------------------------------------------------------------
MEASUREMENT_GUIDES: List[MeasurementGuide] = [
    MeasurementGuide(
        id="bp-brachial-01",
        title="Brachial Blood Pressure & Orthostatic Pulse Check",
        target_organ="cardio",
        frequency="Twice Daily (Wake + 30m, and Pre-Sleep)",
        equipment_needed="Space-Certified Pneumatic Arm Cuff with Bluetooth Telemetry Link",
        why_it_matters=(
            "In microgravity, ~2 liters of blood and interstitial fluid shift headward (cephalad shift). "
            "Because there is no hydrostatic pressure column, systemic vascular resistance decreases and "
            "left ventricular mass slightly remodels. Monitoring BP tracks cardiac stroke volume and detects early orthostatic intolerance."
        ),
        gravity_adjustment_note=(
            "In 0g and 0.16g, anchor the astronaut to the wall restraint rail using thigh straps. "
            "Cuff inflation causes arm displacement if unanchored. Keep the upper arm strictly at heart level "
            "to prevent hydrostatic measurement artifacts."
        ),
        steps=[
            "Attach thigh restraint strap to bulkhead foot loop to prevent floating during inflation.",
            "Slide cuff onto bare left upper arm, positioning the arterial arrow 2 cm above antecubital fossa.",
            "Fasten cuff snug (allow two fingers under edge) and verify wireless sensor sync.",
            "Rest arm across chest with cuff positioned horizontally level with the cardiac mid-sternum.",
            "Depress 'Cycle Start' button; remain completely motionless and avoid vocal communication for 90 seconds.",
            "Review automatic Systolic/Diastolic and Pulse Pressure display; confirm automated packet transfer.",
        ],
        normal_range_label="110-125 / 70-80 mmHg (Pulse: 60-80 bpm)",
    ),
    MeasurementGuide(
        id="usg-refractometer-02",
        title="Hydration & Colorimetric Urine Specific Gravity (USG) Assay",
        target_organ="renal",
        frequency="Morning First-Void & Post-ARED Exercise Session",
        equipment_needed="Handheld Digital Clinical Refractometer & Multi-Reagent Dry Chem Strip",
        why_it_matters=(
            "Spaceflight deconditions thirst receptors while microgravity accelerates skeletal osteoclast calcium resorption. "
            "Urine becomes hyper-concentrated with calcium oxalate and calcium phosphate. A USG > 1.020 significantly elevates "
            "the probability of nephrolithiasis (kidney stones), a mission-critical evacuation risk in deep space."
        ),
        gravity_adjustment_note=(
            "Fluids form floating spherical globules in microgravity. All sample collection must utilize the "
            "Waste Collection System (WCS) syringe aspiration adapter. Never expose open liquid droplets inside the cabin."
        ),
        steps=[
            "Mount sterile single-use syringe onto the WCS sample port septum.",
            "Aspirate exactly 1.0 mL void sample into syringe barrel without creating bubbles.",
            "Dispense 2 drops onto the prism well of the handheld digital refractometer.",
            "Close light cover plate and depress 'READ' button; record USG reading immediately.",
            "Dip colorimetric test strip for exactly 1 second; compare strip pads to dry color reference chart for pH and protein.",
            "Flush prism with sterile deionized water wipe and stow disposable syringe in biohazard waste canister.",
        ],
        normal_range_label="1.010 - 1.018 USG (Urine pH: 6.0 - 7.0, Clear Straw Color)",
    ),
    MeasurementGuide(
        id="ecg-patch-03",
        title="12-Lead Wireless ECG & Continuous Pulse Oximetry Patch",
        target_organ="cardio",
        frequency="Continuous During EVA/ARED; Spot-Check During Malaise",
        equipment_needed="Bio-Monitor Hydrogel Chest Sensor Patch & Dual-Wavelength Finger Sensor",
        why_it_matters=(
            "Cardiac rhythm disturbances (atrial and ventricular premature beats) have been documented during space missions. "
            "Hypoxia from suit leaks, elevated cabin CO2, or sudden coronary events require instant rhythm and oxygen saturation differentiation."
        ),
        gravity_adjustment_note=(
            "Microgravity perspiration floats on the skin rather than dripping, which can loosen adhesive hydrogel electrodes. "
            "Clean skin thoroughly with an alcohol prep pad and allow complete evaporation before applying the sensor patch."
        ),
        steps=[
            "Degrease sternal skin with isopropyl alcohol swab; allow 30 seconds for air dry.",
            "Peel backing from central bio-harness patch and align over mid-sternum at the level of the 4th intercostal space.",
            "Press firmly around all adhesive perimeter rings for 15 seconds to ensure airtight gel contact.",
            "Slide optical pulse oximeter clip onto non-dominant index finger; verify photoplethysmogram waveform stability.",
            "Check that Bluetooth telemetry transmits green packet confirmation to the TAURARO mission console.",
            "Initiate a 2-minute rhythm baseline capture while maintaining calm regular respiration.",
        ],
        normal_range_label="Normal Sinus Rhythm, SpO2 ≥ 96.0%, PR interval 120-200ms",
    ),
    MeasurementGuide(
        id="neuro-sans-04",
        title="Neuro-Ocular (SANS) Amsler Grid & Pupillometry Self-Check",
        target_organ="neuro",
        frequency="Weekly or Immediate Upon Visual Blur / Morning Headache",
        equipment_needed="Digital Near-Vision Card, Monocular Amsler Eye Mask & Handheld Pupillometer",
        why_it_matters=(
            "Spaceflight-Associated Neuro-ocular Syndrome (SANS) affects ~70% of long-duration astronauts due to continuous cephalad venous hypertension. "
            "Symptoms include optic disc edema (papilledema), globe flattening, and hyperopic visual shift. Early detection prevents permanent vision loss."
        ),
        gravity_adjustment_note=(
            "Perform test under standard 100-lux cabin cabin illumination. Avoid performing test immediately after high-intensity resistive exercise "
            "when intracranial pressure transiently spikes."
        ),
        steps=[
            "Position handheld display at calibrated 35 cm distance using the fixed spacer cord.",
            "Occlude the right eye completely with the monocular shield while keeping both eyes open.",
            "Fixate left eye on the center dot of the high-contrast white-on-black Amsler Grid for 15 seconds.",
            "Verify all grid lines appear perfectly straight, with no wavy distortions (metamorphopsia) or blind spots (scotoma).",
            "Repeat procedure for right eye.",
            "Engage handheld pupillometer to photograph pupil light constriction reflex latency and resting diameter.",
            "Log self-reported visual clarity score (1 to 5) into the TAURARO interface.",
        ],
        normal_range_label="Sharp undistorted grid lines bilaterally; Pupil constriction latency < 250ms",
    ),
]

