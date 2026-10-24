/**
 * Frau Muller Resto-Pub - Menu Page Script (menu.html)
 * Assignment 4-5: Interactive Dish Stepper, Live Search & Cart Order Calculator
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
        for (const key in this.items) {
            if (Object.prototype.hasOwnProperty.call(this.items, key)) {
                total += this.items[key].price * this.items[key].qty;
            }
        }
        return total;
    },

    getTotalCount() {
        let count = 0;
        for (const key in this.items) {
            if (Object.prototype.hasOwnProperty.call(this.items, key)) {
                count += this.items[key].qty;
            }
        }
        return count;
    }
};

/**
 * Format currency helper
 */
function formatKztCurrency(amount) {
    return amount.toLocaleString('ru-RU') + ' ₸';
}

/**
 * Parse price string e.g. "8 500 ₸" -> 8500
 */
function parsePrice(text) {
    const cleaned = text.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
}

/**
 * Enhances all tables in menu with interactive quantity steppers
 */
function initMenuTableSteppers() {
    MenuCart.load();

    const tables = document.querySelectorAll('table.table');

    tables.forEach(function (table) {
        // Add header column for "Заказ"
        const headerRow = table.querySelector('thead tr');
        if (headerRow && !headerRow.querySelector('.th-order-col')) {
            const th = document.createElement('th');
            th.className = 'th-order-col text-end pe-4';
            th.scope = 'col';
            th.textContent = 'Заказ';
            headerRow.appendChild(th);
        }

        // Add quantity stepper to each body row
        const bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach(function (row) {
            if (row.querySelector('.td-order-col')) {
                return;
            }

            const titleEl = row.querySelector('th[scope="row"]');
            const priceEl = row.querySelector('td.fw-bold');
            const imgEl = row.querySelector('img');

            if (!titleEl || !priceEl) {
                return;
            }

            const dishName = titleEl.textContent.trim();
            const price = parsePrice(priceEl.textContent);
            const imgSrc = imgEl ? imgEl.getAttribute('src') : '';

            row.setAttribute('data-dish-name', dishName.toLowerCase());
            const descEl = row.querySelector('td.text-muted');
            if (descEl) {
                row.setAttribute('data-dish-desc', descEl.textContent.toLowerCase());
            }

            const tdOrder = document.createElement('td');
            tdOrder.className = 'td-order-col text-end pe-4 text-nowrap';

            const stepperContainer = document.createElement('div');
            stepperContainer.className = 'd-inline-flex align-items-center justify-content-end gap-1';

            const minusBtn = document.createElement('button');
            minusBtn.type = 'button';
            minusBtn.className = 'btn btn-sm btn-outline-secondary px-2 py-0';
            minusBtn.textContent = '−';
            minusBtn.title = 'Уменьшить количество';

            const qtySpan = document.createElement('span');
            qtySpan.className = 'fw-bold px-2 item-qty-display';
            qtySpan.textContent = MenuCart.items[dishName] ? MenuCart.items[dishName].qty : '0';

            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.className = 'btn btn-sm btn-outline-danger px-2 py-0';
            plusBtn.textContent = '+';
            plusBtn.title = 'Добавить в заказ';

            stepperContainer.appendChild(minusBtn);
            stepperContainer.appendChild(qtySpan);
            stepperContainer.appendChild(plusBtn);
            tdOrder.appendChild(stepperContainer);
            row.appendChild(tdOrder);

            plusBtn.addEventListener('click', function () {
                MenuCart.addItem(dishName, price, imgSrc);
                qtySpan.textContent = MenuCart.items[dishName].qty;
                updateCartBarUI();
            });

            minusBtn.addEventListener('click', function () {
                MenuCart.removeItem(dishName);
                qtySpan.textContent = MenuCart.items[dishName] ? MenuCart.items[dishName].qty : '0';
                updateCartBarUI();
            });
        });
    });
}

/**
 * Updates floating cart bar UI and values
 */
function updateCartBarUI() {
    const cartBar = document.getElementById('menu-cart-bar');
    const totalPriceEl = document.getElementById('cart-total-price');
    const totalItemsEl = document.getElementById('cart-total-items');

    if (!cartBar) {
        return;
    }

    const totalCount = MenuCart.getTotalCount();
    const totalPrice = MenuCart.getTotalPrice();

    if (totalCount > 0) {
        cartBar.classList.remove('d-none');
        cartBar.classList.add('d-block');
        if (totalPriceEl) {
            totalPriceEl.textContent = formatKztCurrency(totalPrice);
        }
        if (totalItemsEl) {
            totalItemsEl.textContent = 'Выбрано позиций: ' + totalCount;
        }
    } else {
        cartBar.classList.remove('d-block');
        cartBar.classList.add('d-none');
    }
}

/**
 * Initializes Menu Search Bar
 */
function initMenuSearch() {
    const searchInput = document.getElementById('menu-search-input');
    const clearBtn = document.getElementById('menu-search-clear');
    const resultsInfo = document.getElementById('search-results-info');

    if (!searchInput) {
        return;
    }

    function doSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const rows = document.querySelectorAll('tbody tr[data-dish-name]');
        let matchCount = 0;

        rows.forEach(function (row) {
            const name = row.getAttribute('data-dish-name') || '';
            const desc = row.getAttribute('data-dish-desc') || '';

            if (query === '' || name.includes(query) || desc.includes(query)) {
                row.classList.remove('d-none');
                matchCount++;
            } else {
                row.classList.add('d-none');
            }
        });

        // Hide empty sections
        const sections = document.querySelectorAll('section.card');
        sections.forEach(function (sec) {
            const visibleRows = sec.querySelectorAll('tbody tr:not(.d-none)');
            if (visibleRows.length === 0 && query !== '') {
                sec.classList.add('d-none');
            } else {
                sec.classList.remove('d-none');
            }
        });

        // Update info text
        if (resultsInfo) {
            if (query !== '') {
                resultsInfo.classList.remove('d-none');
                resultsInfo.textContent = 'Найдено позиций: ' + matchCount;
            } else {
                resultsInfo.classList.add('d-none');
            }
        }
    }

    searchInput.addEventListener('input', doSearch);

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            searchInput.value = '';
            doSearch();
            searchInput.focus();
        });
    }
}

/**
 * Initializes Cart Modal and Checkout Navigation
 */
function initCartModalAndCheckout() {
    const viewDetailsBtn = document.getElementById('cart-view-details-btn');
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    const modalCheckoutBtn = document.getElementById('cart-modal-checkout-btn');
    const clearAllBtn = document.getElementById('cart-clear-all-btn');
    const modalItemsContainer = document.getElementById('cart-modal-items');
    const modalTotalEl = document.getElementById('cart-modal-total');

    function renderModalItems() {
        if (!modalItemsContainer) {
            return;
        }
        modalItemsContainer.textContent = '';

        const items = MenuCart.items;
        const keys = Object.keys(items);

        if (keys.length === 0) {
            const emptyP = document.createElement('p');
            emptyP.className = 'text-muted text-center py-3 mb-0';
            emptyP.textContent = 'Ваша корзина пуста. Добавьте блюда из меню.';
            modalItemsContainer.appendChild(emptyP);
            if (modalTotalEl) {
                modalTotalEl.textContent = '0 ₸';
            }
            return;
        }

        keys.forEach(function (dishName) {
            const item = items[dishName];
            const line = document.createElement('div');
            line.className = 'd-flex justify-content-between align-items-center p-2 border rounded bg-light';

            const leftDiv = document.createElement('div');
            const nameEl = document.createElement('strong');
            nameEl.className = 'd-block';
            nameEl.textContent = item.name;

            const priceEl = document.createElement('small');
            priceEl.className = 'text-muted';
            priceEl.textContent = formatKztCurrency(item.price) + ' × ' + item.qty + ' шт = ' + formatKztCurrency(item.price * item.qty);

            leftDiv.appendChild(nameEl);
            leftDiv.appendChild(priceEl);

            const rightDiv = document.createElement('div');
            rightDiv.className = 'd-flex align-items-center gap-1';

            const minus = document.createElement('button');
            minus.type = 'button';
            minus.className = 'btn btn-sm btn-outline-secondary py-0 px-2';
            minus.textContent = '−';

            const countSpan = document.createElement('span');
            countSpan.className = 'px-2 fw-bold';
            countSpan.textContent = item.qty;

            const plus = document.createElement('button');
            plus.type = 'button';
            plus.className = 'btn btn-sm btn-outline-danger py-0 px-2';
            plus.textContent = '+';

            rightDiv.appendChild(minus);
            rightDiv.appendChild(countSpan);
            rightDiv.appendChild(plus);

            line.appendChild(leftDiv);
            line.appendChild(rightDiv);
            modalItemsContainer.appendChild(line);

            plus.addEventListener('click', function () {
                MenuCart.addItem(item.name, item.price, item.image);
                renderModalItems();
                updateAllTableQtyDisplays();
                updateCartBarUI();
            });

            minus.addEventListener('click', function () {
                MenuCart.removeItem(item.name);
                renderModalItems();
                updateAllTableQtyDisplays();
                updateCartBarUI();
            });
        });

        if (modalTotalEl) {
            modalTotalEl.textContent = formatKztCurrency(MenuCart.getTotalPrice());
        }
    }

    function updateAllTableQtyDisplays() {
        const rows = document.querySelectorAll('tbody tr[data-dish-name]');
        rows.forEach(function (row) {
            const titleEl = row.querySelector('th[scope="row"]');
            const qtyDisplay = row.querySelector('.item-qty-display');
            if (titleEl && qtyDisplay) {
                const dishName = titleEl.textContent.trim();
                qtyDisplay.textContent = MenuCart.items[dishName] ? MenuCart.items[dishName].qty : '0';
            }
        });
    }

    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function () {
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

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    if (modalCheckoutBtn) {
        modalCheckoutBtn.addEventListener('click', proceedToCheckout);
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function () {
            MenuCart.clear();
            renderModalItems();
            updateAllTableQtyDisplays();
            updateCartBarUI();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initMenuTableSteppers();
    initMenuSearch();
    initCartModalAndCheckout();
    updateCartBarUI();
});
