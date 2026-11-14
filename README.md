# TAURARO: Universal Space Exploration Health Monitoring & Autonomous Triage Platform

**2026 NASA International Space Apps Challenge**  
**Challenge:** Create Health Monitoring Software for Astronauts on Space Missions  
**Official Data Alignment:** NASA Human Research Program (HRP Standard Measures) & NASA Open Science Data Repository (OSDR)  
**Live Repository:** [https://github.com/beenumarr/tauraro](https://github.com/beenumarr/tauraro)

---

## 🚀 Mission Overview & Problem Statement

As humanity expands beyond Low Earth Orbit toward the Lunar South Pole (Artemis), Deep-Space Transit, and Mars, missions become longer and fundamentally detached from immediate Earth support. 

Astronauts are scientists, pilots, and engineers—**they are not medical doctors**. On a transit to Mars, light-speed communication delays reach **up to 24 minutes round-trip**, and physical medical evacuation to an Earth hospital is impossible.

**TAURARO** empowers non-doctor crew members to:
1. **Understand WHEN and HOW to take health measurements accurately** across varying gravity fields ($0.00g$ microgravity, $0.16g$ lunar gravity, and $1.00g$ terrestrial telemedicine).
2. **Visualize organ-system status on an Interactive Anatomical Body Twin** without medical jargon, highlighting how spaceflight affects the neuro-ocular, cardiovascular, renal, musculoskeletal, and immune systems.
3. **Compound Space Nutrition, Hydration, and ARED Resistive Exercise**: In space, bone unloading releases ~250 mg of excess calcium per day into the bloodstream. When dehydration occurs or ARED workouts are skipped, this calcium concentrates in the kidneys, triggering mission-ending **nephrolithiasis (kidney stones)**. TAURARO provides real-time risk index modeling.
4. **Execute Step-by-Step Non-Doctor Emergency Response & Microgravity CPR**: Directly solving the Brazilian Space Agency scenario (0:50)—when a crewmate suddenly collapses with acute chest pain, TAURARO provides an audible **110 BPM CPR Metronome**, gravity-specific body restraint instructions (CMRS, Bulkhead Handstand lock, or partner knee-wedge), automated defibrillator pad guides, and autonomous SBAR beacon queuing.
5. **Adapt across 4 Operational Exploration Environments**:
   - `ORBITAL_STATION` (Low Earth Orbit / ISS — $0.00g$, $0.4\text{s}$ latency, `REALTIME_SYNCED`)
   - `LUNAR_SURFACE` (Artemis Base Camp — $0.16g$, $2.6\text{s}$ latency, `NEAR_REALTIME_BUFFER`)
   - `DEEP_SPACE_TRANSIT` (Mars Cruise Vehicle — $0.00g$, $18\text{m } 20\text{s}$ latency, `STORE_AND_FORWARD_OFFLINE`)
   - `EARTH_ANALOG_CLINIC` (Extreme Terrestrial Analog / Rural Telemedicine — $1.00g$, offline edge resilience)

---

## 🧬 Core Platform Architecture

```
tauraro/
├── backend/                  # Python 3.14+ FastAPI Microservice
│   ├── app/
│   │   ├── models.py         # Pydantic v2 schemas aligned with NASA HRP & OSDR
│   │   ├── engine.py         # Deterministic Z-score & Renal Stone Risk index engine
│   │   ├── simulator.py      # Habitat profiles, 12-point trend histories & SOP guides
│   │   ├── copilot.py        # Clinical triage & SBAR telemetry packet generator
│   │   └── main.py           # REST API endpoints (/bootstrap, /scenario, /evaluate, /health)
│   └── requirements.txt
│
└── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS v4
    ├── src/
    │   ├── api/client.ts     # Resilient API client with 100% offline fallback simulation
    │   ├── types/tauraro.ts  # End-to-end typed interfaces matching Pydantic v2
    │   ├── components/
    │   │   ├── HeaderCommandBar.tsx        # Mission header, habitat & scenario switcher
    │   │   ├── HabitatStatusRibbon.tsx     # Crew readiness, gravity badge, streak tracking
    │   │   ├── InteractiveBodyTwin.tsx     # Clickable SVG anatomical twin with 5 organ zones
    │   │   ├── TelemetryCharts.tsx         # 4 KPI cards & Recharts with baseline bands (Mean ± 2 SD)
    │   │   ├── GuidedMeasurementView.tsx   # Step-by-step SOPs & Digital Amsler Grid (SANS)
    │   │   ├── NutritionRenalPanel.tsx     # Interactive sliders for bone resorption & kidney stone risk
    │   │   ├── EmergencyCollapseTriage.tsx # 0:50 Brazilian Space Agency CPR Wizard & 110 BPM Metronome
    │   │   └── ClinicalCopilotPanel.tsx    # 3-Layer intelligence engine & SBAR ground packet queue
    │   ├── App.tsx           # Multi-tab console connecting all clinical workflows
    │   └── index.css         # Tailwind v4 theme tokens (Deep Space #070B14, Telemetry Cyan, etc.)
    └── vite.config.ts        # Vite 6 + @tailwindcss/vite
```

---

## 🌟 Key Innovations

### 1. Interactive Anatomical Body Twin (Non-Doctor Interface)
Addresses the core NASA challenge requirement for an intuitive human body visualizer. Astronauts click directly on the Head (`neuro`), Chest (`cardio`), Core (`renal`), Limbs (`musculo`), or Systemic (`immune`) zones. Each zone highlights dynamically based on real-time telemetry:
- **`#10B981` (Nominal)**: Compensated spaceflight adaptation.
- **`#F59E0B` (Caution)**: Early physiological drift (e.g., fluid shift, rising cabin CO2, or dehydration).
- **`#EF4444` (Critical)**: Active emergency threshold (e.g., arrhythmia, acute shock, hypoxemia).

### 2. Space Nutrition, Bone Demineralization & Renal Stone Prevention
In microgravity, osteoclasts resorb trabecular bone at **1–1.5% per month**, dumping calcium ions into glomerular filtrate. 
- Interactive sliders allow crew to adjust **Water Intake**, **Urine Specific Gravity (USG)**, **ARED Exercise Duration**, **Caloric Intake**, **Calcium**, and **Vitamin D**.
- Real-time recalculation of the **Nephrolithiasis Risk Index (0–100)** shows how skipping ARED exercise leaves bone calcium uncountered, rapidly accelerating stone crystallization seeds when hydration dips below 2,500 mL.

### 3. Brazilian Space Agency 0:50 Acute Collapse & Microgravity CPR Wizard
- Solves the critical emergency dilemma: *"A crewmate suddenly clutches their chest and collapses. What should you do?"*
- **Native 110 BPM Web Audio Metronome**: Generates an 880 Hz audible cadence with an animated compression ring (`5 cm depth target`) and elapsed arrest timer.
- **Gravity-Specific CPR Restraint Instructions**:
  - **$0.00g$ Orbital / Mars Transit**: Requires securing the patient to the Crew Medical Restraint System (CMRS) or employing the bulkhead reverse handstand / waist-tether technique so the rescuer is not propelled backward into the ceiling by chest compressions.
  - **$0.16g$ Lunar Surface**: Straddle position with partner knee-wedge straps under habitat deck tie-downs.
  - **$1.00g$ Earth Analog**: Standard supine positioning on a hard backboard.
- Plain-language decision trees for Aspirin (324 mg) and Nitroglycerin (0.4 mg sublingual only if systolic BP $> 90$ mmHg).

### 4. Continuous Flight Surgeon SBAR Uplink
Automatically formats mission-critical findings into strict **Situation-Background-Assessment-Recommendation (SBAR)** ground packets. During communication blackouts, packets are securely buffered in a local store-and-forward queue.

---

## 🛠️ Quick Start & Local Setup

### Prerequisites
- **Node.js**: v20+ or v24+
- **Python**: 3.11+ (Python 3.14 verified)

### 1. Run the Backend API
```bash
# Clone the repository
git clone https://github.com/beenumarr/tauraro.git
cd tauraro

# Create and activate virtual environment
python3 -m venv backend/venv
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server (port 8000)
PYTHONPATH=. uvicorn backend.app.main:app --reload --port 8000
```
- Interactive Swagger Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health check: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

### 2. Run the Frontend Console
In a new terminal window:
```bash
cd tauraro/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 🧪 Verification & Testing

### Automated Backend Verification Test
Run the instant test suite from the repository root:
```bash
PYTHONPATH=. backend/venv/bin/python -c "
from starlette.testclient import TestClient
from backend.app.main import app

client = TestClient(app)
assert client.get('/api/v1/health').status_code == 200
assert client.get('/api/v1/bootstrap').status_code == 200
assert client.get('/api/v1/scenario/DEEP_SPACE_TRANSIT/CODE_RED_COLLAPSE').status_code == 200
print('✅ ALL BACKEND TEST ASSERTIONS PASSED!')
"
```

### Frontend Typecheck & Production Build
```bash
cd frontend
npm run build
# -> ✓ built in ~2.4s (0 errors, 0 warnings)

npm run lint
# -> Found 0 warnings and 0 errors.
```

---

## 🛰️ NASA HRP & OSDR Data References
- **NASA Human Research Program (HRP)**: Standard Measures Cross-Cutting Physiological and Behavioral Health Data Metrics.
- **NASA Open Science Data Repository (OSDR)**: Multi-omics and spaceflight physiological adaptation datasets across microgravity missions.
- **Spaceflight-Associated Neuro-ocular Syndrome (SANS)**: NASA HRP Optic Disc Edema and Intracranial Pressure Protocols.

---

**Developed for the 2026 NASA International Space Apps Challenge.**
