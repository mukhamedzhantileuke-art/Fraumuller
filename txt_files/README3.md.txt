# Frau Muller Resto-Pub — Web Project (Assignment 3: Bootstrap 5.3)

## 1. Project Overview
* **Course:** Introduction to Web Technologies
* **Theme:** Frau Muller Resto-Pub (Ресто-паб Frau Muller)
* **Real Physical Location:** г. Астана, ул. Темирбека Жургенова, 18/1 (Аллея Мынжылдык)
* **Contacts:** +7 (702) 672-40-66 | Instagram: [@fraumullerkz](https://www.instagram.com/fraumullerkz/)
* **Assignment Phase:** Assignment 3 — Framework Layouts with Bootstrap 5.3, Responsive Grid, Containers, Components, Typography, Buttons & Utilities.

---

## 2. Team Members & Page Allocation

| Student | Assigned HTML Pages | Personal Stylesheet | Key Responsibilities in Assignment 3 |
|---|---|---|---|
| **Tileuke Mukhamedzhan** | `index.html`, `about.html`, `reservation.html` | `css/tileuke.css` | Index hero banner, booking form with Bootstrap form controls, about us grid, card layouts, CSS pruning. |
| **Alan Baiguzhinov** | `menu.html`, `contacts.html`, `feedback.html` | `css/alan.css` | Menu dish cards in grid, contacts cards with responsive layout, feedback form controls, CSS pruning. |
| **Nurmuhammadjon Abdurahmonov** | `order.html`, `colophon.html` | `css/nurmuhammadjon.css` | Order checkout form grid, delivery nested grid, Bootstrap Accordion FAQ, Colophon team cards & breakpoints table, CSS reduction (<50 lines). |

* **Team Common Layer:** `css/base.css` (Shared palette: Dark Wood, Light Parchment, DarkRed, Gold; heading font stack).

---

## 3. Core Principles & Bootstrap Architecture

### A. "Bootstrap Builds, Custom CSS Corrects"
* Bootstrap 5.3.3 CDN (`bootstrap.min.css` & `bootstrap.bundle.min.js`) handles all structural layouts, 12-column grid, responsive navigation, gutters, form controls, and utility spacing.
* All custom stylesheets were trimmed into ultra-lightweight correction layers:
  * `css/base.css` $\approx 35$ lines
  * `css/tileuke.css` $\approx 40$ lines
  * `css/alan.css` $\approx 25$ lines
  * `css/nurmuhammadjon.css` $\approx 48$ lines
* A comprehensive log of removed rules and their Bootstrap replacements is maintained in [`css_removal_log.txt`](css_removal_log.txt).

### B. Containers & Responsive Grid Implementation
1. **Container Strategy:**
   * `.container-fluid`: Applied to `<header>` and `<footer>` on every page to ensure full-bleed brand backgrounds across any screen width.
   * `.container`: Applied to `<main>` to contain the central grid with balanced margins and reading width.
2. **Multi-Breakpoint Responsive Blocks:**
   * Delivery & Terms: `col-12 col-lg-7` (info & photo) and `col-12 col-lg-5` (metrics & promo).
   * Delivery Process: 4 cards with `col-12 col-sm-6 col-lg-3`.
   * Developer Profiles: 3 cards with `col-12 col-md-4`.
   * Form Fields: `.row g-3` with `col-12 col-md-8`, `col-12 col-md-6`, `col-12 col-md-4`.
3. **Nested Grid:**
   * Demonstrated on `order.html` inside `.col-12 .col-lg-5` using a nested `<div class="row g-3">` for delivery time and minimum order badges.

### C. Responsive Breakpoints & Zero Overflow at 375px
The layout was rigorously tested and verified across all target viewport sizes:
* **Mobile (375px):** Single-column vertical flow (`col-12`), **0 horizontal overflow**, navbar collapsed into functional toggler.
* **Tablet (768px):** Two/three-column grid (`col-md-6`, `col-md-4`), medium spacing.
* **Desktop (992px+):** Full multi-column grid (`col-lg-7 / col-lg-5`, `col-lg-3`), expanded navbar.

### D. Typography, Buttons & Utility Classes
* **Typography:** `.display-5`, `.h3`, `.h5`, `.lead`, `.text-secondary`, `.text-muted`, `<small>`, `.fw-bold`.
* **Button Variants (4+ types):**
  1. Primary CTA: `.btn .btn-danger .btn-lg` ("Оформить доставку")
  2. Outline Variant: `.btn .btn-outline-secondary .btn-lg` ("Очистить форму")
  3. Size Variant: `.btn .btn-outline-danger .btn-sm` ("Перейти к заказу")
  4. Disabled State: `.btn .btn-secondary .btn-lg .disabled` ("Экспресс за 15 мин (Недоступно)")
* **Utility Classes (10+ types):**
  * Spacing: `py-5`, `mb-4`, `p-4`, `g-3`, `gap-2`
  * Colors: `bg-dark`, `bg-white`, `bg-light`, `text-white`, `text-danger`
  * Borders & Radius: `border`, `border-bottom`, `rounded-3`, `rounded-circle`, `rounded-pill`
  * Shadows: `shadow`, `shadow-sm`, `shadow-lg`
  * Flexbox: `d-flex`, `flex-column`, `justify-content-between`, `align-items-center`

### E. Bootstrap Components Implemented
* **Navbar:** `.navbar .navbar-expand-lg .navbar-dark .bg-dark` with animated toggler button.
* **Accordion (FAQ):** `.accordion .accordion-item .accordion-header .accordion-collapse` on `order.html`.
* **Cards:** `.card .card-body .card-title` for specials, dishes, team members.
* **Alerts:** `.alert .alert-warning .d-flex .align-items-center` for delivery notices.
* **Badges:** `.badge .bg-danger`, `.badge .bg-warning`, `.badge .bg-success`.
* **List Group:** `.list-group .list-group-flush` on `colophon.html`.
* **Table:** `.table .table-striped .table-hover .table-responsive` for breakpoint specifications.

---

## 4. Verification and Validation
* **W3C HTML5 Validation:** All 8 pages pass with **0 errors**.
* **Zero Custom Frameworks:** Native Bootstrap 5.3 CDN only.
* **Local File Support:** Runs directly from local files without requiring Node.js or local web servers.

---

## 5. Repository Structure
```
Fraumuller/
├── index.html            # Landing page (Tileuke)
├── about.html            # About & history (Tileuke)
├── reservation.html      # Table reservation (Tileuke)
├── menu.html             # Menu list (Alan)
├── contacts.html         # Contacts & hours (Alan)
├── feedback.html         # Feedback form (Alan)
├── order.html            # Food delivery & order form (Nurmuhammadjon)
├── colophon.html         # Technical specification (Nurmuhammadjon)
├── css/
│   ├── base.css          # Shared palette & typography
│   ├── tileuke.css       # Stylesheet for Tileuke's pages
│   ├── alan.css          # Stylesheet for Alan's pages
│   └── nurmuhammadjon.css# Stylesheet for Nurmuhammadjon's pages (<50 lines)
├── images/               # Authentic photos and menu dish images
├── screenshots/          # 4 responsive screenshots (Desktop, Tablet, Mobile 375px, Toggler)
├── css_removal_log.txt   # Detailed log of removed CSS and Bootstrap replacements
├── ai_log3.md            # AI interaction log for Assignment 3
└── README3.md            # Comprehensive project documentation for Assignment 3
```
