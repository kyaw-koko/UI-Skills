---
name: chainsa-earth-intelligence
description: Build bilingual (English & Burmese) geospatial, climate, and Earth-intelligence web applications and dashboards following the ChainSa design system. Trigger this skill when creating landing pages, interactive map workspaces, indicator directories, or AI decision-support interfaces featuring deep navy-obsidian surfaces, multi-accent Earth-lens typography, and native Padauk Burmese script support.
---

# ChainSa — Myanmar Earth Intelligence Design System

## 1. Visual Identity & Core Aesthetic
- **Archetype:** Deep-Space Navy Geospatial & Earth Observation Intelligence Platform.
- **Visual Tone:** Authoritative, calm, data-grounded, and bilingual-first (English + Myanmar Unicode).
- **Atmosphere:** High-contrast crisp white typography layered over deep midnight navy surfaces (`#080C17`), punctuated by functional "EarthLens" accents—Solar Amber (`#F5C242`), Sprout Emerald (`#52C46B`), and Hydro Sky Blue (`#1982C4`).

## 2. Color Tokens (EarthLens Palette)
- **Primary Canvas (Deep Midnight Navy):** `#080C17`
- **Elevated Card & Panel Surface:** `#0F1626` with subtle border `border-[#1E293B]` (`rgba(255, 255, 255, 0.08)`)
- **Interactive Input / Sub-panel Surface:** `#161F33`
- **AI Decision Support Panel Gradient:** Deep Indigo-Navy gradient (`bg-gradient-to-br from-[#171238] via-[#0F1626] to-[#0B101D]`)
- **Text Hierarchy:**
  - Primary Headings & Titles: Pure Crisp White `#FFFFFF`
  - Secondary Descriptions & Data Values: Cool Slate Silver `#94A3B8` / `#CBD5E1`
  - Eyebrow / Section Kickers: Muted Periwinkle-Slate `#818CF8` or `#64748B` (`uppercase tracking-widest text-xs font-semibold`)
- **Brand & Semantic Accents:**
  - **Solar Amber / Gold (Primary Action / AI Chat / Highlight):** `#F5C242` with dark navy text `#080C17` (used for floating `AI chat` button, primary apply CTAs, and active map region highlights)
  - **Hydro Sky Blue (Exploration / Water / Primary Brand CTA):** `#1982C4` (used for `Explore Live Trends` pill CTA and water indicators)
  - **Sprout Emerald (Agriculture / Environment / Positive Checkmarks):** `#52C46B` (used for trend headlines, agriculture/environment icons, and recommended action checkmarks)
  - **Crimson Alert (Disaster Intelligence):** `#EF4444` / `#991B1B` tint for hazard/disaster badges

## 3. Typography & Bilingual Localization Rules
- **Font Stack:**
  - **Display Headings:** `Space Grotesk` (`font-bold tracking-tight`)
  - **English UI & Body:** `Inter` (`font-normal` / `font-medium`)
  - **Burmese Script (`my`):** `Padauk` (`400` and `700` weights)
- **Bilingual Layout Hygiene:**
  - Always provide generous line-height (`leading-[1.65]` to `leading-[1.8]`) and vertical padding on buttons, badges, and headings when Burmese (`Padauk`) is active so upper diacritics and stacked sub-consonants (`အောက်မြစ်`, `ဝဆွဲ`, `ပင့်ရစ်`) never clip.
  - Keep numbers, dates (`2025-01-01 — 2025-12-31`), and temperatures (`27.47 °C`) in `tabular-nums`.

## 4. Layout & Structural Archetypes

### A. Global Header & Floating Utility Chrome
- **Top Navbar:** Full-width sticky header (`bg-[#080C17]/90 backdrop-blur-md border-b border-white/5`) with the 3-blade Earth-pinwheel `ChainSa` logo + `MYANMAR EARTH INTELLIGENCE` subtitle on the left, and a square rounded settings icon button (`rounded-xl border border-white/10`) on the right.
- **Settings Popover (Top-Right):** Floating dark card containing a `Language` segmented toggle (`EN | မြန်မာ`), `Theme` toggle (`Dark view / အမှောင်မြင်ကွင်း`), and `Sound Volume` slider (`0%–100%` with `-` / `+` steppers).
- **Persistent Floating AI Assistant:** Bottom-right floating Solar Amber pill/rounded button (`bg-[#F5C242] text-[#080C17] rounded-xl font-semibold shadow-lg`) labeled `AI chat` / `AI စကားပြော` with a chat bubble icon.

### B. Landing Page Sections
1. **Editorial Hero Section:**
   - Full-bleed atmospheric background photograph (rural Myanmar landscape at golden hour) with a smooth dark navy gradient vignette overlay (`from-[#080C17] via-[#080C17]/75 to-transparent`).
   - Pill eyebrow badge (`● Satellite intelligence for every township`).
   - Stacked 3-line display headline with multi-accent color emphasis on key words (`Detect` in Amber, `Understand` in Emerald, `Decisions.` in Sky Blue).
   - Pill primary CTA button (`rounded-full bg-[#1982C4] px-7 py-3.5`) positioned cleanly.
2. **Domain Category Bento Grid (3x2):**
   - 6 domain cards (`Agriculture`, `Infrastructure & Urban Change`, `Water`, `Energy & Electricity`, `Environmental Change`, `Disaster Intelligence`).
   - Each card (`rounded-2xl bg-[#0F1626] border border-white/8 overflow-hidden`) features a top `16:9` real-world photographic header, followed by a tinted square icon badge (`rounded-xl`), bold title, 2-line indicator summary, and a right arrow (`→`).
3. **Persona-Based AI Decision Support Module:**
   - Container with subtle indigo-navy gradient and rounded border (`rounded-3xl border border-indigo-500/20 p-8`).
   - Pill persona selector tabs (`Farmers`, `Urban planners`, `Disaster teams`) where the active tab uses solid white (`bg-white text-[#080C17] font-semibold rounded-full`) and inactive tabs use dark outlined pills.
   - Inner prompt/response card displaying the sample question with a `Sample` badge and a checklist of `Recommended Actions` prefixed with Emerald checkmarks (`✓`).
4. **Observed Trends Summary Grid:**
   - Section header with uppercase kicker (`OBSERVED CHANGE`), bold title (`Observed Trends`), and statistical significance subtitle.
   - Multi-column region cards (`Yangon`, `Mandalay`, `Magway`, `Shan`, `Ayeyarwady`) displaying region name, mean metric (`Mean air temperature 27.47 °C`), ISO date range (`2025-01-01 — 2025-12-31`), significance status, and `View observations →` action link.

### C. Interactive Map & Indicator Workspace (3-Pane Layout)
1. **Left Collapsible Indicator Sidebar (`280px`):**
   - Header (`Indicators / ညွှန်ကိန်းများ` + total count badge `36`) and search input (`Search indicators...`).
   - Expandable domain accordion cards with photographic banner headers, domain icons, and indicator counts (`5`, `7`, `6`, `5`).
2. **Center Township Map Canvas:**
   - Interactive vector/choropleth township map (e.g., `Kunlong / ကွမ်းလုံ`) with selected township highlighted in Solar Amber (`#F5C242`).
   - Floating vertical map zoom/reset controls (`+`, `-`, `↺`) on the top-right of the map canvas.
3. **Right Step-by-Step Query & Action Panel:**
   - Numbered step badges (`3 Date range / ရက်စွဲကာလ`, `4 Apply selection / ရွေးချယ်မှုကို အသုံးပြုရန်`).
   - Date input (`01/01/2020`), UTC observation availability note, and full-width Solar Amber primary CTA button (`View Data / အချက်အလက်များကို ကြည့်ရန်`).

## 5. Anti-Patterns (Strictly Avoid)
- **NO** bright light-mode backgrounds; keep the entire workspace grounded in deep midnight navy (`#080C17`).
- **NO** tight line-heights (`leading-none` or `leading-tight`) on Burmese (`Padauk`) text—always allow vertical breathing room for Myanmar script stacking.
- **NO** decorative neon glow borders or generic sci-fi HUD clutter; keep data cards clean, structured, and scientifically legible.
