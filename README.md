# MetroRehearse (GMRC — October 2026)

**Tactical Crowd Simulation & Live Operations Telemetry for Ahmedabad Metro**

MetroRehearse is an operations-grade, client-only web platform and PWA built for station controllers and crowd operations planners at Gujarat Metro Rail Corporation (GMRC). It executes 100% offline in browser storage (IndexedDB) with zero server dependencies, designed to function reliably in **Airplane Mode**.

---

## 🚉 The Platform at a Glance

Eight operational modules:
1. **Events**: Create, edit, and list stadium and festival egress events with presets (IPL Cricket, Navratri Mega-Garba, Uttarayan, Commuter Peak).
2. **Assumptions (A)**: Transparent, editable model parameters with explicit `(A)` indicators showing placeholder assumptions vs sensor facts.
3. **Simulation Engine**: 200-run Monte Carlo stochastic crowd model in a Web Worker (deterministic Mulberry32 PRNG, Poisson arrivals, 10-second steps).
4. **Optimizer & Tactical Playbook**: Multi-objective search across 300 candidate plans with single-lever refinement and Pareto trade-off sliders (Safety, Time, Budget).
5. **Event Order Dispatcher**: Auto-interpolated operational briefing and timeline (T-60 to T+120) in three bundled languages (English, हिन्दी, ગુજરાતી) with A4 print stylesheet.
6. **Concourse Live Mode**: Touch-first supervisor Tap Pad, real-time Bayesian conjugate Gamma-Poisson rate updating, next-train countdown, and Screen Wake Lock.
7. **Post-Event Review & Backtest**: Variance analysis between predictions and actuals, plus the historical IPL 2026 Final replay benchmark.
8. **Operational Shell**: Control room dark theme (`#0B1220`), trilingual language toggle, GMRC schematic network map, and 4-tier data level indicator (L0 to L3).

---

## 🛠️ Technology Choices

| Layer | Choice | Why |
|---|---|---|
| **Build** | Vite + React 19 + TypeScript | Instant HMR, zero SSR overhead, optimal offline bundling. |
| **PWA** | `vite-plugin-pwa` (Workbox) | Offline precaching of app shell, workers, fonts, and static assets. |
| **State** | Zustand + Dexie Live Queries | Reactive UI state with IndexedDB tables. |
| **Storage** | Dexie (IndexedDB v1) | Schema versioning, indexed queries, 100% offline persistence. |
| **Simulation** | Web Worker (Plain TypeScript) | Non-blocking 200-seed Monte Carlo execution in < 3 seconds. |
| **Rendering** | Canvas 2D + Inline SVG | High-contrast animated station schematic and quantile sparklines without heavy charting libraries. |
| **Printing** | Dedicated `@media print` CSS | Clean A4 portrait operational briefing sheets in 3 languages. |
| **Security** | Web Crypto API PBKDF2 | Local PIN hashing with per-profile cryptographic salts. |
| **Tests** | Vitest | Pure determinism, Bayesian conjugate math, and briefing template verification. |

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Dev Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production PWA Build
```bash
npm run build
```

### 4. Running Unit Tests
```bash
npm test
```

---

## 📋 The Golden Path Demo Flow

1. **First Launch**: Open [http://localhost:5173/](http://localhost:5173/). The app auto-seeds initial profiles and the Gujarat Titans vs Mumbai Indians IPL event at Motera Stadium.
2. **Rehearsal**: Click **Open Rehearsal**. Click **Run Simulation (200 Seeds)**. Observe the 2D Motera Station Canvas and drag the timeline scrubber from $T+0$ to $T+180$ minutes.
3. **Playbook Optimization**: Navigate to **Playbook**. Adjust weights (Safety, Time, Cost) and click **Synthesize Optimal Action Plans**. Review the plain-language action recommendations and click **Apply Plan**.
4. **Event Order Generation**: Navigate to **Event Order**. Toggle languages between **English**, **हिन्दी**, and **ગુજરાતી**. Click **Print Event Order (A4)** to view the printable tactical brief.
5. **Live Concourse Duty**: Navigate to **Live Ops**. Tap **+10 Pax Ingress** or **+25 Concourse Queue** on the supervisor Tap Pad. Watch the **Bayesian Ingress Rate** update in real-time. Test **Undo Last**.
6. **Backtest**: Navigate to **Backtest Replay** to review the public 1,95,868 daily journey replay for the IPL 2026 Final.
7. **One-Tap Reset**: Visit **Cache & Status** or click **Reset Demo Data** at any time to restore factory state.
