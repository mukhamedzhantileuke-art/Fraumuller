# AI Interaction Log — Assignment 6 (jQuery Migration, DOM Traversal, Events & Form Validation)

**Project:** Frau Muller Resto-Pub Website  
**Course:** Introduction to Web Technologies (SE-2531)  
**Team:** Tileuke Mukhamedzhan, Alan Baiguzhinov, Nurmuhammadjon Abdurahmonov  
**Date:** October 2026  

---

## 1. Overview and Compliance Statement
In strict accordance with course policy and academic integrity guidelines, AI assistance was utilized as a pair-programming consultant for **conceptual clarification of jQuery 3.7.1 API design, DOM traversal performance, event delegation mechanics, animation queue lifecycle, and client vs. server validation architecture**. 

All original plain JavaScript implementations from previous assignments were preserved in `old-js-version.js` for comparative analysis. No external third-party plugins, ready-made sliders, or UI templates were downloaded or used. The HTML/CSS freeze rule was strictly maintained.

---

## 2. Structured Log Entries

### Log Entry 1: jQuery Loading Lifecycle and `$(document).ready()` Mechanics
* **Date:** 2026-10-28
* **Topic / Inquiry:**
  > "Why is `$(document).ready()` (or `$(function() { ... })`) required when scripts are placed at the bottom of the page, and what specific browser events does it hook into compared to `window.onload`?"
* **Technical Clarification Received:**
  `$(document).ready()` fires as soon as the DOM tree hierarchy is fully parsed and constructured by the browser (`DOMContentLoaded` event), without waiting for heavy external assets like high-resolution images, stylesheets, or iframes to finish downloading. Conversely, `window.onload` waits for every single image and stylesheet to load, introducing unnecessary latency. Wrapping code in `$(document).ready()` guarantees that jQuery element selectors (such as `$('#booking-form')` or `$('.review-card')`) will find valid DOM nodes and never return empty collections.
* **Project Implementation:**
  Every JavaScript file (`js/main.js`, `js/index.js`, `js/reservation.js`, `js/order.js`, `js/menu.js`, `js/feedback.js`, `js/contacts.js`) wraps its runtime logic inside `$(document).ready()` / `$(function() { ... })` and includes explicit version documentation.

---

### Log Entry 2: Direct Binding vs. Event Delegation (`.on()`)
* **Date:** 2026-10-29
* **Topic / Inquiry:**
  > "Why does binding a click listener directly via `$('.item').on('click', handler)` fail for dynamic cards generated in code, and how does `$('#container').on('click', '.item', handler)` resolve this?"
* **Technical Clarification Received:**
  Direct binding evaluates `$('.item')` once when the statement executes. It traverses the DOM at that precise moment and attaches event listeners only to elements currently in the tree. When a list or catalog is filtered, sorted, or re-rendered with `.empty()` and `.append()`, the old elements are destroyed and brand-new DOM elements are created with zero attached listeners.
  Delegated event handling attaches a single listener to a persistent ancestor (e.g. `$('#cardsRow')` or `$('#cartContainer')`). Due to DOM event bubbling, when a child `.card-dish-item` is clicked, the event bubbles up the ancestor tree. The parent container checks if `event.target` matches the delegate selector (`.card-dish-item`) and executes the handler with `$(this)` bound to the matching child.
* **Project Implementation:**
  - `js/index.js`: `$cardsRow.on('click', '.card-dish-item', ...)`
  - `js/order.js`: `$cartContainer.on('click', '.btn-remove-cart-item', ...)`
  - `js/menu.js`: `$('table.table').on('click', '.btn-stepper-plus', ...)`
  - `js/menu.js`: `$modalItemsContainer.on('click', '.btn-modal-plus', ...)`

---

### Log Entry 3: `.attr()` vs. `.prop()` and `.text()` vs. `.html()`
* **Date:** 2026-10-29
* **Topic / Inquiry:**
  > "What is the critical semantic and runtime difference between `.attr()` and `.prop()` on checkboxes/inputs, and why does `.text()` prevent XSS while `.html()` should be reserved for trusted markup?"
* **Technical Clarification Received:**
  - `.attr('checked')` queries the static HTML markup attribute string (`"checked"` or `undefined`). It does not change when the user clicks the checkbox on the screen.
  - `.prop('checked')` queries the live, dynamic DOM property maintained by the browser engine (`true` or `false`). For runtime user interactions, `.prop()` is strictly required.
  - `.text(val)` internally invokes `textContent` (or `innerText`), automatically escaping `< > & "` characters into text nodes, rendering malicious script tags harmless.
  - `.html(val)` invokes `innerHTML`, parsing strings into executable DOM elements. It is appropriate only for safe developer-authored icons (e.g., SVG eye toggles), never for raw user input.
* **Project Implementation:**
  Applied on `reservation.html` (`#wantsNotification.prop('checked')`), `order.html` (`#extraSauce.prop('checked')`, input `.prop('disabled', true)`), and throughout text updates.

---

### Log Entry 4: Method Chaining & Traversal Without Redundant IDs
* **Date:** 2026-10-30
* **Topic / Inquiry:**
  > "How can jQuery traversal methods (`.closest()`, `.parent()`, `.siblings()`, `.find()`) replace manual DOM IDs, and how should method chaining be structured for readability?"
* **Technical Clarification Received:**
  Rather than giving every input wrapper or card title an arbitrary unique ID, jQuery allows contextual traversal from the event source `$(this)`. From a clicked button, `$(this).closest('.card').find('.card-title')` navigates up to the card boundary and down to its title. In chaining, each method returns a jQuery collection, allowing contiguous operations without storing intermediate variables.
* **Project Implementation:**
  - Chain 1 (`js/main.js`): `$item.removeClass('text-muted').addClass('text-success fw-semibold').text('✓ ' + label);`
  - Chain 2 (`js/index.js`): `$(this).closest('.card').find('.card-title').addClass('text-danger');`
  - Chain 3 (`js/reservation.js`): `$input.siblings('.js-field-error').fadeOut(150, function () { $(this).remove(); });`

---

### Log Entry 5: Client-Side vs. Server-Side Validation Philosophy
* **Date:** 2026-10-30
* **Topic / Inquiry:**
  > "Why does rigorous client-side form validation (regex, required, real-time error clearing) never substitute for server-side validation?"
* **Technical Clarification Received:**
  Client-side validation is solely an interface optimization designed for user convenience (reducing round-trips and giving immediate visual hints). It is never a security mechanism because:
  1. The client controls the execution environment: scripts can be disabled, modified via browser DevTools, or bypassed using automated HTTP clients (curl, Postman).
  2. Business constraints (table capacity, unique database constraints, live inventory) can only be verified against persistent server records.
  3. Backend validation is the only true barrier preventing injection attacks, data corruption, and unauthorized state changes.
* **Project Implementation:**
  Extensively documented in `js/reservation.js`, `js/order.js`, and `README.md`.
