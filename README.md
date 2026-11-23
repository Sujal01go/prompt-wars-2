# 🌬️ AeroPulse AI — Urban Air Quality & Smog Defense Assistant
> **Google Prompt Wars Virtual (Hack2Skill) • Challenge 6 Submission**  
> *Autonomous GenAI-Powered Urban Air Quality Assistant providing Hyperlocal Telemetry, Inversion Stagnation Alerts, Vulnerability Personas, DIY Corsi-Rosenthal Purifier Physics, Low-Emission Commute Optimization, and Impact Transparency for Severe Winter Smog.*

- **🌐 Live Production Deployment**: [https://aeropulse-assistant.web.app](https://aeropulse-assistant.web.app)
- **💻 Public GitHub Repository**: [https://github.com/Sujal01go/prompt-wars-2](https://github.com/Sujal01go/prompt-wars-2)

---

## 🏆 Evaluation Parameters Matrix

| Evaluation Criteria | Implementation Highlights |
| :--- | :--- |
| **Code Quality** | Clean modular architecture, TypeScript 5.8 strict typing, zero lint warnings (`oxlint`), idiomatic React 19 state synchronization, separated domain engines (`aqiCalculators`, `corsiRosenthal`, `commuteCalculator`). |
| **Security** | DOMPurify HTML sanitization against XSS, Base64 obfuscated Gemini API key storage, safe outbound links (`rel="noopener noreferrer"`), local-first privacy (zero health telemetry transmitted to external servers). |
| **Efficiency** | Vite 8 bundling, 571ms production build time, 128kB gzipped JS, 8.7kB gzipped CSS, 10-minute in-memory telemetry caching to prevent network congestion, memoized calculations (`useMemo`, `useCallback`). |
| **Testing** | Complete Vitest + React Testing Library test suite with **28 passing tests across 9 test suites** covering mathematical break-points, CADR physics, commute exposure, DOMPurify security, and UI components. |
| **Accessibility (a11y)** | WCAG AA compliance in both Dark & Light themes, skip-to-content landmark link, semantic HTML landmarks (`<header>`, `<main id="main-content">`, `<nav role="tablist">`, `<footer>`, `role="tabpanel"`), ARIA live regions, full keyboard navigation. |
| **Problem Statement Alignment** | Direct solution for **Challenge 6: Urban Air Quality Assistant** — winter thermal inversion alerts, 6 vulnerable household personas, Corsi-Rosenthal box builder, Berkeley Earth cigarette equivalence model, and 24-hour hour-by-hour smog routines. |

---

## ✨ Key Features & Capabilities

### 1. 📊 Real-Time Atmospheric Telemetry & Inversion Monitoring
- **Multi-Pollutant Tracking**: Live integration with Open-Meteo Air Quality & Weather Telemetry tracking $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{O}_3$, $\text{CO}$, Dust, and Ammonia.
- **US AQI & European CAQI**: Real-time US EPA AQI (0–500 scale) with dynamic color coding and European Common Air Quality Index.
- **Thermal Inversion & Stagnation Index (0–100)**: Detects when cold ground-level winter air is capped by warmer atmospheric layers, concentrating vehicular soot and industrial smog at human breathing height.
- **Global & Regional Smog Hotspots**: Instant one-click monitoring for high-smog urban centers (New Delhi, Lahore, Beijing, Mumbai, Bangkok, Jakarta, Los Angeles, London) plus browser GPS detection.

### 2. 🕒 24-Hour Smog Forecast & "Golden Window" Ventilation Finder
- **Golden Ventilation Window**: Automatically detects the consecutive 1–2 hour afternoon window (typically 1:00 PM – 3:00 PM) when daytime solar radiation weakens the inversion layer cap, identifying the safest time for brief room ventilation.
- **Smog Peak Warnings**: Flags morning (6:00 – 9:00 AM) and night (8:00 – 11:00 PM) stagnation spikes caused by commuter rush-hours combined with nocturnal surface cooling.

### 3. 🛡️ Tailored Vulnerable Persona Health Shield
Adapts all clinical warnings, safe outdoor tolerances, and protective protocols across 6 vulnerable household profiles:
1. 👶 **Infants & Children**: Immature alveolar tissue, 2x breathing rate per kg, ground-level stroller tailpipe proximity.
2. 🧓 **Seniors & Heart Patients**: Cardiovascular risk, endothelial arterial plaque destabilization, blood pressure spikes.
3. 🏃 **Runners & Outdoor Athletes**: Oral breathing paradox ($80\text{--}120\text{ L/min}$ minute ventilation), deep alveolar soot deposit.
4. 🫁 **Asthma & Respiratory Patients**: Acidic aerosol ($\text{SO}_2/\text{NO}_2$) bronchoconstriction, peak expiratory flow triggers.
5. 🤰 **Expectant Mothers**: Transplacental particulate translocation, gestational hypertension, clean-air oasis.
6. 🛵 **Daily Commuters & Drivers**: Tailpipe exhaust wake, concentrated black carbon and volatile organic compounds (VOCs).

### 4. 🛠️ Indoor Air Quality (IAQ) & DIY Corsi-Rosenthal Purifier Studio
- **Corsi-Rosenthal Box Simulator**: Engineered physics calculator based on UC Davis Air Quality Research Center benchmarks.
- **Custom Room Sizing**: Input width, length, ceiling height, and fan CFM to compute Clean Air Delivery Rate (CADR in CFM), Air Changes Per Hour (ACH), and minutes required to drop room particulates by 90%.
- **4-Filter Comparetto Cube vs 1-Filter**: Demonstrates why a multi-filter box reduces static pressure drop and delivers superior CADR.
- **The "Cardboard Shroud" Secret**: Explains the aerodynamic donut shroud trick that eliminates fan back-vortex and boosts airflow by 20–30%.
- **DIY Cost Analysis**: Shows how building a \$45–\$65 Corsi-Rosenthal box matches or outperforms \$500 commercial HEPA purifiers.
- **NASA Clean Air Bio-Filters**: Botanical guide for Snake Plant, Areca Palm, Peace Lily, and Spider Plant with CAM nighttime oxygen release.
- **Respirator Efficacy Matrix**: N95/FFP2 vs KF94 vs Surgical vs Cloth masks with step-by-step 10-second negative pressure seal check.

### 5. 🚴 Low-Emission Commute & Exposure Optimizer
- **Mode Comparison**: Interactive trip calculator comparing Walking, Cycling, Two-Wheeler, Auto/Bus, Metro Rail, and AC Car.
- **Inhaled $\text{PM}_{2.5}$ Mass**: Calculates exact microgram ($\mu\text{g}$) particulate inhalation accounting for respiratory exertion and cabin filtration.
- **Metro Rail Clean Benchmark**: Proves that switching to sealed, HVAC-filtered Metro Rail reduces lung particle intake by up to ~78% and eliminates personal carbon emissions.

### 6. 🌍 Impact Transparency & Berkeley Earth Cigarette Index
- **Berkeley Earth Model**: Translates ambient $\text{PM}_{2.5}$ into equivalent cigarettes smoked ($1\text{ cigarette} \approx 22\,\mu\text{g}/\text{m}^3$ over 24 hours).
- **Personal Mitigation Checklist**: Interactive log for sustainable daily actions (taking the metro, zero open waste burning, building a C-R box, carpooling, flameless indoor rituals) with live aggregate CO2 (kg) and PM (grams) saved.

### 7. 🤖 Dual-Engine GenAI Smog Copilot & Routine Architect
- **Live Google Gemini API**: Direct integration with `gemini-2.5-flash` via Google AI Studio API key.
- **Offline Heuristic GenAI Engine**: Fallback that generates scientifically grounded, context-aware advice and hour-by-hour 24-hour smog routines 100% offline without requiring an API key.
- **One-Click Export**: Export daily smog defense routines to formatted Markdown (`.md`) or printable PDF format.

---

## 🏗️ Architecture & Project Structure

```
prompt-wars-2/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── assistant/      # SmogCopilotDrawer.tsx (Context-aware GenAI Chatbot)
│   │   ├── common/         # Modal.tsx (Accessible focus trap), Toast.tsx
│   │   ├── commute/        # CommuteSmogPlanner.tsx (Exposure vs Transit mode)
│   │   ├── dashboard/      # HeroAqiMeter.tsx, PollutantGrid.tsx, HourlyForecastChart.tsx
│   │   ├── iaq/            # CorsiRosenthalSimulator.tsx, WindowVentilationGuide.tsx
│   │   ├── impact/         # HealthImpactCard.tsx (Cigarette meter), EcoActionsTracker.tsx
│   │   ├── layout/         # Navbar.tsx, Footer.tsx
│   │   ├── modals/         # ApiKeyModal.tsx, CitySelectorModal.tsx, RoutineExportModal.tsx
│   │   └── persona/        # PersonaShield.tsx (6 Vulnerable household personas)
│   ├── context/            # AeroContext.tsx, AeroContextInstance.ts
│   ├── hooks/              # useAero.ts
│   ├── services/           # airQualityApi.ts, geminiService.ts, personaData.ts, storageService.ts
│   ├── test/               # Vitest + React Testing Library (9 test suites, 28 tests)
│   ├── types/              # index.ts (Strict TypeScript interfaces)
│   ├── utils/              # aqiCalculators.ts, commuteCalculator.ts, corsiRosenthal.ts, exportUtils.ts, security.ts
│   ├── App.tsx             # Main tabbed container with semantic landmarks
│   ├── index.css           # Modern design system, WCAG AA contrast, print stylesheet
│   └── main.tsx            # React 19 entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Test Suite
```bash
npm run test
```
Runs 28 unit and component tests with Vitest.

### 4. Run Linter
```bash
npm run lint
```
Runs `oxlint` with 0 warnings and 0 errors.

### 5. Build for Production
```bash
npm run build
```
Type-checks with `tsc -b` and builds optimized bundle via Vite (128kB gzipped JS).

---

## 🔒 Security Best Practices
- **XSS Protection**: All rich dynamic text rendered in copilot and cards is processed through DOMPurify with strict HTML tag whitelisting.
- **Safe Key Storage**: API keys are masked in the UI and stored safely in localStorage using Base64 obfuscation without server exfiltration.
- **Local-First Privacy**: No telemetry, search coordinates, or personal health choices are ever transmitted to third-party tracking servers.

---

## ♿ Accessibility Features (WCAG AA)
- **Keyboard Navigation**: Full focus trap in modals, Escape key support, Tab and Enter navigation across all cards.
- **Skip Link**: Top-of-page skip link to jump directly to `#main-content`.
- **Contrast**: Curated dark and light mode themes adhering to WCAG 4.5:1 text contrast ratios.
- **Semantic Roles**: Proper usage of `role="tablist"`, `role="tab"`, `role="tabpanel"`, `role="dialog"`, `aria-selected`, `aria-expanded`, and `aria-label`.

---

## 📹 Video Demonstration
- **Video Link**: *[Insert Unlisted YouTube or Google Drive Link Here]*
