/**
 * Frau Muller Resto-Pub — Table Reservation Script (reservation.html)
 * Student: Tileuke Mukhamedzhan (SE-2531)
 * Assignment 6: jQuery Migration (Selectors, Traversal, Effects, Form Validation, Delegation)
 * 
 * jQuery Version: 3.7.1
 * Why $(document).ready() is needed:
 * Ensures the DOM tree is fully constructed before selecting form fields (#booking-form),
 * inserting the dynamic calculation cards, and attaching event listeners.
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
        return { isWeekend: false, holidayName: null, occupancyStatus: 'Обычная загрузка', alertClass: 'alert-info' };
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
 * REWRITTEN FEATURE 2 (Assignment 6 comparison):
 * Interactive Table Booking Form Validation & Deposit Calculator
 * 
 * Comparison Comment:
 * Replaced: querySelector, classList.add/remove, parentElement.querySelector/appendChild, and manual string trimming
 * With jQuery: $('#...'), .parent(), .siblings(), .addClass('is-invalid'), .val(), $.trim(), .fadeIn(), and .slideDown()
 * Verdict: Significantly shorter and cleaner. Reaching parent containers and inserting/removing inline feedback
 * elements via jQuery traversal (.parent(), .siblings()) is far more compact than native DOM parent navigation.
 */

/**
 * Clears field-level error messages and invalid CSS classes using jQuery
 * Uses .siblings() traversal and .fadeOut() effect
 * @param {jQuery} $input - jQuery wrapped input element
 */
function clearFieldError($input) {
    $input.removeClass('is-invalid');
    $input.siblings('.js-field-error').fadeOut(150, function () {
        $(this).remove();
    });
}

/**
 * Displays field-level error and applies is-invalid class using jQuery
 * Error message is placed directly next to the invalid field (not one global message!)
 * @param {jQuery} $input - jQuery wrapped input element
 * @param {string} errorMessage - Error description
 */
function showFieldError($input, errorMessage) {
    clearFieldError($input);
    $input.addClass('is-invalid');

    const $feedback = $('<div>', {
        class: 'invalid-feedback d-block js-field-error small mt-1',
        text: errorMessage
    }).hide();

    $input.parent().append($feedback);
    $feedback.fadeIn(200);
}

/**
 * Validates a single field according to specific rules using jQuery
 * @param {string} fieldName - Field identifier
 * @param {jQuery} $form - Form reference
 * @returns {string|null} Error string if invalid, or null if valid
 */
function validateBookingField(fieldName, $form) {
    const $fullName = $form.find('#fullName');
    const $phone = $form.find('#phoneNumber');
    const $date = $form.find('#resDate');
    const $time = $form.find('#resTime');
    const $guests = $form.find('#guestCount');
    const $zone = $form.find('#zone');

    const todayStr = new Date().toISOString().split('T')[0];

    if (fieldName === 'fullName') {
        const val = $.trim($fullName.val());
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
        const val = $.trim($phone.val());
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
        const val = $date.val();
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
        const val = $time.val();
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
        const val = parseInt($guests.val(), 10);
        if (isNaN(val) || val < 1) {
            return 'Минимальное количество гостей — 1.';
        }
        if (val > 15) {
            return 'Для компании более 15 человек свяжитесь с нами по телефону.';
        }

        if ($zone.val() === 'vip' && val < 4) {
            return 'Бронирование VIP кабины доступно для компаний от 4 гостей.';
        }
        return null;
    }

    return null;
}

/**
 * Initializes reservation page interactivity using jQuery
 */
function initReservationInteractivity() {
    const $bookingForm = $('#booking-form');
    const $confirmationContainer = $('#booking-confirmation');

    if (!$bookingForm.length) {
        return;
    }

    const $fullName = $bookingForm.find('#fullName');
    const $phone = $bookingForm.find('#phoneNumber');
    const $date = $bookingForm.find('#resDate');
    const $time = $bookingForm.find('#resTime');
    const $guests = $bookingForm.find('#guestCount');
    const $zone = $bookingForm.find('#zone');
    const $requests = $bookingForm.find('#requests');
    const $wantsNotification = $bookingForm.find('#wantsNotification');

    // Set minimum date to today using jQuery .attr()
    const today = new Date().toISOString().split('T')[0];
    $date.attr('min', today);
    if (!$date.val()) {
        $date.val(today);
    }

    if (!$time.val()) {
        $time.val('19:00');
    }

    // Schedule Notice Banner
    const $scheduleNoticeBox = $('<div>', {
        id: 'schedule-status-banner',
        class: 'alert alert-info py-2 small mb-3'
    });
    $date.closest('.row').before($scheduleNoticeBox);

    // Live Deposit Calculation Card
    const $calculationCard = $('<div>', {
        id: 'live-deposit-summary',
        class: 'card border-danger border-2 p-3 mb-4 bg-light'
    });

    const $calcTitle = $('<h3>', {
        class: 'h6 fw-bold text-danger mb-2 d-flex justify-content-between align-items-center',
        text: 'Предварительный расчет депозита:'
    }).append($('<span>', { class: 'badge bg-danger', text: 'Калькулятор брони' }));

    const $calcBreakdown = $('<div>', {
        id: 'deposit-breakdown-content',
        class: 'small text-muted d-flex flex-column gap-1'
    });

    const $calcTotalDiv = $('<div>', {
        id: 'deposit-total-display',
        class: 'd-flex justify-content-between align-items-center pt-2 mt-2 border-top fw-bold text-dark fs-6'
    });

    $calculationCard.append($calcTitle).append($calcBreakdown).append($calcTotalDiv);

    const $actionButtons = $bookingForm.find('.d-flex.flex-wrap:last');
    if ($actionButtons.length) {
        $actionButtons.before($calculationCard);
    } else {
        $bookingForm.append($calculationCard);
    }

    /**
     * Helper to get currently selected radio button value
     * Uses attribute selector and :checked filter
     */
    function getSelectedOccasion() {
        const $checked = $bookingForm.find('input[name="occasion"]:checked');
        return $checked.length ? $checked.val() : 'dinner';
    }

    /**
     * Updates the Schedule Notice Banner and Deposit Card
     */
    function updateLiveSummary() {
        const guests = parseInt($guests.val(), 10) || 1;
        const zone = $zone.val();
        const dateVal = $date.val();
        const occasion = getSelectedOccasion();

        // 1. Update Schedule Notice
        const sched = checkDateSchedule(dateVal);
        $scheduleNoticeBox.attr('class', 'alert ' + sched.alertClass + ' py-2 small mb-3').empty();

        let prefix = 'ℹ️ Статус зала: ';
        if (sched.holidayName) {
            prefix = '🎉 ' + sched.holidayName + ': ';
        } else if (sched.isWeekend) {
            prefix = '📅 Выходной день: ';
        }

        $scheduleNoticeBox.append($('<strong>', { text: prefix }))
                          .append(document.createTextNode(sched.occupancyStatus));

        // 2. Update Live Deposit Calculation
        const calc = calculateBookingDeposit(guests, zone, dateVal, occasion);
        $calcBreakdown.empty();

        // Base deposit row
        $('<div>', {
            class: 'd-flex justify-content-between',
            text: 'Базовый депозит (' + calc.guestCount + ' гостей × ' + formatKzt(calc.basePerGuest) + '):'
        }).append($('<span>', { class: 'fw-semibold text-dark', text: formatKzt(calc.guestTotal) }))
          .appendTo($calcBreakdown);

        // Zone surcharge
        if (calc.zoneSurcharge > 0) {
            $('<div>', {
                class: 'd-flex justify-content-between',
                text: 'Доплата за зал (' + calc.zoneName + '):'
            }).append($('<span>', { class: 'fw-semibold text-dark', text: '+' + formatKzt(calc.zoneSurcharge) }))
              .appendTo($calcBreakdown);
        }

        // Weekend surcharge
        if (calc.weekendSurcharge > 0) {
            $('<div>', {
                class: 'd-flex justify-content-between text-warning-emphasis',
                text: 'Тариф выходного дня (+10%):'
            }).append($('<span>', { class: 'fw-semibold', text: '+' + formatKzt(calc.weekendSurcharge) }))
              .appendTo($calcBreakdown);
        }

        // Group discount
        if (calc.groupDiscountAmount > 0) {
            $('<div>', {
                class: 'd-flex justify-content-between text-success fw-semibold',
                text: 'Скидка на размер компании (-' + calc.groupDiscountPercent + '%):'
            }).append($('<span>', { text: '-' + formatKzt(calc.groupDiscountAmount) }))
              .appendTo($calcBreakdown);
        }

        // Birthday discount
        if (calc.birthdayDiscountAmount > 0) {
            $('<div>', {
                class: 'd-flex justify-content-between text-danger fw-semibold',
                text: 'Скидка имениннику (-10%):'
            }).append($('<span>', { text: '-' + formatKzt(calc.birthdayDiscountAmount) }))
              .appendTo($calcBreakdown);
        }

        if (calc.birthdayGift) {
            $('<div>', {
                class: 'badge bg-warning text-dark text-wrap text-start p-2 mt-1',
                text: '🎁 Подарок имениннику: ' + calc.birthdayGift
            }).appendTo($calcBreakdown);
        }

        // Final total row using jQuery .text()
        $calcTotalDiv.empty()
            .append($('<span>', { text: 'Итого сумма депозита:' }))
            .append($('<span>', { class: 'text-danger fs-5', text: formatKzt(calc.finalDeposit) }));
    }

    /**
     * Clear field errors immediately upon user input/change
     * Handlers using $(this)
     */
    $guests.on('input', function () {
        clearFieldError($(this));
        updateLiveSummary();
    });

    $zone.on('change', function () {
        clearFieldError($guests);
        updateLiveSummary();
    });

    $date.on('change', function () {
        clearFieldError($(this));
        updateLiveSummary();
    });

    $time.on('change', function () {
        clearFieldError($(this));
    });

    $fullName.on('input', function () {
        clearFieldError($(this));
    });

    $phone.on('input', function () {
        clearFieldError($(this));
    });

    // Event handler using attribute selector
    $bookingForm.find('input[name="occasion"]').on('change', updateLiveSummary);

    // Form reset handler
    $bookingForm.on('reset', function () {
        setTimeout(function () {
            $date.val(today);
            $time.val('19:00');
            $guests.val('2');
            $.each([$fullName, $phone, $date, $time, $guests], function (i, $el) {
                clearFieldError($el);
                $el.removeClass('is-valid');
            });
            updateLiveSummary();
        }, 10);
    });

    /**
     * FORM VALIDATION WITH JQUERY (Mandatory Requirement):
     * Rebuilt validation of main form in jQuery.
     * Prevents default, trims values, checks email/phone format,
     * highlights invalid fields with individual error messages,
     * shows success message only on full pass, and resets form.
     */
    $bookingForm.on('submit', function (event) {
        /*
         * event.preventDefault() comment:
         * Prevents the default browser action of submitting the form data to the server URL.
         * Without preventDefault(): The browser would instantly reload the page (triggering HTTP GET/POST),
         * destroying all user input, resetting calculator calculations, and hiding error feedback.
         */
        event.preventDefault();

        const fieldsToValidate = [
            { name: 'fullName', $el: $fullName },
            { name: 'phoneNumber', $el: $phone },
            { name: 'resDate', $el: $date },
            { name: 'resTime', $el: $time },
            { name: 'guestCount', $el: $guests }
        ];

        let $firstInvalid = null;
        let hasErrors = false;

        // Check each field individually
        $.each(fieldsToValidate, function (idx, field) {
            const error = validateBookingField(field.name, $bookingForm);
            if (error) {
                showFieldError(field.$el, error);
                hasErrors = true;
                if (!$firstInvalid) {
                    $firstInvalid = field.$el;
                }
            } else {
                clearFieldError(field.$el);
                field.$el.addClass('is-valid');
            }
        });

        // Focus the first invalid field
        if (hasErrors) {
            if ($firstInvalid) {
                $firstInvalid.focus();
            }
            return;
        }

        const bookingRef = generateBookingReference();
        const guests = parseInt($guests.val(), 10);
        const zone = $zone.val();
        const dateVal = $date.val();
        const timeVal = $time.val();
        const occasionVal = getSelectedOccasion();
        const $occasionRadio = $bookingForm.find('input[name="occasion"]:checked');
        const occasionLabel = $occasionRadio.length ? $occasionRadio.next('label').text() : 'Обычный ужин';
        const requestsVal = $.trim($requests.val());

        /*
         * EXPLAINING DIFFERENCE BETWEEN .attr() AND .prop() ON A CHECKBOX:
         * - .attr('checked') inspects the HTML attribute literal present in initial markup ('checked' or undefined).
         * - .prop('checked') returns the dynamic, current DOM boolean state of the checkbox (true or false).
         * For real-time checkbox status in JavaScript, .prop('checked') is always the correct choice!
         */
        const wantsWa = $wantsNotification.prop('checked');

        const calc = calculateBookingDeposit(guests, zone, dateVal, occasionVal);

        if ($confirmationContainer.length) {
            $confirmationContainer.empty().removeClass('d-none').addClass('mt-4 d-block');

            const $card = $('<div>', {
                class: 'card border-success border-2 shadow p-4 bg-white'
            }).hide(); // Hidden for smooth jQuery slideDown effect

            const $cardHeader = $('<div>', {
                class: 'd-flex flex-wrap justify-content-between align-items-center pb-3 mb-3 border-bottom'
            });
            const $headerTitle = $('<h3>', {
                class: 'h4 text-success fw-bold mb-0',
                text: 'Бронирование сформировано'
            });
            const $refBadge = $('<span>', {
                class: 'badge bg-success fs-6',
                text: 'Код заявки: #' + bookingRef
            });
            $cardHeader.append($headerTitle).append($refBadge);

            const $detailsList = $('<dl>', { class: 'row g-2 mb-3' });

            function addDetailRow(label, value) {
                $('<dt>', { class: 'col-sm-4 text-muted fw-normal', text: label }).appendTo($detailsList);
                $('<dd>', { class: 'col-sm-8 fw-semibold text-dark mb-1', text: value }).appendTo($detailsList);
            }

            addDetailRow('Гость:', $.trim($fullName.val()));
            addDetailRow('Телефон:', $.trim($phone.val()));
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

            /*
             * COMMENT ON BROWSER VS SERVER VALIDATION:
             * Client-side JavaScript validation serves purely as immediate UX guidance.
             * It NEVER replaces server validation because malicious users can bypass the browser
             * environment entirely using tools like Postman, curl, or custom HTTP requests,
             * directly submitting invalid data, malicious payloads, or bypassing capacity rules.
             */
            const $demoAlert = $('<div>', { class: 'alert alert-warning py-3 mt-3 mb-0' });
            $demoAlert.append($('<strong>', { class: 'd-block mb-1', text: '⚠️ Демонстрационный режим учебного проекта:' }))
                      .append($('<p>', {
                          class: 'small mb-0',
                          text: 'Форма успешно прошла валидацию на стороне клиента. Реальная отправка на сервер не производилась, бронь и оплата не регистрируются в боевой системе.'
                      }));

            const $actionDiv = $('<div>', { class: 'mt-3 d-flex gap-2' });
            const $printBtn = $('<button>', {
                type: 'button',
                class: 'btn btn-outline-dark btn-sm',
                text: 'Распечатать квитанцию'
            }).on('click', function () {
                window.print();
            });
            $actionDiv.append($printBtn);

            $card.append($cardHeader).append($detailsList).append($demoAlert).append($actionDiv);
            $confirmationContainer.append($card);

            // Effect with duration (400ms) and completion callback
            $card.slideDown(400, function () {
                // Callback scrolls confirmation smoothly into viewport
                $('html, body').animate({
                    scrollTop: $confirmationContainer.offset().top - 80
                }, 400);
            });

            // Reset form afterwards
            $bookingForm.trigger('reset');
            updateLiveSummary();
        }
    });

    updateLiveSummary();
}

// Global initialization inside $(document).ready()
$(document).ready(function () {
    initReservationInteractivity();
});
