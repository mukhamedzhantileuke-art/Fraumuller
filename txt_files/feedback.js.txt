/**
 * Frau Muller Resto-Pub — Customer Feedback Script (feedback.html)
 * Student: Alan Baiguzhinov (SE-2531)
 * Assignment 6: jQuery Migration (Selectors, Traversal, Effects, Form Validation, Delegation)
 * 
 * jQuery Version: 3.7.1
 * Why $(document).ready() is needed:
 * Ensures the review card container (#reviews-container), filter pills, and review submission
 * form are fully constructed before binding sorting handlers and calculating initial ratings.
 */

'use strict';

/**
 * Initializes review filters, sorting controls, and dynamic submission using jQuery
 */
function initFeedbackInteractivity() {
    const $reviewsContainer = $('#reviews-container');
    const $starFiltersContainer = $('#star-filters');
    const $sortDateBtn = $('#sort-date');
    const $sortRatingBtn = $('#sort-rating');
    const $sortUsefulnessBtn = $('#sort-usefulness');
    const $feedbackForm = $('#feedback-form');
    const $feedbackMessageContainer = $('#feedback-message-container');

    if (!$reviewsContainer.length) {
        return;
    }

    let activeFilter = 'all';
    let currentSort = 'date';
    let sortDirection = 'desc';

    // 1. Star Filters using jQuery traversal and $(this)
    if ($starFiltersContainer.length) {
        const $filterButtons = $starFiltersContainer.find('.filter-btn');

        $filterButtons.css('cursor', 'pointer');
        $filterButtons.on('click', function () {
            activeFilter = $(this).attr('data-filter') || 'all';

            $filterButtons.removeClass('active-filter text-dark border-bottom border-2 border-dark pb-1')
                          .addClass('text-muted');

            $(this).removeClass('text-muted')
                   .addClass('active-filter text-dark border-bottom border-2 border-dark pb-1');

            applyFiltersAndSort();
        });
    }

    // 2. Sorting Controls
    function updateSortButtonsUI($activeBtn, labelText) {
        $.each([$sortDateBtn, $sortRatingBtn, $sortUsefulnessBtn], function (idx, $btn) {
            if ($btn && $btn.length) {
                $btn.removeClass('text-dark fw-bold border-bottom border-dark')
                    .addClass('text-muted');
            }
        });

        if ($activeBtn && $activeBtn.length) {
            const arrow = sortDirection === 'desc' ? ' ↓' : ' ↑';
            $activeBtn.removeClass('text-muted')
                      .addClass('text-dark fw-bold border-bottom border-dark')
                      .text(labelText + arrow);
        }
    }

    if ($sortDateBtn.length) {
        $sortDateBtn.on('click', function () {
            if (currentSort === 'date') {
                sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
            } else {
                currentSort = 'date';
                sortDirection = 'desc';
            }
            updateSortButtonsUI($sortDateBtn, 'Дате');
            applyFiltersAndSort();
        });
    }

    if ($sortRatingBtn.length) {
        $sortRatingBtn.on('click', function () {
            if (currentSort === 'rating') {
                sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
            } else {
                currentSort = 'rating';
                sortDirection = 'desc';
            }
            updateSortButtonsUI($sortRatingBtn, 'Рейтингу');
            applyFiltersAndSort();
        });
    }

    if ($sortUsefulnessBtn.length) {
        $sortUsefulnessBtn.on('click', function () {
            if (currentSort === 'usefulness') {
                sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
            } else {
                currentSort = 'usefulness';
                sortDirection = 'desc';
            }
            updateSortButtonsUI($sortUsefulnessBtn, 'Полезности');
            applyFiltersAndSort();
        });
    }

    /**
     * Reorders and toggles visibility of review cards based on active filter and sort state
     */
    function applyFiltersAndSort() {
        const $cards = $reviewsContainer.find('.review-card').toArray();
        let visibleCount = 0;

        // Sort cards
        $cards.sort(function (a, b) {
            const $a = $(a);
            const $b = $(b);

            if (currentSort === 'date') {
                const dateA = $a.attr('data-date') || '2026-01-01';
                const dateB = $b.attr('data-date') || '2026-01-01';
                return sortDirection === 'desc' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
            }

            let valA = 0;
            let valB = 0;
            if (currentSort === 'rating') {
                valA = parseInt($a.attr('data-rating') || '0', 10);
                valB = parseInt($b.attr('data-rating') || '0', 10);
            } else if (currentSort === 'usefulness') {
                valA = parseInt($a.attr('data-usefulness') || '0', 10);
                valB = parseInt($b.attr('data-usefulness') || '0', 10);
            }

            return sortDirection === 'desc' ? valB - valA : valA - valB;
        });

        // Filter cards and re-append in sorted order
        $.each($cards, function (idx, card) {
            const $card = $(card);
            const cardRating = $card.attr('data-rating');
            const isMatch = activeFilter === 'all' || cardRating === activeFilter;

            if (isMatch) {
                $card.removeClass('d-none');
                visibleCount++;
            } else {
                $card.addClass('d-none');
            }

            $reviewsContainer.append($card);
        });

        // Empty state check
        let $emptyMsg = $reviewsContainer.find('#empty-reviews-alert');
        if (visibleCount === 0) {
            if (!$emptyMsg.length) {
                $emptyMsg = $('<div>', {
                    id: 'empty-reviews-alert',
                    class: 'alert alert-info text-center py-4 my-3',
                    text: 'Отзывов с такой оценкой пока нет. Вы можете стать первым!'
                });
                $reviewsContainer.append($emptyMsg);
            }
        } else if ($emptyMsg.length) {
            $emptyMsg.remove();
        }
    }

    /**
     * Helper to show field error in feedback form
     * @param {jQuery} $input - Target input
     * @param {string} msg - Error message
     */
    function showFeedbackFieldError($input, msg) {
        $input.removeClass('is-invalid');
        $input.siblings('.invalid-feedback').remove();

        $input.addClass('is-invalid');
        const $fb = $('<div>', {
            class: 'invalid-feedback d-block small mt-1',
            text: msg
        }).hide();
        $input.parent().append($fb);
        $fb.fadeIn(200);
    }

    function clearFeedbackFieldError($input) {
        $input.removeClass('is-invalid');
        $input.siblings('.invalid-feedback').fadeOut(150, function () {
            $(this).remove();
        });
    }

    // 3. New Review Submission
    if ($feedbackForm.length) {
        const $ratingInput = $('#feedback-rating');
        const $prosInput = $('#feedback-pros');
        const $consInput = $('#feedback-cons');
        const $commentInput = $('#feedback-comment');

        // Clear errors in real-time
        $ratingInput.on('change', function () { clearFeedbackFieldError($(this)); });
        $commentInput.on('input', function () { clearFeedbackFieldError($(this)); });

        $feedbackForm.on('submit', function (event) {
            /*
             * event.preventDefault() comment:
             * Prevents page reload so the new review card can be appended dynamically.
             * Without preventDefault(): The browser would submit via HTTP POST and refresh,
             * clearing input and not displaying the newly added review.
             */
            event.preventDefault();

            const ratingVal = parseInt($ratingInput.val(), 10);
            const prosVal = $.trim($prosInput.val());
            const consVal = $.trim($consInput.val());
            const commentVal = $.trim($commentInput.val());

            let hasErrors = false;

            if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
                showFeedbackFieldError($ratingInput, 'Пожалуйста, выберите оценку от 1 до 5 звезд.');
                hasErrors = true;
                $ratingInput.focus();
            } else {
                clearFeedbackFieldError($ratingInput);
            }

            if (commentVal.length < 5) {
                showFeedbackFieldError($commentInput, 'Комментарий должен содержать не менее 5 символов.');
                if (!hasErrors) {
                    $commentInput.focus();
                }
                hasErrors = true;
            } else {
                clearFeedbackFieldError($commentInput);
            }

            if (hasErrors) {
                return;
            }

            /*
             * COMMENT ON CLIENT VS SERVER VALIDATION:
             * Even though the client validates comment length and star rating,
             * the server must sanitize text against XSS, prevent spam submissions,
             * and check authorization before saving reviews to a database.
             */
            const now = new Date();
            const dayStr = String(now.getDate()).padStart(2, '0');
            const monthStr = String(now.getMonth() + 1).padStart(2, '0');
            const yearStr = now.getFullYear();
            const formattedDate = dayStr + '.' + monthStr + '.' + yearStr;
            const isoDate = yearStr + '-' + monthStr + '-' + dayStr;

            let starsStr = '';
            for (let i = 0; i < 5; i++) {
                starsStr += i < ratingVal ? '★ ' : '☆ ';
            }

            // Create new review card safely using jQuery
            const $newCard = $('<div>', {
                class: 'card border-0 shadow-sm rounded-0 mb-3 review-card border-top border-success border-3',
                'data-rating': String(ratingVal),
                'data-date': isoDate,
                'data-usefulness': '1'
            }).hide();

            const $cardBody = $('<div>', { class: 'card-body' });
            const $headerRow = $('<div>', { class: 'd-flex justify-content-between align-items-center mb-3' });

            const $userLeft = $('<div>', { class: 'd-flex align-items-center' });
            const $avatar = $('<div>', {
                class: 'bg-success rounded-circle d-flex justify-content-center align-items-center text-white me-3',
                css: { width: '40px', height: '40px' },
                text: 'Г'
            });

            const $userMeta = $('<div>');
            $('<span>', { class: 'fw-bold me-2', text: 'Гость сайта' }).appendTo($userMeta);
            $('<span>', { class: 'text-danger me-2', text: starsStr.trim() }).appendTo($userMeta);
            $('<span>', { class: 'text-muted small', text: ' ' + formattedDate }).appendTo($userMeta);

            $userLeft.append($avatar).append($userMeta);
            const $badge = $('<span>', { class: 'badge bg-success small', text: 'Новый отзыв' });
            $headerRow.append($userLeft).append($badge);
            $cardBody.append($headerRow);

            if (prosVal || consVal) {
                const $table = $('<table>', { class: 'table table-borderless table-sm mb-3' });
                const $tbody = $('<tbody>');

                if (prosVal) {
                    $('<tr>').append($('<td>', { class: 'fw-bold text-success', css: { width: '120px' }, text: 'Достоинства' }))
                             .append($('<td>', { class: 'text-success', text: prosVal }))
                             .appendTo($tbody);
                }
                if (consVal) {
                    $('<tr>').append($('<td>', { class: 'fw-bold text-danger', css: { width: '120px' }, text: 'Недостатки' }))
                             .append($('<td>', { class: 'text-danger', text: consVal }))
                             .appendTo($tbody);
                }
                $table.append($tbody);
                $cardBody.append($table);
            }

            $cardBody.append($('<p>', { class: 'fw-bold mb-1', text: 'Комментарий:' }))
                     .append($('<p>', { class: 'text-muted small mb-0', text: commentVal }));

            $newCard.append($cardBody);

            // Prepend new card to container
            $reviewsContainer.prepend($newCard);

            // Effect: slideDown with duration (400ms) and callback
            $newCard.slideDown(400, function () {
                $(this).addClass('border-success');
            });

            // Show success feedback
            if ($feedbackMessageContainer.length) {
                $feedbackMessageContainer.empty();
                const $alert = $('<div>', {
                    class: 'alert alert-success py-2 small',
                    text: 'Спасибо за ваш отзыв! Он успешно добавлен и отображается в списке.'
                }).hide();
                $feedbackMessageContainer.append($alert);
                $alert.fadeIn(300);
            }

            $feedbackForm.trigger('reset');
            applyFiltersAndSort();
        });
    }
}

// Global initialization inside $(document).ready()
$(document).ready(function () {
    initFeedbackInteractivity();
});
