# AI Interaction Log — Endterm Project (Weeks 6–10)
**Project:** Frau Muller Resto-Pub Web Application  
**Course:** Introduction to Web Technologies  
**Team Members:** Tileuke Mukhamedzhan, Alan Baiguzhinov, Nurmuhammadjon Abdurahmonov  

---

## 1. Questions Asked & Concepts Researched

### Topic 1: Plain JavaScript Event Delegation vs Direct Attachment
* **Question:** Why is a delegated event listener (`parent.addEventListener('click', ...)`) preferred over attaching handlers to individual items created dynamically?
* **Explanation Received:** Elements created after the initial DOM load (such as dynamically appended order items or receipt cards) do not have listeners directly attached to them. By attaching the handler to a stable parent element and using `e.target` or `e.target.closest()`, any current or future child elements are caught through event bubbling (DOM Level 3 event propagation model).
* **Application in Project:** Applied in `js/order.js` on `#order-form` to catch clicks on reset buttons, order receipt dismissal, and quick actions.

### Topic 2: Strict Separation of Plain JavaScript and jQuery
* **Question:** What is the technical penalty for mixing jQuery and Plain JS in the same file or feature?
* **Explanation Received:** Mixing APIs (e.g. using `document.getElementById` inside a jQuery chain or wrapping raw DOM objects unnecessarily) violates modular design, creates maintenance confusion, and breaks the course requirement. Features must be strictly decoupled: `js/order.js`, `js/reservation.js`, and `js/auth.js` use pure Plain JavaScript, while `js/feedback.js` and `js/menu.js` use jQuery.

### Topic 3: jQuery Traversal vs Global ID Lookups
* **Question:** How to replace ID selectors like `$('#feedback-error')` with jQuery traversal methods?
* **Explanation Received:** Instead of adding extra IDs to the HTML markup (which breaks the freeze rule), use contextual traversal starting from the active element: `$(this).closest('.mb-3').find('.invalid-feedback')` or `$(this).siblings()`. This keeps the DOM clean and flexible.
* **Application in Project:** Implemented in `js/feedback.js` for star rating tabs and review card filtering.

### Topic 4: Form Validation Best Practices & Preventing Page Reload
* **Question:** What is the exact sequence when validating a main checkout form without a backend?
* **Explanation Received:** 
  1. Call `e.preventDefault()` on form submit to prevent browser submission and reload.
  2. Trim string values with `.trim()`.
  3. Validate each field individually against regular expressions and logical bounds.
  4. Display specific error messages adjacent to the erroneous field rather than a single generic alert.
  5. Clear errors immediately upon the `input` or `change` event as the user corrects the mistake.
  6. Assemble and inject the confirmation receipt into the designated DOM container only when all validation checks pass.
* **Application in Project:** Implemented in `js/order.js` and `js/reservation.js`.

---

## 2. Integrity and Defense Readiness Declaration
All team members have reviewed the code, understand every function, traversal chain, and event handler, and are fully prepared to answer oral questions, live coding tasks, and theory prompts during the Endterm defense.
