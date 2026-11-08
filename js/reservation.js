/**
 * Frau Muller Resto-Pub — Table Reservation Logic (Plain JavaScript)
 * Author: Tileuke Mukhamedzhan (Weeks 6–8)
 *
 * Requirements fulfilled:
 * 1. Real project data in arrays and objects at top of file
 * 2. Pure helper functions with parameters & return values, called from multiple places
 * 3. Conditional business logic (opening hours check, zone capacity, VIP deposit calculation)
 * 4. Calculated numbers (deposit sum, confirmation code)
 * 5. Multiple event types ('submit', 'input', 'change', 'click') + delegated event handler
 * 6. Field-by-field form validation with instant error clearing on fix
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // 1. REAL PROJECT DATA AT THE TOP OF THE FILE
    const RESTAURANT_SCHEDULE = {
        openHour: 12, // 12:00
        closeHour: 2,  // 02:00 next morning
        name: 'Ресто-паб Frau Muller',
        address: 'г. Астана, ул. Темирбека Жургенова, 18/1'
    };

    const HALL_ZONES = [
        { id: 'main', name: 'Основной зал', maxGuests: 15, depositPerGuest: 0, description: 'Уютная атмосфера баварского паба, живая музыка' },
        { id: 'terrace', name: 'Летняя терраса', maxGuests: 8, depositPerGuest: 0, description: 'Свежий воздух с видом на Аллею Мынжылдык' },
        { id: 'vip', name: 'VIP кабина', maxGuests: 12, depositPerGuest: 3000, description: 'Изолированное пространство с караоке' }
    ];

    // DOM Hooks
    const bookingForm = document.getElementById('booking-form');
    const fullName = document.getElementById('fullName');
    const phoneNumber = document.getElementById('phoneNumber');
    const resDate = document.getElementById('resDate');
    const resTime = document.getElementById('resTime');
    const guestCount = document.getElementById('guestCount');
    const zoneSelect = document.getElementById('zone');
    const wantsNotification = document.getElementById('wantsNotification');
    const requests = document.getElementById('requests');
    const confirmationBox = document.getElementById('booking-confirmation');

    if (!bookingForm || !fullName) {
        return;
    }

    // Set minimum date to today
    const todayIso = new Date().toISOString().split('T')[0];
    if (resDate) {
        resDate.min = todayIso;
        if (!resDate.value) {
            resDate.value = todayIso;
        }
    }

    // 2. PURE FUNCTIONS WITH PARAMETERS AND RETURN VALUES

    function findZoneById(zoneId) {
        for (let i = 0; i < HALL_ZONES.length; i++) {
            if (HALL_ZONES[i].id === zoneId) {
                return HALL_ZONES[i];
            }
        }
        return HALL_ZONES[0];
    }

    function calculateDeposit(zoneObj, guests) {
        const count = parseInt(guests, 10) || 0;
        return zoneObj.depositPerGuest * count;
    }

    function formatTenge(amount) {
        return amount.toLocaleString('ru-RU') + ' ₸';
    }

    function validatePhone(phoneStr) {
        const trimmed = phoneStr.trim();
        const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return phoneRegex.test(trimmed);
    }

    function isTimeWithinOperatingHours(timeStr) {
        if (!timeStr) return false;
        const parts = timeStr.split(':');
        const hour = parseInt(parts[0], 10);
        const minute = parseInt(parts[1], 10);

        // Frau Muller operates from 12:00 to 02:00 (i.e. 12:00..23:59 or 00:00..01:59)
        if (hour >= RESTAURANT_SCHEDULE.openHour && hour <= 23) {
            return true;
        }
        if (hour >= 0 && hour < RESTAURANT_SCHEDULE.closeHour) {
            return true;
        }
        if (hour === RESTAURANT_SCHEDULE.closeHour && minute === 0) {
            return true;
        }
        return false;
    }

    function generateBookingCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'TB-';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // 3. VALIDATION HELPER FUNCTIONS

    function showFieldError(inputElement, message) {
        clearFieldError(inputElement);
        inputElement.classList.add('field-error', 'is-invalid-custom');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error-text text-danger small mt-1 fw-semibold';
        errorDiv.textContent = '⚠️ ' + message;

        if (inputElement.nextElementSibling) {
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextElementSibling);
        } else {
            inputElement.parentNode.appendChild(errorDiv);
        }
    }

    function clearFieldError(inputElement) {
        inputElement.classList.remove('field-error', 'is-invalid-custom');
        const parent = inputElement.parentNode;
        const existing = parent.querySelector('.field-error-text');
        if (existing) {
            parent.removeChild(existing);
        }
    }

    // 4. EVENT LISTENERS: Real-time error clearing
    fullName.addEventListener('input', function () { clearFieldError(fullName); });
    phoneNumber.addEventListener('input', function () { clearFieldError(phoneNumber); });
    resDate.addEventListener('change', function () { clearFieldError(resDate); });
    resTime.addEventListener('input', function () { clearFieldError(resTime); });
    resTime.addEventListener('change', function () { clearFieldError(resTime); });
    guestCount.addEventListener('input', function () { clearFieldError(guestCount); });
    zoneSelect.addEventListener('change', function () { clearFieldError(guestCount); });

    // Delegated event listener for form controls & confirmation dismiss
    bookingForm.addEventListener('click', function (e) {
        const target = e.target;

        if (target.getAttribute('type') === 'reset' || target.closest('[type="reset"]')) {
            setTimeout(function () {
                const errors = bookingForm.querySelectorAll('.field-error-text');
                errors.forEach(function (err) { err.remove(); });
                const inputs = bookingForm.querySelectorAll('.field-error, .is-invalid-custom');
                inputs.forEach(function (inp) { inp.classList.remove('field-error', 'is-invalid-custom'); });

                if (confirmationBox) {
                    confirmationBox.classList.add('hidden');
                    confirmationBox.innerHTML = '';
                }
            }, 10);
        }

        if (target.classList.contains('dismiss-booking-btn')) {
            e.preventDefault();
            if (confirmationBox) {
                confirmationBox.classList.add('hidden');
                confirmationBox.innerHTML = '';
            }
        }
    });

    // 5. FORM SUBMIT HANDLER
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        // 1. Name validation
        const nameVal = fullName.value.trim();
        if (nameVal.length < 2) {
            showFieldError(fullName, 'Введите корректное имя гостя (не менее 2 символов).');
            isValid = false;
        } else {
            clearFieldError(fullName);
        }

        // 2. Phone validation
        const phoneVal = phoneNumber.value.trim();
        if (!validatePhone(phoneVal)) {
            showFieldError(phoneNumber, 'Введите корректный номер телефона (+7 778 777 00 03).');
            isValid = false;
        } else {
            clearFieldError(phoneNumber);
        }

        // 3. Date validation
        const dateVal = resDate.value;
        if (!dateVal) {
            showFieldError(resDate, 'Пожалуйста, выберите дату визита.');
            isValid = false;
        } else {
            const selectedDate = new Date(dateVal);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                showFieldError(resDate, 'Дата бронирования не может быть в прошлом.');
                isValid = false;
            } else {
                clearFieldError(resDate);
            }
        }

        // 4. Time validation (within operating hours)
        const timeVal = resTime.value;
        if (!timeVal) {
            showFieldError(resTime, 'Укажите желаемое время визита.');
            isValid = false;
        } else if (!isTimeWithinOperatingHours(timeVal)) {
            showFieldError(resTime, 'Ресто-паб открыт с 12:00 до 02:00. Выберите время в этом интервале.');
            isValid = false;
        } else {
            clearFieldError(resTime);
        }

        // 5. Guest count & zone capacity validation
        const guests = parseInt(guestCount.value, 10);
        const selectedZone = findZoneById(zoneSelect.value);

        if (isNaN(guests) || guests < 1 || guests > 15) {
            showFieldError(guestCount, 'Количество гостей должно быть от 1 до 15.');
            isValid = false;
        } else if (guests > selectedZone.maxGuests) {
            showFieldError(guestCount, 'Для зоны "' + selectedZone.name + '" максимум ' + selectedZone.maxGuests + ' гостей. Выберите другой зал.');
            isValid = false;
        } else {
            clearFieldError(guestCount);
        }

        if (!isValid) {
            const firstErr = bookingForm.querySelector('.field-error');
            if (firstErr) {
                firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErr.focus();
            }
            return;
        }

        // Calculate deposit
        const depositAmount = calculateDeposit(selectedZone, guests);
        const bookingCode = generateBookingCode();

        // Selected occasion
        const occasionRadio = bookingForm.querySelector('input[name="occasion"]:checked');
        let occasionText = 'Обычный ужин';
        if (occasionRadio) {
            if (occasionRadio.value === 'birthday') occasionText = 'День рождения 🎉';
            if (occasionRadio.value === 'corporate') occasionText = 'Корпоратив 🍻';
        }

        const notifyWhatsApp = wantsNotification ? wantsNotification.checked : false;
        const requestsVal = requests ? requests.value.trim() : '';

        // RENDER CONFIRMATION
        let confHtml = '';
        confHtml += '<div class="card border-success shadow">';
        confHtml += '  <div class="card-header bg-success text-white py-3">';
        confHtml += '    <h3 class="h5 mb-0 fw-bold">🎉 Столик успешно забронирован! Код брони: ' + bookingCode + '</h3>';
        confHtml += '  </div>';
        confHtml += '  <div class="card-body p-4">';
        confHtml += '    <p class="lead mb-3">Уважаемый(ая) <strong>' + escapeHtml(nameVal) + '</strong>, мы забронировали для вас столик в ресто-пабе <em>Frau Muller</em>.</p>';
        confHtml += '    <div class="row g-3 mb-3">';
        confHtml += '      <div class="col-md-6">';
        confHtml += '        <ul class="list-unstyled mb-0">';
        confHtml += '          <li><strong>Дата и время:</strong> ' + escapeHtml(dateVal) + ' в ' + escapeHtml(timeVal) + '</li>';
        confHtml += '          <li><strong>Зал:</strong> ' + selectedZone.name + ' (' + guests + ' чел.)</li>';
        confHtml += '          <li><strong>Повод:</strong> ' + occasionText + '</li>';
        confHtml += '        </ul>';
        confHtml += '      </div>';
        confHtml += '      <div class="col-md-6">';
        confHtml += '        <ul class="list-unstyled mb-0">';
        confHtml += '          <li><strong>Контактный телефон:</strong> ' + escapeHtml(phoneVal) + '</li>';
        confHtml += '          <li><strong>WhatsApp уведомление:</strong> ' + (notifyWhatsApp ? 'Включено ✅' : 'Не требуется') + '</li>';
        confHtml += '          <li><strong>Депозит за бронь:</strong> ' + (depositAmount === 0 ? '<span class="text-success fw-bold">Без депозита (0 ₸)</span>' : formatTenge(depositAmount)) + '</li>';
        confHtml += '        </ul>';
        confHtml += '      </div>';
        confHtml += '    </div>';

        if (requestsVal) {
            confHtml += '    <div class="p-2 bg-light rounded mb-3 small"><strong>Пожелания:</strong> ' + escapeHtml(requestsVal) + '</div>';
        }

        confHtml += '    <div class="alert alert-info py-2 small mb-3">';
        confHtml += '      📍 Адрес: г. Астана, ул. Темирбека Жургенова, 18/1. Стол сохраняется за вами в течение 15 минут от указанного времени.';
        confHtml += '    </div>';

        confHtml += '    <div class="text-end">';
        confHtml += '      <button type="button" class="btn btn-outline-secondary btn-sm dismiss-booking-btn">Скрыть подтверждение</button>';
        confHtml += '    </div>';
        confHtml += '  </div>';
        confHtml += '</div>';

        confirmationBox.innerHTML = confHtml;
        confirmationBox.classList.remove('hidden');
        confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
