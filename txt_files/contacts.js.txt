/**
 * Frau Muller Resto-Pub — Contacts Interactive Script (contacts.html)
 * Student: Alan Baiguzhinov (SE-2531)
 * Assignment 6: jQuery Migration (Selectors, Traversal, Effects, Form Validation)
 * 
 * jQuery Version: 3.7.1
 * Why $(document).ready() is needed:
 * Guarantees that the DOM elements (#live-restaurant-status, #contacts-callback-form)
 * are ready before evaluating live restaurant business hours and binding validation handlers.
 */

'use strict';

/**
 * Checks current time and updates live open/closed status badge using jQuery
 */
function initLiveOpenStatus() {
    const $statusContainer = $('#live-restaurant-status');
    if (!$statusContainer.length) {
        return;
    }

    const now = new Date();
    const hour = now.getHours();

    // Resto-pub Frau Muller operates from 12:00 PM to 02:00 AM (next day)
    const isOpen = hour >= 12 || hour < 2;

    $statusContainer.empty();

    const $badge = $('<span>', {
        class: isOpen
            ? 'badge bg-success p-2 fs-6 shadow-sm d-inline-flex align-items-center gap-2'
            : 'badge bg-secondary p-2 fs-6 shadow-sm d-inline-flex align-items-center gap-2'
    });

    const $dot = $('<span>', {
        class: isOpen ? 'spinner-grow spinner-grow-sm text-light' : 'd-none',
        role: 'status'
    });

    const statusText = isOpen
        ? 'Сейчас открыто: ждём вас до 02:00'
        : 'Сейчас закрыто: открываемся в 12:00';

    $badge.append($dot).append(document.createTextNode(statusText));
    $statusContainer.append($badge);
}

/**
 * Helper to display field-level error in callback form
 * @param {jQuery} $input - jQuery input
 * @param {string} msg - Error text
 */
function showCallbackFieldError($input, msg) {
    clearCallbackFieldError($input);
    $input.addClass('is-invalid');

    const $fb = $('<div>', {
        class: 'invalid-feedback d-block js-cb-error small mt-1',
        text: msg
    }).hide();

    $input.parent().append($fb);
    $fb.fadeIn(200);
}

function clearCallbackFieldError($input) {
    $input.removeClass('is-invalid');
    $input.siblings('.js-cb-error').fadeOut(150, function () {
        $(this).remove();
    });
}

/**
 * Initializes callback and manager message form using jQuery
 */
function initCallbackForm() {
    const $form = $('#contacts-callback-form');
    const $msgContainer = $('#callback-message-container');

    if (!$form.length) {
        return;
    }

    const $nameInput = $('#cb-name');
    const $phoneInput = $('#cb-phone');
    const $topicSelect = $('#cb-topic');
    const $messageInput = $('#cb-message');

    // Clear errors on real-time input
    $nameInput.on('input', function () { clearCallbackFieldError($(this)); });
    $phoneInput.on('input', function () { clearCallbackFieldError($(this)); });

    $form.on('submit', function (event) {
        /*
         * event.preventDefault() comment:
         * Prevents the page from refreshing when user submits the callback request.
         * Without preventDefault(): The browser performs default GET/POST, causing a page jump
         * and discarding all user input before confirmation can be shown.
         */
        event.preventDefault();

        const nameVal = $.trim($nameInput.val());
        const phoneVal = $.trim($phoneInput.val());
        const topicVal = $topicSelect.length ? $topicSelect.find('option:selected').text() : 'Общий вопрос';

        let hasErrors = false;

        if (nameVal.length < 2) {
            showCallbackFieldError($nameInput, 'Пожалуйста, укажите ваше имя (не менее 2 символов).');
            hasErrors = true;
            $nameInput.focus();
        } else {
            clearCallbackFieldError($nameInput);
            $nameInput.addClass('is-valid');
        }

        const cleanedDigits = phoneVal.replace(/\D/g, '');
        if (cleanedDigits.length < 10) {
            showCallbackFieldError($phoneInput, 'Укажите корректный номер телефона (не менее 10 цифр).');
            if (!hasErrors) {
                $phoneInput.focus();
            }
            hasErrors = true;
        } else {
            clearCallbackFieldError($phoneInput);
            $phoneInput.addClass('is-valid');
        }

        if (hasErrors) {
            return;
        }

        /*
         * COMMENT ON CLIENT VS SERVER VALIDATION:
         * Client-side validation gives immediate visual reassurance to the user.
         * However, backend verification is non-negotiable for security:
         * server must enforce rate-limiting (prevent SMS flooding), authenticate users,
         * sanitize against injection attacks, and securely queue callback notifications.
         */
        if ($msgContainer.length) {
            $msgContainer.empty();

            const $alertDiv = $('<div>', {
                class: 'alert alert-success shadow-sm py-3 mt-3 text-start'
            }).hide();

            const $title = $('<strong>', { class: 'd-block mb-1', text: '✅ Запрос успешно зарегистрирован!' });
            const $desc = $('<p>', {
                class: 'mb-1 small',
                text: 'Спасибо, ' + nameVal + '! Администратор Frau Muller свяжется с вами по номеру ' + phoneVal + ' по теме «' + topicVal + '» в течение 10 минут.'
            });
            const $demoNotice = $('<small>', {
                class: 'text-muted d-block mt-2 border-top pt-1',
                text: '⚠️ Демонстрационный режим: запрос обработан на стороне клиента без отправки на сервер.'
            });

            $alertDiv.append($title).append($desc).append($demoNotice);
            $msgContainer.append($alertDiv);

            // jQuery Effect: slideDown with duration (350ms) and callback
            $alertDiv.slideDown(350, function () {
                $form.trigger('reset');
                $form.find('.is-valid').removeClass('is-valid');
            });
        }
    });
}

// Global initialization inside $(document).ready()
$(document).ready(function () {
    initLiveOpenStatus();
    initCallbackForm();
});
