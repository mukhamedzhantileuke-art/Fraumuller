# AI Interaction Log — Assignment 3 (Bootstrap 5.3 Framework & Responsive Design)

**Project:** Frau Muller Resto-Pub Website  
**Author:** Nurmuhammadjon Abdurahmonov  
**Course:** Introduction to Web Technologies  
**Date:** October 2026  

---

## Overview and Compliance Statement
In strict compliance with the course Academic Integrity and AI Policy, AI tools were utilized solely for **conceptual clarification of Bootstrap 5.3 specifications, grid calculations, and component architecture**. Component markups were adapted directly from official Bootstrap documentation. All markup structuring, layout adaptations, stylesheet pruning, and verification were performed manually by the student.

---

## Log Entry 1: Mobile-First 12-Column Grid Architecture and Breakpoints
* **Date:** 2026-10-01
* **Topic / Question Asked:**
  > "How does Bootstrap 5 calculate column widths across different viewports (mobile-first approach), and how do classes like `col-12 col-md-6 col-lg-3` cascade upwards through breakpoints?"
* **Concept Clarification Received:**
  Bootstrap uses a mobile-first `min-width` media query approach. The base class `col-12` applies to all viewport widths from $0\text{px}$ up (`xs`). When the viewport reaches $768\text{px}$ (`md`), the `col-md-6` rule overrides the base, giving $50\%$ width ($6/12$). At $992\text{px}$ (`lg`), `col-lg-3` takes precedence, setting each item to $25\%$ ($3/12$). This ensures smooth responsive adaptation from single-column on mobile to multi-column on desktop without custom media queries.
* **Application in Project:**
  Implemented on `order.html` for the 4 delivery step cards (`.col-12 .col-sm-6 .col-lg-3`) and on `colophon.html` for the 3 developer profile cards (`.col-12 .col-md-4`).

---

## Log Entry 2: Container vs. Container-Fluid Design Principles
* **Date:** 2026-10-01
* **Topic / Question Asked:**
  > "When is it semantically and visually appropriate to choose `.container-fluid` over standard `.container` in modern web layouts?"
* **Concept Clarification Received:**
  `.container-fluid` maintains `width: 100%` across all viewport sizes, making it ideal for full-bleed hero banners, top-level navigation bars, and footers where background colors must stretch edge-to-edge. Conversely, `.container` applies predefined responsive `max-width` thresholds at each breakpoint, centering the grid (`margin-left: auto; margin-right: auto;`) with comfortable reading margins.
* **Application in Project:**
  Demonstrated on both `order.html` and `colophon.html`: `<header class="container-fluid">` and `<footer class="container-fluid">` span $100\%$ width with dark wood background, while `<main class="container">` contains the central content grid.

---

## Log Entry 3: Nested Grids and Gutters Management
* **Date:** 2026-10-02
* **Topic / Question Asked:**
  > "How do nested `.row` elements inside a `.col-*` handle margin-padding offsets, and why are gutter classes like `.g-3` preferred over manual margins?"
* **Concept Clarification Received:**
  Bootstrap `.row` elements apply negative horizontal margins (e.g. `-0.75rem`) to counteract the padding of parent column containers. When nesting a `.row` inside a `.col-*`, Bootstrap automatically aligns child columns to the grid boundaries without overflowing. Using `.g-3` sets consistent horizontal and vertical gaps via CSS variables (`--bs-gutter-x`, `--bs-gutter-y`), eliminating manual margin overrides.
* **Application in Project:**
  Implemented in the right-hand column of `order.html` (`.col-12 .col-lg-5`), where a nested `<div class="row g-3">` creates dual delivery metric badges.

---

## Log Entry 4: Navbar Collapse Mechanics and Accessibility (ARIA)
* **Date:** 2026-10-02
* **Topic / Question Asked:**
  > "What JavaScript data attributes and ARIA roles are required for the Bootstrap navbar toggler button to properly collapse and expand on mobile screens?"
* **Concept Clarification Received:**
  Bootstrap 5 uses pure JavaScript without jQuery. The toggler button requires `data-bs-toggle="collapse"` and `data-bs-target="#mainNav"`. For accessibility, `aria-controls="mainNav"`, `aria-expanded="false"`, and `aria-label="Toggle navigation"` must be provided. The target container requires `.collapse .navbar-collapse` with matching `id="mainNav"`.
* **Application in Project:**
  Integrated across all pages for full responsive navigation collapsing into a working mobile hamburger menu.

---

## Log Entry 5: Custom CSS Reduction and Component Adaptation
* **Date:** 2026-10-02
* **Topic / Question Asked:**
  > "How to systematically identify and remove redundant CSS when migrating an existing site to Bootstrap 5 while preserving brand identity?"
* **Concept Clarification Received:**
  Any custom rule defining display mode (`flex`, `grid`), column widths, padding, margins, borders, button states, or form sizing can be replaced with native Bootstrap classes (`.d-flex`, `.row`, `.p-4`, `.btn`, `.form-control`). The remaining custom stylesheet should act strictly as a brand palette and typography layer (`< 50` lines), only overriding CSS variables or adding brand-specific accents.
* **Application in Project:**
  Pruned `css/nurmuhammadjon.css` down from 384 lines to 48 lines, documenting every removed rule in `css_removal_log.txt`.
