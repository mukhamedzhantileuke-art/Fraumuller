/**
 * Frau Muller Resto-Pub - Food Delivery Script (order.html)
 * Assignment 4-5: Multi-type Order Flow (Delivery / Takeaway / Dine-in), Realistic Time Slots, Cart Synchronization & Live Calculator
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
 * Currency formatter
 */
function formatKzt(amount) {
    return amount.toLocaleString('ru-RU') + ' ₸';
}

/**
 * Generates temporary tracking code like "ORD-7294"
 */
function generateOrderReference() {
    return 'ORD-' + Math.floor(1000 + Math.random() * 9000);
}

/**
 * Loads cart from localStorage if populated from menu.html
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
 * Main delivery interactivity initialization
 */
function initOrderInteractivity() {
    const orderForm = document.getElementById('order-form');
    const confirmationContainer = document.getElementById('order-confirmation');

    if (!orderForm) {
        return;
    }

    const dishSelect = orderForm.querySelector('#dishSelect');
    const portionsInput = orderForm.querySelector('#portionsCount');
    const sauceCheckbox = orderForm.querySelector('#extraSauce');
    const clientNameInput = orderForm.querySelector('#clientName');
    const clientPhoneInput = orderForm.querySelector('#clientPhone');
    const clientEmailInput = orderForm.querySelector('#clientEmail');
    const addressInput = orderForm.querySelector('#deliveryAddress');
    const addressWrapper = document.getElementById('address-field-wrapper') || addressInput.closest('.col-12');
    const addressLabel = document.getElementById('address-label');
    const timeSelect = document.getElementById('deliveryTimeSlot');

    // 1. Render Transferred Cart from menu.html if available
    let cart = getSavedCart();
    let hasCartItems = Object.keys(cart).length > 0;

    const cartContainer = document.createElement('div');
    cartContainer.id = 'order-cart-items-container';
    cartContainer.className = 'mb-3';

    const fieldset1 = orderForm.querySelector('fieldset');
    if (fieldset1) {
        fieldset1.insertBefore(cartContainer, fieldset1.children[1]);
    }

    function renderCartSummary() {
        cartContainer.textContent = '';
        const keys = Object.keys(cart);

        if (keys.length === 0) {
            hasCartItems = false;
            return;
        }

        hasCartItems = true;
        const card = document.createElement('div');
        card.className = 'card border-danger border-2 p-3 bg-light mb-3';

        const title = document.createElement('h4');
        title.className = 'h6 fw-bold text-danger mb-2 d-flex justify-content-between align-items-center';
        title.textContent = '🛒 Выбранные блюда из меню:';

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'btn btn-outline-secondary btn-sm py-0';
        clearBtn.textContent = 'Очистить корзину';
        clearBtn.addEventListener('click', function () {
            cart = {};
            localStorage.removeItem('fraumuller_cart');
            renderCartSummary();
            updateOrderCalculations();
        });
        title.appendChild(clearBtn);
        card.appendChild(title);

        const list = document.createElement('div');
        list.className = 'd-flex flex-column gap-2';

        keys.forEach(function (dishName) {
            const item = cart[dishName];
            const row = document.createElement('div');
            row.className = 'd-flex justify-content-between align-items-center bg-white p-2 border rounded';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'fw-semibold text-dark small';
            nameDiv.textContent = item.name + ' × ' + item.qty;

            const priceDiv = document.createElement('div');
            priceDiv.className = 'd-flex align-items-center gap-2';

            const sumSpan = document.createElement('span');
            sumSpan.className = 'text-danger fw-bold small';
            sumSpan.textContent = formatKzt(item.price * item.qty);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn btn-sm btn-outline-danger py-0 px-2';
            removeBtn.textContent = '×';
            removeBtn.title = 'Удалить';
            removeBtn.addEventListener('click', function () {
                delete cart[dishName];
                localStorage.setItem('fraumuller_cart', JSON.stringify(cart));
                renderCartSummary();
                updateOrderCalculations();
            });

            priceDiv.appendChild(sumSpan);
            priceDiv.appendChild(removeBtn);

            row.appendChild(nameDiv);
            row.appendChild(priceDiv);
            list.appendChild(row);
        });

        card.appendChild(list);
        cartContainer.appendChild(card);
    }

    renderCartSummary();

    // 2. Order Type Toggle Handler (Delivery vs Takeaway vs Dine-in)
    const orderTypeRadios = orderForm.querySelectorAll('input[name="orderType"]');

    function getOrderType() {
        const checked = orderForm.querySelector('input[name="orderType"]:checked');
        return checked ? checked.value : 'delivery';
    }

    function updateOrderTypeUI() {
        const type = getOrderType();

        if (type === 'delivery') {
            if (addressLabel) {
                addressLabel.textContent = 'Адрес доставки (улица, дом, квартира):';
            }
            addressInput.disabled = false;
            addressInput.placeholder = 'ул. Жургенова, дом 18/1, кв. 42';
            addressInput.value = addressInput.dataset.savedAddress || '';
            addressInput.required = true;
        } else if (type === 'takeaway') {
            if (addressLabel) {
                addressLabel.textContent = 'Пункт самовывоза (скидка 5%):';
            }
            if (addressInput.value && addressInput.value.indexOf('Жургенова') === -1) {
                addressInput.dataset.savedAddress = addressInput.value;
            }
            addressInput.value = 'Ресто-паб Frau Muller: ул. Темирбека Жургенова, 18/1 (Аллея Мынжылдык)';
            addressInput.disabled = true;
            addressInput.required = false;
        } else if (type === 'dinein') {
            if (addressLabel) {
                addressLabel.textContent = 'Предзаказ в зале ресторана:';
            }
            if (addressInput.value && addressInput.value.indexOf('Жургенова') === -1) {
                addressInput.dataset.savedAddress = addressInput.value;
            }
            addressInput.value = 'Зал Frau Muller: столик будет накрыт к указанному времени';
            addressInput.disabled = true;
            addressInput.required = false;
        }
        updateOrderCalculations();
    }

    orderTypeRadios.forEach(function (radio) {
        radio.addEventListener('change', updateOrderTypeUI);
    });

    // 3. Live Order Calculation Summary Box
    const calcBox = document.createElement('div');
    calcBox.className = 'card border-danger border-2 p-3 mb-4 bg-light shadow-sm';
    calcBox.id = 'live-order-summary';

    const calcTitle = document.createElement('h3');
    calcTitle.className = 'h6 fw-bold text-danger mb-2 d-flex justify-content-between align-items-center';
    calcTitle.textContent = 'Расчет стоимости заказа:';

    const calcBadge = document.createElement('span');
    calcBadge.className = 'badge bg-danger';
    calcBadge.textContent = 'Онлайн-чек';
    calcTitle.appendChild(calcBadge);

    const calcLinesContainer = document.createElement('div');
    calcLinesContainer.className = 'small text-muted d-flex flex-column gap-1';

    const calcTotalLine = document.createElement('div');
    calcTotalLine.className = 'd-flex justify-content-between align-items-center pt-2 mt-2 border-top fw-bold text-dark fs-5';

    calcBox.appendChild(calcTitle);
    calcBox.appendChild(calcLinesContainer);
    calcBox.appendChild(calcTotalLine);

    const submitBtnsContainer = orderForm.querySelector('.d-flex.flex-wrap');
    if (submitBtnsContainer) {
        submitBtnsContainer.insertAdjacentElement('beforebegin', calcBox);
    } else {
        orderForm.appendChild(calcBox);
    }

    function getCourierTip() {
        const checked = orderForm.querySelector('input[name="courierTip"]:checked');
        return checked ? parseInt(checked.value, 10) : 0;
    }

    /**
     * Calculates total breakdown
     */
    function calculateOrderTotals() {
        let dishesSubtotal = 0;

        // Sum from cart
        for (const k in cart) {
            if (Object.prototype.hasOwnProperty.call(cart, k)) {
                dishesSubtotal += cart[k].price * cart[k].qty;
            }
        }

        // Sum from direct select if chosen
        const selectedDishKey = dishSelect ? dishSelect.value : '';
        const portions = portionsInput ? parseInt(portionsInput.value, 10) || 1 : 1;

        if (selectedDishKey && DISH_PRICES[selectedDishKey]) {
            dishesSubtotal += DISH_PRICES[selectedDishKey].price * portions;
        }

        // Sauce
        let saucePrice = 0;
        if (sauceCheckbox && sauceCheckbox.checked) {
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

        calcLinesContainer.textContent = '';

        const lineFood = document.createElement('div');
        lineFood.className = 'd-flex justify-content-between';
        lineFood.textContent = 'Стоимость блюд:';
        const spanFood = document.createElement('span');
        spanFood.className = 'fw-semibold text-dark';
        spanFood.textContent = formatKzt(res.rawFoodTotal);
        lineFood.appendChild(spanFood);
        calcLinesContainer.appendChild(lineFood);

        if (res.takeawayDiscount > 0) {
            const lineDisc = document.createElement('div');
            lineDisc.className = 'd-flex justify-content-between text-success fw-semibold';
            lineDisc.textContent = 'Скидка на самовывоз (5%):';
            const spanDisc = document.createElement('span');
            spanDisc.textContent = '-' + formatKzt(res.takeawayDiscount);
            lineDisc.appendChild(spanDisc);
            calcLinesContainer.appendChild(lineDisc);
        }

        const lineDel = document.createElement('div');
        lineDel.className = 'd-flex justify-content-between';
        lineDel.textContent = 'Доставка курьером:';
        const spanDel = document.createElement('span');
        if (res.orderType !== 'delivery') {
            spanDel.className = 'text-success fw-semibold';
            spanDel.textContent = '0 ₸ (не требуется)';
        } else if (res.deliveryFee === 0 && res.rawFoodTotal >= 7000) {
            spanDel.className = 'text-success fw-semibold';
            spanDel.textContent = '0 ₸ (Бесплатно от 7 000 ₸)';
        } else {
            spanDel.className = 'text-dark fw-semibold';
            spanDel.textContent = formatKzt(res.deliveryFee);
        }
        lineDel.appendChild(spanDel);
        calcLinesContainer.appendChild(lineDel);

        if (res.tip > 0) {
            const lineTip = document.createElement('div');
            lineTip.className = 'd-flex justify-content-between text-muted';
            lineTip.textContent = 'Чаевые курьеру:';
            const spanTip = document.createElement('span');
            spanTip.className = 'fw-semibold';
            spanTip.textContent = '+' + formatKzt(res.tip);
            lineTip.appendChild(spanTip);
            calcLinesContainer.appendChild(lineTip);
        }

        calcTotalLine.textContent = '';
        const totalLbl = document.createElement('span');
        totalLbl.textContent = 'Итого к оплате:';
        const totalVal = document.createElement('span');
        totalVal.className = 'text-danger fs-4';
        totalVal.textContent = formatKzt(res.grandTotal);
        calcTotalLine.appendChild(totalLbl);
        calcTotalLine.appendChild(totalVal);
    }

    // Attach listeners
    if (dishSelect) {
        dishSelect.addEventListener('change', updateOrderCalculations);
    }
    if (portionsInput) {
        portionsInput.addEventListener('input', updateOrderCalculations);
    }
    if (sauceCheckbox) {
        sauceCheckbox.addEventListener('change', updateOrderCalculations);
    }

    const tipRadios = orderForm.querySelectorAll('input[name="courierTip"]');
    tipRadios.forEach(function (radio) {
        radio.addEventListener('change', updateOrderCalculations);
    });

    updateOrderTypeUI();

    // Form Submission
    orderForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const totals = calculateOrderTotals();
        if (totals.rawFoodTotal === 0) {
            alert('Пожалуйста, выберите хотя бы одно блюдо для заказа.');
            if (dishSelect) {
                dishSelect.focus();
            }
            return;
        }

        const nameVal = clientNameInput.value.trim();
        const phoneVal = clientPhoneInput.value.trim();
        const emailVal = clientEmailInput.value.trim();
        const addressVal = addressInput.value.trim();
        const timeVal = timeSelect ? timeSelect.options[timeSelect.selectedIndex].text : 'Как можно скорее';
        const paymentRadio = orderForm.querySelector('input[name="paymentMethod"]:checked');
        const paymentVal = paymentRadio ? paymentRadio.nextElementSibling.textContent.trim() : 'Kaspi QR';
        const commentsVal = orderForm.querySelector('#orderComments').value.trim();

        const orderRef = generateOrderReference();

        // Render confirmation receipt
        if (confirmationContainer) {
            confirmationContainer.textContent = '';
            confirmationContainer.className = 'mt-4 d-block';

            const card = document.createElement('div');
            card.className = 'card border-success border-2 shadow p-4 bg-white';

            // Header
            const header = document.createElement('div');
            header.className = 'd-flex flex-wrap justify-content-between align-items-center pb-3 mb-3 border-bottom';

            const title = document.createElement('h3');
            title.className = 'h4 text-success fw-bold mb-0';
            title.textContent = 'Заказ успешно оформлен!';

            const refBadge = document.createElement('span');
            refBadge.className = 'badge bg-success fs-6';
            refBadge.textContent = 'Номер заказа: #' + orderRef;

            header.appendChild(title);
            header.appendChild(refBadge);
            card.appendChild(header);

            // Realistic Tracker Progress Bar
            const trackerDiv = document.createElement('div');
            trackerDiv.className = 'p-3 bg-light rounded mb-3 border text-center';

            const trackerTitle = document.createElement('div');
            trackerTitle.className = 'fw-bold text-dark mb-2';
            trackerTitle.textContent = 'Статус заказа: 👨‍🍳 Готовится на кухне Frau Muller';

            const progress = document.createElement('div');
            progress.className = 'progress mb-2';
            progress.style.height = '10px';

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar bg-danger progress-bar-striped progress-bar-animated';
            progressBar.style.width = '35%';
            progress.appendChild(progressBar);

            const trackerSub = document.createElement('div');
            trackerSub.className = 'small text-muted';
            trackerSub.textContent = 'Ориентировочное время: ' + timeVal;

            trackerDiv.appendChild(trackerTitle);
            trackerDiv.appendChild(progress);
            trackerDiv.appendChild(trackerSub);
            card.appendChild(trackerDiv);

            // Details
            const dl = document.createElement('dl');
            dl.className = 'row g-2 mb-3';

            function addRow(lbl, val) {
                const dt = document.createElement('dt');
                dt.className = 'col-sm-4 text-muted fw-normal';
                dt.textContent = lbl;
                const dd = document.createElement('dd');
                dd.className = 'col-sm-8 fw-semibold text-dark mb-1';
                dd.textContent = val;
                dl.appendChild(dt);
                dl.appendChild(dd);
            }

            addRow('Получатель:', nameVal + ' (' + phoneVal + ')');
            addRow('Email для чека:', emailVal);
            addRow('Способ получения:', totals.orderType === 'delivery' ? 'Доставка курьером' : (totals.orderType === 'takeaway' ? 'С собой (самовывоз)' : 'В ресторане'));
            addRow('Адрес:', addressVal);
            addRow('Время:', timeVal);
            addRow('Способ оплаты:', paymentVal);
            addRow('Сумма к оплате:', formatKzt(totals.grandTotal));

            if (commentsVal) {
                addRow('Пожелания:', commentsVal);
            }

            card.appendChild(dl);

            // Academic Notice
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning py-3 mt-3 mb-0';
            const strong = document.createElement('strong');
            strong.className = 'd-block mb-1';
            strong.textContent = '⚠️ Учебная демонстрация:';
            const alertP = document.createElement('p');
            alertP.className = 'small mb-0';
            alertP.textContent = 'Заказ успешно сформирован на стороне клиента. Реальная передача на сервер ресторана не производилась.';
            alertDiv.appendChild(strong);
            alertDiv.appendChild(alertP);
            card.appendChild(alertDiv);

            confirmationContainer.appendChild(card);
            confirmationContainer.scrollIntoView({ behavior: 'smooth' });

            // Clear cart
            localStorage.removeItem('fraumuller_cart');
            cart = {};
            renderCartSummary();
            orderForm.reset();
            updateOrderTypeUI();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initOrderInteractivity();
});
