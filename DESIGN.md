# Design Specification - Competitive English Test Platform (NIKE x MOCKERS)

This document outlines the design system tokens, typography, component layout structure, and aesthetics for the English Mock Test application.

---

## 1. Global System Tokens

### Color Palette
- **Canvas / Background**: `#FFFFFF` (Pure White)
- **Primary / Active Text / Active States**: `#000000` (Pure Black)
- **Secondary Text (Hierarchy Level 2)**: `#555555` (Dark Gray)
- **Muted Metadata (Hierarchy Level 3)**: `#888888` (Medium Gray)
- **System Borders (Crisp Layout Dividers)**: `#E5E5E5` (Light Gray)
- **Shadow Rule**: `border: 1px solid #E5E5E5; box-shadow: none !important;` (No shadows allowed, sharp flat design)

### Typography
- **Core UI Font Family**: `"Inter"`, sans-serif
- **Hero Display Family**: `"Inter"`, sans-serif (Bold/Extra Bold uppercase styles) or `"Bebas Neue"`, sans-serif
- **Global Tracking (Body)**: `-0.01em`
- **Global Tracking (Headings)**: `-0.02em`
- **Hero Tracking**: `-0.04em`

---

## 2. Layout & Component Architecture

### Component A: Minimal Global Header
- **Structure**: 
  - Height: `64px`
  - Display: Flex, space-between, items-center
  - Padding: `0 32px`
  - Border Bottom: `1px solid #E5E5E5`
  - Background Color: `#FFFFFF`
- **Left Element**: "ENGLISH MOCK TESTS" (Inter, Weight 800, Size 16px, Uppercase, Color #000000)
- **Right Element**: "Student Code: 4315" (Inter, Size 14px, Color #555555, code 4315 nested in span with Weight 900 and Color #000000)
- **Decoration**: No profile pictures, no dark/light mode toggle icons, no decorative chrome.

### Component B: Typographic Hero Section
- **Structure**: Centered layout, max-width `720px`, padding `80px 0 48px 0`
- **Title**: "Welcome back." (Inter, Weight 800, Size 56px, Line-height 1.1, Color #000000, Letter-spacing -0.03em, margin-bottom 16px)
- **Subtitle**: "Continue your preparation with today's mock tests. Timed simulations with detailed reviews will help you refine grammar and structure rules." (Inter, Weight 400, Size 15px, Line-height 1.6, Color #555555, margin-bottom 32px)
- **Primary CTA Button**: "START MOCK TEST 8 →" (Capsule Pill, background `#000000`, color `#FFFFFF`, Inter, Weight 600, Size 14px, Uppercase, Letter-spacing 0.05em, padding `14px 28px`, border none, instant state transitions)

### Component C: High-Density Performance Statistics Matrix
- **Structure**: Max-width `1024px`, background `#FFFFFF`, border `1px solid #E5E5E5`, sharp edges (border-radius `0px`)
- **Row Style**: Flex, space-between, items-center, padding `20px 24px`, border-bottom `1px solid #E5E5E5` (Last row omits border-bottom)
- **Data Nodes**: Inter, Weight 800, Size 16px, uppercase, color `#000000`
- **Matrix Mapping**:
  - Row 1: Left -> "TESTS TAKEN: 7" | Right -> "AVG. ACCURACY: 35%"
  - Row 2: Left -> "BEST SCORE: 4 / 80" | Right -> ""
  - Row 3: Left -> "STREAK: 1 DAY" | Right -> ""

### Component D: Available Mock Tests Linear Directory
- **Section Title**: "Available Mock Tests" (Inter, Weight 800, Size 22px, color `#000000`, margin-bottom 24px, text-align left)
- **List Container**: Max-width `1024px`, flex column layout
- **Row Item Structure**: Flex, space-between, items-center, height `72px`, padding `0 8px`, border-bottom `1px solid #E5E5E5`
- **Left Group**:
  - Title: "TEST 1: ENGLISH GRAMMAR MCQ" (Inter, Weight 800, Size 15px, uppercase, color `#000000`)
  - Metadata: "20 Questions • 20 Mins" (Inter, Weight 400, Size 13px, color `#888888`, margin-top 4px)
- **Center Tag (Conditional)**: "COMPLETED" (Inter, Weight 700, size 12px, letter-spacing 0.06em, color `#000000`, flat text badge, no green/blue pill backgrounds)
- **Right Action Button**: "VIEW REPORT" or "START TEST" (Capsule Pill, background `#000000`, color `#FFFFFF`, Inter, Weight 700, Size 12px, uppercase, padding `10px 20px`, border none)

---

## 3. Interaction & Visual Standards
- All borders must be exactly `1px solid #E5E5E5` or `#000000` for active states.
- Absolutely no soft shadows, color pills (green/blue/red backgrounds), or colorful accent tags.
- Design must feel modern, serious, authoritative, and completely distraction-free.
