/**
 * Frau Muller Resto-Pub - Table Reservation Script (reservation.html)
 * Student: Tileuke Mukhamedzhan (SE-2531)
 * Assignment 4-5: Live Deposit Calculator, Schedule Occupancy, Comprehensive Form Validation & Confirmation
 */

'use strict';

/**
 * Known holidays in Kazakhstan for special schedule notices
 */
const KZ_HOLIDAYS = {
    '01-01': 'Новый Год',
    '01-02': 'Новогодние праздники',
    '03-08': 'Международный женский день',
    '03-21': 'Наурыз Мейрамы',
    '03-22': 'Наурыз Мейрамы',
    '03-23': 'Наурыз Мейрамы',
    '05-01': 'Праздник единства народа Казахстана',
    '05-07': 'День защитника Отечества',
    '05-09': 'День Победы',
    '07-06': 'День Столицы',
    '08-30': 'День Конституции РК',
    '10-25': 'День Республики',
    '12-16': 'День Независимости РК'
};

/**
 * Reusable function 1: Formats number into KZT currency string
 * @param {number} amount - Numeric sum
 * @returns {string} Formatted string
 */
function formatKzt(amount) {
    return amount.toLocaleString('ru-RU') + ' ₸';
}

/**
 * Reusable function 2: Generates a temporary booking reference number using Math.random()
 * @returns {string} Unique demo code like "FM-7342"
 */
function generateBookingReference() {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return 'FM-' + randomDigits;
}

/**
 * Reusable function 3: Evaluates date for weekend status, holidays and table load
 * @param {string} dateString - "YYYY-MM-DD"
 * @returns {Object} Schedule information
 */
function checkDateSchedule(dateString) {
    if (!dateString) {
        return { isWeekend: false, holidayName: null, occupancyStatus: 'Обычная загрузка' };
    }

    const dateObj = new Date(dateString + 'T00:00:00');
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    const monthDay = dateString.slice(5); // "MM-DD"
    const holidayName = KZ_HOLIDAYS[monthDay] || null;

    let occupancyStatus = 'Свободных столиков достаточно (~75% доступно)';
    let alertClass = 'alert-info';

    if (holidayName) {
        occupancyStatus = 'Праздничный день: столы бронируются быстрее обычного (~20% свободно)';
        alertClass = 'alert-warning';
    } else if (isWeekend) {
        occupancyStatus = 'Пятница/Выходной: пиковые часы (~35% свободно, подтверждение до 15 мин)';
        alertClass = 'alert-warning';
    }

    return {
        isWeekend,
        holidayName,
        occupancyStatus,
        alertClass
    };
}

/**
 * Reusable function 4: Calculates required reservation deposit and surcharges
 * Includes group discounts and birthday special bonuses
 * @param {number} guestCount - Number of visitors
 * @param {string} zone - Selected hall zone ('main', 'terrace', 'vip')
 * @param {string} dateString - "YYYY-MM-DD"
 * @param {string} occasion - 'dinner', 'birthday', or 'corporate'
 * @returns {Object} Full calculation breakdown
 */
function calculateBookingDeposit(guestCount, zone, dateString, occasion) {
    const basePerGuest = 2000;
    const guestTotal = guestCount * basePerGuest;

    let zoneSurcharge = 0;
    let zoneName = 'Основной зал';

    if (zone === 'vip') {
        zoneSurcharge = 5000;
        zoneName = 'VIP кабина (приватная лаунж-зона)';
    } else if (zone === 'terrace') {
        zoneSurcharge = 1000;
        zoneName = 'Летняя терраса';
    }

    const scheduleInfo = checkDateSchedule(dateString);
    const subtotal = guestTotal + zoneSurcharge;
    const weekendMultiplier = scheduleInfo.isWeekend ? 0.1 : 0;
    const weekendSurcharge = Math.round(subtotal * weekendMultiplier);

    // Group size discount: 10% for 10+ guests, 5% for 6+ guests
    let groupDiscountPercent = 0;
    if (guestCount >= 10) {
        groupDiscountPercent = 10;
    } else if (guestCount >= 6) {
        groupDiscountPercent = 5;
    }
    const groupDiscountAmount = Math.round(subtotal * (groupDiscountPercent / 100));

    // Birthday bonus: 10% discount on booking + chef's surprise gift
    let birthdayDiscountAmount = 0;
    let birthdayGift = null;
    if (occasion === 'birthday') {
        birthdayDiscountAmount = Math.round(subtotal * 0.1);
        birthdayGift = '🎂 Фирменный мини-торт «Захер» со свечой от шеф-повара (в подарок)';
    }

    const totalDiscounts = groupDiscountAmount + birthdayDiscountAmount;
    const finalDeposit = Math.max(1000, subtotal + weekendSurcharge - totalDiscounts);

    return {
        guestCount,
        basePerGuest,
        guestTotal,
        zoneName,
        zoneSurcharge,
        isWeekend: scheduleInfo.isWeekend,
        holidayName: scheduleInfo.holidayName,
        weekendSurcharge,
        groupDiscountPercent,
        groupDiscountAmount,
        birthdayDiscountAmount,
        birthdayGift,
        finalDeposit
    };
}

/**
 * Clears field-level error messages and invalid CSS classes
 * @param {HTMLElement} inputElement - Input to clear
 */
function clearFieldError(inputElement) {
    inputElement.classList.remove('is-invalid');
    const existingFeedback = inputElement.parentElement.querySelector('.js-field-error');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

/**
 * Displays field-level error and applies is-invalid class
 * @param {HTMLElement} inputElement - Form field
 * @param {string} errorMessage - Error description
 */
function showFieldError(inputElement, errorMessage) {
    clearFieldError(inputElement);
    inputElement.classList.add('is-invalid');

    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback d-block js-field-error small mt-1';
    feedback.textContent = errorMessage;
    inputElement.parentElement.appendChild(feedback);
}

/**
 * Validates a single field according to specific rules
 * @param {string} fieldName - Field identifier
 * @param {HTMLFormElement} form - Form reference
 * @returns {string|null} Error string if invalid, or null if valid
 */
function validateBookingField(fieldName, form) {
    const fullNameInput = form.querySelector('#fullName');
    const phoneInput = form.querySelector('#phoneNumber');
    const dateInput = form.querySelector('#resDate');
    const timeInput = form.querySelector('#resTime');
    const guestsInput = form.querySelector('#guestCount');
    const zoneSelect = form.querySelector('#zone');

    const todayStr = new Date().toISOString().split('T')[0];

    if (fieldName === 'fullName') {
        const val = fullNameInput.value.trim();
        if (val.length === 0) {
            return 'Пожалуйста, укажите ваше имя.';
        }
        if (val.length < 2) {
            return 'Имя должно содержать не менее 2 символов.';
        }
        const nameRegex = /^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі\s\-]+$/;
        if (!nameRegex.test(val)) {
            return 'Имя может содержать только буквы, пробелы и дефисы.';
        }
        return null;
    }

    if (fieldName === 'phoneNumber') {
        const val = phoneInput.value.trim();
        if (val.length === 0) {
            return 'Пожалуйста, введите номер телефона.';
        }
        const cleanedDigits = val.replace(/\D/g, '');
        if (cleanedDigits.length < 10 || cleanedDigits.length > 12) {
            return 'Введите корректный номер (например, +7 778 777 00 03).';
        }
        return null;
    }

    if (fieldName === 'resDate') {
        const val = dateInput.value;
        if (!val) {
            return 'Выберите дату визита.';
        }
        if (val < todayStr) {
            return 'Дата визита не может быть в прошлом.';
        }
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 60);
        const maxDateStr = maxDate.toISOString().split('T')[0];
        if (val > maxDateStr) {
            return 'Бронирование доступно максимум на 60 дней вперед.';
        }
        return null;
    }

    if (fieldName === 'resTime') {
        const val = timeInput.value;
        if (!val) {
            return 'Выберите время визита.';
        }
        const timeParts = val.split(':');
        const hour = parseInt(timeParts[0], 10);

        if (hour >= 2 && hour < 12) {
            return 'Ресто-паб работает с 12:00 дня до 02:00 ночи. Пожалуйста, выберите рабочее время.';
        }
        return null;
    }

    if (fieldName === 'guestCount') {
        const val = parseInt(guestsInput.value, 10);
        if (isNaN(val) || val < 1) {
            return 'Минимальное количество гостей — 1.';
        }
        if (val > 15) {
            return 'Для компании более 15 человек свяжитесь с нами по телефону.';
        }

        if (zoneSelect.value === 'vip' && val < 4) {
            return 'Бронирование VIP кабины доступно для компаний от 4 гостей.';
        }
        return null;
    }

    return null;
}

/**
 * Initializes reservation page interactivity
 */
function initReservationInteractivity() {
    const bookingForm = document.getElementById('booking-form');
    const confirmationContainer = document.getElementById('booking-confirmation');

    if (!bookingForm) {
        return;
    }

    const fullNameInput = bookingForm.querySelector('#fullName');
    const phoneInput = bookingForm.querySelector('#phoneNumber');
    const dateInput = bookingForm.querySelector('#resDate');
    const timeInput = bookingForm.querySelector('#resTime');
    const guestsInput = bookingForm.querySelector('#guestCount');
    const zoneSelect = bookingForm.querySelector('#zone');
    const occasionRadios = bookingForm.querySelectorAll('input[name="occasion"]');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) {
        dateInput.value = today;
    }

    if (!timeInput.value) {
        timeInput.value = '19:00';
    }

    // Schedule Notice Banner
    const scheduleNoticeBox = document.createElement('div');
    scheduleNoticeBox.className = 'alert alert-info py-2 small mb-3';
    scheduleNoticeBox.id = 'schedule-status-banner';
    dateInput.closest('.row').insertAdjacentElement('beforebegin', scheduleNoticeBox);

    // Live Deposit Calculation Card
    const calculationCard = document.createElement('div');
    calculationCard.className = 'card border-danger border-2 p-3 mb-4 bg-light';
    calculationCard.id = 'live-deposit-summary';

    const calcTitle = document.createElement('h3');
    calcTitle.className = 'h6 fw-bold text-danger mb-2 d-flex justify-content-between align-items-center';
    calcTitle.textContent = 'Предварительный расчет депозита:';

    const calcBadge = document.createElement('span');
    calcBadge.className = 'badge bg-danger';
    calcBadge.textContent = 'Калькулятор брони';
    calcTitle.appendChild(calcBadge);

    const calcBreakdown = document.createElement('div');
    calcBreakdown.className = 'small text-muted d-flex flex-column gap-1';
    calcBreakdown.id = 'deposit-breakdown-content';

    const calcTotalDiv = document.createElement('div');
    calcTotalDiv.className = 'd-flex justify-content-between align-items-center pt-2 mt-2 border-top fw-bold text-dark fs-6';
    calcTotalDiv.id = 'deposit-total-display';

    calculationCard.appendChild(calcTitle);
    calculationCard.appendChild(calcBreakdown);
    calculationCard.appendChild(calcTotalDiv);

    const actionButtonsContainer = bookingForm.querySelector('.d-flex.flex-wrap');
    if (actionButtonsContainer) {
        actionButtonsContainer.insertAdjacentElement('beforebegin', calculationCard);
    } else {
        bookingForm.appendChild(calculationCard);
    }

    function getSelectedOccasion() {
        const checked = bookingForm.querySelector('input[name="occasion"]:checked');
        return checked ? checked.value : 'dinner';
    }

    /**
     * Updates the Schedule Notice Banner and Deposit Card
     */
    function updateLiveSummary() {
        const guests = parseInt(guestsInput.value, 10) || 1;
        const zone = zoneSelect.value;
        const dateVal = dateInput.value;
        const occasion = getSelectedOccasion();

        // 1. Update Schedule Notice
        const sched = checkDateSchedule(dateVal);
        scheduleNoticeBox.className = 'alert ' + sched.alertClass + ' py-2 small mb-3';
        scheduleNoticeBox.textContent = '';

        const noticeHeading = document.createElement('strong');
        if (sched.holidayName) {
            noticeHeading.textContent = '🎉 ' + sched.holidayName + ': ';
        } else if (sched.isWeekend) {
            noticeHeading.textContent = '📅 Выходной день: ';
        } else {
            noticeHeading.textContent = 'ℹ️ Статус зала: ';
        }

        const noticeText = document.createTextNode(sched.occupancyStatus);
        scheduleNoticeBox.appendChild(noticeHeading);
        scheduleNoticeBox.appendChild(noticeText);

        // 2. Update Live Deposit Calculation
        const calc = calculateBookingDeposit(guests, zone, dateVal, occasion);

        calcBreakdown.textContent = '';

        const lineGuests = document.createElement('div');
        lineGuests.className = 'd-flex justify-content-between';
        lineGuests.textContent = 'Базовый депозит (' + calc.guestCount + ' гостей × ' + formatKzt(calc.basePerGuest) + '):';
        const spanGuestsVal = document.createElement('span');
        spanGuestsVal.className = 'fw-semibold text-dark';
        spanGuestsVal.textContent = formatKzt(calc.guestTotal);
        lineGuests.appendChild(spanGuestsVal);
        calcBreakdown.appendChild(lineGuests);

        if (calc.zoneSurcharge > 0) {
            const lineZone = document.createElement('div');
            lineZone.className = 'd-flex justify-content-between';
            lineZone.textContent = 'Доплата за выбранный зал (' + calc.zoneName + '):';
            const spanZoneVal = document.createElement('span');
            spanZoneVal.className = 'fw-semibold text-dark';
            spanZoneVal.textContent = '+' + formatKzt(calc.zoneSurcharge);
            lineZone.appendChild(spanZoneVal);
            calcBreakdown.appendChild(lineZone);
        }

        if (calc.weekendSurcharge > 0) {
            const lineWeekend = document.createElement('div');
            lineWeekend.className = 'd-flex justify-content-between text-warning-emphasis';
            lineWeekend.textContent = 'Тариф выходного дня (+10%):';
            const spanWVal = document.createElement('span');
            spanWVal.className = 'fw-semibold';
            spanWVal.textContent = '+' + formatKzt(calc.weekendSurcharge);
            lineWeekend.appendChild(spanWVal);
            calcBreakdown.appendChild(lineWeekend);
        }

        // Display Group Discount
        if (calc.groupDiscountAmount > 0) {
            const lineGroup = document.createElement('div');
            lineGroup.className = 'd-flex justify-content-between text-success fw-semibold';
            lineGroup.textContent = 'Скидка на размер компании (-' + calc.groupDiscountPercent + '%):';
            const spanGVal = document.createElement('span');
            spanGVal.textContent = '-' + formatKzt(calc.groupDiscountAmount);
            lineGroup.appendChild(spanGVal);
            calcBreakdown.appendChild(lineGroup);
        }

        // Display Birthday Discount and Gift
        if (calc.birthdayDiscountAmount > 0) {
            const lineBday = document.createElement('div');
            lineBday.className = 'd-flex justify-content-between text-danger fw-semibold';
            lineBday.textContent = 'Скидка имениннику (-10%):';
            const spanBVal = document.createElement('span');
            spanBVal.textContent = '-' + formatKzt(calc.birthdayDiscountAmount);
            lineBday.appendChild(spanBVal);
            calcBreakdown.appendChild(lineBday);
        }

        if (calc.birthdayGift) {
            const giftBox = document.createElement('div');
            giftBox.className = 'badge bg-warning text-dark text-wrap text-start p-2 mt-1';
            giftBox.textContent = '🎁 Подарок имениннику: ' + calc.birthdayGift;
            calcBreakdown.appendChild(giftBox);
        }

        calcTotalDiv.textContent = '';
        const totalLabel = document.createElement('span');
        totalLabel.textContent = 'Итого сумма депозита:';

        const totalValue = document.createElement('span');
        totalValue.className = 'text-danger fs-5';
        totalValue.textContent = formatKzt(calc.finalDeposit);

        calcTotalDiv.appendChild(totalLabel);
        calcTotalDiv.appendChild(totalValue);
    }

    // Attach listeners
    guestsInput.addEventListener('input', function () {
        clearFieldError(guestsInput);
        updateLiveSummary();
    });

    zoneSelect.addEventListener('change', function () {
        clearFieldError(guestsInput);
        updateLiveSummary();
    });

    dateInput.addEventListener('change', function () {
        clearFieldError(dateInput);
        updateLiveSummary();
    });

    timeInput.addEventListener('change', function () {
        clearFieldError(timeInput);
    });

    fullNameInput.addEventListener('input', function () {
        clearFieldError(fullNameInput);
    });

    phoneInput.addEventListener('input', function () {
        clearFieldError(phoneInput);
    });

    occasionRadios.forEach(function (radio) {
        radio.addEventListener('change', updateLiveSummary);
    });

    bookingForm.addEventListener('reset', function () {
        setTimeout(function () {
            dateInput.value = today;
            timeInput.value = '19:00';
            guestsInput.value = '2';
            [fullNameInput, phoneInput, dateInput, timeInput, guestsInput].forEach(clearFieldError);
            updateLiveSummary();
        }, 10);
    });

    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const fieldsToValidate = [
            { name: 'fullName', element: fullNameInput },
            { name: 'phoneNumber', element: phoneInput },
            { name: 'resDate', element: dateInput },
            { name: 'resTime', element: timeInput },
            { name: 'guestCount', element: guestsInput }
        ];

        let firstInvalid = null;
        let hasErrors = false;

        fieldsToValidate.forEach(function (field) {
            const error = validateBookingField(field.name, bookingForm);
            if (error) {
                showFieldError(field.element, error);
                hasErrors = true;
                if (!firstInvalid) {
                    firstInvalid = field.element;
                }
            } else {
                clearFieldError(field.element);
                field.element.classList.add('is-valid');
            }
        });

        if (hasErrors) {
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        const bookingRef = generateBookingReference();
        const guests = parseInt(guestsInput.value, 10);
        const zone = zoneSelect.value;
        const dateVal = dateInput.value;
        const timeVal = timeInput.value;
        const occasionVal = getSelectedOccasion();
        const occasionRadio = bookingForm.querySelector('input[name="occasion"]:checked');
        const occasionLabel = occasionRadio ? occasionRadio.nextElementSibling.textContent.trim() : 'Обычный ужин';
        const requestsVal = bookingForm.querySelector('#requests').value.trim();
        const wantsWa = bookingForm.querySelector('#wantsNotification').checked;

        const calc = calculateBookingDeposit(guests, zone, dateVal, occasionVal);

        if (confirmationContainer) {
            confirmationContainer.textContent = '';
            confirmationContainer.className = 'mt-4 d-block';

            const card = document.createElement('div');
            card.className = 'card border-success border-2 shadow p-4 bg-white';

            const cardHeader = document.createElement('div');
            cardHeader.className = 'd-flex flex-wrap justify-content-between align-items-center pb-3 mb-3 border-bottom';

            const headerTitle = document.createElement('h3');
            headerTitle.className = 'h4 text-success fw-bold mb-0';
            headerTitle.textContent = 'Бронирование сформировано';

            const refBadge = document.createElement('span');
            refBadge.className = 'badge bg-success fs-6';
            refBadge.textContent = 'Код заявки: #' + bookingRef;

            cardHeader.appendChild(headerTitle);
            cardHeader.appendChild(refBadge);

            const detailsList = document.createElement('dl');
            detailsList.className = 'row g-2 mb-3';

            function addDetailRow(label, value) {
                const dt = document.createElement('dt');
                dt.className = 'col-sm-4 text-muted fw-normal';
                dt.textContent = label;

                const dd = document.createElement('dd');
                dd.className = 'col-sm-8 fw-semibold text-dark mb-1';
                dd.textContent = value;

                detailsList.appendChild(dt);
                detailsList.appendChild(dd);
            }

            addDetailRow('Гость:', fullNameInput.value.trim());
            addDetailRow('Телефон:', phoneInput.value.trim());
            addDetailRow('Дата и время:', dateVal + ' в ' + timeVal);
            addDetailRow('Зал и количество гостей:', calc.zoneName + ' (' + guests + ' чел.)');
            addDetailRow('Повод:', occasionLabel);

            if (calc.groupDiscountAmount > 0) {
                addDetailRow('Скидка для компании:', '-' + formatKzt(calc.groupDiscountAmount) + ' (' + calc.groupDiscountPercent + '%)');
            }

            if (calc.birthdayDiscountAmount > 0) {
                addDetailRow('Скидка имениннику:', '-' + formatKzt(calc.birthdayDiscountAmount) + ' (-10%)');
            }

            if (calc.birthdayGift) {
                addDetailRow('Подарок от заведения:', calc.birthdayGift);
            }

            addDetailRow('Расчетный депозит:', formatKzt(calc.finalDeposit));
            addDetailRow('Уведомление в WhatsApp:', wantsWa ? 'Да, запрошено' : 'Нет');

            if (requestsVal) {
                addDetailRow('Пожелания:', requestsVal);
            }

            const demoAlert = document.createElement('div');
            demoAlert.className = 'alert alert-warning py-3 mt-3 mb-0';

            const alertTitle = document.createElement('strong');
            alertTitle.className = 'd-block mb-1';
            alertTitle.textContent = '⚠️ Демонстрационный режим учебного проекта:';

            const alertMsg = document.createElement('p');
            alertMsg.className = 'small mb-0';
            alertMsg.textContent = 'Форма успешно прошла валидацию на стороне клиента. Реальная отправка данных на сервер не производилась, бронь и оплата не регистрируются в реальной системе Frau Muller.';

            demoAlert.appendChild(alertTitle);
            demoAlert.appendChild(alertMsg);

            const actionDiv = document.createElement('div');
            actionDiv.className = 'mt-3 d-flex gap-2';

            const printBtn = document.createElement('button');
            printBtn.type = 'button';
            printBtn.className = 'btn btn-outline-dark btn-sm';
            printBtn.textContent = 'Распечатать квитанцию';
            printBtn.addEventListener('click', function () {
                window.print();
            });

            actionDiv.appendChild(printBtn);

            card.appendChild(cardHeader);
            card.appendChild(detailsList);
            card.appendChild(demoAlert);
            card.appendChild(actionDiv);

            confirmationContainer.appendChild(card);
            confirmationContainer.scrollIntoView({ behavior: 'smooth' });

            bookingForm.reset();
            updateLiveSummary();
        }
    });

    updateLiveSummary();
}

document.addEventListener('DOMContentLoaded', function () {
    initReservationInteractivity();
});
