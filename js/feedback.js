/**
 * Frau Muller Resto-Pub - Customer Feedback Script (feedback.html)
 * Assignment 4-5: Dynamic Review Filtering, Sorting & Submission
 */

'use strict';

/**
 * Initializes review filters, sorting controls, and dynamic submission
 */
function initFeedbackInteractivity() {
    const reviewsContainer = document.getElementById('reviews-container');
    const starFiltersContainer = document.getElementById('star-filters');
    const sortDateBtn = document.getElementById('sort-date');
    const sortRatingBtn = document.getElementById('sort-rating');
    const sortUsefulnessBtn = document.getElementById('sort-usefulness');
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackMessageContainer = document.getElementById('feedback-message-container');

    if (!reviewsContainer) {
        return;
    }

    let activeFilter = 'all';
    let currentSort = 'date';
    let sortDirection = 'desc';

    // 1. Star Filters
    if (starFiltersContainer) {
        const filterButtons = starFiltersContainer.querySelectorAll('.filter-btn');

        filterButtons.forEach(function (btn) {
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', function () {
                activeFilter = btn.getAttribute('data-filter') || 'all';

                filterButtons.forEach(function (b) {
                    b.classList.remove('active-filter', 'text-dark', 'border-bottom', 'border-2', 'border-dark', 'pb-1');
                    b.classList.add('text-muted');
                });

                btn.classList.remove('text-muted');
                btn.classList.add('active-filter', 'text-dark', 'border-bottom', 'border-2', 'border-dark', 'pb-1');

                applyFiltersAndSort();
            });
        });
    }

    // 2. Sorting Controls
    function updateSortButtonsUI(activeBtn, labelText) {
        [sortDateBtn, sortRatingBtn, sortUsefulnessBtn].forEach(function (btn) {
            if (btn) {
                btn.classList.remove('text-dark', 'fw-bold', 'border-bottom', 'border-dark');
                btn.classList.add('text-muted');
            }
        });

        if (activeBtn) {
            activeBtn.classList.remove('text-muted');
            activeBtn.classList.add('text-dark', 'fw-bold', 'border-bottom', 'border-dark');
            const arrow = sortDirection === 'desc' ? ' ↓' : ' ↑';
            activeBtn.textContent = labelText + arrow;
        }
    }

    if (sortDateBtn) {
        sortDateBtn.addEventListener('click', function () {
            if (currentSort === 'date') {
                sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
            } else {
                currentSort = 'date';
                sortDirection = 'desc';
            }
            updateSortButtonsUI(sortDateBtn, 'Дате');
            applyFiltersAndSort();
        });
    }

    if (sortRatingBtn) {
        sortRatingBtn.addEventListener('click', function () {
            if (currentSort === 'rating') {
                sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
            } else {
                currentSort = 'rating';
                sortDirection = 'desc';
            }
            updateSortButtonsUI(sortRatingBtn, 'Рейтингу');
            applyFiltersAndSort();
        });
    }

    if (sortUsefulnessBtn) {
        sortUsefulnessBtn.addEventListener('click', function () {
            if (currentSort === 'usefulness') {
                sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
            } else {
                currentSort = 'usefulness';
                sortDirection = 'desc';
            }
            updateSortButtonsUI(sortUsefulnessBtn, 'Полезности');
            applyFiltersAndSort();
        });
    }

    /**
     * Reorders and toggles visibility of review cards based on active filter and sort state
     */
    function applyFiltersAndSort() {
        const cards = Array.from(reviewsContainer.querySelectorAll('.review-card'));
        let visibleCount = 0;

        // Sort cards
        cards.sort(function (a, b) {
            let valA = 0;
            let valB = 0;

            if (currentSort === 'date') {
                const dateA = a.getAttribute('data-date') || '2026-01-01';
                const dateB = b.getAttribute('data-date') || '2026-01-01';
                return sortDirection === 'desc' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
            }

            if (currentSort === 'rating') {
                valA = parseInt(a.getAttribute('data-rating') || '0', 10);
                valB = parseInt(b.getAttribute('data-rating') || '0', 10);
            } else if (currentSort === 'usefulness') {
                valA = parseInt(a.getAttribute('data-usefulness') || '0', 10);
                valB = parseInt(b.getAttribute('data-usefulness') || '0', 10);
            }

            return sortDirection === 'desc' ? valB - valA : valA - valB;
        });

        // Filter cards and re-append in sorted order
        cards.forEach(function (card) {
            const cardRating = card.getAttribute('data-rating');
            const isMatch = activeFilter === 'all' || cardRating === activeFilter;

            if (isMatch) {
                card.classList.remove('d-none');
                visibleCount++;
            } else {
                card.classList.add('d-none');
            }

            reviewsContainer.appendChild(card);
        });

        // Empty state check
        let emptyMsg = reviewsContainer.querySelector('#empty-reviews-alert');
        if (visibleCount === 0) {
            if (!emptyMsg) {
                emptyMsg = document.createElement('div');
                emptyMsg.id = 'empty-reviews-alert';
                emptyMsg.className = 'alert alert-info text-center py-4 my-3';
                emptyMsg.textContent = 'Отзывов с такой оценкой пока нет. Вы можете стать первым!';
                reviewsContainer.appendChild(emptyMsg);
            }
        } else if (emptyMsg) {
            emptyMsg.remove();
        }
    }

    // 3. New Review Submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const ratingInput = document.getElementById('feedback-rating');
            const prosInput = document.getElementById('feedback-pros');
            const consInput = document.getElementById('feedback-cons');
            const commentInput = document.getElementById('feedback-comment');

            const ratingVal = parseInt(ratingInput.value, 10);
            const prosVal = prosInput.value.trim();
            const consVal = consInput.value.trim();
            const commentVal = commentInput.value.trim();

            if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
                ratingInput.classList.add('is-invalid');
                ratingInput.focus();
                return;
            }
            ratingInput.classList.remove('is-invalid');

            if (commentVal.length < 5) {
                commentInput.classList.add('is-invalid');
                commentInput.focus();
                return;
            }
            commentInput.classList.remove('is-invalid');

            // Format current date: DD.MM.YYYY
            const now = new Date();
            const dayStr = String(now.getDate()).padStart(2, '0');
            const monthStr = String(now.getMonth() + 1).padStart(2, '0');
            const yearStr = now.getFullYear();
            const formattedDate = dayStr + '.' + monthStr + '.' + yearStr;
            const isoDate = yearStr + '-' + monthStr + '-' + dayStr;

            // Generate star string
            let starsStr = '';
            for (let i = 0; i < 5; i++) {
                starsStr += i < ratingVal ? '★ ' : '☆ ';
            }

            // Create new review card safely via DOM
            const newCard = document.createElement('div');
            newCard.className = 'card border-0 shadow-sm rounded-0 mb-3 review-card border-top border-success border-3';
            newCard.setAttribute('data-rating', String(ratingVal));
            newCard.setAttribute('data-date', isoDate);
            newCard.setAttribute('data-usefulness', '1');

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const headerRow = document.createElement('div');
            headerRow.className = 'd-flex justify-content-between align-items-center mb-3';

            const userLeft = document.createElement('div');
            userLeft.className = 'd-flex align-items-center';

            const avatar = document.createElement('div');
            avatar.className = 'bg-success rounded-circle d-flex justify-content-center align-items-center text-white me-3';
            avatar.style.width = '40px';
            avatar.style.height = '40px';
            avatar.textContent = 'Г';

            const userMeta = document.createElement('div');
            const nameSpan = document.createElement('span');
            nameSpan.className = 'fw-bold me-2';
            nameSpan.textContent = 'Гость сайта';

            const starsSpan = document.createElement('span');
            starsSpan.className = 'text-danger me-2';
            starsSpan.textContent = starsStr.trim();

            const dateSpan = document.createElement('span');
            dateSpan.className = 'text-muted small';
            dateSpan.textContent = ' ' + formattedDate;

            userMeta.appendChild(nameSpan);
            userMeta.appendChild(starsSpan);
            userMeta.appendChild(dateSpan);

            userLeft.appendChild(avatar);
            userLeft.appendChild(userMeta);

            const badge = document.createElement('span');
            badge.className = 'badge bg-success small';
            badge.textContent = 'Новый отзыв';

            headerRow.appendChild(userLeft);
            headerRow.appendChild(badge);

            const commentHeading = document.createElement('p');
            commentHeading.className = 'fw-bold mb-1';
            commentHeading.textContent = 'Комментарий:';

            const commentP = document.createElement('p');
            commentP.className = 'text-muted small mb-0';
            commentP.textContent = commentVal;

            cardBody.appendChild(headerRow);

            if (prosVal || consVal) {
                const table = document.createElement('table');
                table.className = 'table table-borderless table-sm mb-3';
                const tbody = document.createElement('tbody');

                if (prosVal) {
                    const trPros = document.createElement('tr');
                    const tdLabel = document.createElement('td');
                    tdLabel.className = 'fw-bold text-success';
                    tdLabel.style.width = '120px';
                    tdLabel.textContent = 'Достоинства';
                    const tdVal = document.createElement('td');
                    tdVal.className = 'text-success';
                    tdVal.textContent = prosVal;
                    trPros.appendChild(tdLabel);
                    trPros.appendChild(tdVal);
                    tbody.appendChild(trPros);
                }

                if (consVal) {
                    const trCons = document.createElement('tr');
                    const tdLabel = document.createElement('td');
                    tdLabel.className = 'fw-bold text-danger';
                    tdLabel.style.width = '120px';
                    tdLabel.textContent = 'Недостатки';
                    const tdVal = document.createElement('td');
                    tdVal.className = 'text-danger';
                    tdVal.textContent = consVal;
                    trCons.appendChild(tdLabel);
                    trCons.appendChild(tdVal);
                    tbody.appendChild(trCons);
                }

                table.appendChild(tbody);
                cardBody.appendChild(table);
            }

            cardBody.appendChild(commentHeading);
            cardBody.appendChild(commentP);
            newCard.appendChild(cardBody);

            // Prepend new card to container
            reviewsContainer.insertBefore(newCard, reviewsContainer.firstChild);

            // Show success feedback
            if (feedbackMessageContainer) {
                feedbackMessageContainer.textContent = '';
                const alert = document.createElement('div');
                alert.className = 'alert alert-success py-2 small';
                alert.textContent = 'Спасибо за ваш отзыв! Он успешно добавлен и отображается в списке.';
                feedbackMessageContainer.appendChild(alert);
            }

            feedbackForm.reset();
            applyFiltersAndSort();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initFeedbackInteractivity();
});
