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

    // Enhance Registration Form if present
    if (registerPane) {
        const registerForm = registerPane.querySelector('form');
        const passwordInput = registerPane.querySelector('input[type="password"]');

        if (registerForm && passwordInput) {
            // Create Show/Hide Password button
            const togglePasswordBtn = document.createElement('button');
            togglePasswordBtn.type = 'button';
            togglePasswordBtn.className = 'btn btn-outline-secondary btn-sm mt-1 mb-2 d-block';
            togglePasswordBtn.textContent = 'Показать пароль';

            togglePasswordBtn.addEventListener('click', function () {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    togglePasswordBtn.textContent = 'Скрыть пароль';
                } else {
                    passwordInput.type = 'password';
                    togglePasswordBtn.textContent = 'Показать пароль';
                }
            });

            // Insert toggle button right after password input
            passwordInput.insertAdjacentElement('afterend', togglePasswordBtn);

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

    // Enhance Login Form if present
    if (loginPane) {
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
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    initFloatingActions();
    initAuthModalValidation();
});
