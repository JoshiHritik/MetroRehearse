# MetroRehearse — Design System & Visual Specification

## 1. Aesthetic Identity
MetroRehearse is an operations-grade crowd simulation and tactical briefing platform designed for Ahmedabad Metro (GMRC) station controllers and event planners.
The visual language combines the precision and calm authority of a modern transit control room with high-fidelity telemetry, responsive glassmorphism, and instant tactile responsiveness.

### Core Philosophy
- **Control Room Clarity**: Deep obsidian and navy surfaces (`#0B1220`, `#0F172A`) prevent operator glare during night shifts.
- **Transit Line Accents**: Authentic GMRC corridor identities (Vibrant Transit Red `#E11D48` for North-South Corridor, Sapphire Cyan `#0284C7` for East-West Corridor, Emerald `#059669` for Safe Thresholds, Amber `#D97706` for Alert/Metering, Crimson `#DC2626` for Overcrowding risk).
- **Assumed vs Measured Honesty**: Any parameter or simulated metric derived from editable assumptions carries an unmistakable `(A)` badge (amber-pill accent).
- **Trilingual Typography**: Clean modern sans typography (`Inter` / `Plus Jakarta Sans` / `Noto Sans Gujarati` / `Noto Sans Devanagari`) with generous line-height (`1.7` for Indic scripts) and monospaced Western tabular digits (`Chakra Petch` / `JetBrains Mono` / monospace) for countdowns, headways, and queues.
- **Physical Touch Targets**: Operational live controls (such as the Tap Pad) provide oversized targets (≥ 56px height) with haptic/tactile visual feedback for one-handed operation on mobile in busy concourses.

---

## 2. Color Palette & Tokens

### Base & Backgrounds
- `--bg-canvas`: `#0B1220` (Root dark canvas)
- `--bg-surface`: `#111C33` (Card / modal elevated surface)
- `--bg-surface-elevated`: `#182747` (Higher elevation surface / hover)
- `--bg-glass`: `rgba(17, 28, 51, 0.78)` (Glassmorphism card background with blur)
- `--border-subtle`: `rgba(255, 255, 255, 0.08)`
- `--border-focus`: `rgba(56, 189, 248, 0.5)`

### Light Theme Overrides
- `--bg-canvas-light`: `#F8FAFC`
- `--bg-surface-light`: `#FFFFFF`
- `--bg-surface-elevated-light`: `#F1F5F9`
- `--border-subtle-light`: `rgba(0, 0, 0, 0.1)`

### Semantic Accents
- `--accent-cyan`: `#38BDF8` (Active selection, telemetry glow)
- `--accent-blue`: `#2563EB` (Primary buttons, actions)
- `--accent-red-line`: `#E11D48` (GMRC North-South corridor / Motera line)
- `--accent-blue-line`: `#0284C7` (GMRC East-West corridor)
- `--status-safe`: `#10B981` (Normal density < 3.0 pax/m²)
- `--status-caution`: `#F59E0B` (Approaching capacity 3.0 - 4.5 pax/m²)
- `--status-critical`: `#EF4444` (Severe crush risk > 4.5 pax/m²)
- `--tag-assumed-bg`: `rgba(245, 158, 11, 0.15)`
- `--tag-assumed-border`: `rgba(245, 158, 11, 0.45)`
- `--tag-assumed-text`: `#FBBF24`

---

## 3. Typography
- UI Font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Gujarati', 'Noto Sans Devanagari', sans-serif
- Tabular Monospace: 'SF Mono', 'Roboto Mono', 'Cascadia Code', monospace
- Operational Line Height: `1.5` for English, `1.7` for Hindi (`hi`) and Gujarati (`gu`)

---

## 4. Components & Layout Rules
- TopBar: Unified telemetry strip showing current station, active role, current data level (Level 0-3 badge), language picker, theme toggle, offline readiness indicator.
- Navigation: Persistent navigation with clear breadcrumb and quick action to Live Mode.
- Station Canvas: High-contrast 2D schematic rendering of Motera Stadium concourse, security gates, automated fare collection (AFC) turnstiles, platform edge doors (PED), and train loading animations.
- Print Sheet: Strict A4 portrait format, black text on crisp white background, bordered tables, bilingual briefing blocks.
