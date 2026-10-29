/**
 * Frau Muller Resto-Pub — Shared Site-Wide Script
 * Student: Tileuke Mukhamedzhan (SE-2531)
 * Assignment 6: jQuery Migration (Selectors, Traversal, Effects, Delegation, Validation)
 * 
 * jQuery Version: 3.7.1 (loaded via official CDN in <head>/bottom of HTML)
 * Why $(document).ready() is needed:
 * In jQuery, $(document).ready() (or $(function() { ... })) guarantees that the entire DOM tree
 * is fully parsed and constructured before any JavaScript code executes. Without this wrapper,
 * attempting to select or manipulate elements (e.g., $('#loginPane')) while the browser is still
 * parsing HTML would yield empty jQuery collections and silent execution failures.
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
 * REWRITTEN FEATURE 3 (Assignment 6 comparison):
 * Password Eye Toggle & Interactive Security Checklist
 * 
 * Comparison Comment:
 * Replaced: document.createElement, parentNode.insertBefore, innerHTML, addEventListener, and manual type switching
 * With jQuery: $('<button>'), .wrap(), .attr(), .prop('type', ...), .html(), .on('click'), and $(this).
 * Verdict: Shorter and noticeably clearer. jQuery .prop() handles dynamic input type changing reliably across browsers,
 * while .html() and method chaining eliminate 15+ lines of tedious node creation and insertion.
 * 
 * @param {jQuery} $passwordInput - Target password input wrapped in jQuery
 */
function attachPasswordEyeToggle($passwordInput) {
    if (!$passwordInput.length || $passwordInput.attr('data-has-eye-toggle') === 'true') {
        return;
    }
    $passwordInput.attr('data-has-eye-toggle', 'true');

    // SVG Eye Icons
    const eyeOpenSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-1.01 1.343-2.313 2.169C11.02 11.332 9.258 12.5 8 12.5s-3.02-1.168-4.32-2.043A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>';
    const eyeSlashSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-1.01 1.343-2.313 2.169a8 8 0 0 1-1.39.81l.77.771zm-2.072-2.072A2.5 2.5 0 0 0 8 5.5a2.5 2.5 0 0 0-1.782.748l2.069 2.069z"/><path d="M11.297 9.174l2.557 2.556a.5.5 0 0 1-.708.708l-12-12a.5.5 0 1 1 .708-.708l1.796 1.797A8 8 0 0 1 8 2.5c5 0 8 5.5 8 5.5a13 13 0 0 1-1.927 2.664zM2.85 4.398l1.492 1.492C3.125 6.942 2 8 2 8s3 5.5 8 5.5c1.17 0 2.222-.32 3.14-.852l1.502 1.503a.5.5 0 0 1-.708.708l-12-12a.5.5 0 0 1 .708-.708z"/></svg>';

    // If input is not wrapped in .input-group, wrap it dynamically
    if (!$passwordInput.parent().hasClass('input-group')) {
        $passwordInput.wrap('<div class="input-group"></div>');
    }

    const $toggleBtn = $('<button>', {
        type: 'button',
        class: 'btn btn-outline-secondary',
        title: 'Показать / скрыть пароль',
        'aria-label': 'Показать пароль'
    }).html(eyeOpenSvg);

    // Event handler using $(this) and .prop()
    $toggleBtn.on('click', function () {
        const isPassword = $passwordInput.prop('type') === 'password';
        if (isPassword) {
            $passwordInput.prop('type', 'text');
            $(this).html(eyeSlashSvg).attr('aria-label', 'Скрыть пароль');
        } else {
            $passwordInput.prop('type', 'password');
            $(this).html(eyeOpenSvg).attr('aria-label', 'Показать пароль');
        }
    });

    $passwordInput.parent().append($toggleBtn);
}

/**
 * Initializes floating action button for quick WhatsApp contact and smooth scroll to top
 * Uses jQuery traversal, .fadeIn() / .fadeOut() effects and jQuery .animate()
 */
function initFloatingActions() {
    const $floatingContainer = $('<div>', {
        id: 'floating-quick-actions',
        class: 'position-fixed bottom-0 end-0 p-3 z-3 flex-column gap-2 align-items-end'
    }).css('display', 'none'); // Initially hidden for jQuery fadeIn/fadeOut effect

    // WhatsApp quick contact button
    const $waLink = $('<a>', {
        href: 'https://wa.me/77787770003?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%AF%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Frau%20Muller',
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'btn btn-success rounded-circle shadow-lg d-flex align-items-center justify-content-center p-3 text-white text-decoration-none',
        title: 'Быстрая связь в WhatsApp',
        'aria-label': 'Написать менеджеру в WhatsApp'
    }).append($('<span>', { class: 'fw-bold fs-6', text: 'WA' }));

    // Scroll-to-top button with smooth jQuery animate effect
    const $scrollTopBtn = $('<button>', {
        type: 'button',
        class: 'btn btn-dark rounded-circle shadow p-2 px-3',
        title: 'Наверх',
        'aria-label': 'Вернуться наверх страницы',
        text: '↑'
    });

    $scrollTopBtn.on('click', function (event) {
        /*
         * event.preventDefault() prevents default button trigger.
         * Comment explaining what would happen without preventDefault():
         * If this button were inside a form or default action context, it could trigger unwanted form submissions.
         */
        event.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 500);
    });

    $floatingContainer.append($waLink).append($scrollTopBtn);
    $('body').append($floatingContainer);

    // Effect with real purpose: fade in when scrolled down, fade out when at top
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 250) {
            if (!$floatingContainer.is(':visible')) {
                $floatingContainer.css('display', 'flex').hide().fadeIn(300);
            }
        } else {
            if ($floatingContainer.is(':visible')) {
                $floatingContainer.fadeOut(300);
            }
        }
    });
}

/**
 * Initializes client-side validation and interactive checklist in Login/Registration modal
 * Uses jQuery traversal, .slideDown(), .slideToggle(), chaining, and event delegation
 */
function initAuthModalValidation() {
    const $registerPane = $('#registerPane');
    const $loginPane = $('#loginPane');

    if (!$registerPane.length && !$loginPane.length) {
        return;
    }

    // Enhance Login Form with Eye Icon if present
    if ($loginPane.length) {
        const $loginPasswordInput = $loginPane.find('input[type="password"]');
        if ($loginPasswordInput.length) {
            attachPasswordEyeToggle($loginPasswordInput);
        }

        const $loginForm = $loginPane.find('form');
        const $loginMessageContainer = $('#login-message-container');

        if ($loginForm.length && $loginMessageContainer.length) {
            $loginForm.on('submit', function (event) {
                /*
                 * event.preventDefault() stops the browser's native form submission.
                 * Without preventDefault(): The browser would send an HTTP POST/GET request,
                 * refreshing the entire page, closing the modal, and losing all user state.
                 */
                event.preventDefault();
                $loginMessageContainer.empty();

                const $emailInput = $loginForm.find('input[type="email"]');
                const emailValue = $.trim($emailInput.val());

                const $alertDiv = $('<div>', {
                    class: 'alert alert-info py-2 small text-start'
                }).hide();

                const $title = $('<strong>', { class: 'd-block mb-1', text: 'Демонстрационная авторизация:' });
                const $message = $('<p>', {
                    class: 'mb-0',
                    text: 'Сессия пользователя ' + emailValue + ' успешно эмулирована в браузере. База данных отключена в учебном проекте.'
                });

                $alertDiv.append($title).append($message);
                $loginMessageContainer.append($alertDiv);

                // jQuery Effect with duration and callback
                $alertDiv.slideDown(350, function () {
                    // Callback runs after slideDown finishes
                    $loginForm.trigger('reset');
                });
            });
        }
    }

    // Enhance Registration Form if present
    if ($registerPane.length) {
        const $registerForm = $registerPane.find('form');
        const $passwordInput = $registerPane.find('input[type="password"]:first');

        if ($registerForm.length && $passwordInput.length) {
            attachPasswordEyeToggle($passwordInput);

            // Create Confirmation Password Field container
            const $confirmWrapper = $('<div>', { class: 'mb-3' });
            const $confirmLabel = $('<label>', { class: 'form-label', text: 'Повторите пароль' });
            const $confirmInput = $('<input>', {
                type: 'password',
                class: 'form-control',
                required: true,
                autocomplete: 'new-password'
            });

            $confirmWrapper.append($confirmLabel).append($confirmInput);

            // Insert confirm field before the submit button
            const $submitBtn = $registerForm.find('button[type="submit"]');
            $confirmWrapper.insertBefore($submitBtn);

            // Attach eye toggle to confirm password as well
            attachPasswordEyeToggle($confirmInput);

            // Create Live Checklist container
            const $checklistContainer = $('<div>', {
                class: 'card bg-light border-0 p-3 mb-3 text-start small'
            });

            const $checklistTitle = $('<p>', {
                class: 'fw-bold mb-2 text-secondary',
                text: 'Требования к надежности пароля:'
            });
            $checklistContainer.append($checklistTitle);

            const $checklistList = $('<ul>', {
                class: 'list-unstyled mb-0 d-flex flex-column gap-1'
            });

            const rules = [
                { id: 'rule-length', label: 'Не менее 8 символов' },
                { id: 'rule-upper', label: 'Заглавная буква (A-Z, А-Я)' },
                { id: 'rule-lower', label: 'Строчная буква (a-z, а-я)' },
                { id: 'rule-digit', label: 'Хотя бы одна цифра (0-9)' },
                { id: 'rule-special', label: 'Специальный символ (!@#$%^&*)' },
                { id: 'rule-match', label: 'Пароли совпадают' }
            ];

            // Build list dynamically using jQuery .each() and .appendTo()
            $.each(rules, function (idx, rule) {
                $('<li>', {
                    id: rule.id,
                    class: 'text-muted',
                    text: '○ ' + rule.label
                }).appendTo($checklistList);
            });

            $checklistContainer.append($checklistList);
            $confirmWrapper.after($checklistContainer);

            // Live validation logic
            function updateChecklist() {
                const pass = $passwordInput.val() || '';
                const conf = $confirmInput.val() || '';
                const valResult = validatePasswordRules(pass);
                const isMatch = pass === conf && pass.length > 0;

                function updateItem(selector, isValid, label) {
                    const $item = $checklistList.find(selector);
                    if (isValid) {
                        /*
                         * REQUIRED CHAIN 1 OF 3+ METHODS:
                         * Link 1: .removeClass('text-muted') -> removes gray default text styling
                         * Link 2: .addClass('text-success fw-semibold') -> applies green bold success styling
                         * Link 3: .text('✓ ' + label) -> updates checkmark symbol and rule text
                         */
                        $item.removeClass('text-muted')
                             .addClass('text-success fw-semibold')
                             .text('✓ ' + label);
                    } else {
                        $item.removeClass('text-success fw-semibold')
                             .addClass('text-muted')
                             .text('○ ' + label);
                    }
                }

                updateItem('#rule-length', valResult.isLengthValid, 'Не менее 8 символов');
                updateItem('#rule-upper', valResult.hasUpper, 'Заглавная буква (A-Z, А-Я)');
                updateItem('#rule-lower', valResult.hasLower, 'Строчная буква (a-z, а-я)');
                updateItem('#rule-digit', valResult.hasDigit, 'Хотя бы одна цифра (0-9)');
                updateItem('#rule-special', valResult.hasSpecial, 'Специальный символ (!@#$%^&*)');
                updateItem('#rule-match', isMatch, 'Пароли совпадают');

                return valResult.allPassed && isMatch;
            }

            // Real-time input listening via .on()
            $passwordInput.on('input', updateChecklist);
            $confirmInput.on('input', updateChecklist);

            // Handle Registration form submission
            $registerForm.on('submit', function (event) {
                /*
                 * event.preventDefault() prevents page reload upon registration attempt.
                 * Without it, invalid input would submit natively and reload without showing checklist feedback.
                 */
                event.preventDefault();
                const isValid = updateChecklist();
                const $messageContainer = $('#register-message-container');

                if (!$messageContainer.length) {
                    return;
                }

                $messageContainer.empty();

                /*
                 * COMMENT ON CLIENT VS SERVER VALIDATION:
                 * Browser-side checks (like regex, required fields, and live password checklist)
                 * improve UX by providing instant feedback before form submission.
                 * However, client validation NEVER replaces server-side validation because:
                 * 1. A client can bypass browser JavaScript entirely (e.g., via Postman, curl, or DevTools).
                 * 2. Browser scripts cannot check database uniqueness (e.g., already registered emails).
                 * 3. Malicious payloads could compromise the backend if the server blindly trusts client data.
                 */
                if (!isValid) {
                    $passwordInput.addClass('is-invalid').focus();

                    const $alertDiv = $('<div>', {
                        class: 'alert alert-danger py-2 small',
                        text: 'Пожалуйста, выполните все требования к паролю перед регистрацией.'
                    }).hide();

                    $messageContainer.append($alertDiv);
                    $alertDiv.slideDown(250);
                    return;
                }

                $passwordInput.removeClass('is-invalid').addClass('is-valid');
                $confirmInput.removeClass('is-invalid').addClass('is-valid');

                const $successDiv = $('<div>', {
                    class: 'alert alert-success py-2 small text-start'
                }).hide();

                const $strong = $('<strong>', { class: 'd-block mb-1', text: 'Демонстрационный режим:' });
                const $pDesc = $('<p>', {
                    class: 'mb-0',
                    text: 'Проверка данных успешно пройдена на стороне клиента. В учебных целях данные не передаются на сервер.'
                });

                $successDiv.append($strong).append($pDesc);
                $messageContainer.append($successDiv);

                // Effect with duration and callback
                $successDiv.fadeIn(400, function () {
                    $registerForm.trigger('reset');
                    updateChecklist();
                });
            });
        }
    }
}

// Global initialization inside $(document).ready()
$(document).ready(function () {
    initFloatingActions();
    initAuthModalValidation();
});
