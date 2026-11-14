# ★ TAURARO: 30-Second Video Demo Script & 7-Slide Pitch Guide
### 2026 NASA International Space Apps Challenge
**Challenge:** Create Health Monitoring Software for Astronauts on Space Missions  
**Lead Developer & System Architect:** Ameer Umar | **BWSO Innovation Hub**  
**Repository:** [https://github.com/beenumarr/tauraro](https://github.com/beenumarr/tauraro)

---

## 🎬 Section 1: The 30-Second Video Demo Recording Script

> **Recording Tip:** Keep the browser zoomed to 90% or 100% on high-definition ($1920 \times 1080$). Turn on system audio recording so the **110 BPM Web Audio CPR Metronome beeps** are clearly captured in the final cut.

| Timestamp | Screen Action / Visual Click | Spoken Voiceover Script (Word-for-Word) | On-Screen Graphic / Badge |
|---|---|---|---|
| **0:00 – 0:08** | • Start on **Overview** tab.<br>• Click the **Exploration Habitat Switcher** dropdown in the header and select `DEEP_SPACE_TRANSIT` (Mars Vessel).<br>• Hover over and click the **Neuro** and **Cardio** zones on the SVG **Interactive Anatomical Body Twin**. | *"Meet TAURARO—an autonomous space health and emergency triage platform built for non-doctor astronauts. When crews journey halfway to Mars under zero-g, 24-minute communication blackouts make Earth doctors unreachable."* | `★ TAURARO Console`<br>`0.00g Mars Transit`<br>`18m 20s One-Way Latency` |
| **0:08 – 0:18** | • Click the **Nutrition & Renal Risk** tab.<br>• Drag the **Daily Water Intake** slider from `2500 mL` down to `1100 mL`.<br>• Watch the **Calculated Renal Stone Risk Index** gauge surge from 12% to **84% (HIGH RISK)** in real time. | *"In microgravity, bone demineralization dumps 250 milligrams of calcium daily into the blood. Watch how TAURARO's deterministic engine models dehydration and missed ARED exercise to prevent mission-ending kidney stones before symptoms occur."* | `RENAL STONE RISK: 84%`<br>`CALCIURIA ALERT`<br>`NASA HRP Aligned` |
| **0:18 – 0:30** | • Click the flashing crimson **🚨 CODE RED COLLAPSE** button in the top navigation bar.<br>• The app snaps to the **Emergency CPR** wizard.<br>• Click the blue **START CPR AUDIO METRONOME (110 BPM)** button—audible beeps pulse through the audio.<br>• Check the Step 1 checkbox (0g CMRS / Handstand Restraint).<br>• Point to the generated **SBAR Offline Ground Packet**. | *"Suddenly, a crewmate collapses with chest pain—the exact Brazilian Space Agency crisis. TAURARO instantly activates: displaying 0g CMRS and Handstand CPR restraint protocols, pulsing a 110 BPM cardiac metronome, and queueing an autonomous SBAR beacon for Earth."* | `CODE RED: ACUTE COLLAPSE`<br>`110 BPM CPR ACTIVE`<br>`0g RESTRAINT LOCKED`<br>`SBAR BUFFERED` |

---

## 📊 Section 2: The 7-Slide Official Presentation Outline

### Slide 1: Title & Executive Vision
- **Slide Title:** TAURARO — Universal Space Health Monitoring & Autonomous Triage Platform
- **Subtitle:** Empowering Non-Doctor Astronauts across Moon, Mars, and Earth
- **Team / Organization:** Ameer Umar — BWSO Innovation Hub
- **Challenge:** 2026 NASA International Space Apps Challenge (Authored by Agência Espacial Brasileira / AEB)
- **Key Visual:** High-resolution screenshot of the TAURARO mission console showcasing the anatomical body twin, live telemetry trend curves, and the habitat ribbon.
- **Key Takeaway:** Astronauts are scientists and pilots, not physicians. When medical crises strike millions of miles from Earth, TAURARO provides autonomous clinical intelligence.

---

### Slide 2: The Deep-Space & Non-Doctor Crisis
- **Slide Title:** The Problem: 140 Million Miles from the Nearest Hospital
- **Core Insights:**
  1. **Extreme Communication Blackouts:** Round-trip transmission latencies to Mars reach up to 24 minutes. In cardiac arrest or anaphylaxis, waiting for Houston or ground control is fatal.
  2. **Microgravity Pathophysiology:** Cephalad fluid shifts increase intracranial pressure (SANS), cardiovascular deconditioning reduces blood volume, and bone unloading releases ~250 mg of excess calcium per day.
  3. **The Non-Doctor Dilemma:** Crews lack surgical or intensive care specialists; technical medical jargon causes cognitive overload during acute crises.
- **The Brazilian Space Agency Prompt (0:50):**
  > *"Imagine you're halfway to Mars... suddenly your fellow crewmate feels a sharp pain in the chest and collapses. What's happening? Is he or she dying? What should you do?"*

---

### Slide 3: System Architecture & Personal Baseline Math
- **Slide Title:** Rigorous Science: NASA HRP Standard Measures & Individual Z-Scores
- **Core Insights:**
  - **No Generic "Normal Ranges":** In space, standard 1g reference ranges fail. TAURARO calculates real-time standard score deviations ($Z$-scores) against each astronaut's pre-flight resting profile:
    $$\Delta Z_{\text{HR}} = \frac{\text{HR}_{\text{current}} - \mu_{\text{baseline}}}{\sigma_{\text{baseline}}}$$
  - **Compound Multi-Organ Risk Modeling:** Evaluates 5 core systems: Neuro-ocular, Cardiovascular, Renal, Musculoskeletal, and Immune.
  - **100% Offline Edge Resilient:** Fast, deterministic Python FastAPI backend with zero reliance on cloud APIs—guaranteed functional during solar storms and deep-space comm blackouts.

---

### Slide 4: Interactive Anatomical Body Twin & Guided Self-Measurement
- **Slide Title:** Human-Centric Interface: Turning Telemetry into Intuitive Anatomy
- **Core Insights:**
  - **Interactive 5-Zone Anatomical Twin:** Clickable SVG body map rendering real-time organ stress (green/nominal, amber/caution, crimson/emergency) with plain-language clinical explanations.
  - **Guided SOP Measurement Protocols:** Non-doctor checklists teaching crew members *when* and *how* to measure biometrics (Doppler ultrasound, blood pressure cuff calibration, urine specific gravity).
  - **Interactive SANS Digital Amsler Grid:** Onboard self-test for Spaceflight-Associated Neuro-ocular Syndrome to catch optic disc edema and maculopathy early.

---

### Slide 5: Space Nutrition & Renal Stone Prevention Engine
- **Slide Title:** Preventing the Silent Mission-Killer: Microgravity Nephrolithiasis
- **Core Insights:**
  - **The Spaceflight Bone-Kidney Axis:** Microgravity disuse osteopenia frees skeletal calcium into the urinary tract. Dehydration and skipped workouts multiply stone crystallization risks exponentially.
  - **Compound Mathematical Risk Equation:**
    $$\text{Index} = f(\text{Water Deficit}, \text{USG Elevation}, \Delta Z_{\text{BP}}, \text{ARED Deficit}, \text{Dietary Ratios})$$
  - **Interactive Nutritional Countermeasures:** Astronauts adjust hydration, calories, ARED resistive exercise, calcium, and Vitamin D to simulate countermeasures and reverse clinical risk scores in real time.

---

### Slide 6: Code Red Collapse Triage & Microgravity CPR
- **Slide Title:** Direct Solution to AEB 0:50: Step-by-Step Life Support in Microgravity
- **Core Insights:**
  - **Microgravity CPR Restraint Engineering:** In 0.00g, normal chest compressions push the rescuer backward into the bulkhead. TAURARO instructs:
    1. **Crew Medical Restraint System (CMRS)** buckle-down, or
    2. **Handstand Method** (feet locked on ceiling bulkhead, pushing down on patient's sternum).
  - **Native 110 BPM Web Audio Metronome:** Zero external audio dependencies; synthesizes precise clinical rhythm right in the browser.
  - **Autonomous SBAR Ground Packet Generator:** Compiles standardized Situation-Background-Assessment-Recommendation packets and buffers them into a store-and-forward queue for the next telemetry downlink.

---

### Slide 7: Earth Spinoff & Terrestrial Dual-Use Impact
- **Slide Title:** From Mars to Rural Clinics: Bringing Space Triage Down to Earth
- **Core Insights:**
  - **Earth Analog Mode:** TAURARO adapts seamlessly to $1.00g$ rural healthcare clinics across Nigeria, Sub-Saharan Africa, and remote polar research stations.
  - **Empowering Community Health Workers:** Non-specialist clinic staff use the exact same anatomical guidance, SOP measurement guides, and offline triage logic where doctors and broadband internet are unavailable.
  - **Open Science & Modular Future:** Fully compatible with open data standards (NASA OSDR / ALSDA), ready for expansion to wearable biosensors and autonomous ultrasound probes.
- **Closing Tagline:**
  *"TAURARO: Protecting human life across the frontiers of space, and strengthening healthcare resilience on Earth."*

---

## 🚀 Presentation & Q&A Tips for the BWSO Innovation Hub Team

1. **Emphasize Offline Independence:** Judges always ask: *"What if the internet drops?"* Point out that TAURARO has a 100% offline deterministic engine that requires zero external connectivity to evaluate risk and run CPR.
2. **Stress Non-Doctor Usability:** Point to the anatomical body twin and plain-language SBAR summaries—every screen was designed specifically for engineers and pilots under high stress, not medical doctors.
3. **Demonstrate the Audio Metronome:** In any live demo, actually click the 110 BPM button so the judges hear the metronome beeping. It instantly elevates the presentation from a theoretical concept to an active emergency device.
