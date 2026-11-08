/**
 * Frau Muller Resto-Pub — Menu Page Script (menu.html)
 * Student: Alan Baiguzhinov (SE-2531)
 * Assignment 6: jQuery Migration (Selectors, Traversal, Effects, Delegation)
 * 
 * jQuery Version: 3.7.1
 * Why $(document).ready() is needed:
 * Ensures all table rows, modals, and input fields are available in the DOM before
 * appending quantity steppers, setting up search listeners, and syncing cart counts.
 */

'use strict';

/**
 * Global Cart State for Menu
 */
const MenuCart = {
    items: {},

    load() {
        try {
            const saved = localStorage.getItem('fraumuller_cart');
            if (saved) {
                this.items = JSON.parse(saved);
            }
        } catch (e) {
            this.items = {};
        }
    },

    save() {
        try {
            localStorage.setItem('fraumuller_cart', JSON.stringify(this.items));
        } catch (e) {
            // LocalStorage fallback
        }
    },

    addItem(name, price, image) {
        if (!this.items[name]) {
            this.items[name] = { name: name, price: price, qty: 1, image: image || '' };
        } else {
            this.items[name].qty += 1;
        }
        this.save();
    },

    removeItem(name) {
        if (this.items[name]) {
            this.items[name].qty -= 1;
            if (this.items[name].qty <= 0) {
                delete this.items[name];
            }
            this.save();
        }
    },

    clear() {
        this.items = {};
        this.save();
    },

    getTotalPrice() {
        let total = 0;
        $.each(this.items, function (key, item) {
            total += item.price * item.qty;
        });
        return total;
    },

    getTotalCount() {
        let count = 0;
        $.each(this.items, function (key, item) {
            count += item.qty;
        });
        return count;
    }
};

/**
 * Format currency helper
 * @param {number} amount - Numeric price
 * @returns {string} Formatted price
 */
function formatKztCurrency(amount) {
    return amount.toLocaleString('ru-RU') + ' ₸';
}

/**
 * Parse price string e.g. "8 500 ₸" -> 8500
 * @param {string} text - Raw price text
 * @returns {number} Numeric price
 */
function parsePrice(text) {
    const cleaned = text.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
}

/**
 * Enhances all tables in menu with interactive quantity steppers using jQuery
 */
function initMenuTableSteppers() {
    MenuCart.load();

    const $tables = $('table.table');

    $tables.each(function () {
        const $table = $(this);

        // Add header column for "Заказ"
        const $headerRow = $table.find('thead tr');
        if ($headerRow.length && !$headerRow.find('.th-order-col').length) {
            $('<th>', {
                class: 'th-order-col text-end pe-4',
                scope: 'col',
                text: 'Заказ'
            }).appendTo($headerRow);
        }

        // Add quantity stepper to each body row using jQuery traversal
        $table.find('tbody tr').each(function () {
            const $row = $(this);
            if ($row.find('.td-order-col').length) {
                return;
            }

            const $titleEl = $row.find('th[scope="row"]');
            const $priceEl = $row.find('td.fw-bold');
            const $imgEl = $row.find('img');

            if (!$titleEl.length || !$priceEl.length) {
                return;
            }

            const dishName = $.trim($titleEl.text());
            const price = parsePrice($priceEl.text());
            const imgSrc = $imgEl.length ? $imgEl.attr('src') : '';

            $row.attr('data-dish-name', dishName.toLowerCase());
            $row.attr('data-raw-name', dishName);
            $row.attr('data-price', price);
            $row.attr('data-img', imgSrc);

            const $descEl = $row.find('td.text-muted');
            if ($descEl.length) {
                $row.attr('data-dish-desc', $.trim($descEl.text()).toLowerCase());
            }

            const $tdOrder = $('<td>', { class: 'td-order-col text-end pe-4 text-nowrap' });
            const $stepperContainer = $('<div>', {
                class: 'd-inline-flex align-items-center justify-content-end gap-1'
            });

            const $minusBtn = $('<button>', {
                type: 'button',
                class: 'btn btn-sm btn-outline-secondary px-2 py-0 btn-stepper-minus',
                text: '−',
                title: 'Уменьшить количество'
            });

            const currentQty = MenuCart.items[dishName] ? MenuCart.items[dishName].qty : '0';
            const $qtySpan = $('<span>', {
                class: 'fw-bold px-2 item-qty-display',
                text: currentQty
            });

            const $plusBtn = $('<button>', {
                type: 'button',
                class: 'btn btn-sm btn-outline-danger px-2 py-0 btn-stepper-plus',
                text: '+',
                title: 'Добавить в заказ'
            });

            $stepperContainer.append($minusBtn).append($qtySpan).append($plusBtn);
            $tdOrder.append($stepperContainer);
            $row.append($tdOrder);
        });
    });

    /**
     * DELEGATED EVENT HANDLER FOR MENU STEPPERS:
     * Bound to table container to intercept stepper clicks from table rows.
     */
    $('table.table').on('click', '.btn-stepper-plus', function (event) {
        event.preventDefault();
        const $row = $(this).closest('tr');
        const dishName = $row.attr('data-raw-name');
        const price = parseInt($row.attr('data-price'), 10);
        const imgSrc = $row.attr('data-img');

        MenuCart.addItem(dishName, price, imgSrc);
        $row.find('.item-qty-display').text(MenuCart.items[dishName].qty);
        updateCartBarUI();
    });

    $('table.table').on('click', '.btn-stepper-minus', function (event) {
        event.preventDefault();
        const $row = $(this).closest('tr');
        const dishName = $row.attr('data-raw-name');

        MenuCart.removeItem(dishName);
        const newQty = MenuCart.items[dishName] ? MenuCart.items[dishName].qty : '0';
        $row.find('.item-qty-display').text(newQty);
        updateCartBarUI();
    });
}

/**
 * Updates floating cart bar UI and values with jQuery fadeIn/fadeOut effects
 */
function updateCartBarUI() {
    const $cartBar = $('#menu-cart-bar');
    const $totalPriceEl = $('#cart-total-price');
    const $totalItemsEl = $('#cart-total-items');

    if (!$cartBar.length) {
        return;
    }

    const totalCount = MenuCart.getTotalCount();
    const totalPrice = MenuCart.getTotalPrice();

    if (totalCount > 0) {
        if (!$cartBar.is(':visible')) {
            $cartBar.removeClass('d-none').hide().fadeIn(300);
        }
        $totalPriceEl.text(formatKztCurrency(totalPrice));
        $totalItemsEl.text('Выбрано позиций: ' + totalCount);
    } else {
        if ($cartBar.is(':visible')) {
            $cartBar.fadeOut(300, function () {
                $(this).addClass('d-none');
            });
        }
    }
}

/**
 * Initializes Menu Search Bar using jQuery traversal and filter :not()
 */
function initMenuSearch() {
    const $searchInput = $('#menu-search-input');
    const $clearBtn = $('#menu-search-clear');
    const $resultsInfo = $('#search-results-info');

    if (!$searchInput.length) {
        return;
    }

    function doSearch() {
        const query = $.trim($searchInput.val()).toLowerCase();
        const $rows = $('tbody tr[data-dish-name]');
        let matchCount = 0;

        $rows.each(function () {
            const $row = $(this);
            const name = $row.attr('data-dish-name') || '';
            const desc = $row.attr('data-dish-desc') || '';

            if (query === '' || name.indexOf(query) !== -1 || desc.indexOf(query) !== -1) {
                $row.removeClass('d-none');
                matchCount++;
            } else {
                $row.addClass('d-none');
            }
        });

        // Hide empty menu sections using :not() filter
        $('section.card').each(function () {
            const $sec = $(this);
            const $visibleRows = $sec.find('tbody tr:not(.d-none)');
            if ($visibleRows.length === 0 && query !== '') {
                $sec.addClass('d-none');
            } else {
                $sec.removeClass('d-none');
            }
        });

        // Update info text
        if ($resultsInfo.length) {
            if (query !== '') {
                $resultsInfo.removeClass('d-none').text('Найдено позиций: ' + matchCount);
            } else {
                $resultsInfo.addClass('d-none');
            }
        }
    }

    $searchInput.on('input', doSearch);

    if ($clearBtn.length) {
        $clearBtn.on('click', function () {
            $searchInput.val('');
            doSearch();
            $searchInput.focus();
        });
    }
}

/**
 * Initializes Cart Modal and Checkout Navigation using jQuery
 */
function initCartModalAndCheckout() {
    const $viewDetailsBtn = $('#cart-view-details-btn');
    const $checkoutBtn = $('#cart-checkout-btn');
    const $modalCheckoutBtn = $('#cart-modal-checkout-btn');
    const $clearAllBtn = $('#cart-clear-all-btn');
    const $modalItemsContainer = $('#cart-modal-items');
    const $modalTotalEl = $('#cart-modal-total');

    function renderModalItems() {
        if (!$modalItemsContainer.length) {
            return;
        }
        $modalItemsContainer.empty();

        const items = MenuCart.items;
        const keys = Object.keys(items);

        if (keys.length === 0) {
            $('<p>', {
                class: 'text-muted text-center py-3 mb-0',
                text: 'Ваша корзина пуста. Добавьте блюда из меню.'
            }).appendTo($modalItemsContainer);

            if ($modalTotalEl.length) {
                $modalTotalEl.text('0 ₸');
            }
            return;
        }

        $.each(keys, function (idx, dishName) {
            const item = items[dishName];
            const $line = $('<div>', {
                class: 'd-flex justify-content-between align-items-center p-2 border rounded bg-light',
                'data-dish-name': dishName
            });

            const $leftDiv = $('<div>');
            $('<strong>', { class: 'd-block', text: item.name }).appendTo($leftDiv);
            $('<small>', {
                class: 'text-muted',
                text: formatKztCurrency(item.price) + ' × ' + item.qty + ' шт = ' + formatKztCurrency(item.price * item.qty)
            }).appendTo($leftDiv);

            const $rightDiv = $('<div>', { class: 'd-flex align-items-center gap-1' });

            const $minus = $('<button>', {
                type: 'button',
                class: 'btn btn-sm btn-outline-secondary py-0 px-2 btn-modal-minus',
                text: '−'
            });

            const $countSpan = $('<span>', { class: 'px-2 fw-bold', text: item.qty });

            const $plus = $('<button>', {
                type: 'button',
                class: 'btn btn-sm btn-outline-danger py-0 px-2 btn-modal-plus',
                text: '+'
            });

            $rightDiv.append($minus).append($countSpan).append($plus);
            $line.append($leftDiv).append($rightDiv);
            $modalItemsContainer.append($line);
        });

        if ($modalTotalEl.length) {
            $modalTotalEl.text(formatKztCurrency(MenuCart.getTotalPrice()));
        }
    }

    // Delegated modal button handlers
    $modalItemsContainer.on('click', '.btn-modal-plus', function () {
        const dishName = $(this).closest('[data-dish-name]').attr('data-dish-name');
        const item = MenuCart.items[dishName];
        if (item) {
            MenuCart.addItem(item.name, item.price, item.image);
            renderModalItems();
            updateAllTableQtyDisplays();
            updateCartBarUI();
        }
    });

    $modalItemsContainer.on('click', '.btn-modal-minus', function () {
        const dishName = $(this).closest('[data-dish-name]').attr('data-dish-name');
        const item = MenuCart.items[dishName];
        if (item) {
            MenuCart.removeItem(item.name);
            renderModalItems();
            updateAllTableQtyDisplays();
            updateCartBarUI();
        }
    });

    function updateAllTableQtyDisplays() {
        $('tbody tr[data-dish-name]').each(function () {
            const $row = $(this);
            const dishName = $row.attr('data-raw-name');
            const $qtyDisplay = $row.find('.item-qty-display');
            if (dishName && $qtyDisplay.length) {
                $qtyDisplay.text(MenuCart.items[dishName] ? MenuCart.items[dishName].qty : '0');
            }
        });
    }

    if ($viewDetailsBtn.length) {
        $viewDetailsBtn.on('click', function () {
            renderModalItems();
            const modalEl = document.getElementById('cartModal');
            if (modalEl && window.bootstrap) {
                const modal = new window.bootstrap.Modal(modalEl);
                modal.show();
            }
        });
    }

    function proceedToCheckout() {
        MenuCart.save();
        window.location.href = 'order.html';
    }

    if ($checkoutBtn.length) {
        $checkoutBtn.on('click', proceedToCheckout);
    }

    if ($modalCheckoutBtn.length) {
        $modalCheckoutBtn.on('click', proceedToCheckout);
    }

    if ($clearAllBtn.length) {
        $clearAllBtn.on('click', function () {
            MenuCart.clear();
            renderModalItems();
            updateAllTableQtyDisplays();
            updateCartBarUI();
        });
    }
}

// Global initialization inside $(document).ready()
$(document).ready(function () {
    initMenuTableSteppers();
    initMenuSearch();
    initCartModalAndCheckout();
    updateCartBarUI();
});
