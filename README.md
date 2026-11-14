# ★ TAURARO: Universal Space Exploration Health Monitoring, Risk Assessment & Autonomous Triage Platform

[![2026 NASA International Space Apps Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Global%20Challenge-blue?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/)
[![Challenge: Health Monitoring Software for Astronauts](https://img.shields.io/badge/Challenge-Brazilian%20Space%20Agency%20(AEB)-009c3b?style=for-the-badge)](https://www.gov.br/aeb/pt-br)
[![NASA HRP Standard Measures Aligned](https://img.shields.io/badge/Alignment-NASA%20HRP%20%2B%20OSDR-06B6D4?style=for-the-badge)](https://www.nasa.gov/hrp)
[![Offline Edge Resilient](https://img.shields.io/badge/Architecture-100%25%20Offline%20Edge%20Ready-10B981?style=for-the-badge)](#)

> **"Imagine you're halfway to Mars... suddenly your fellow crewmate feels a sharp pain in the chest and collapses. What's happening? Is he or she dying? What should you do?"**  
> — *Brazilian Space Agency (AEB) Challenge Video (0:50)*

**TAURARO** (Hausa for *"Stars"*) is an autonomous spaceflight medical companion, non-doctor anatomical digital twin, and crisis life-support system engineered for astronauts exploring Low Earth Orbit, the Lunar Surface (Artemis), and Deep-Space Transit to Mars.

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [NASA Space Apps Judging Criteria Alignment](#-nasa-space-apps-judging-criteria-alignment)
   - [Pillar 1: Impact](#1-impact-saving-astronaut-lives--rural-earth-telehealth)
   - [Pillar 2: Creativity](#2-creativity-interactive-anatomical-body-twin--110-bpm-metronome)
   - [Pillar 3: Validity](#3-validity-nasa-hrp--osdr-deterministic-mathematical-engine)
   - [Pillar 4: Relevance](#4-relevance-solving-the-aeb-050-chest-pain-collapse-challenge)
   - [Pillar 5: Presentation](#5-presentation-mission-critical-aerospace-console)
3. [The 4 Core Architectural Pillars](#-the-4-core-architectural-pillars)
4. [Official NASA & Space Agency Resources Used](#-official-nasa--space-agency-resources-used)
5. [One-Command Quick Start (`./start_tauraro.sh`)](#-one-command-quick-start)
6. [Team & Attribution](#-team--attribution)

---

## 🌌 Executive Summary & Problem Statement

As exploration missions expand beyond Earth's magnetic shielding and communication horizon, astronauts must operate with **complete medical autonomy**:

* **Astronauts Are Not Medical Doctors**: Crew members are aerospace engineers, geologists, and astrophysicists. Complex clinical jargon confuses operators during crisis situations.
* **Light-Speed Communication Latency & Blackouts**: Earth-to-Mars telemetry delays range from **3 to 22 minutes one-way (up to 44 minutes round-trip)**. Waiting for Mission Control Flight Surgeons during acute cardiac arrest or sudden decompression is fatal.
* **Microgravity Physiology Compounding Hazards**:
  - Cephalad fluid shift (~2 liters of venous blood pools headward), masking hypovolemia and driving Spaceflight-Associated Neuro-ocular Syndrome (SANS).
  - Rapid trabecular bone calcium resorption (~1.0%–1.5% bone density lost per month), dumping excess calcium into glomerular filtrate.
  - When combined with blunted thirst sensation and skipped resistive exercise, urine supersaturates with calcium oxalate, triggering mission-terminating **nephrolithiasis (kidney stones)**.
* **Zero Physical Evacuation**: In deep-space transit, there is no emergency room within 50 million kilometers.

---

## 🏆 NASA Space Apps Judging Criteria Alignment

### 1. Impact: Saving Astronaut Lives & Rural Earth Telehealth
- **Deep Space**: TAURARO transforms non-doctor astronauts into autonomous responders capable of stabilizing acute arrhythmias, preventing kidney stone formation, and pacing CPR compressions.
- **Earth Telemedicine Spinoff**: TAURARO's `EARTH_ANALOG_CLINIC` mode operates 100% offline on low-resource edge hardware. In rural clinics across Sub-Saharan Africa and isolated northern analog habitats, community health workers without internet can perform clinical triage, monitor maternal/cardiac hemodynamics, and queue store-and-forward packets for regional hospitals.

### 2. Creativity: Interactive Anatomical Body Twin & 110 BPM Metronome
- **Interactive Anatomical Body Twin**: Solves the AEB challenge for a non-doctor visual representation. Astronauts click directly on Head (`neuro`), Chest (`cardio`), Core (`renal`), Limbs (`musculo`), or Systemic (`immune`) to see real-time physiological status without medical jargon.
- **Native Web Audio CPR Metronome**: Generates an audible 880 Hz cadence at exactly 110 beats per minute via the browser's native `AudioContext` with zero external dependencies, accompanied by a pulsing visual compression ring (`5 cm depth target`).

### 3. Validity: NASA HRP & OSDR Deterministic Mathematical Engine
- **Pure Deterministic Z-Score Math**: Computes individual baseline deviations ($Z = \frac{\text{Telemetry} - \mu}{\sigma}$) against personalized astronaut baselines (e.g. Cmdr. Ameer Umar, Mission Sol 142).
- **Evidence-Based Nephrolithiasis Risk Index ($0$–$100$)**: Directly couples water volume intake deficit ($< 2,500\text{ mL}$), elevated urine specific gravity ($> 1.020$), dietary calcium balance, and skipped ARED resistive exercise (uncountered osteoclast bone dumping).

### 4. Relevance: Solving the AEB 0:50 Chest-Pain Collapse Challenge
- **Instant Emergency Transition**: Clicking **`🚨 CODE RED COLLAPSE`** instantly loads the Brazilian Space Agency acute chest pain scenario (HR 148 bpm, BP 84/50 mmHg, SpO2 87%), reveals the gravity-specific restraint instructions (CMRS vs Bulkhead Handstand lock vs partner knee-wedge), and guides the rescuer through Drawer A-2 defibrillator pad placement and oxygenation.

### 5. Presentation: Mission-Critical Aerospace Console
- **Professional Aerospace UI**: Deep Space Canvas (`#070B14`), Orbital Slate (`#0F172A`), Telemetry Cyan (`#06B6D4`), Bio-Safe Emerald (`#10B981`), Baseline Amber (`#F59E0B`), and Code Red (`#EF4444`).
- **Typography Hierarchy**: `Sora` for mission command branding, `Inter` for clinical instructions, and `JetBrains Mono` for Z-scores, timers, and SBAR ground packets.

---

## 🏛️ The 4 Core Architectural Pillars

```
+----------------------------------------------------------------------------------------------------+
|                                    TAURARO MISSION CONTROL SYSTEM                                   |
+----------------------------------+----------------------------------+------------------------------+
|  1. EXPLORATION ENVIRONMENTS     |  2. ANATOMICAL TWIN & SOPs       |  3. NUTRITION & RENAL ENGINE |
|  • ORBITAL_STATION (0g, 0.4s)    |  • Interactive SVG Body Twin     |  • Bone Demineralization Sim |
|  • LUNAR_SURFACE (0.16g, 2.6s)   |  • 5 Dynamic Organ Focus Zones   |  • Nephrolithiasis Index 0-100|
|  • DEEP_SPACE_TRANSIT (0g, 18m)  |  • 4 NASA HRP SOP Guides         |  • Real-time ARED Sliders    |
|  • EARTH_ANALOG_CLINIC (1g Edge) |  • Gamified Sol Streak Tracker   |  • Dietary Calcium/Vit D     |
+----------------------------------+----------------------------------+------------------------------+
|                                  4. CODE RED COLLAPSE & CPR WIZARD                                 |
|  • Brazilian Space Agency 0:50 Life-Support Protocol  • 110 BPM Web Audio Native Metronome         |
|  • Gravity-Specific CMRS / Handstand Restraints       • Structured Autonomous Ground SBAR Uplink   |
+----------------------------------------------------------------------------------------------------+
```

### Pillar 1: Multi-Environment Exploration Engine
Adapts clinical algorithms across 4 gravity regimes and communication latencies:
- **`ORBITAL_STATION`** (0.00g, 0.4s sync): Crew Medical Restraint System (CMRS) torso lock or reverse handstand bulkhead compression.
- **`LUNAR_SURFACE`** (0.16g, 2.6s buffer): Straddle torso-brace with knee-wedge straps under habitat deck tie-downs to counteract 1/6th-g upward recoil.
- **`DEEP_SPACE_TRANSIT`** (0.00g, 18m 20s blackout): Bulkhead-tethered rigid compression bracket; store-and-forward packet queuing.
- **`EARTH_ANALOG_CLINIC`** (1.00g offline edge): Standard AHA/ERC BLS chest compressions on rigid backboard.

### Pillar 2: Interactive Anatomical Body Twin & Guided SOPs
Non-doctor visual interface showing real-time physiological status across 5 systems:
1. **Neuro-Ocular (`neuro`)**: SANS optic disc edema, cephalad venous congestion, cabin CO2 hypercapnia ($> 4.0\text{ mmHg}$). Includes interactive **Digital Amsler Grid**.
2. **Cardiovascular (`cardio`)**: Orthostatic intolerance, stroke volume deconditioning, tachycardia ($> 135\text{ bpm}$), shock.
3. **Renal & Fluid (`renal`)**: Dehydration, hypercalciuria, crystalluria, USG refractometry.
4. **Musculoskeletal (`musculo`)**: Trabecular osteopenia, ARED resistive exercise compliance ($60\text{ min/day}$).
5. **Immune & Respiratory (`immune`)**: Radiation doserate ($> 0.25\text{ mSv/day}$), lunar regolith dust airway inflammation.

### Pillar 3: Space Nutrition, Bone Resorption & Renal Stone Prevention
Models the direct physiological link between uncountered bone calcium resorption and kidney stone formation:
$$\text{Renal Stone Risk Index} = f(\text{Hydration Deficit}) + f(\text{USG} > 1.020) + f(\text{ARED Deficit}) + f(\text{Calcium/Vit D})$$
Crew members drag live sliders for Water (mL), USG, ARED exercise (mins), and calories to watch the risk index and Z-scores update in real time.

### Pillar 4: Code Red Collapse & 0g CPR Wizard
Step-by-step life support solving the AEB 0:50 scenario:
- **Step 1: Gravity-Specific Restraint Lock (`0:00 - 0:30`)**
- **Step 2: Sensor Patch & Airway/Oxygen (`0:30 - 1:00`)**: Medical Kit Drawer A-2 (Red Tab), 12-lead ECG/AED pads, and 100% O2 mask.
- **Step 3: Acute Coronary / Arrhythmia Decision Tree (`1:00 - 2:00`)**: Aspirin 324 mg, Nitroglycerin sublingual (only if BP $> 90$), or AED rhythm analysis and 110 BPM compressions.
- **Step 4: Autonomous SBAR Ground Uplink Beacon**: Packaged and queued for Mission Control Flight Surgeons.

---

## 📚 Official NASA & Space Agency Resources Used

1. **NASA Human Research Program (HRP)**:
   - *Standard Measures Cross-Cutting Physiological and Behavioral Health Roadmap*
   - *Evidence Report: Risk of Renal Stone Formation in Spaceflight*
   - *Evidence Report: Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS)*
   - *Evidence Report: Risk of Cardiovascular Disease and Orthostatic Intolerance*
2. **NASA Open Science Data Repository (OSDR / ALSDA)**:
   - Aerospace physiological adaptation telemetry baselines and multi-omics radiation benchmarks.
3. **Agência Espacial Brasileira (AEB / Brazilian Space Agency)**:
   - *2026 Space Apps Challenge Specification & 0:50 Acute Astronaut Collapse Prompt Video*.

---

## ⚡ One-Command Quick Start

### Prerequisites
- Linux / Ubuntu / macOS
- **Node.js**: v20+ or v24+
- **Python**: 3.11+ (Python 3.14 verified)

### Run Both Backend and Frontend in One Step:
```bash
# Clone the repository
git clone https://github.com/beenumarr/tauraro.git
cd tauraro

# Launch both FastAPI backend and Vite frontend with unified logging
./start_tauraro.sh
```

- **Frontend Console:** [http://localhost:5173](http://localhost:5173)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **REST API Health Endpoint:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

Press `Ctrl+C` in the terminal to cleanly terminate all processes simultaneously.

---

## 🧪 Verification & Build Tests

### Backend REST API Test
```bash
PYTHONPATH=. backend/venv/bin/python -c "
from starlette.testclient import TestClient
from backend.app.main import app

client = TestClient(app)
assert client.get('/api/v1/health').status_code == 200
assert client.get('/api/v1/bootstrap').status_code == 200
assert client.get('/api/v1/scenario/DEEP_SPACE_TRANSIT/CODE_RED_COLLAPSE').status_code == 200
print('✅ All backend test assertions passed!')
"
```

### Frontend Typecheck & Production Build
```bash
cd frontend
npm run build
# -> ✓ built in 2.10s (0 errors, 0 warnings)

npm run lint
# -> Found 0 warnings and 0 errors across 13 files.
```

---

## 👥 Team & Attribution

Developed with pride for the **2026 NASA International Space Apps Challenge** by the team at **BWSO Innovation Hub**:
- **Lead Developer & System Architect:** Ameer Umar (`Cmdr. Ameer Umar`)
- **Institution:** BWSO Innovation Hub

*Dedicated to advancing human space exploration and empowering remote community telemedicine across the stars and on Earth.*
