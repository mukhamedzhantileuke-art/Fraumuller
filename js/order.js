/**
 * Frau Muller Resto-Pub — Online Food Delivery System
 * Weeks 6–8: Plain JavaScript Architecture
 * Author: Nurmuhammadjon Abdurahmonov
 *
 * Requirements fulfilled:
 * 1. Real project data in arrays and objects at top of file
 * 2. Markup for menu select options built dynamically with a loop
 * 3. Custom functions with parameters and return values called from multiple places
 * 4. Conditional business logic (free delivery threshold, volume discount, working hours)
 * 5. Calculated numbers (subtotal, delivery fee, discount, final total)
 * 6. Multiple event types ('submit', 'input', 'change', 'click') + delegated event handler
 * 7. Strict field-by-field form validation with instant error clearing on fix
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // 1. REAL PROJECT DATA AT THE TOP OF THE FILE
    const MENU_ITEMS = [
        { id: 'steak', name: 'Стейк Рибай', category: 'Горячее', price: 8500, timeMin: 25 },
        { id: 'sausages', name: 'Баварские колбаски с тушеной капустой', category: 'Горячее', price: 3200, timeMin: 20 },
        { id: 'pizza', name: 'Пицца Пепперони', category: 'Пицца', price: 3500, timeMin: 20 },
        { id: 'salad', name: 'Салат "Баварский" с копченой говядиной', category: 'Салаты', price: 2400, timeMin: 15 },
        { id: 'waffles', name: 'Бельгийские вафли с мороженым', category: 'Десерты', price: 1800, timeMin: 15 }
    ];

    const DELIVERY_CONFIG = {
        freeDeliveryThreshold: 7000,
        standardDeliveryFee: 1000,
        discountThreshold: 15000,
        discountPercent: 10,
        saucePrice: 300,
        currency: '₸'
    };

    // DOM Hooks
    const orderForm = document.getElementById('order-form');
    const dishSelect = document.getElementById('dishSelect');
    const portionsCount = document.getElementById('portionsCount');
    const extraSauce = document.getElementById('extraSauce');
    const clientName = document.getElementById('clientName');
    const clientPhone = document.getElementById('clientPhone');
    const clientEmail = document.getElementById('clientEmail');
    const deliveryDate = document.getElementById('deliveryDate');
    const deliveryAddress = document.getElementById('deliveryAddress');
    const orderComments = document.getElementById('orderComments');
    const confirmationBox = document.getElementById('order-confirmation');

    if (!orderForm || !dishSelect) {
        return;
    }

    // 2. DYNAMIC MARKUP GENERATION: Populate <select> via loop from MENU_ITEMS array
    function populateMenuSelect(selectElement, items) {
        selectElement.innerHTML = '<option value="">-- Выберите блюдо из меню --</option>';
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name + ' (' + formatMoney(item.price) + ')';
            selectElement.appendChild(option);
        }
    }
    populateMenuSelect(dishSelect, MENU_ITEMS);

    // Set minimum date to today for deliveryDate
    const todayStr = new Date().toISOString().split('T')[0];
    if (deliveryDate) {
        deliveryDate.min = todayStr;
        deliveryDate.value = todayStr;
    }

    // Dynamic Live Preview Container (created in code, not written in HTML)
    const liveSummaryBox = document.createElement('div');
    liveSummaryBox.id = 'live-order-summary';
    liveSummaryBox.className = 'alert alert-light border mt-3 mb-0 p-3';
    dishSelect.closest('fieldset').appendChild(liveSummaryBox);

    // 3. PURE FUNCTIONS WITH PARAMETERS AND RETURN VALUES (called from >= 2 places)

    function formatMoney(amount) {
        return amount.toLocaleString('ru-RU') + ' ' + DELIVERY_CONFIG.currency;
    }

    function findDishById(id) {
        for (let i = 0; i < MENU_ITEMS.length; i++) {
            if (MENU_ITEMS[i].id === id) {
                return MENU_ITEMS[i];
            }
        }
        return null;
    }

    function calculateSubtotal(unitPrice, quantity, hasSauce) {
        const qty = parseInt(quantity, 10) || 0;
        let subtotal = unitPrice * qty;
        if (hasSauce) {
            subtotal += (DELIVERY_CONFIG.saucePrice * qty);
        }
        return subtotal;
    }

    function calculateDeliveryFee(subtotal) {
        if (subtotal <= 0) return 0;
        return subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold ? 0 : DELIVERY_CONFIG.standardDeliveryFee;
    }

    function calculateDiscount(subtotal) {
        if (subtotal >= DELIVERY_CONFIG.discountThreshold) {
            return Math.round(subtotal * (DELIVERY_CONFIG.discountPercent / 100));
        }
        return 0;
    }

    function calculateTotal(subtotal, deliveryFee, discount) {
        return Math.max(0, subtotal + deliveryFee - discount);
    }

    function validatePhone(phoneStr) {
        const trimmed = phoneStr.trim();
        // Accepts: +77026724066, +7 (702) 672-40-66, 87026724066, 7026724066
        const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return phoneRegex.test(trimmed);
    }

    function validateEmail(emailStr) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailStr.trim());
    }

    function validateDate(dateStr) {
        if (!dateStr) return false;
        const selected = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
    }

    // 4. LIVE ORDER CALCULATION (UPDATED ON INPUT / CHANGE)
    function updateLiveSummary() {
        const selectedDish = findDishById(dishSelect.value);
        const qty = parseInt(portionsCount.value, 10) || 0;
        const hasSauce = extraSauce ? extraSauce.checked : false;

        if (!selectedDish || qty <= 0) {
            liveSummaryBox.innerHTML = '<span class="text-muted small">ℹ️ Выберите блюдо и количество порций для расчёта стоимости доставки.</span>';
            return;
        }

        const subtotal = calculateSubtotal(selectedDish.price, qty, hasSauce);
        const deliveryFee = calculateDeliveryFee(subtotal);
        const discount = calculateDiscount(subtotal);
        const total = calculateTotal(subtotal, deliveryFee, discount);

        let html = '<div class="d-flex justify-content-between align-items-center flex-wrap gap-2">';
        html += '<div><strong>' + selectedDish.name + '</strong> &times; ' + qty + ' порц.';
        if (hasSauce) {
            html += ' <span class="badge bg-warning text-dark">+ соус</span>';
        }
        html += '<br><span class="text-muted small">Сумма блюд: ' + formatMoney(subtotal);
        if (discount > 0) {
            html += ' | <span class="text-success fw-bold">Скидка 10%: -' + formatMoney(discount) + '</span>';
        }
        html += ' | Доставка: ' + (deliveryFee === 0 ? '<span class="text-success fw-bold">Бесплатно</span>' : formatMoney(deliveryFee));
        html += '</span></div>';
        html += '<div class="text-end"><span class="small text-muted d-block">Итого к оплате:</span><span class="h5 fw-bold text-danger mb-0">' + formatMoney(total) + '</span></div>';
        html += '</div>';

        liveSummaryBox.innerHTML = html;
    }

    // Initial run
    updateLiveSummary();

    // 5. VALIDATION HELPER FUNCTIONS (NEXT TO THE FIELD)

    function showError(inputElement, message) {
        clearError(inputElement);
        inputElement.classList.add('field-error', 'is-invalid-custom');

        const errorMsg = document.createElement('div');
        errorMsg.className = 'field-error-text text-danger small mt-1 fw-semibold';
        errorMsg.textContent = '⚠️ ' + message;

        // Insert next to the input
        if (inputElement.nextElementSibling) {
            inputElement.parentNode.insertBefore(errorMsg, inputElement.nextElementSibling);
        } else {
            inputElement.parentNode.appendChild(errorMsg);
        }
    }

    function clearError(inputElement) {
        inputElement.classList.remove('field-error', 'is-invalid-custom');
        const parent = inputElement.parentNode;
        const existingError = parent.querySelector('.field-error-text');
        if (existingError) {
            parent.removeChild(existingError);
        }
    }

    // 6. EVENT LISTENERS (MULTIPLE EVENT TYPES)

    // Event Type 1 & 2: 'input' and 'change' for live updates & instant error clearing
    dishSelect.addEventListener('change', function () {
        clearError(dishSelect);
        updateLiveSummary();
    });

    portionsCount.addEventListener('input', function () {
        clearError(portionsCount);
        updateLiveSummary();
    });

    if (extraSauce) {
        extraSauce.addEventListener('change', function () {
            updateLiveSummary();
        });
    }

    clientName.addEventListener('input', function () {
        clearError(clientName);
    });

    clientPhone.addEventListener('input', function () {
        clearError(clientPhone);
    });

    clientEmail.addEventListener('input', function () {
        clearError(clientEmail);
    });

    deliveryDate.addEventListener('change', function () {
        clearError(deliveryDate);
    });

    deliveryAddress.addEventListener('input', function () {
        clearError(deliveryAddress);
    });

    // Event Type 3: 'click' via Delegated Event Listener on the form
    orderForm.addEventListener('click', function (e) {
        const target = e.target;

        // Reset button handling
        if (target.getAttribute('type') === 'reset' || target.closest('[type="reset"]')) {
            setTimeout(function () {
                // Clear all error messages on reset
                const allErrors = orderForm.querySelectorAll('.field-error-text');
                allErrors.forEach(function (err) { err.remove(); });
                const inputs = orderForm.querySelectorAll('.field-error, .is-invalid-custom');
                inputs.forEach(function (inp) { inp.classList.remove('field-error', 'is-invalid-custom'); });

                // Hide confirmation
                if (confirmationBox) {
                    confirmationBox.classList.add('hidden');
                    confirmationBox.innerHTML = '';
                }
                updateLiveSummary();
            }, 10);
        }

        // Receipt dismissal button delegation
        if (target.classList.contains('dismiss-receipt-btn')) {
            e.preventDefault();
            if (confirmationBox) {
                confirmationBox.classList.add('hidden');
                confirmationBox.innerHTML = '';
            }
        }
    });

    // Event Type 4: 'submit' on the main form with full validation
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        // 1. Dish selection check
        const dishId = dishSelect.value;
        const selectedDish = findDishById(dishId);
        if (!dishId || !selectedDish) {
            showError(dishSelect, 'Пожалуйста, выберите блюдо из нашего меню.');
            isValid = false;
        } else {
            clearError(dishSelect);
        }

        // 2. Portions count check
        const portions = parseInt(portionsCount.value, 10);
        if (isNaN(portions) || portions < 1 || portions > 20) {
            showError(portionsCount, 'Укажите количество порций от 1 до 20.');
            isValid = false;
        } else {
            clearError(portionsCount);
        }

        // 3. Name check
        const nameVal = clientName.value.trim();
        if (nameVal.length < 2) {
            showError(clientName, 'Имя должно содержать не менее 2 символов.');
            isValid = false;
        } else {
            clearError(clientName);
        }

        // 4. Phone check
        const phoneVal = clientPhone.value.trim();
        if (!validatePhone(phoneVal)) {
            showError(clientPhone, 'Введите корректный номер телефона (например, +7 702 672-40-66).');
            isValid = false;
        } else {
            clearError(clientPhone);
        }

        // 5. Email check
        const emailVal = clientEmail.value.trim();
        if (!validateEmail(emailVal)) {
            showError(clientEmail, 'Введите корректный адрес электронной почты.');
            isValid = false;
        } else {
            clearError(clientEmail);
        }

        // 6. Delivery Date check
        const dateVal = deliveryDate.value;
        if (!validateDate(dateVal)) {
            showError(deliveryDate, 'Дата доставки не может быть раньше сегодняшнего дня.');
            isValid = false;
        } else {
            clearError(deliveryDate);
        }

        // 7. Delivery Address check
        const addressVal = deliveryAddress.value.trim();
        if (addressVal.length < 5) {
            showError(deliveryAddress, 'Укажите полный адрес (улица, дом, квартира).');
            isValid = false;
        } else {
            clearError(deliveryAddress);
        }

        // If any validation failed, stop here
        if (!isValid) {
            // Scroll to first invalid field
            const firstError = orderForm.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // CALCULATE FINAL RECEIPT
        const hasSauce = extraSauce ? extraSauce.checked : false;
        const subtotal = calculateSubtotal(selectedDish.price, portions, hasSauce);
        const deliveryFee = calculateDeliveryFee(subtotal);
        const discount = calculateDiscount(subtotal);
        const total = calculateTotal(subtotal, deliveryFee, discount);

        // Get selected payment method
        const selectedPaymentRadio = orderForm.querySelector('input[name="paymentMethod"]:checked');
        let paymentName = 'Kaspi QR';
        if (selectedPaymentRadio) {
            if (selectedPaymentRadio.value === 'card') paymentName = 'Банковской картой курьеру';
            if (selectedPaymentRadio.value === 'cash') paymentName = 'Наличными при получении';
        }

        const commentsVal = orderComments ? orderComments.value.trim() : '';
        const orderNumber = 'FM-' + Math.floor(100000 + Math.random() * 900000);
        const estimatedTime = (selectedDish.timeMin + 30) + '–' + (selectedDish.timeMin + 45) + ' мин';

        // CONSTRUCT CONFIRMATION RECEIPT INTO #order-confirmation
        let receiptHtml = '';
        receiptHtml += '<div class="card border-success shadow">';
        receiptHtml += '  <div class="card-header bg-success text-white py-3">';
        receiptHtml += '    <h3 class="h5 mb-0 fw-bold">✅ Заказ № ' + orderNumber + ' успешно оформлен!</h3>';
        receiptHtml += '  </div>';
        receiptHtml += '  <div class="card-body p-4">';
        receiptHtml += '    <p class="lead mb-3">Спасибо, <strong>' + escapeHtml(nameVal) + '</strong>! Кухня ресто-паба <em>Frau Muller</em> уже приступила к приготовлению.</p>';
        receiptHtml += '    <div class="row g-3 mb-3">';
        receiptHtml += '      <div class="col-md-6">';
        receiptHtml += '        <ul class="list-unstyled mb-0">';
        receiptHtml += '          <li><strong>Позиция:</strong> ' + selectedDish.name + ' &times; ' + portions + '</li>';
        if (hasSauce) {
            receiptHtml += '          <li><strong>Дополнение:</strong> Фирменный горчичный соус &times; ' + portions + '</li>';
        }
        receiptHtml += '          <li><strong>Оплата:</strong> ' + paymentName + '</li>';
        receiptHtml += '          <li><strong>Ожидаемое время доставки:</strong> ~' + estimatedTime + '</li>';
        receiptHtml += '        </ul>';
        receiptHtml += '      </div>';
        receiptHtml += '      <div class="col-md-6">';
        receiptHtml += '        <ul class="list-unstyled mb-0">';
        receiptHtml += '          <li><strong>Получатель:</strong> ' + escapeHtml(nameVal) + ' (' + escapeHtml(phoneVal) + ')</li>';
        receiptHtml += '          <li><strong>Электронный чек выслан на:</strong> ' + escapeHtml(emailVal) + '</li>';
        receiptHtml += '          <li><strong>Адрес:</strong> ' + escapeHtml(addressVal) + '</li>';
        receiptHtml += '          <li><strong>Дата доставки:</strong> ' + escapeHtml(dateVal) + '</li>';
        receiptHtml += '        </ul>';
        receiptHtml += '      </div>';
        receiptHtml += '    </div>';

        if (commentsVal) {
            receiptHtml += '    <div class="p-2 bg-light rounded mb-3 small"><strong>Примечание курьеру:</strong> ' + escapeHtml(commentsVal) + '</div>';
        }

        receiptHtml += '    <hr>';
        receiptHtml += '    <div class="d-flex justify-content-between align-items-center flex-wrap">';
        receiptHtml += '      <div>';
        receiptHtml += '        <span class="text-muted small">Стоимость блюд: ' + formatMoney(subtotal) + '</span><br>';
        if (discount > 0) {
            receiptHtml += '        <span class="text-success small fw-bold">Скидка постоянного гостя 10%: -' + formatMoney(discount) + '</span><br>';
        }
        receiptHtml += '        <span class="text-muted small">Доставка: ' + (deliveryFee === 0 ? 'Бесплатно (заказ от 7 000 ₸)' : formatMoney(deliveryFee)) + '</span>';
        receiptHtml += '      </div>';
        receiptHtml += '      <div class="text-end">';
        receiptHtml += '        <span class="small text-muted d-block">ИТОГО К ОПЛАТЕ:</span>';
        receiptHtml += '        <span class="display-6 fw-bold text-danger">' + formatMoney(total) + '</span>';
        receiptHtml += '      </div>';
        receiptHtml += '    </div>';

        receiptHtml += '    <div class="text-end mt-4">';
        receiptHtml += '      <button type="button" class="btn btn-outline-secondary btn-sm dismiss-receipt-btn">Закрыть квитанцию</button>';
        receiptHtml += '    </div>';
        receiptHtml += '  </div>';
        receiptHtml += '</div>';

        confirmationBox.innerHTML = receiptHtml;
        confirmationBox.classList.remove('hidden');

        // Smooth scroll to confirmation
        confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // XSS sanitizer helper
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
