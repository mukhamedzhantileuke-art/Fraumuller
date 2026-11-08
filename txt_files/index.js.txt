/**
 * Frau Muller Resto-Pub — Main Page Script (index.html)
 * Student: Tileuke Mukhamedzhan (SE-2531)
 * Assignment 6: jQuery Migration (Selectors, Traversal, Effects, Delegation)
 * 
 * jQuery Version: 3.7.1
 * Why $(document).ready() is needed:
 * Ensures the DOM hierarchy is fully constructed before searching for <h2> headings,
 * inserting the dynamic controls, and attaching delegated event handlers.
 */

'use strict';

/**
 * Array of dish objects representing Frau Muller culinary hits
 * 7 dish objects with complete project data
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
 * REWRITTEN FEATURE 1 (Assignment 6 comparison):
 * Dynamic Dish Catalog Rendering & Selection from Array
 * 
 * Comparison Comment:
 * Replaced: document.createElement, appendChild, classList.add, textContent, and direct element.addEventListener
 * With jQuery: $('<div>'), .append(), .addClass(), .text(), and delegated .on('click', '.card-dish-item')
 * Verdict: The jQuery version is substantially shorter, more declarative, and eliminates dozens of verbose
 * DOM creation calls. Delegating events via .on() completely solves the re-render listener lifecycle issue.
 * 
 * @param {Object} dish - Dish data object
 * @param {boolean} isSelected - Whether dish is currently active
 * @returns {jQuery} Column container with card
 */
function createDishCard(dish, isSelected) {
    const borderClass = isSelected
        ? 'border-danger border-3 shadow'
        : 'border-0 border-top border-danger border-3 shadow-sm';

    const $col = $('<div>', { class: 'col-12 col-md-6' });

    const $card = $('<div>', {
        class: 'card h-100 bg-white card-dish-item ' + borderClass,
        'data-dish-id': dish.id,
        css: { cursor: 'pointer' }
    });

    const $cardBody = $('<div>', { class: 'card-body d-flex flex-column justify-content-between' });

    // Top block: Badge & Title
    const $topDiv = $('<div>');
    const $badgeSpan = $('<span>', {
        class: 'badge mb-2 ' + dish.badgeClass,
        text: dish.badge
    });
    const $titleH4 = $('<h4>', {
        class: 'card-title h5 fw-bold mb-2',
        text: dish.name
    });
    const $descP = $('<p>', {
        class: 'card-text text-muted small mb-3',
        text: dish.description
    });
    $topDiv.append($badgeSpan).append($titleH4).append($descP);

    // Bottom block: Price and Details button
    const $bottomDiv = $('<div>', {
        class: 'd-flex align-items-center justify-content-between pt-2 border-top'
    });
    const $priceSpan = $('<span>', {
        class: 'fw-bold text-danger fs-6',
        text: formatCurrency(dish.price)
    });
    const $actionBtn = $('<button>', {
        type: 'button',
        class: isSelected ? 'btn btn-sm btn-danger btn-dish-action' : 'btn btn-sm btn-outline-danger btn-dish-action',
        text: isSelected ? 'Выбрано' : 'Подробнее'
    });
    $bottomDiv.append($priceSpan).append($actionBtn);

    $cardBody.append($topDiv).append($bottomDiv);
    $card.append($cardBody);
    $col.append($card);

    return $col;
}

/**
 * Renders list of dish cards into target container from an array
 * Build at least one list/set of cards from an array with .append() or .appendTo()
 * @param {Array} dishes - List of dishes to display
 * @param {jQuery} $container - Grid container
 * @param {string|null} selectedDishId - Currently selected dish ID
 * @param {Function} onResetFilterCallback - Reset handler for empty state
 */
function renderDishesList(dishes, $container, selectedDishId, onResetFilterCallback) {
    $container.empty();

    if (dishes.length === 0) {
        const $emptyCol = $('<div>', { class: 'col-12' });
        const $emptyCard = $('<div>', { class: 'card p-4 text-center border-dashed bg-light' });
        const $emptyText = $('<p>', { class: 'text-muted mb-3 fs-6', text: 'По заданным критериям блюд не найдено.' });
        const $resetBtn = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-danger btn-sm mx-auto',
            text: 'Сбросить фильтр'
        }).on('click', onResetFilterCallback);

        $emptyCard.append($emptyText).append($resetBtn);
        $emptyCol.append($emptyCard);
        $container.append($emptyCol);
        return;
    }

    // Build set of cards from array using jQuery .each() and .appendTo()
    $.each(dishes, function (index, dish) {
        const isSelected = dish.id === selectedDishId;
        const $cardCol = createDishCard(dish, isSelected);
        $cardCol.appendTo($container);
    });
}

/**
 * Renders the interactive enlarged preview card of the selected dish
 * Uses jQuery .slideDown() effect with duration and callback
 * @param {Object} dish - Selected dish data
 * @param {jQuery} $container - Preview target container
 */
function renderInteractivePreview(dish, $container) {
    $container.empty();

    if (!dish) {
        return;
    }

    const $previewCard = $('<div>', {
        class: 'card border-danger border-2 shadow-sm p-3 mb-4 bg-light'
    }).hide(); // Hidden initially for smooth jQuery slideDown effect

    const $header = $('<div>', { class: 'd-flex justify-content-between align-items-center mb-2' });
    const $titleBadge = $('<span>', { class: 'badge bg-danger', text: 'Интерактивный просмотр блюда' });
    const $prepSpan = $('<span>', { class: 'badge bg-secondary', text: '⏱ Время приготовления: ' + dish.prepTime });
    $header.append($titleBadge).append($prepSpan);

    const $bodyDiv = $('<div>', { class: 'row g-3 align-items-center' });

    const $infoCol = $('<div>', { class: 'col-12 col-md-8' });
    const $dishHeading = $('<h3>', { class: 'h5 fw-bold text-dark mb-1', text: dish.name });
    const $dishDesc = $('<p>', { class: 'text-muted small mb-2', text: dish.description });
    const $compositionP = $('<p>', { class: 'small mb-2' })
        .append($('<strong>', { text: 'Состав: ' }))
        .append(document.createTextNode(dish.composition));
    const $metaP = $('<p>', { class: 'small text-secondary mb-0', text: 'Энергетическая ценность: ' + dish.calories + ' ккал' });

    $infoCol.append($dishHeading).append($dishDesc).append($compositionP).append($metaP);

    const $actionCol = $('<div>', { class: 'col-12 col-md-4 text-md-end' });
    const $priceHeading = $('<div>', { class: 'fs-4 fw-bold text-danger mb-2', text: formatCurrency(dish.price) });
    const $orderLink = $('<a>', {
        href: 'reservation.html?dish=' + encodeURIComponent(dish.name),
        class: 'btn btn-danger w-100 shadow-sm',
        text: 'Забронировать столик'
    });
    $actionCol.append($priceHeading).append($orderLink);

    $bodyDiv.append($infoCol).append($actionCol);
    $previewCard.append($header).append($bodyDiv);
    $container.append($previewCard);

    // jQuery effect with duration (350ms) and completion callback
    $previewCard.slideDown(350, function () {
        // Callback after animation completes
        $(this).attr('aria-live', 'polite');
    });
}

/**
 * Selects a random dish using Math.random() and renders a featured promo banner with 15% discount
 * Uses jQuery fadeIn effect with duration
 * @param {Array} dishes - Catalog of dishes
 * @param {jQuery} $targetSection - Parent container
 */
function selectFeaturedDishOfTheDay(dishes, $targetSection) {
    if (!dishes || dishes.length === 0) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * dishes.length);
    const featuredDish = dishes[randomIndex];
    const discountPercent = 15;
    const discountedPrice = calculateDiscountPrice(featuredDish.price, discountPercent);

    const $bannerCard = $('<div>', {
        class: 'card border-warning border-2 shadow-sm mb-4 bg-light'
    }).hide();

    const $bannerBody = $('<div>', {
        class: 'card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3'
    });

    const $textDiv = $('<div>');
    const $promoBadge = $('<span>', {
        class: 'badge bg-warning text-dark mb-2',
        text: '🔥 Спецпредложение дня — скидка ' + discountPercent + '%!'
    });
    const $titleH4 = $('<h4>', { class: 'h5 fw-bold text-dark mb-1', text: featuredDish.name });
    const $descP = $('<p>', {
        class: 'text-muted small mb-0',
        text: 'Шеф-повар рекомендует сегодня: ' + featuredDish.description
    });
    $textDiv.append($promoBadge).append($titleH4).append($descP);

    const $priceDiv = $('<div>', { class: 'text-md-end text-nowrap' });
    const $oldPriceDel = $('<del>', {
        class: 'text-muted small d-block',
        text: formatCurrency(featuredDish.price)
    });
    const $newPriceSpan = $('<span>', {
        class: 'fs-5 fw-bold text-danger d-block mb-2',
        text: formatCurrency(discountedPrice)
    });
    const $bookBtn = $('<a>', {
        href: 'reservation.html?promo=' + encodeURIComponent(featuredDish.name),
        class: 'btn btn-sm btn-outline-danger',
        text: 'Попробовать со скидкой'
    });
    $priceDiv.append($oldPriceDel).append($newPriceSpan).append($bookBtn);

    $bannerBody.append($textDiv).append($priceDiv);
    $bannerCard.append($bannerBody);

    $targetSection.prepend($bannerCard);

    // Fade in effect
    $bannerCard.fadeIn(400);
}

/**
 * Initializes the interactive Hits section on index.html using jQuery
 */
function initIndexHitsSection() {
    // Find the section containing "Наши хиты" heading using jQuery :contains filter
    const $hitsHeading = $("h2:contains('Наши хиты')").first();
    if (!$hitsHeading.length) {
        return;
    }

    const $hitsSection = $hitsHeading.closest('section');
    const $cardsRow = $hitsSection.find('.row.g-3:first');
    if (!$cardsRow.length) {
        return;
    }

    // Dynamic state
    let currentCategory = 'all';
    let searchQuery = '';
    let selectedDishId = HITS_CATALOG[0].id;

    // Create interactive preview container
    const $previewContainer = $('<div>', { id: 'dish-interactive-preview' });
    $previewContainer.insertBefore($cardsRow);

    // Create Controls Container (Category Filters, Search, Counter)
    const $controlsContainer = $('<div>', { class: 'mb-3 d-flex flex-column gap-3' });

    // 1. Search Box with attribute selector and jQuery .val()
    const $searchWrapper = $('<div>', { class: 'input-group' });
    const $searchInput = $('<input>', {
        type: 'text',
        class: 'form-control',
        placeholder: 'Поиск по названию или ингредиентам...',
        'aria-label': 'Поиск по блюдам'
    });
    const $resetSearchBtn = $('<button>', {
        type: 'button',
        class: 'btn btn-outline-secondary',
        text: 'Очистить'
    });
    $searchWrapper.append($searchInput).append($resetSearchBtn);

    // 2. Category filter buttons and counter
    const $buttonsRow = $('<div>', { class: 'd-flex flex-wrap align-items-center justify-content-between gap-2' });
    const $buttonsGroup = $('<div>', { class: 'btn-group flex-wrap', role: 'group' });

    const categories = [
        { key: 'all', label: 'Все блюда' },
        { key: 'meat', label: 'Мясо и гриль' },
        { key: 'dessert', label: 'Десерты' },
        { key: 'snack', label: 'Закуски' }
    ];

    const $categoryButtons = {};

    $.each(categories, function (idx, cat) {
        const count = cat.key === 'all'
            ? HITS_CATALOG.length
            : $.grep(HITS_CATALOG, function (d) { return d.category === cat.key; }).length;

        const $btn = $('<button>', {
            type: 'button',
            class: cat.key === 'all' ? 'btn btn-sm btn-danger filter-btn' : 'btn btn-sm btn-outline-danger filter-btn',
            'data-filter': cat.key,
            text: cat.label + ' (' + count + ')'
        });

        // Event handler using $(this)
        $btn.on('click', function () {
            currentCategory = $(this).attr('data-filter');
            updateFilterButtons();
            applyFilterAndRender();
        });

        $buttonsGroup.append($btn);
        $categoryButtons[cat.key] = $btn;
    });

    const $countBadge = $('<span>', {
        class: 'badge bg-light text-dark border p-2',
        text: 'Показано: ' + HITS_CATALOG.length
    });

    $buttonsRow.append($buttonsGroup).append($countBadge);
    $controlsContainer.append($searchWrapper).append($buttonsRow);
    $controlsContainer.insertBefore($previewContainer);

    // Update active style of filter buttons using jQuery traversal and classes
    function updateFilterButtons() {
        $.each(categories, function (idx, cat) {
            const $btn = $categoryButtons[cat.key];
            if (cat.key === currentCategory) {
                $btn.removeClass('btn-outline-danger').addClass('btn-danger');
            } else {
                $btn.removeClass('btn-danger').addClass('btn-outline-danger');
            }
        });
    }

    // Filter dishes based on category and search query
    function filterDishes() {
        return $.grep(HITS_CATALOG, function (dish) {
            const matchesCat = currentCategory === 'all' || dish.category === currentCategory;
            const query = $.trim($searchInput.val()).toLowerCase();
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
        $countBadge.text('Показано: ' + filtered.length + ' из ' + HITS_CATALOG.length);

        renderDishesList(
            filtered,
            $cardsRow,
            selectedDishId,
            function onResetFilter() {
                currentCategory = 'all';
                $searchInput.val('');
                updateFilterButtons();
                applyFilterAndRender();
            }
        );
    }

    /**
     * ATTACH DELEGATED EVENT HANDLER (Mandatory Requirement):
     * Bound to persistent parent container $cardsRow, reacting to .card-dish-item elements created later.
     * 
     * WHY BINDING DIRECTLY TO .card-dish-item WOULD NOT WORK:
     * Direct binding ($('.card-dish-item').on('click', ...)) evaluates the selector once at execution time
     * and binds event listeners only to elements currently in the DOM. Whenever the visitor filters categories
     * or searches, renderDishesList() clears the container with .empty() and creates brand-new card DOM elements.
     * Those newly created cards were not present when direct listeners were bound, so they would be completely dead
     * to clicks.
     * By using delegation ($cardsRow.on('click', '.card-dish-item', handler)), the listener stays attached
     * to the static ancestor ($cardsRow). When a card is clicked, the click event bubbles up to $cardsRow,
     * which checks if the originating element matches '.card-dish-item' and executes the handler.
     */
    $cardsRow.on('click', '.card-dish-item', function (event) {
        /*
         * event.preventDefault() comment:
         * Prevents any default browser jump if inner elements were anchor tags.
         */
        event.preventDefault();

        const dishId = $(this).attr('data-dish-id');
        selectedDishId = dishId;

        /*
         * REQUIRED CHAIN 2 OF 3+ METHODS:
         * Link 1: $(this).closest('.card') -> reaches the clicked dish card
         * Link 2: .find('.card-title') -> searches inside card for title element
         * Link 3: .addClass('text-danger') -> highlights title with theme danger color
         */
        $(this).closest('.card').find('.card-title').addClass('text-danger');

        const foundDish = $.grep(HITS_CATALOG, function (d) { return d.id === dishId; })[0];
        renderInteractivePreview(foundDish, $previewContainer);
        applyFilterAndRender();
    });

    // Search input event using jQuery .on('input')
    $searchInput.on('input', function () {
        applyFilterAndRender();
    });

    $resetSearchBtn.on('click', function () {
        $searchInput.val('');
        applyFilterAndRender();
    });

    // Initial render of featured dish of the day banner
    selectFeaturedDishOfTheDay(HITS_CATALOG, $hitsSection);

    // Initial render of default selected preview
    const initialDish = $.grep(HITS_CATALOG, function (d) { return d.id === selectedDishId; })[0];
    renderInteractivePreview(initialDish, $previewContainer);

    // Initial catalog render
    applyFilterAndRender();
}

// Initialize on document ready
$(function () {
    initIndexHitsSection();
});
