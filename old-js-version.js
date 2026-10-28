/**
 * Frau Muller Resto-Pub — Plain JavaScript Reference File (Assignment 4-5)
 * File: old-js-version.js
 * 
 * IMPORTANT: This file is NOT linked to any HTML page.
 * It is preserved for side-by-side comparison with the jQuery implementations
 * as required by Assignment 6 specification.
 * 
 * Contains original plain JavaScript implementations of three features:
 * 1. Feature 1: Dynamic Dish Catalog Rendering & Selection from Array (from js/index.js)
 * 2. Feature 2: Interactive Table Booking Form Validation & Deposit Calculator (from js/reservation.js)
 * 3. Feature 3: Password Eye Toggle & Interactive Security Checklist (from js/main.js)
 */

'use strict';

/* ==========================================================================
   FEATURE 1 (Plain JS): Dynamic Dish Catalog from Array (js/index.js)
   - Built using: document.createElement, appendChild, textContent, addEventListener
   ========================================================================== */

const OLD_HITS_CATALOG = [
    {
        id: 'dish-1',
        name: 'Баварские колбаски',
        category: 'meat',
        price: 4200,
        calories: 680,
        prepTime: '20 мин',
        badge: 'Хит продаж',
        badgeClass: 'bg-danger',
        description: 'Сочные свино-говяжьи колбаски на открытом гриле с тушеной капустой и баварской зернистой горчицей.',
        composition: 'Свинина, говядина, пряности, тушеная квашеная капуста, домашняя горчица'
    },
    {
        id: 'dish-2',
        name: 'Стейк Рибай Прайм',
        category: 'meat',
        price: 8500,
        calories: 750,
        prepTime: '25 мин',
        badge: 'Шеф-выбор',
        badgeClass: 'bg-danger',
        description: 'Мраморная говядина зернового откорма, обжаренная на березовых углях с розмарином и чесночным маслом.',
        composition: 'Мраморная говядина Black Angus, морская соль, свежий розмарин, фермерское масло'
    },
    {
        id: 'dish-3',
        name: 'Мюнхенский шницель',
        category: 'meat',
        price: 4800,
        calories: 710,
        prepTime: '20 мин',
        badge: 'Классика',
        badgeClass: 'bg-primary',
        description: 'Большой золотистый шницель из нежной телятины в хрустящей панировке с картофелем фри и долькой лимона.',
        composition: 'Телячья вырезка, хрустящие панировочные сухари, картофель фри, лимон, брусничный соус'
    },
    {
        id: 'dish-4',
        name: 'Пикантные крылья BBQ',
        category: 'meat',
        price: 3600,
        calories: 590,
        prepTime: '15 мин',
        badge: 'Острое',
        badgeClass: 'bg-danger',
        description: 'Хрустящие куриные крылья в пикантной карамельной глазури BBQ со стеблями сельдерея и сырным дипом Блю Чиз.',
        composition: 'Куриные крылышки, соус BBQ, копченая паприка, соус Блю Чиз, свежий сельдерей'
    },
    {
        id: 'dish-5',
        name: 'Бельгийские вафли',
        category: 'dessert',
        price: 2600,
        calories: 430,
        prepTime: '12 мин',
        badge: 'Десерт',
        badgeClass: 'bg-warning text-dark',
        description: 'Теплые пышные вафли с шариком сливочного пломбира, свежей садовой клубникой и бельгийским шоколадом.',
        composition: 'Бельгийское бисквитное тесто, пломбир ванильный, свежая клубника, бельгийский темный шоколад'
    },
    {
        id: 'dish-6',
        name: 'Яблочный штрудель',
        category: 'dessert',
        price: 2400,
        calories: 390,
        prepTime: '15 мин',
        badge: 'Традиция',
        badgeClass: 'bg-warning text-dark',
        description: 'Классический венский штрудель с карамелизированными яблоками, корицей, грецким орехом и ванильным соусом.',
        composition: 'Вытяжное слоеное тесто, яблоки Гренни Смит, корица, дробленый грецкий орех, ванильный крем'
    },
    {
        id: 'dish-7',
        name: 'Бретцель с сырным соусом',
        category: 'snack',
        price: 1900,
        calories: 320,
        prepTime: '10 мин',
        badge: 'Закуска',
        badgeClass: 'bg-secondary',
        description: 'Свежеиспеченный немецкий крендель с морской солью и теплым сливочно-сырным соусом обацда.',
        composition: 'Традиционное дрожжевое бретцельное тесто, кристаллы морской соли, сливочно-сырный крем'
    }
];

function oldFormatCurrency(amount) {
    return amount.toLocaleString('ru-RU') + ' ₸';
}

function oldCreateDishCard(dish, isSelected, onSelect) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';

    const card = document.createElement('div');
    const borderClass = isSelected ? 'border-danger border-3 shadow' : 'border-0 border-top border-danger border-3 shadow-sm';
    card.className = 'card h-100 bg-white ' + borderClass;
    card.style.cursor = 'pointer';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column justify-content-between';

    // Top block: Badge & Title
    const topDiv = document.createElement('div');

    const badgeSpan = document.createElement('span');
    badgeSpan.className = 'badge mb-2 ' + dish.badgeClass;
    badgeSpan.textContent = dish.badge;
    topDiv.appendChild(badgeSpan);

    const titleH4 = document.createElement('h4');
    titleH4.className = 'card-title h5 fw-bold mb-2';
    titleH4.textContent = dish.name;
    topDiv.appendChild(titleH4);

    const descP = document.createElement('p');
    descP.className = 'card-text text-muted small mb-3';
    descP.textContent = dish.description;
    topDiv.appendChild(descP);

    // Bottom block: Price and Details button
    const bottomDiv = document.createElement('div');
    bottomDiv.className = 'd-flex align-items-center justify-content-between pt-2 border-top';

    const priceSpan = document.createElement('span');
    priceSpan.className = 'fw-bold text-danger fs-6';
    priceSpan.textContent = oldFormatCurrency(dish.price);

    const actionBtn = document.createElement('button');
    actionBtn.type = 'button';
    actionBtn.className = isSelected ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-outline-danger';
    actionBtn.textContent = isSelected ? 'Выбрано' : 'Подробнее';

    bottomDiv.appendChild(priceSpan);
    bottomDiv.appendChild(actionBtn);

    cardBody.appendChild(topDiv);
    cardBody.appendChild(bottomDiv);
    card.appendChild(cardBody);
    col.appendChild(card);

    card.addEventListener('click', function () {
        onSelect(dish.id);
    });

    return col;
}

function oldRenderDishesList(dishes, container, selectedDishId, onSelectCallback, onResetFilterCallback) {
    container.textContent = '';

    if (dishes.length === 0) {
        const emptyCol = document.createElement('div');
        emptyCol.className = 'col-12';

        const emptyCard = document.createElement('div');
        emptyCard.className = 'card p-4 text-center border-dashed bg-light';

        const emptyText = document.createElement('p');
        emptyText.className = 'text-muted mb-3 fs-6';
        emptyText.textContent = 'По заданным критериям блюд не найдено.';

        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'btn btn-outline-danger btn-sm mx-auto';
        resetBtn.textContent = 'Сбросить фильтр';
        resetBtn.addEventListener('click', onResetFilterCallback);

        emptyCard.appendChild(emptyText);
        emptyCard.appendChild(resetBtn);
        emptyCol.appendChild(emptyCard);
        container.appendChild(emptyCol);
        return;
    }

    dishes.forEach(function (dish) {
        const isSelected = dish.id === selectedDishId;
        const cardCol = oldCreateDishCard(dish, isSelected, onSelectCallback);
        container.appendChild(cardCol);
    });
}


/* ==========================================================================
   FEATURE 2 (Plain JS): Table Reservation Form Validation & Deposit (js/reservation.js)
   - Built using: querySelector, classList.add/remove, addEventListener('submit')
   ========================================================================== */

function oldClearFieldError(inputElement) {
    inputElement.classList.remove('is-invalid');
    const existingFeedback = inputElement.parentElement.querySelector('.js-field-error');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

function oldShowFieldError(inputElement, errorMessage) {
    oldClearFieldError(inputElement);
    inputElement.classList.add('is-invalid');

    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback d-block js-field-error small mt-1';
    feedback.textContent = errorMessage;
    inputElement.parentElement.appendChild(feedback);
}

function oldValidateBookingField(fieldName, form) {
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
            return 'Имя должно состоять только из букв.';
        }
        return null;
    }

    if (fieldName === 'phoneNumber') {
        const val = phoneInput.value.trim();
        const cleanedDigits = val.replace(/\D/g, '');
        if (cleanedDigits.length < 10) {
            return 'Укажите корректный номер телефона (не менее 10 цифр).';
        }
        return null;
    }

    if (fieldName === 'resDate') {
        const val = dateInput.value;
        if (!val) {
            return 'Выберите дату бронирования.';
        }
        if (val < todayStr) {
            return 'Дата бронирования не может быть в прошлом.';
        }
        return null;
    }

    if (fieldName === 'resTime') {
        const val = timeInput.value;
        if (!val) {
            return 'Укажите желаемое время визита.';
        }
        const hour = parseInt(val.split(':')[0], 10);
        if (hour >= 2 && hour < 12) {
            return 'Frau Muller открыт с 12:00 до 02:00 ночи.';
        }
        return null;
    }

    if (fieldName === 'guestCount') {
        const count = parseInt(guestsInput.value, 10);
        if (isNaN(count) || count < 1 || count > 30) {
            return 'Укажите количество гостей от 1 до 30 человек.';
        }
        return null;
    }

    if (fieldName === 'zone') {
        const val = zoneSelect.value;
        const count = parseInt(guestsInput.value, 10);
        if (val === 'vip' && count > 12) {
            return 'VIP-кабина вмещает до 12 гостей. Для больших компаний выберите Основной зал.';
        }
        return null;
    }

    return null;
}


/* ==========================================================================
   FEATURE 3 (Plain JS): Password Eye Toggle & Security Checklist (js/main.js)
   - Built using: createElement, insertBefore, innerHTML for SVG, addEventListener
   ========================================================================== */

function oldAttachPasswordEyeToggle(passwordInput) {
    if (!passwordInput || passwordInput.dataset.hasEyeToggle === 'true') {
        return;
    }
    passwordInput.dataset.hasEyeToggle = 'true';

    const eyeOpenSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-1.01 1.343-2.313 2.169C11.02 11.332 9.258 12.5 8 12.5s-3.02-1.168-4.32-2.043A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>';
    const eyeSlashSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-1.01 1.343-2.313 2.169a8 8 0 0 1-1.39.81l.77.771zm-2.072-2.072A2.5 2.5 0 0 0 8 5.5a2.5 2.5 0 0 0-1.782.748l2.069 2.069z"/><path d="M11.297 9.174l2.557 2.556a.5.5 0 0 1-.708.708l-12-12a.5.5 0 1 1 .708-.708l1.796 1.797A8 8 0 0 1 8 2.5c5 0 8 5.5 8 5.5a13 13 0 0 1-1.927 2.664zM2.85 4.398l1.492 1.492C3.125 6.942 2 8 2 8s3 5.5 8 5.5c1.17 0 2.222-.32 3.14-.852l1.502 1.503a.5.5 0 0 1-.708.708l-12-12a.5.5 0 0 1 .708-.708z"/></svg>';

    let inputGroup = passwordInput.parentElement;
    if (!inputGroup.classList.contains('input-group')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-group';
        passwordInput.parentNode.insertBefore(wrapper, passwordInput);
        wrapper.appendChild(passwordInput);
        inputGroup = wrapper;
    }

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn btn-outline-secondary';
    toggleBtn.setAttribute('aria-label', 'Показать пароль');
    toggleBtn.title = 'Показать / скрыть пароль';
    toggleBtn.innerHTML = eyeOpenSvg;

    toggleBtn.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.innerHTML = eyeSlashSvg;
            toggleBtn.setAttribute('aria-label', 'Скрыть пароль');
        } else {
            passwordInput.type = 'password';
            toggleBtn.innerHTML = eyeOpenSvg;
            toggleBtn.setAttribute('aria-label', 'Показать пароль');
        }
    });

    inputGroup.appendChild(toggleBtn);
}
