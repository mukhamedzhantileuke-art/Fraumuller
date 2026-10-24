# Frau Muller Resto-Pub — Web Project (Assignment 2)

## 1. Project Overview
* **Institution:** Introduction to Web Technologies
* **Theme:** Frau Muller Resto-Pub (Ресто-паб Frau Muller)
* **Real Physical Location:** г. Астана, ул. Темирбека Жургенова, 18/1 (Аллея Мынжылдык)
* **Contacts:** +7 (702) 672-40-66 | Instagram: [@fraumullerkz](https://www.instagram.com/fraumullerkz/)
* **Assignment Phase:** Assignment 2 — CSS Fundamentals, Selectors, Cascade, Flexbox & Grid Layouts, Positioning.

---

## 2. Team Members & Distribution of Responsibilities

| Student | Assigned HTML Pages | Personal Stylesheet | Key Responsibilities |
|---|---|---|---|
| **Tileuke Mukhamedzhan** | `index.html`, `about.html`, `reservation.html` | `css/tileuke.css` | Grid auto-fit layout, relative/absolute hero overlay, float/clear on history section, date/time attribute selectors, booking form. |
| **Alan Baiguzhinov** | `menu.html`, `contacts.html`, `feedback.html` | `css/alan.css` | Specificity experiment (.contact-card), contacts flex container with grow/shrink items, menu grid, feedback form, internal `<style>` block in `menu.html`, inline style in `contacts.html`. |
| **Nurmuhammadjon Abdurahmonov** | `order.html`, `colophon.html` | `css/nurmuhammadjon.css` | Order form styling, order steps flexbox, colophon CSS Grid with spanning item, fixed floating button, 3 centering techniques, margin collapse analysis, specificity experiment, single `!important` rule justification. |

* **Team Collaboration:** `css/base.css` (Palette, typography, global box model, header/nav flex row/footer).

---

## 3. CSS Architecture & Key Implementations

### A. Color Palette & Typography (`css/base.css`)
Defined at the root level with a strict maximum of 5 colors:
1. `#F5F2EB` (Light Parchment / Beige) — Main background ensuring readability and warmth.
2. `rgba(43, 30, 22, 1)` (Dark Wood) — Header and footer background reflecting traditional Bavarian pub aesthetics.
3. `#2C2C2C` (Charcoal) — Primary body text color, softer than pure black.
4. `DarkRed` (Named Color) — Accent color for borders, links, and highlights.
5. `#D4AF37` (Mustard / Antique Gold) — Interactive states (:hover, :focus, accents).

Typography features deliberate font stacks:
- Headings: `Georgia, "Times New Roman", serif`
- Body copy: `Arial, Helvetica, sans-serif`

### B. Selectors Coverage (All Required Types Used)
- **Type Selectors:** `h1, h2, h3`, `legend`, `p`, `table`, etc.
- **Class Selectors:** `.order-card`, `.colophon-grid`, `.step-item`, `.delivery-info`, `.price-tag`, etc.
- **ID Selectors:** `#order-form`, `#colophon-main`, `#history-section`, `#contact-main`.
- **Descendant Selectors:** `.order-form label`, `header h1`.
- **Child Selectors (`>`):** `fieldset > input[type="checkbox"]`, `.booking-form > fieldset`.
- **Adjacent Sibling Selectors (`+`):** `label + input[type="text"]`, `h2 + p`.
- **Grouping with Commas:** `button[type="submit"], button[type="reset"]`, `input, textarea`.
- **Attribute Selectors:** `input[type="tel"]`, `input[type="date"]`, `button[type="submit"]`.
- **Universal Selector (`*`):** Resetting box-sizing to `border-box`.
- **Pseudo-Classes:** `:hover`, `:focus`, `:first-child`.
- **Pseudo-Elements:** `::after`, `::before`.

### C. Layout Systems: Flexbox & Grid
1. **Flexbox:**
   - Global navigation row with `justify-content: center; align-items: center; gap: 20px;` in `css/base.css`.
   - Card rows with `flex-wrap: wrap; flex-direction: row;` and items that grow/shrink (`flex: 1 1 180px;`) on `order.html` (`.order-steps`, `.step-item`) and `contacts.html` (`#contact-main`, `.contact-card`).
2. **CSS Grid:**
   - Multi-column responsive layout on `colophon.html` (`.colophon-grid`) and `index.html` (`.main-grid`) using `repeat(auto-fit, minmax(280px, 1fr))` and `gap`.
   - Grid spanning element (`grid-column: 1 / -1;`) on `.grid-span-all` in `colophon.html`.

### D. Positioning, Float & Clear
1. **Positioning (all 4 values demonstrated):**
   - `static`: Document flow behavior explained on `.static-content` and `#history-section`.
   - `relative`: Containing block for badge on `.order-card-relative` and `.hero-article`.
   - `absolute`: Promo badge (`.promo-badge`) and image caption overlay (`.overlay-figure figcaption`).
   - `fixed`: Floating quick call / order button (`.fixed-order-btn`) remaining pinned to bottom-right during scroll.
2. **Float & Clear:**
   - Float left on `.float-img` with text wrapping around the image.
   - Proper clearance via `.delivery-clear { clear: both; }` preventing parent container collapse and overlap.

### E. 3 Distinct Centering Techniques
1. **Technique 1 (Margin Auto):** Horizontal centering of block containers with constrained width (`.center-block`, `main` in `base.css`).
2. **Technique 2 (Flexbox):** Two-axis centering using `display: flex; justify-content: center; align-items: center;` on `.center-flex-box`.
3. **Technique 3 (Absolute + Transform):** Dead-center positioning within relative container via `top: 50%; left: 50%; transform: translate(-50%, -50%);` on `.center-absolute-item`.

### F. Priority, Cascade & Specificity Experiments
- **Specificity Experiment in `css/nurmuhammadjon.css`:**
  - Rule 1: `.order-badge` $\rightarrow$ Specificity `(0, 1, 0)`.
  - Rule 2: `span.order-badge` $\rightarrow$ Specificity `(0, 1, 1)`.
  - Resolution: Rule 2 wins naturally through higher selector weight without needing `!important`.
- **The Single `!important` Rule:**
  - Applied exclusively to `.urgent-notice` in `css/nurmuhammadjon.css` (line 147) with a dedicated justification comment explaining its role for critical delivery announcements.
- **Cascade Demonstrations:**
  - Internal `<style>` block in `menu.html` overriding base heading styles.
  - Inline `style="..."` attribute in `contacts.html` demonstrating top-tier cascade priority.

---

## 4. Verification and Validation
- **W3C HTML5 Validation:** All 8 pages pass with **0 errors**.
- **W3C CSS3 Validation:** All stylesheets (`base.css`, `tileuke.css`, `alan.css`, `nurmuhammadjon.css`) pass with **0 errors**.
- **Local Execution:** Open any HTML file directly in any modern desktop browser (Google Chrome, Microsoft Edge, Mozilla Firefox).

---

## 5. Repository Structure
```
Fraumuller/
├── index.html            # Main landing page (Tileuke)
├── about.html            # History & concept (Tileuke)
├── reservation.html      # Table booking form (Tileuke)
├── menu.html             # Menu list & table (Alan)
├── contacts.html         # Contact information & map details (Alan)
├── feedback.html         # Feedback form (Alan)
├── order.html            # Food delivery & order form (Nurmuhammadjon)
├── colophon.html         # Technical documentation & credits (Nurmuhammadjon)
├── css/
│   ├── base.css          # Common palette, typography, header, nav, footer
│   ├── tileuke.css       # Stylesheet for Tileuke's pages
│   ├── alan.css          # Stylesheet for Alan's pages
│   └── nurmuhammadjon.css# Stylesheet for Nurmuhammadjon's pages
├── images/               # Authentic photos and logo
├── screenshots/          # Before & after styling screenshots + sketch photo
├── css_checklist2.txt    # Line-numbered checklist of all CSS requirements
├── ai_log2.md            # Documented conceptual inquiries per AI policy
└── README2.md            # Comprehensive project documentation
```
