/**
 * Frau Muller Resto-Pub — Food Delivery Script (order.html)
 * Student: Nurmuhammadjon Abdurahmonov (SE-2531)
 * Assignment 6: jQuery Migration (Selectors, Traversal, Effects, Form Validation, Delegation)
 * 
 * jQuery Version: 3.7.1
 * Why $(document).ready() is needed:
 * Ensures the DOM elements (#order-form, address inputs, radio toggles) are ready before
 * attaching event handlers, checking localStorage cart items, and initializing live calculators.
 */

'use strict';

/**
 * Standard menu price catalog for direct selections
 */
const DISH_PRICES = {
    'steak': { name: 'Стейк Рибай', price: 8500 },
    'sausages': { name: 'Баварские колбаски с тушеной капустой', price: 3200 },
    'pizza': { name: 'Пицца Пепперони', price: 3500 },
    'salad': { name: 'Салат «Баварский»', price: 2400 },
    'waffles': { name: 'Бельгийские вафли с мороженым', price: 1800 }
};

/**
 * Currency formatter helper
 * @param {number} amount - Numeric price
 * @returns {string} Formatted string
 */
function formatKzt(amount) {
    return amount.toLocaleString('ru-RU') + ' ₸';
}

/**
 * Generates temporary tracking code like "ORD-7294"
 * @returns {string} Tracking code
 */
function generateOrderReference() {
    return 'ORD-' + Math.floor(1000 + Math.random() * 9000);
}

/**
 * Loads cart from localStorage if populated from menu.html
 * @returns {Object} Stored cart dictionary
 */
function getSavedCart() {
    try {
        const raw = localStorage.getItem('fraumuller_cart');
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (e) {
        // Fallback
    }
    return {};
}

/**
 * Helper to display field error using jQuery
 * Places the error directly next to the invalid input
 * @param {jQuery} $input - jQuery input element
 * @param {string} message - Validation message
 */
function showOrderFieldError($input, message) {
    clearOrderFieldError($input);
    $input.addClass('is-invalid');

    const $feedback = $('<div>', {
        class: 'invalid-feedback d-block js-order-error small mt-1',
        text: message
    }).hide();

    $input.parent().append($feedback);
    $feedback.fadeIn(200);
}

/**
 * Helper to clear field error using jQuery
 * @param {jQuery} $input - jQuery input element
 */
function clearOrderFieldError($input) {
    $input.removeClass('is-invalid');
    $input.siblings('.js-order-error').fadeOut(150, function () {
        $(this).remove();
    });
}

/**
 * Main delivery interactivity initialization using jQuery
 */
function initOrderInteractivity() {
    const $orderForm = $('#order-form');
    const $confirmationContainer = $('#order-confirmation');

    if (!$orderForm.length) {
        return;
    }

    const $dishSelect = $orderForm.find('#dishSelect');
    const $portionsInput = $orderForm.find('#portionsCount');
    const $sauceCheckbox = $orderForm.find('#extraSauce');
    const $clientName = $orderForm.find('#clientName');
    const $clientPhone = $orderForm.find('#clientPhone');
    const $clientEmail = $orderForm.find('#clientEmail');
    const $addressInput = $orderForm.find('#deliveryAddress');
    const $addressLabel = $('#address-label');
    const $timeSelect = $('#deliveryTimeSlot');
    const $comments = $orderForm.find('#orderComments');

    // 1. Render Transferred Cart from menu.html if available
    let cart = getSavedCart();

    const $cartContainer = $('<div>', {
        id: 'order-cart-items-container',
        class: 'mb-3'
    });

    const $firstFieldset = $orderForm.find('fieldset:first');
    if ($firstFieldset.length) {
        $firstFieldset.children().eq(1).before($cartContainer);
    }

    function renderCartSummary() {
        $cartContainer.empty();
        const keys = Object.keys(cart);

        if (keys.length === 0) {
            return;
        }

        const $card = $('<div>', { class: 'card border-danger border-2 p-3 bg-light mb-3' });
        const $title = $('<h4>', {
            class: 'h6 fw-bold text-danger mb-2 d-flex justify-content-between align-items-center',
            text: '🛒 Выбранные блюда из меню:'
        });

        const $clearBtn = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-secondary btn-sm py-0',
            text: 'Очистить корзину'
        }).on('click', function () {
            cart = {};
            localStorage.removeItem('fraumuller_cart');
            renderCartSummary();
            updateOrderCalculations();
        });
        $title.append($clearBtn);
        $card.append($title);

        const $list = $('<div>', { class: 'd-flex flex-column gap-2' });

        $.each(keys, function (idx, dishName) {
            const item = cart[dishName];
            const $row = $('<div>', {
                class: 'd-flex justify-content-between align-items-center bg-white p-2 border rounded',
                'data-dish-name': dishName
            });

            const $nameDiv = $('<div>', {
                class: 'fw-semibold text-dark small',
                text: item.name + ' × ' + item.qty
            });

            const $priceDiv = $('<div>', { class: 'd-flex align-items-center gap-2' });
            const $sumSpan = $('<span>', {
                class: 'text-danger fw-bold small',
                text: formatKzt(item.price * item.qty)
            });

            const $removeBtn = $('<button>', {
                type: 'button',
                class: 'btn btn-sm btn-outline-danger py-0 px-2 btn-remove-cart-item',
                text: '×',
                title: 'Удалить позицию'
            });

            $priceDiv.append($sumSpan).append($removeBtn);
            $row.append($nameDiv).append($priceDiv);
            $list.append($row);
        });

        $card.append($list);
        $cartContainer.append($card);
    }

    /**
     * DELEGATED EVENT HANDLER FOR DYNAMIC CART ITEMS:
     * Bound to $cartContainer to catch clicks from newly added or updated items.
     * 
     * Why binding directly would not work:
     * When items are added or removed, renderCartSummary() clears and recreates the rows.
     * A direct handler would be lost on the next render.
     */
    $cartContainer.on('click', '.btn-remove-cart-item', function (event) {
        event.preventDefault();
        const dishName = $(this).closest('[data-dish-name]').attr('data-dish-name');
        if (dishName && cart[dishName]) {
            delete cart[dishName];
            localStorage.setItem('fraumuller_cart', JSON.stringify(cart));
            renderCartSummary();
            updateOrderCalculations();
        }
    });

    renderCartSummary();

    // 2. Order Type Toggle Handler (Delivery vs Takeaway vs Dine-in)
    function getOrderType() {
        const $checked = $orderForm.find('input[name="orderType"]:checked');
        return $checked.length ? $checked.val() : 'delivery';
    }

    function updateOrderTypeUI() {
        const type = getOrderType();

        if (type === 'delivery') {
            if ($addressLabel.length) {
                $addressLabel.text('Адрес доставки (улица, дом, квартира):');
            }
            $addressInput.prop('disabled', false)
                         .attr('placeholder', 'ул. Жургенова, дом 18/1, кв. 42')
                         .prop('required', true);

            const saved = $addressInput.attr('data-saved-address') || '';
            $addressInput.val(saved);
        } else if (type === 'takeaway') {
            if ($addressLabel.length) {
                $addressLabel.text('Пункт самовывоза (скидка 5%):');
            }
            if ($addressInput.val() && $addressInput.val().indexOf('Жургенова') === -1) {
                $addressInput.attr('data-saved-address', $addressInput.val());
            }
            $addressInput.val('Ресто-паб Frau Muller: ул. Темирбека Жургенова, 18/1 (Аллея Мынжылдык)')
                         .prop('disabled', true)
                         .prop('required', false);
            clearOrderFieldError($addressInput);
        } else if (type === 'dinein') {
            if ($addressLabel.length) {
                $addressLabel.text('Предзаказ в зале ресторана:');
            }
            if ($addressInput.val() && $addressInput.val().indexOf('Жургенова') === -1) {
                $addressInput.attr('data-saved-address', $addressInput.val());
            }
            $addressInput.val('Зал Frau Muller: столик будет накрыт к указанному времени')
                         .prop('disabled', true)
                         .prop('required', false);
            clearOrderFieldError($addressInput);
        }
        updateOrderCalculations();
    }

    // Attach listener via attribute selector
    $orderForm.find('input[name="orderType"]').on('change', updateOrderTypeUI);

    // 3. Live Order Calculation Summary Box
    const $calcBox = $('<div>', {
        id: 'live-order-summary',
        class: 'card border-danger border-2 p-3 mb-4 bg-light shadow-sm'
    });

    const $calcTitle = $('<h3>', {
        class: 'h6 fw-bold text-danger mb-2 d-flex justify-content-between align-items-center',
        text: 'Расчет стоимости заказа:'
    }).append($('<span>', { class: 'badge bg-danger', text: 'Онлайн-чек' }));

    const $calcLinesContainer = $('<div>', { class: 'small text-muted d-flex flex-column gap-1' });
    const $calcTotalLine = $('<div>', {
        class: 'd-flex justify-content-between align-items-center pt-2 mt-2 border-top fw-bold text-dark fs-5'
    });

    $calcBox.append($calcTitle).append($calcLinesContainer).append($calcTotalLine);

    const $submitBtnWrapper = $orderForm.find('.d-flex.flex-wrap:last');
    if ($submitBtnWrapper.length) {
        $submitBtnWrapper.before($calcBox);
    } else {
        $orderForm.append($calcBox);
    }

    function getCourierTip() {
        const $checked = $orderForm.find('input[name="courierTip"]:checked');
        return $checked.length ? parseInt($checked.val(), 10) : 0;
    }

    /**
     * Calculates total breakdown
     */
    function calculateOrderTotals() {
        let dishesSubtotal = 0;

        // Sum from cart
        $.each(cart, function (name, item) {
            dishesSubtotal += item.price * item.qty;
        });

        // Sum from direct select if chosen
        const selectedDishKey = $dishSelect.val();
        const portions = parseInt($portionsInput.val(), 10) || 1;

        if (selectedDishKey && DISH_PRICES[selectedDishKey]) {
            dishesSubtotal += DISH_PRICES[selectedDishKey].price * portions;
        }

        // Sauce extra
        let saucePrice = 0;
        if ($sauceCheckbox.prop('checked')) {
            saucePrice = 300;
        }

        const rawFoodTotal = dishesSubtotal + saucePrice;
        const orderType = getOrderType();

        // 5% Takeaway discount
        let takeawayDiscount = 0;
        if (orderType === 'takeaway') {
            takeawayDiscount = Math.round(rawFoodTotal * 0.05);
        }

        // Delivery fee: 0 if takeaway/dine-in or food >= 7000, otherwise 1000 KZT
        let deliveryFee = 0;
        if (orderType === 'delivery') {
            deliveryFee = rawFoodTotal >= 7000 || rawFoodTotal === 0 ? 0 : 1000;
        }

        const tip = getCourierTip();
        const grandTotal = Math.max(0, rawFoodTotal - takeawayDiscount + deliveryFee + tip);

        return {
            dishesSubtotal,
            saucePrice,
            rawFoodTotal,
            orderType,
            takeawayDiscount,
            deliveryFee,
            tip,
            grandTotal
        };
    }

    function updateOrderCalculations() {
        const res = calculateOrderTotals();
        $calcLinesContainer.empty();

        // Dishes cost line
        $('<div>', {
            class: 'd-flex justify-content-between',
            text: 'Стоимость блюд:'
        }).append($('<span>', { class: 'fw-semibold text-dark', text: formatKzt(res.rawFoodTotal) }))
          .appendTo($calcLinesContainer);

        // Takeaway discount
        if (res.takeawayDiscount > 0) {
            $('<div>', {
                class: 'd-flex justify-content-between text-success fw-semibold',
                text: 'Скидка на самовывоз (5%):'
            }).append($('<span>', { text: '-' + formatKzt(res.takeawayDiscount) }))
              .appendTo($calcLinesContainer);
        }

        // Delivery fee line
        const $lineDel = $('<div>', { class: 'd-flex justify-content-between', text: 'Доставка курьером:' });
        if (res.orderType !== 'delivery') {
            $lineDel.append($('<span>', { class: 'text-success fw-semibold', text: '0 ₸ (не требуется)' }));
        } else if (res.deliveryFee === 0 && res.rawFoodTotal >= 7000) {
            $lineDel.append($('<span>', { class: 'text-success fw-semibold', text: '0 ₸ (Бесплатно от 7 000 ₸)' }));
        } else {
            $lineDel.append($('<span>', { class: 'text-dark fw-semibold', text: formatKzt(res.deliveryFee) }));
        }
        $calcLinesContainer.append($lineDel);

        // Courier tip
        if (res.tip > 0) {
            $('<div>', {
                class: 'd-flex justify-content-between text-muted',
                text: 'Чаевые курьеру:'
            }).append($('<span>', { class: 'fw-semibold', text: '+' + formatKzt(res.tip) }))
              .appendTo($calcLinesContainer);
        }

        // Total
        $calcTotalLine.empty()
            .append($('<span>', { text: 'Итого к оплате:' }))
            .append($('<span>', { class: 'text-danger fs-4', text: formatKzt(res.grandTotal) }));
    }

    // Attach listeners for live calculator using jQuery .on()
    $dishSelect.on('change', function () {
        clearOrderFieldError($(this));
        updateOrderCalculations();
    });

    $portionsInput.on('input', updateOrderCalculations);
    $sauceCheckbox.on('change', updateOrderCalculations);

    // Radio change listener via attribute selector
    $orderForm.find('input[name="courierTip"]').on('change', updateOrderCalculations);

    // Input listeners to clear field errors in real time
    $clientName.on('input', function () { clearOrderFieldError($(this)); });
    $clientPhone.on('input', function () { clearOrderFieldError($(this)); });
    $clientEmail.on('input', function () { clearOrderFieldError($(this)); });
    $addressInput.on('input', function () { clearOrderFieldError($(this)); });

    updateOrderTypeUI();

    /**
     * FORM VALIDATION WITH JQUERY (Mandatory Requirement):
     * Rebuild validation of order form in jQuery.
     * Prevents default, trims values, checks phone and email with regex,
     * shows specific errors next to each invalid field, clears errors on user input,
     * shows success message with jQuery effect only on complete pass, and resets form.
     */
    $orderForm.on('submit', function (event) {
        /*
         * event.preventDefault() comment:
         * Prevents the browser from navigating away or refreshing the page.
         * Without preventDefault(): All cart and form data would instantly reset,
         * interrupting the user experience and preventing the confirmation receipt from appearing.
         */
        event.preventDefault();

        const totals = calculateOrderTotals();
        let hasErrors = false;
        let $firstInvalid = null;

        // 1. Validate dish selection if cart is empty
        if (totals.rawFoodTotal === 0) {
            showOrderFieldError($dishSelect, 'Пожалуйста, выберите хотя бы одно блюдо для заказа.');
            hasErrors = true;
            $firstInvalid = $dishSelect;
        } else {
            clearOrderFieldError($dishSelect);
        }

        // 2. Validate Client Name
        const nameVal = $.trim($clientName.val());
        if (nameVal.length < 2) {
            showOrderFieldError($clientName, 'Имя должно содержать не менее 2 символов.');
            hasErrors = true;
            if (!$firstInvalid) { $firstInvalid = $clientName; }
        } else {
            clearOrderFieldError($clientName);
            $clientName.addClass('is-valid');
        }

        // 3. Validate Phone Number (min 10 digits)
        const phoneVal = $.trim($clientPhone.val());
        const cleanedPhone = phoneVal.replace(/\D/g, '');
        if (cleanedPhone.length < 10) {
            showOrderFieldError($clientPhone, 'Введите корректный номер телефона (не менее 10 цифр).');
            hasErrors = true;
            if (!$firstInvalid) { $firstInvalid = $clientPhone; }
        } else {
            clearOrderFieldError($clientPhone);
            $clientPhone.addClass('is-valid');
        }

        // 4. Validate Email (if provided or required)
        const emailVal = $.trim($clientEmail.val());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal.length > 0 && !emailRegex.test(emailVal)) {
            showOrderFieldError($clientEmail, 'Введите корректный адрес e-mail (например: user@mail.kz).');
            hasErrors = true;
            if (!$firstInvalid) { $firstInvalid = $clientEmail; }
        } else {
            clearOrderFieldError($clientEmail);
            if (emailVal.length > 0) {
                $clientEmail.addClass('is-valid');
            }
        }

        // 5. Validate Address if Delivery is selected
        const orderType = getOrderType();
        const addressVal = $.trim($addressInput.val());
        if (orderType === 'delivery') {
            if (addressVal.length < 5) {
                showOrderFieldError($addressInput, 'Укажите точный адрес доставки (улица, дом, квартира).');
                hasErrors = true;
                if (!$firstInvalid) { $firstInvalid = $addressInput; }
            } else {
                clearOrderFieldError($addressInput);
                $addressInput.addClass('is-valid');
            }
        }

        if (hasErrors) {
            if ($firstInvalid) {
                $firstInvalid.focus();
            }
            return;
        }

        /*
         * COMMENT ON CLIENT VS SERVER VALIDATION:
         * Keeping browser attributes (required, type="email") and client-side checks provides
         * instantaneous user feedback. However, browser checks NEVER replace server-side verification:
         * 1. Anyone can send arbitrary HTTP POST payloads via curl, Postman, or disabled JS.
         * 2. Server must re-verify inventory stock, dish availability, and genuine payment signatures.
         * 3. Price calculations must be sealed by the backend to prevent client-side price tampering.
         */
        const orderRef = generateOrderReference();
        const timeVal = $timeSelect.length ? $timeSelect.find('option:selected').text() : 'Как можно скорее';
        const $paymentRadio = $orderForm.find('input[name="paymentMethod"]:checked');
        const paymentVal = $paymentRadio.length ? $paymentRadio.next('label').text() : 'Kaspi QR';
        const commentsVal = $.trim($comments.val());

        // Render confirmation receipt using jQuery
        if ($confirmationContainer.length) {
            $confirmationContainer.empty().removeClass('d-none').addClass('mt-4 d-block');

            const $card = $('<div>', {
                class: 'card border-success border-2 shadow p-4 bg-white'
            }).hide();

            // Header
            const $header = $('<div>', {
                class: 'd-flex flex-wrap justify-content-between align-items-center pb-3 mb-3 border-bottom'
            });
            const $title = $('<h3>', {
                class: 'h4 text-success fw-bold mb-0',
                text: 'Заказ успешно оформлен!'
            });
            const $refBadge = $('<span>', {
                class: 'badge bg-success fs-6',
                text: 'Номер заказа: #' + orderRef
            });
            $header.append($title).append($refBadge);
            $card.append($header);

            // Realistic Tracker Progress Bar
            const $trackerDiv = $('<div>', { class: 'p-3 bg-light rounded mb-3 border text-center' });
            const $trackerTitle = $('<div>', {
                class: 'fw-bold text-dark mb-2',
                text: 'Статус заказа: 👨‍🍳 Готовится на кухне Frau Muller'
            });
            const $progress = $('<div>', { class: 'progress mb-2', css: { height: '10px' } });
            const $progressBar = $('<div>', {
                class: 'progress-bar bg-danger progress-bar-striped progress-bar-animated',
                css: { width: '35%' }
            });
            $progress.append($progressBar);

            const $trackerSub = $('<div>', {
                class: 'small text-muted',
                text: 'Ориентировочное время: ' + timeVal
            });
            $trackerDiv.append($trackerTitle).append($progress).append($trackerSub);
            $card.append($trackerDiv);

            // Details list
            const $dl = $('<dl>', { class: 'row g-2 mb-3' });
            function addRow(lbl, val) {
                $('<dt>', { class: 'col-sm-4 text-muted fw-normal', text: lbl }).appendTo($dl);
                $('<dd>', { class: 'col-sm-8 fw-semibold text-dark mb-1', text: val }).appendTo($dl);
            }

            addRow('Получатель:', nameVal + ' (' + phoneVal + ')');
            if (emailVal) { addRow('Email для чека:', emailVal); }
            addRow('Способ получения:', totals.orderType === 'delivery' ? 'Доставка курьером' : (totals.orderType === 'takeaway' ? 'С собой (самовывоз)' : 'В ресторане'));
            addRow('Адрес:', addressVal);
            addRow('Время:', timeVal);
            addRow('Способ оплаты:', paymentVal);
            addRow('Сумма к оплате:', formatKzt(totals.grandTotal));

            if (commentsVal) {
                addRow('Пожелания:', commentsVal);
            }
            $card.append($dl);

            // Academic Notice
            const $alertDiv = $('<div>', { class: 'alert alert-warning py-3 mt-3 mb-0' });
            $alertDiv.append($('<strong>', { class: 'd-block mb-1', text: '⚠️ Учебная демонстрация:' }))
                     .append($('<p>', {
                         class: 'small mb-0',
                         text: 'Заказ успешно сформирован на стороне клиента. Реальная передача на сервер ресторана не производилась.'
                     }));
            $card.append($alertDiv);

            $confirmationContainer.append($card);

            // jQuery Effect: slideDown with duration (400ms) and scroll callback
            $card.slideDown(400, function () {
                $('html, body').animate({
                    scrollTop: $confirmationContainer.offset().top - 80
                }, 400);
            });

            // Clear cart & reset form
            localStorage.removeItem('fraumuller_cart');
            cart = {};
            renderCartSummary();
            $orderForm.trigger('reset');
            $orderForm.find('.is-valid').removeClass('is-valid');
            updateOrderTypeUI();
        }
    });
}

// Global initialization inside $(document).ready()
$(document).ready(function () {
    initOrderInteractivity();
});
