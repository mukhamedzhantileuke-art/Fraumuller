/**
 * Frau Muller Resto-Pub - Shared Site-Wide Script
 * Student: Tileuke Mukhamedzhan (SE-2531)
 * Assignment 4-5: JavaScript Fundamentals, DOM Manipulation & Event Handling
 */

'use strict';

/**
 * Validates password strength according to security checklist
 * @param {string} password - Raw password input
 * @returns {Object} Validation states for each rule
 */
function validatePasswordRules(password) {
    const minLength = 8;
    const hasUpper = /[A-ZА-ЯЁ]/.test(password);
    const hasLower = /[a-zа-яё]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLengthValid = password.length >= minLength;

    const allPassed = isLengthValid && hasUpper && hasLower && hasDigit && hasSpecial;

    return {
        isLengthValid,
        hasUpper,
        hasLower,
        hasDigit,
        hasSpecial,
        allPassed
    };
}

/**
 * Creates and attaches an eye icon toggle button to a password field
 * @param {HTMLInputElement} passwordInput - Target password input element
 */
function attachPasswordEyeToggle(passwordInput) {
    if (!passwordInput || passwordInput.dataset.hasEyeToggle === 'true') {
        return;
    }
    passwordInput.dataset.hasEyeToggle = 'true';

    // SVG Eye Icons
    const eyeOpenSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-1.01 1.343-2.313 2.169C11.02 11.332 9.258 12.5 8 12.5s-3.02-1.168-4.32-2.043A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>';
    const eyeSlashSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-1.01 1.343-2.313 2.169a8 8 0 0 1-1.39.81l.77.771zm-2.072-2.072A2.5 2.5 0 0 0 8 5.5a2.5 2.5 0 0 0-1.782.748l2.069 2.069z"/><path d="M11.297 9.174l2.557 2.556a.5.5 0 0 1-.708.708l-12-12a.5.5 0 1 1 .708-.708l1.796 1.797A8 8 0 0 1 8 2.5c5 0 8 5.5 8 5.5a13 13 0 0 1-1.927 2.664zM2.85 4.398l1.492 1.492C3.125 6.942 2 8 2 8s3 5.5 8 5.5c1.17 0 2.222-.32 3.14-.852l1.502 1.503a.5.5 0 0 1-.708.708l-12-12a.5.5 0 0 1 .708-.708z"/></svg>';

    // Create input-group wrapper if not present
    let inputGroup = passwordInput.parentElement;
    if (!inputGroup.classList.contains('input-group')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-group';
        passwordInput.parentNode.insertBefore(wrapper, passwordInput);
        wrapper.appendChild(passwordInput);
        inputGroup = wrapper;
    }

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn btn-outline-secondary';
    toggleBtn.setAttribute('aria-label', 'Показать пароль');
    toggleBtn.title = 'Показать / скрыть пароль';
    toggleBtn.innerHTML = eyeOpenSvg;

    toggleBtn.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.innerHTML = eyeSlashSvg;
            toggleBtn.setAttribute('aria-label', 'Скрыть пароль');
        } else {
            passwordInput.type = 'password';
            toggleBtn.innerHTML = eyeOpenSvg;
            toggleBtn.setAttribute('aria-label', 'Показать пароль');
        }
    });

    inputGroup.appendChild(toggleBtn);
}

/**
 * Initializes floating action button for quick WhatsApp contact and smooth scroll to top
 */
function initFloatingActions() {
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'position-fixed bottom-0 end-0 p-3 z-3 d-none flex-column gap-2 align-items-end';
    floatingContainer.id = 'floating-quick-actions';

    // WhatsApp quick contact button
    const waLink = document.createElement('a');
    waLink.href = 'https://wa.me/77787770003?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%AF%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Frau%20Muller';
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.className = 'btn btn-success rounded-circle shadow-lg d-flex align-items-center justify-content-center p-3 text-white text-decoration-none';
    waLink.setAttribute('aria-label', 'Написать менеджеру в WhatsApp');
    waLink.title = 'Быстрая связь в WhatsApp';

    const waBadge = document.createElement('span');
    waBadge.className = 'fw-bold fs-6';
    waBadge.textContent = 'WA';
    waLink.appendChild(waBadge);

    // Scroll-to-top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.type = 'button';
    scrollTopBtn.className = 'btn btn-dark rounded-circle shadow p-2 px-3';
    scrollTopBtn.setAttribute('aria-label', 'Вернуться наверх страницы');
    scrollTopBtn.title = 'Наверх';
    scrollTopBtn.textContent = '↑';

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    floatingContainer.appendChild(waLink);
    floatingContainer.appendChild(scrollTopBtn);
    document.body.appendChild(floatingContainer);

    // Toggle visibility on scroll past 250px
    window.addEventListener('scroll', function () {
        if (window.scrollY > 250) {
            floatingContainer.classList.remove('d-none');
            floatingContainer.classList.add('d-flex');
        } else {
            floatingContainer.classList.remove('d-flex');
            floatingContainer.classList.add('d-none');
        }
    });
}

/**
 * Initializes client-side validation and interactive checklist in Login/Registration modal
 */
function initAuthModalValidation() {
    const registerPane = document.getElementById('registerPane');
    const loginPane = document.getElementById('loginPane');

    if (!registerPane && !loginPane) {
        return;
    }

    // Enhance Login Form with Eye Icon if present
    if (loginPane) {
        const loginPasswordInput = loginPane.querySelector('input[type="password"]');
        if (loginPasswordInput) {
            attachPasswordEyeToggle(loginPasswordInput);
        }

        const loginForm = loginPane.querySelector('form');
        const loginMessageContainer = document.getElementById('login-message-container');

        if (loginForm && loginMessageContainer) {
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();
                loginMessageContainer.textContent = '';

                const emailInput = loginForm.querySelector('input[type="email"]');
                const emailValue = emailInput ? emailInput.value.trim() : '';

                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-info py-2 small text-start';

                const title = document.createElement('strong');
                title.className = 'd-block mb-1';
                title.textContent = 'Демонстрационная авторизация:';

                const message = document.createElement('p');
                message.className = 'mb-0';
                message.textContent = 'Сессия пользователя ' + emailValue + ' успешно эмулирована в браузере. Серверная база данных отключена в рамках учебного проекта.';

                alertDiv.appendChild(title);
                alertDiv.appendChild(message);
                loginMessageContainer.appendChild(alertDiv);

                loginForm.reset();
            });
        }
    }

    // Enhance Registration Form if present
    if (registerPane) {
        const registerForm = registerPane.querySelector('form');
        const passwordInput = registerPane.querySelector('input[type="password"]');

        if (registerForm && passwordInput) {
            // Attach eye toggle to register password
            attachPasswordEyeToggle(passwordInput);

            // Create Confirmation Password Field container
            const confirmWrapper = document.createElement('div');
            confirmWrapper.className = 'mb-3';

            const confirmLabel = document.createElement('label');
            confirmLabel.className = 'form-label';
            confirmLabel.textContent = 'Повторите пароль';

            const confirmInput = document.createElement('input');
            confirmInput.type = 'password';
            confirmInput.className = 'form-control';
            confirmInput.required = true;
            confirmInput.setAttribute('autocomplete', 'new-password');

            confirmWrapper.appendChild(confirmLabel);
            confirmWrapper.appendChild(confirmInput);

            // Insert confirm field before the submit button
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            registerForm.insertBefore(confirmWrapper, submitBtn);

            // Attach eye toggle to confirm password as well
            attachPasswordEyeToggle(confirmInput);

            // Create Live Checklist container
            const checklistContainer = document.createElement('div');
            checklistContainer.className = 'card bg-light border-0 p-3 mb-3 text-start small';

            const checklistTitle = document.createElement('p');
            checklistTitle.className = 'fw-bold mb-2 text-secondary';
            checklistTitle.textContent = 'Требования к надежности пароля:';
            checklistContainer.appendChild(checklistTitle);

            const checklistList = document.createElement('ul');
            checklistList.className = 'list-unstyled mb-0 d-flex flex-column gap-1';

            const rules = [
                { id: 'rule-length', label: 'Не менее 8 символов' },
                { id: 'rule-upper', label: 'Заглавная буква (A-Z, А-Я)' },
                { id: 'rule-lower', label: 'Строчная буква (a-z, а-я)' },
                { id: 'rule-digit', label: 'Хотя бы одна цифра (0-9)' },
                { id: 'rule-special', label: 'Специальный символ (!@#$%^&*)' },
                { id: 'rule-match', label: 'Пароли совпадают' }
            ];

            const ruleElements = {};

            rules.forEach(function (rule) {
                const li = document.createElement('li');
                li.className = 'text-muted';
                li.id = rule.id;
                li.textContent = '○ ' + rule.label;
                checklistList.appendChild(li);
                ruleElements[rule.id] = li;
            });

            checklistContainer.appendChild(checklistList);
            confirmWrapper.insertAdjacentElement('afterend', checklistContainer);

            // Update checklist on user input
            function updateChecklist() {
                const pass = passwordInput.value;
                const conf = confirmInput.value;
                const valResult = validatePasswordRules(pass);
                const isMatch = pass === conf && pass.length > 0;

                function updateItem(element, isValid, label) {
                    if (isValid) {
                        element.className = 'text-success fw-semibold';
                        element.textContent = '✓ ' + label;
                    } else {
                        element.className = 'text-muted';
                        element.textContent = '○ ' + label;
                    }
                }

                updateItem(ruleElements['rule-length'], valResult.isLengthValid, 'Не менее 8 символов');
                updateItem(ruleElements['rule-upper'], valResult.hasUpper, 'Заглавная буква (A-Z, А-Я)');
                updateItem(ruleElements['rule-lower'], valResult.hasLower, 'Строчная буква (a-z, а-я)');
                updateItem(ruleElements['rule-digit'], valResult.hasDigit, 'Хотя бы одна цифра (0-9)');
                updateItem(ruleElements['rule-special'], valResult.hasSpecial, 'Специальный символ (!@#$%^&*)');
                updateItem(ruleElements['rule-match'], isMatch, 'Пароли совпадают');

                return valResult.allPassed && isMatch;
            }

            passwordInput.addEventListener('input', updateChecklist);
            confirmInput.addEventListener('input', updateChecklist);

            // Handle Registration form submission
            registerForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const isValid = updateChecklist();
                const messageContainer = document.getElementById('register-message-container');

                if (!messageContainer) {
                    return;
                }

                messageContainer.textContent = '';

                if (!isValid) {
                    passwordInput.classList.add('is-invalid');
                    passwordInput.focus();

                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger py-2 small';
                    alertDiv.textContent = 'Пожалуйста, выполните все требования к паролю перед регистрацией.';
                    messageContainer.appendChild(alertDiv);
                    return;
                }

                passwordInput.classList.remove('is-invalid');
                passwordInput.classList.add('is-valid');
                confirmInput.classList.add('is-valid');

                const successDiv = document.createElement('div');
                successDiv.className = 'alert alert-success py-2 small text-start';

                const strong = document.createElement('strong');
                strong.className = 'd-block mb-1';
                strong.textContent = 'Демонстрационный режим:';

                const pDesc = document.createElement('p');
                pDesc.className = 'mb-0';
                pDesc.textContent = 'Проверка данных успешно пройдена на стороне клиента. В учебных целях данные не сохраняются в базу и пароль не передается на сервер.';

                successDiv.appendChild(strong);
                successDiv.appendChild(pDesc);
                messageContainer.appendChild(successDiv);

                registerForm.reset();
                updateChecklist();
            });
        }
    }
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    initFloatingActions();
    initAuthModalValidation();
});
