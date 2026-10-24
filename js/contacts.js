/**
 * Frau Muller Resto-Pub - Contacts Interactive Script (contacts.html)
 * Assignment 4-5: Live Open/Closed Status, Route Quick-Links & Callback Form
 */

'use strict';

/**
 * Checks current time and updates live open/closed status badge
 */
function initLiveOpenStatus() {
    const statusContainer = document.getElementById('live-restaurant-status');
    if (!statusContainer) {
        return;
    }

    const now = new Date();
    const hour = now.getHours();

    // Resto-pub Frau Muller operates from 12:00 PM to 02:00 AM (next day)
    const isOpen = hour >= 12 || hour < 2;

    statusContainer.textContent = '';

    const badge = document.createElement('span');
    badge.className = isOpen
        ? 'badge bg-success p-2 fs-6 shadow-sm d-inline-flex align-items-center gap-2'
        : 'badge bg-secondary p-2 fs-6 shadow-sm d-inline-flex align-items-center gap-2';

    const dot = document.createElement('span');
    dot.className = isOpen ? 'spinner-grow spinner-grow-sm text-light' : 'd-none';
    dot.setAttribute('role', 'status');

    const text = document.createTextNode(isOpen ? 'Сейчас открыто: ждём вас до 02:00' : 'Сейчас закрыто: открываемся в 12:00');

    badge.appendChild(dot);
    badge.appendChild(text);
    statusContainer.appendChild(badge);
}

/**
 * Initializes callback and manager message form
 */
function initCallbackForm() {
    const form = document.getElementById('contacts-callback-form');
    const msgContainer = document.getElementById('callback-message-container');

    if (!form) {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nameInput = document.getElementById('cb-name');
        const phoneInput = document.getElementById('cb-phone');
        const topicSelect = document.getElementById('cb-topic');
        const messageInput = document.getElementById('cb-message');

        const nameVal = nameInput ? nameInput.value.trim() : '';
        const phoneVal = phoneInput ? phoneInput.value.trim() : '';
        const topicVal = topicSelect ? topicSelect.options[topicSelect.selectedIndex].text : 'Общий вопрос';
        const messageVal = messageInput ? messageInput.value.trim() : '';

        if (nameVal.length < 2) {
            nameInput.classList.add('is-invalid');
            nameInput.focus();
            return;
        }
        nameInput.classList.remove('is-invalid');

        const cleanedDigits = phoneVal.replace(/\D/g, '');
        if (cleanedDigits.length < 10) {
            phoneInput.classList.add('is-invalid');
            phoneInput.focus();
            return;
        }
        phoneInput.classList.remove('is-invalid');

        if (msgContainer) {
            msgContainer.textContent = '';

            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-success shadow-sm py-3 mt-3 text-start';

            const title = document.createElement('strong');
            title.className = 'd-block mb-1';
            title.textContent = '✅ Запрос успешно зарегистрирован!';

            const desc = document.createElement('p');
            desc.className = 'mb-1 small';
            desc.textContent = 'Спасибо, ' + nameVal + '! Администратор Frau Muller свяжется с вами по номеру ' + phoneVal + ' по теме «' + topicVal + '» в течение 10 минут.';

            const demoNotice = document.createElement('small');
            demoNotice.className = 'text-muted d-block mt-2 border-top pt-1';
            demoNotice.textContent = '⚠️ Демонстрационный режим: запрос обработан на стороне клиента.';

            alertDiv.appendChild(title);
            alertDiv.appendChild(desc);
            alertDiv.appendChild(demoNotice);
            msgContainer.appendChild(alertDiv);
        }

        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initLiveOpenStatus();
    initCallbackForm();
});
