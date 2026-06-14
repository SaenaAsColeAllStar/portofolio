# Technical Debt Register

This document tracks technical debt, duplication, and architectural improvements for the CTOS Portfolio platform.

## Registered Items

### 1. Styling & Token Duplication
- **Issue**: Hardcoded HSL/hex color values, margins, and borders in `global.css` and individual component `<style>` tags.
- **Impact**: Inconsistent theme implementation and higher maintenance costs.
- **Refactoring Plan**: Extract colors, spacing, borders, radius, shadows, typography, and motion tokens into standalone files under `src/styles/tokens/` and reference them via CSS variables.

### 2. Monolithic Navigation System
- **Issue**: `Header.astro` contains desktop styles, theme toggling scripts, language switcher HTML/JS, and mobile routing in a single file.
- **Impact**: Poor modularity, difficult keyboard access maintenance, and visual clutter.
- **Refactoring Plan**: Modularize into `/src/components/navigation/` containing `Header.astro`, `MobileNav.astro`, `ThemeSwitcher.astro`, and `LanguageSwitcher.astro`.

### 3. Monolithic Command Palette
- **Issue**: `CommandPalette.astro` contains modal backdrop logic, search indexing fetch, keyboard event handlers, and result lists.
- **Impact**: High complexity and difficult component reusability.
- **Refactoring Plan**: Split into `/src/components/command/` containing `CommandPalette.astro`, `CommandInput.astro`, and `SearchResults.astro`.

### 4. Inline SVG Bloat
- **Issue**: Icon SVGs are hardcoded inline across about page, index page, and navigations.
- **Impact**: High page footprint and visual inconsistency.
- **Refactoring Plan**: Create standardized Astro SVG wrapper components under `src/assets/svg/` sharing a common visual system.

### 5. Inline Animation Logic
- **Issue**: Keyframe animations and intersection observer scripts are scattered in CSS files and inline page scripts.
- **Impact**: Non-reusable animations and poor readability.
- **Refactoring Plan**: Establish a clean, central animation utility engine in `src/lib/animations/` and apply classes or data-attributes.
