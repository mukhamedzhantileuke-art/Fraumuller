/**
 * Frau Muller Resto-Pub — Table Reservation Logic (Plain JavaScript)
 * Author: Tileuke Mukhamedzhan (Weeks 6–8)
 *
 * Requirements fulfilled:
 * 1. At least two arrays and two objects at the top of the file containing real project data
 * 2. Dynamic markup generation: <select> options populated with a loop from HALL_ZONES
 * 3. Pure helper functions with parameters & return values, called from multiple places
 * 4. Conditional business logic (opening hours check, zone capacity, VIP deposit, group discount)
 * 5. Calculated numbers displayed on page (deposit sum, group discount, confirmation code)
 * 6. Multiple event types ('submit', 'input', 'change', 'click') + delegated event handler
 * 7. Field-by-field form validation with instant error clearing on fix
 * 8. Strict separation: 100% Plain Vanilla JavaScript, zero jQuery dependencies
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // 1. REAL PROJECT DATA AT THE TOP OF THE FILE (>= 2 Arrays and >= 2 Objects)
    
    // Array 1: Hall zones configuration with seating limits and deposit rules
    const HALL_ZONES = [
        { id: 'main', name: 'Основной зал', maxGuests: 15, depositPerGuest: 0, description: 'Уютная атмосфера баварского паба, живая музыка и спортивные трансляции' },
        { id: 'terrace', name: 'Летняя терраса', maxGuests: 8, depositPerGuest: 0, description: 'Свежий воздух с панорамным видом на Аллею Мынжылдык' },
        { id: 'vip', name: 'VIP кабина', maxGuests: 12, depositPerGuest: 3000, description: 'Изолированное клубное пространство с профессиональным караоке' }
    ];

    // Array 2: Special occasion packages with guest bonuses
    const OCCASION_OFFERS = [
        { id: 'dinner', name: 'Обычный ужин', bonus: 'Приветственный комплимент от шефа (свежеиспеченный баварский брецель)' },
        { id: 'birthday', name: 'День рождения 🎉', bonus: 'Скидка 10% на все меню кухни + праздничный десерт со свечой от шеф-кондитера' },
        { id: 'corporate', name: 'Корпоратив 🍻', bonus: 'Фирменный сет мюнхенских колбасок и скидка 15% при бронировании от 8 гостей' }
    ];

    // Object 1: Operating schedule and venue information
    const RESTAURANT_SCHEDULE = {
        openHour: 12, // 12:00
        closeHour: 2,  // 02:00 next morning
        name: 'Ресто-паб Frau Muller',
        city: 'Астана',
        address: 'ул. Темирбека Жургенова, 18/1 (Аллея Мынжылдык)',
        phone: '+7 778 777 00 03'
    };

    // Object 2: Booking and reservation policy rules
    const BOOKING_POLICY = {
        minGuests: 1,
        maxGuests: 15,
        largeGroupThreshold: 8,
        largeGroupDiscountPercent: 10,
        holdMinutes: 15
    };

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

    // 2. DYNAMIC MARKUP GENERATION: Populate <select> via loop from HALL_ZONES array
    function populateZoneSelect(selectElement, zones) {
        if (!selectElement) return;
        selectElement.innerHTML = '';
        for (let i = 0; i < zones.length; i++) {
            const zone = zones[i];
            const option = document.createElement('option');
            option.value = zone.id;
            const depositNote = zone.depositPerGuest > 0 
                ? ' (депозит ' + formatTenge(zone.depositPerGuest) + '/чел)' 
                : ' (без депозита)';
            option.textContent = zone.name + ' — до ' + zone.maxGuests + ' гостей' + depositNote;
            selectElement.appendChild(option);
        }
    }
    populateZoneSelect(zoneSelect, HALL_ZONES);

    // Dynamic Live Preview Container (created in JavaScript DOM, not written in static HTML)
    const liveReservationBox = document.createElement('div');
    liveReservationBox.id = 'live-reservation-summary';
    liveReservationBox.className = 'alert alert-light border mt-3 mb-0 p-3 shadow-sm';
    const detailsFieldset = zoneSelect ? zoneSelect.closest('fieldset') : null;
    if (detailsFieldset) {
        detailsFieldset.appendChild(liveReservationBox);
    }

    // 3. PURE HELPER FUNCTIONS WITH PARAMETERS AND RETURN VALUES (each called from >= 2 places)

    function formatTenge(amount) {
        return amount.toLocaleString('ru-RU') + ' ₸';
    }

    function findZoneById(zoneId) {
        for (let i = 0; i < HALL_ZONES.length; i++) {
            if (HALL_ZONES[i].id === zoneId) {
                return HALL_ZONES[i];
            }
        }
        return HALL_ZONES[0];
    }

    function findOccasionById(occId) {
        for (let i = 0; i < OCCASION_OFFERS.length; i++) {
            if (OCCASION_OFFERS[i].id === occId) {
                return OCCASION_OFFERS[i];
            }
        }
        return OCCASION_OFFERS[0];
    }

    function calculateDeposit(zoneObj, guests) {
        const count = parseInt(guests, 10) || 0;
        return zoneObj.depositPerGuest * count;
    }

    function calculateGroupDiscount(guests, baseDeposit) {
        const count = parseInt(guests, 10) || 0;
        if (count >= BOOKING_POLICY.largeGroupThreshold && baseDeposit > 0) {
            return Math.round(baseDeposit * (BOOKING_POLICY.largeGroupDiscountPercent / 100));
        }
        return 0;
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

    function generateBookingCode(prefix) {
        const safePrefix = prefix || 'FM';
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = safePrefix + '-';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // 4. LIVE SUMMARY UPDATE: Recalculates and updates live DOM preview
    function updateLiveSummary() {
        if (!liveReservationBox) return;

        const currentZone = findZoneById(zoneSelect ? zoneSelect.value : 'main');
        const guests = parseInt(guestCount.value, 10) || 1;
        const occasionRadio = bookingForm.querySelector('input[name="occasion"]:checked');
        const occasionObj = findOccasionById(occasionRadio ? occasionRadio.value : 'dinner');
        const timeVal = resTime ? resTime.value : '';

        const baseDeposit = calculateDeposit(currentZone, guests);
        const groupDiscount = calculateGroupDiscount(guests, baseDeposit);
        const finalDeposit = baseDeposit - groupDiscount;

        let timeStatusHtml = '';
        if (timeVal) {
            if (isTimeWithinOperatingHours(timeVal)) {
                timeStatusHtml = '<span class="badge bg-success">Ресторан открыт (12:00 - 02:00)</span>';
            } else {
                timeStatusHtml = '<span class="badge bg-danger">Вне рабочих часов (открыты 12:00 - 02:00)</span>';
            }
        }

        let capacityWarning = '';
        if (guests > currentZone.maxGuests) {
            capacityWarning = '<div class="text-danger small mt-1 fw-bold">⚠️ Превышена вместимость зала (' + currentZone.maxGuests + ' мест). Выберите другой зал или уменьшите число гостей.</div>';
        }

        let html = '';
        html += '<div class="d-flex justify-content-between align-items-center mb-2">';
        html += '  <strong class="text-dark">Параметры брони: ' + currentZone.name + '</strong>';
        html += '  <span>' + timeStatusHtml + '</span>';
        html += '</div>';
        html += '<p class="small text-muted mb-2">' + currentZone.description + '</p>';
        html += '<div class="d-flex flex-wrap justify-content-between align-items-center pt-2 border-top small">';
        html += '  <div><strong>Гостей:</strong> ' + guests + ' чел. (макс. ' + currentZone.maxGuests + ')</div>';
        html += '  <div><strong>Депозит:</strong> ' + (finalDeposit === 0 ? '<span class="text-success fw-bold">0 ₸ (без депозита)</span>' : '<span class="text-primary fw-bold">' + formatTenge(finalDeposit) + '</span>');
        if (groupDiscount > 0) {
            html += ' <span class="badge bg-warning text-dark ms-1">Скидка -' + formatTenge(groupDiscount) + '</span>';
        }
        html += '  </div>';
        html += '</div>';
        html += '<div class="mt-2 pt-2 border-top small text-secondary">';
        html += '  <strong>Бонус повода (' + occasionObj.name + '):</strong> ' + occasionObj.bonus;
        html += '</div>';
        html += capacityWarning;

        liveReservationBox.innerHTML = html;
    }

    // 5. VALIDATION HELPER FUNCTIONS

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
        if (!inputElement) return;
        inputElement.classList.remove('field-error', 'is-invalid-custom');
        const parent = inputElement.parentNode;
        if (!parent) return;
        const existing = parent.querySelector('.field-error-text');
        if (existing) {
            parent.removeChild(existing);
        }
    }

    // 6. EVENT LISTENERS: Real-time validation clearing and live summary update
    fullName.addEventListener('input', function () { clearFieldError(fullName); });
    phoneNumber.addEventListener('input', function () { clearFieldError(phoneNumber); });

    resDate.addEventListener('change', function () {
        clearFieldError(resDate);
        updateLiveSummary();
    });

    resTime.addEventListener('input', function () {
        clearFieldError(resTime);
        updateLiveSummary();
    });
    resTime.addEventListener('change', function () {
        clearFieldError(resTime);
        updateLiveSummary();
    });

    guestCount.addEventListener('input', function () {
        clearFieldError(guestCount);
        updateLiveSummary();
    });
    guestCount.addEventListener('change', function () {
        clearFieldError(guestCount);
        updateLiveSummary();
    });

    zoneSelect.addEventListener('change', function () {
        clearFieldError(guestCount);
        clearFieldError(zoneSelect);
        updateLiveSummary();
    });

    // Occasion radio buttons change
    const occasionRadios = bookingForm.querySelectorAll('input[name="occasion"]');
    occasionRadios.forEach(function (radio) {
        radio.addEventListener('change', updateLiveSummary);
    });

    // 7. DELEGATED EVENT LISTENER FOR FORM CONTROLS & CONFIRMATION ACTIONS
    bookingForm.addEventListener('click', function (e) {
        const target = e.target;

        // Reset button handling
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
                updateLiveSummary();
            }, 10);
        }

        // Dismiss confirmation handling
        if (target.classList.contains('dismiss-booking-btn')) {
            e.preventDefault();
            if (confirmationBox) {
                confirmationBox.classList.add('hidden');
                confirmationBox.innerHTML = '';
            }
        }
    });

    // 8. FORM SUBMIT HANDLER: Full validation and dynamic receipt generation
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

        if (isNaN(guests) || guests < BOOKING_POLICY.minGuests || guests > BOOKING_POLICY.maxGuests) {
            showFieldError(guestCount, 'Количество гостей должно быть от ' + BOOKING_POLICY.minGuests + ' до ' + BOOKING_POLICY.maxGuests + '.');
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

        // Calculate final deposit and group discount
        const baseDeposit = calculateDeposit(selectedZone, guests);
        const groupDiscount = calculateGroupDiscount(guests, baseDeposit);
        const finalDeposit = baseDeposit - groupDiscount;
        const bookingCode = generateBookingCode('TB');

        // Selected occasion details
        const occasionRadio = bookingForm.querySelector('input[name="occasion"]:checked');
        const occasionObj = findOccasionById(occasionRadio ? occasionRadio.value : 'dinner');

        const notifyWhatsApp = wantsNotification ? wantsNotification.checked : false;
        const requestsVal = requests ? requests.value.trim() : '';

        // Render dynamic confirmation receipt
        let confHtml = '';
        confHtml += '<div class="card border-success shadow">';
        confHtml += '  <div class="card-header bg-success text-white py-3">';
        confHtml += '    <h3 class="h5 mb-0 fw-bold">🎉 Столик успешно забронирован! Код брони: ' + bookingCode + '</h3>';
        confHtml += '  </div>';
        confHtml += '  <div class="card-body p-4">';
        confHtml += '    <p class="lead mb-3">Уважаемый(ая) <strong>' + escapeHtml(nameVal) + '</strong>, мы забронировали для вас столик в ресто-пабе <em>' + RESTAURANT_SCHEDULE.name + '</em>.</p>';
        confHtml += '    <div class="row g-3 mb-3">';
        confHtml += '      <div class="col-md-6">';
        confHtml += '        <ul class="list-unstyled mb-0">';
        confHtml += '          <li><strong>Дата и время:</strong> ' + escapeHtml(dateVal) + ' в ' + escapeHtml(timeVal) + '</li>';
        confHtml += '          <li><strong>Зал:</strong> ' + selectedZone.name + ' (' + guests + ' гостей)</li>';
        confHtml += '          <li><strong>Повод:</strong> ' + occasionObj.name + '</li>';
        confHtml += '        </ul>';
        confHtml += '      </div>';
        confHtml += '      <div class="col-md-6">';
        confHtml += '        <ul class="list-unstyled mb-0">';
        confHtml += '          <li><strong>Контактный телефон:</strong> ' + escapeHtml(phoneVal) + '</li>';
        confHtml += '          <li><strong>WhatsApp уведомление:</strong> ' + (notifyWhatsApp ? 'Включено ✅' : 'Не требуется') + '</li>';
        confHtml += '          <li><strong>Депозит за бронь:</strong> ' + (finalDeposit === 0 ? '<span class="text-success fw-bold">Без депозита (0 ₸)</span>' : formatTenge(finalDeposit));
        if (groupDiscount > 0) {
            confHtml += ' <span class="badge bg-warning text-dark ms-1">Скидка -' + formatTenge(groupDiscount) + '</span>';
        }
        confHtml += '</li>';
        confHtml += '        </ul>';
        confHtml += '      </div>';
        confHtml += '    </div>';

        confHtml += '    <div class="p-2 bg-light rounded mb-3 small"><strong>Бонус визита:</strong> ' + occasionObj.bonus + '</div>';

        if (requestsVal) {
            confHtml += '    <div class="p-2 bg-light rounded mb-3 small"><strong>Пожелания:</strong> ' + escapeHtml(requestsVal) + '</div>';
        }

        confHtml += '    <div class="alert alert-info py-2 small mb-3">';
        confHtml += '      📍 Адрес: ' + RESTAURANT_SCHEDULE.address + '. Стол сохраняется за вами в течение ' + BOOKING_POLICY.holdMinutes + ' минут от указанного времени.';
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

    // Initial render of live summary
    updateLiveSummary();
});
