---
name: warm-glass-dashboard
description: Build modern SaaS dashboards and command centers using a Warm Dark Glassmorphism, Bento Grid, and Soft Pill-UI aesthetic. Trigger this skill when creating analytics dashboards, admin panels, or workspace interfaces requiring translucent warm charcoal surfaces, soft cream typography, and mint/coral status indicators.
---

# Warm Dark Glassmorphism & Bento Dashboard Design System

## 1. Visual Aesthetic & Core Philosophy
- **Style Archetype:** Warm Glassmorphic Bento Command Center.
- **Atmosphere:** Grounded, tactile, executive dark mode using warm espresso/taupe undertones rather than cold pure black or harsh neon cyber-dark themes.
- **Surface Hierarchy:** Rely on subtle translucent layering (`backdrop-blur`), hairline borders, and soft inner glows rather than heavy drop shadows.

## 2. Color Tokens (Tailwind CSS Mapping)
Use warm neutral tones paired with soft cream highlights and muted botanical accents:

- **Canvas / Backdrop:** Ambient warm taupe-brown blurred background (`#3A322D` to `#26201D`).
- **Primary Glass Container:** Translucent dark espresso (`bg-[#2C2521]/75 backdrop-blur-xl`).
- **Elevated Card Surface:** Slightly lighter warm glass (`bg-[#362E29]/60 backdrop-blur-md`).
- **Active Highlight Card (Accent):** Muted teal-slate glass (`bg-gradient-to-br from-[#2B5B53]/80 to-[#1F423C]/80 border-[#4FD1C5]/30`).
- **Borders & Dividers:** Ultra-thin warm hairline strokes (`border-white/10` or `border-[#E8DFD5]/12`).
- **Text Hierarchy:**
  - Primary Headings & Hero KPIs: Warm Soft Cream (`#F5EFEA`)
  - Secondary Body & Labels: Muted Sand (`#B8AFA6`)
  - Tertiary / Muted Captions: Warm Taupe (`#857C74`)
- **Interactive Pill Surfaces:**
  - Active / Selected Pill: Solid Warm Cream (`bg-[#F5EFEA] text-[#1E1916] font-medium`)
  - Inactive / Ghost Pill: Translucent dark pill (`bg-white/5 hover:bg-white/10 text-[#E8DFD5] border border-white/10`)
- **Semantic Status Tokens:**
  - Positive / Complete / Upward Trend: Mint Teal (`text-[#5EEAD4]`, badge `bg-[#5EEAD4]/15 text-[#5EEAD4]`)
  - Warning / Needs Review / Downward Trend: Soft Terracotta Coral (`text-[#FCA5A5]`, badge `bg-[#F87171]/15 text-[#FCA5A5]`)
  - Scheduled / Neutral: Warm Sand (`bg-[#E8DFD5]/15 text-[#E8DFD5]`)

## 3. Typography & Data Hierarchy
- **Font Family:** Clean geometric sans-serif (`Plus Jakarta Sans`, `Inter`, or `Geist`).
- **Page Title:** `text-3xl md:text-4xl font-semibold tracking-tight text-[#F5EFEA]`
- **Hero KPI Numbers:** `text-3xl md:text-4xl font-bold tracking-tight tabular-nums text-[#F5EFEA]`
- **Card Titles:** `text-sm font-medium text-[#E8DFD5]`
- **Table & Micro Labels:** `text-xs font-medium text-[#B8AFA6]`
- **Rule:** Always apply `tabular-nums` to financial figures, percentages, and timestamps so numbers align cleanly.

## 4. Layout Architecture (Bento & Floating Chrome)
1. **Top Floating Utility Bar:**
   - Detached floating pill header (`rounded-full`) containing Brand Mark on the left, a centered AI Command/Search pill (`Show me what needs attention...`) with subtle iridescent orb icon, and utility icon buttons (Theme/Notifications/Avatar) on the right.
2. **Main Glass Workspace Shell:**
   - Large rounded outer container (`rounded-[28px] border border-white/10 p-6 md:p-8`).
   - Top row: Page Header + Subtitle on the left; segmented pill time-range switcher (`7 days | 30 days | 90 days`) on the right.
3. **Bento Grid Structure (12-Column Responsive):**
   - **Row 1 (KPIs & Primary Chart):**
     - Left (4 cols): Hero Revenue Card with large metric, trend pill (`↗ +8.3%`), dual pill CTAs (one solid cream primary, one glass secondary), and 3-column mini breakdown footer (`Subscriptions | Services | Add-ons`).
     - Center (4 cols): 2x2 nested KPI grid (`Automations run`, `Subscribers`, `Churn rate`, `Open tickets`). Highlight one key card with the Mint Teal accent surface.
     - Right (4 cols): Rounded-top vertical bar chart (`rounded-t-lg`) comparing two series (e.g., Cream `#F5EFEA` vs. Mint `#5EEAD4`) across days of the week.
   - **Row 2 (Capacity, Approvals & Activity Table):**
     - Left (4 cols): Stacked cards — Linear progress bar card (`Automation capacity`) with dual-tone fill, plus an `Approvals` action card with circular icon button (`↗`).
     - Right (8 cols): `Recent activity` data table with integrated pill search input and status filter dropdown in the card header.
4. **Navigation Chrome:**
   - Floating vertical icon rail on the far left (`rounded-full`) AND/OR a centered floating bottom dock (`rounded-full bg-[#241E1B]/90 backdrop-blur-xl border border-white/10 p-1.5`) with active cream pill tab.

## 5. Component & Geometry Rules
- **Corner Radii:** Strictly use generous, soft curves:
  - Outer Workspace Container: `rounded-[28px]`
  - Bento Cards: `rounded-2xl` (16px)
  - Buttons, Tabs, Search Bars, Badges, Navigation Docks: `rounded-full` (9999px)
- **Icons:** Thin-to-regular stroke icons (`1.5px` stroke width, e.g., Lucide Icons) enclosed in subtle circular or rounded-square containers.
- **Tables:** Borderless vertical columns; separate rows only with faint horizontal dividers (`border-b border-white/5`) and generous vertical row padding (`py-3.5`).

## 6. Anti-Patterns (Strictly Avoid)
- **NO** pure `#000000` backgrounds or harsh `#FFFFFF` cards.
- **NO** sharp `0px`–`4px` rectangular buttons or square checkboxes; everything interactive must be pill-shaped or smoothly rounded.
- **NO** saturated neon colors (`#00FF00`, `#FF00FF`); keep all semantic colors desaturated and warm-compatible.
- **NO** heavy opaque drop shadows (`shadow-2xl` black); use translucency and `1px` light borders for depth.