/**
 * Frau Muller Resto-Pub - Main Page Script (index.html)
 * Student: Tileuke Mukhamedzhan (SE-2531)
 * Assignment 4-5: Dynamic Catalog Rendering, Filters, Interactive Selection & Random Dish Promo
 */

'use strict';

/**
 * Array of dish objects representing Frau Muller culinary hits
 * Each object contains at least 8 properties with real project data
 */
const HITS_CATALOG = [
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

/**
 * Reusable function 1: Formats number into KZT currency string
 * @param {number} amount - Numeric price
 * @returns {string} Formatted string with currency sign
 */
function formatCurrency(amount) {
    return amount.toLocaleString('ru-RU') + ' ₸';
}

/**
 * Reusable function 2: Calculates discounted price with percentage
 * @param {number} originalPrice - Base price
 * @param {number} discountPercent - Discount percent (e.g. 15)
 * @returns {number} Final discounted price rounded to nearest 50
 */
function calculateDiscountPrice(originalPrice, discountPercent) {
    const rawDiscounted = originalPrice * (1 - discountPercent / 100);
    return Math.round(rawDiscounted / 50) * 50;
}

/**
 * Reusable function 3: Creates a DOM card for a dish
 * Calls formatCurrency internally
 * @param {Object} dish - Dish data object
 * @param {boolean} isSelected - Whether dish is currently active
 * @param {Function} onSelect - Callback when clicked
 * @returns {HTMLElement} Column container with card
 */
function createDishCard(dish, isSelected, onSelect) {
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
    priceSpan.textContent = formatCurrency(dish.price);

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

/**
 * Reusable function 4: Renders list of dish cards into target container
 * Handles empty state cleanly
 * Calls createDishCard for each item
 * @param {Array} dishes - List of dishes to display
 * @param {HTMLElement} container - Grid container
 * @param {string|null} selectedDishId - Currently selected dish ID
 * @param {Function} onSelectCallback - Click handler
 * @param {Function} onResetFilterCallback - Reset handler for empty state
 */
function renderDishesList(dishes, container, selectedDishId, onSelectCallback, onResetFilterCallback) {
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
        const cardElement = createDishCard(dish, isSelected, onSelectCallback);
        container.appendChild(cardElement);
    });
}

/**
 * Renders the interactive enlarged preview card of the selected dish
 * @param {Object} dish - Selected dish data
 * @param {HTMLElement} container - Preview target container
 */
function renderInteractivePreview(dish, container) {
    container.textContent = '';

    if (!dish) {
        return;
    }

    const previewCard = document.createElement('div');
    previewCard.className = 'card border-danger border-2 shadow-sm p-3 mb-4 bg-light';

    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-2';

    const titleBadge = document.createElement('span');
    titleBadge.className = 'badge bg-danger';
    titleBadge.textContent = 'Интерактивный просмотр блюда';

    const prepSpan = document.createElement('span');
    prepSpan.className = 'badge bg-secondary';
    prepSpan.textContent = '⏱ Время приготовления: ' + dish.prepTime;

    header.appendChild(titleBadge);
    header.appendChild(prepSpan);

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'row g-3 align-items-center';

    const infoCol = document.createElement('div');
    infoCol.className = 'col-12 col-md-8';

    const dishHeading = document.createElement('h3');
    dishHeading.className = 'h5 fw-bold text-dark mb-1';
    dishHeading.textContent = dish.name;

    const dishDesc = document.createElement('p');
    dishDesc.className = 'text-muted small mb-2';
    dishDesc.textContent = dish.description;

    const compositionP = document.createElement('p');
    compositionP.className = 'small mb-2';
    const compLabel = document.createElement('strong');
    compLabel.textContent = 'Состав: ';
    compositionP.appendChild(compLabel);
    compositionP.appendChild(document.createTextNode(dish.composition));

    const metaP = document.createElement('p');
    metaP.className = 'small text-secondary mb-0';
    metaP.textContent = 'Энергетическая ценность: ' + dish.calories + ' ккал';

    infoCol.appendChild(dishHeading);
    infoCol.appendChild(dishDesc);
    infoCol.appendChild(compositionP);
    infoCol.appendChild(metaP);

    const actionCol = document.createElement('div');
    actionCol.className = 'col-12 col-md-4 text-md-end';

    const priceHeading = document.createElement('div');
    priceHeading.className = 'fs-4 fw-bold text-danger mb-2';
    priceHeading.textContent = formatCurrency(dish.price);

    const orderLink = document.createElement('a');
    orderLink.href = 'reservation.html?dish=' + encodeURIComponent(dish.name);
    orderLink.className = 'btn btn-danger w-100 shadow-sm';
    orderLink.textContent = 'Забронировать столик';

    actionCol.appendChild(priceHeading);
    actionCol.appendChild(orderLink);

    bodyDiv.appendChild(infoCol);
    bodyDiv.appendChild(actionCol);

    previewCard.appendChild(header);
    previewCard.appendChild(bodyDiv);

    container.appendChild(previewCard);
}

/**
 * Selects a random dish using Math.random() and renders a featured promo banner with 15% discount
 * Calls calculateDiscountPrice internally
 * @param {Array} dishes - Catalog of dishes
 * @param {HTMLElement} targetSection - Parent container to prepend banner
 */
function selectFeaturedDishOfTheDay(dishes, targetSection) {
    if (!dishes || dishes.length === 0) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * dishes.length);
    const featuredDish = dishes[randomIndex];
    const discountPercent = 15;
    const discountedPrice = calculateDiscountPrice(featuredDish.price, discountPercent);

    const bannerCard = document.createElement('div');
    bannerCard.className = 'card border-warning border-2 shadow-sm mb-4 bg-light';

    const bannerBody = document.createElement('div');
    bannerBody.className = 'card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3';

    const textDiv = document.createElement('div');

    const promoBadge = document.createElement('span');
    promoBadge.className = 'badge bg-warning text-dark mb-2';
    promoBadge.textContent = '🔥 Спецпредложение дня — скидка ' + discountPercent + '%!';
    textDiv.appendChild(promoBadge);

    const titleH4 = document.createElement('h4');
    titleH4.className = 'h5 fw-bold text-dark mb-1';
    titleH4.textContent = featuredDish.name;
    textDiv.appendChild(titleH4);

    const descP = document.createElement('p');
    descP.className = 'text-muted small mb-0';
    descP.textContent = 'Шеф-повар рекомендует сегодня: ' + featuredDish.description;
    textDiv.appendChild(descP);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'text-md-end text-nowrap';

    const oldPriceDel = document.createElement('del');
    oldPriceDel.className = 'text-muted small d-block';
    oldPriceDel.textContent = formatCurrency(featuredDish.price);

    const newPriceSpan = document.createElement('span');
    newPriceSpan.className = 'fs-5 fw-bold text-danger d-block mb-2';
    newPriceSpan.textContent = formatCurrency(discountedPrice);

    const bookBtn = document.createElement('a');
    bookBtn.href = 'reservation.html?promo=' + encodeURIComponent(featuredDish.name);
    bookBtn.className = 'btn btn-sm btn-outline-danger';
    bookBtn.textContent = 'Попробовать со скидкой';

    priceDiv.appendChild(oldPriceDel);
    priceDiv.appendChild(newPriceSpan);
    priceDiv.appendChild(bookBtn);

    bannerBody.appendChild(textDiv);
    bannerBody.appendChild(priceDiv);
    bannerCard.appendChild(bannerBody);

    targetSection.insertBefore(bannerCard, targetSection.firstChild);
}

/**
 * Initializes the interactive Hits section on index.html
 */
function initIndexHitsSection() {
    // Locate the "Наши хиты" section
    const headings = document.querySelectorAll('h2');
    let hitsHeading = null;

    headings.forEach(function (h) {
        if (h.textContent.indexOf('Наши хиты') !== -1) {
            hitsHeading = h;
        }
    });

    if (!hitsHeading) {
        return;
    }

    const hitsSection = hitsHeading.closest('section');
    if (!hitsSection) {
        return;
    }

    const cardsRow = hitsSection.querySelector('.row.g-3');
    if (!cardsRow) {
        return;
    }

    // Dynamic state
    let currentCategory = 'all';
    let searchQuery = '';
    let selectedDishId = HITS_CATALOG[0].id;

    // Create interactive preview container
    const previewContainer = document.createElement('div');
    previewContainer.id = 'dish-interactive-preview';
    hitsSection.insertBefore(previewContainer, cardsRow);

    // Create Controls Container (Category Filters, Search, Counter)
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'mb-3 d-flex flex-column gap-3';

    // 1. Search Box
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'input-group';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control';
    searchInput.placeholder = 'Поиск по названию или ингредиентам...';
    searchInput.setAttribute('aria-label', 'Поиск по блюдам');

    const resetSearchBtn = document.createElement('button');
    resetSearchBtn.type = 'button';
    resetSearchBtn.className = 'btn btn-outline-secondary';
    resetSearchBtn.textContent = 'Очистить';

    searchWrapper.appendChild(searchInput);
    searchWrapper.appendChild(resetSearchBtn);

    // 2. Category filter buttons and counter
    const buttonsRow = document.createElement('div');
    buttonsRow.className = 'd-flex flex-wrap align-items-center justify-content-between gap-2';

    const buttonsGroup = document.createElement('div');
    buttonsGroup.className = 'btn-group flex-wrap';
    buttonsGroup.setAttribute('role', 'group');

    const categories = [
        { key: 'all', label: 'Все блюда' },
        { key: 'meat', label: 'Мясо и гриль' },
        { key: 'dessert', label: 'Десерты' },
        { key: 'snack', label: 'Закуски' }
    ];

    const categoryButtons = {};

    categories.forEach(function (cat) {
        const count = cat.key === 'all'
            ? HITS_CATALOG.length
            : HITS_CATALOG.filter(function (d) { return d.category === cat.key; }).length;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = cat.key === 'all' ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-outline-danger';
        btn.textContent = cat.label + ' (' + count + ')';

        btn.addEventListener('click', function () {
            currentCategory = cat.key;
            updateFilterButtons();
            applyFilterAndRender();
        });

        buttonsGroup.appendChild(btn);
        categoryButtons[cat.key] = btn;
    });

    const countBadge = document.createElement('span');
    countBadge.className = 'badge bg-light text-dark border p-2';
    countBadge.textContent = 'Показано: ' + HITS_CATALOG.length;

    buttonsRow.appendChild(buttonsGroup);
    buttonsRow.appendChild(countBadge);

    controlsContainer.appendChild(searchWrapper);
    controlsContainer.appendChild(buttonsRow);

    hitsSection.insertBefore(controlsContainer, previewContainer);

    // Update active style of filter buttons
    function updateFilterButtons() {
        categories.forEach(function (cat) {
            const btn = categoryButtons[cat.key];
            if (cat.key === currentCategory) {
                btn.className = 'btn btn-sm btn-danger';
            } else {
                btn.className = 'btn btn-sm btn-outline-danger';
            }
        });
    }

    // Filter dishes based on category and search query
    function filterDishes() {
        return HITS_CATALOG.filter(function (dish) {
            const matchesCat = currentCategory === 'all' || dish.category === currentCategory;
            const query = searchQuery.trim().toLowerCase();
            const matchesSearch = query === '' ||
                dish.name.toLowerCase().indexOf(query) !== -1 ||
                dish.composition.toLowerCase().indexOf(query) !== -1 ||
                dish.description.toLowerCase().indexOf(query) !== -1;

            return matchesCat && matchesSearch;
        });
    }

    // Apply filtering and refresh DOM
    function applyFilterAndRender() {
        const filtered = filterDishes();
        countBadge.textContent = 'Показано: ' + filtered.length + ' из ' + HITS_CATALOG.length;

        renderDishesList(
            filtered,
            cardsRow,
            selectedDishId,
            function onDishSelect(id) {
                selectedDishId = id;
                const foundDish = HITS_CATALOG.find(function (d) { return d.id === id; });
                renderInteractivePreview(foundDish, previewContainer);
                applyFilterAndRender();
            },
            function onResetFilter() {
                currentCategory = 'all';
                searchQuery = '';
                searchInput.value = '';
                updateFilterButtons();
                applyFilterAndRender();
            }
        );
    }

    // Search input event
    searchInput.addEventListener('input', function () {
        searchQuery = searchInput.value;
        applyFilterAndRender();
    });

    resetSearchBtn.addEventListener('click', function () {
        searchQuery = '';
        searchInput.value = '';
        applyFilterAndRender();
    });

    // Initial render of featured dish of the day banner
    selectFeaturedDishOfTheDay(HITS_CATALOG, hitsSection);

    // Initial render of default selected preview
    const initialDish = HITS_CATALOG.find(function (d) { return d.id === selectedDishId; });
    renderInteractivePreview(initialDish, previewContainer);

    // Initial catalog render
    applyFilterAndRender();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    initIndexHitsSection();
});
