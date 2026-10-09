# Frau Muller Resto-Pub — Midterm Web Project

## 1. Project Overview & Physical Location
* **Course:** Introduction to Web Technologies
* **Theme:** Frau Muller Resto-Pub (Ресто-паб Frau Muller)
* **Real Physical Location:** г. Астана, ул. Темирбека Жургенова, 18/1 (Аллея Мынжылдык)
* **Phone:** +7 (702) 672-40-66 / +7 (701) 234-56-78
* **Opening Hours:** Ежедневно с 12:00 до 02:00
* **Instagram:** [@fraumullerkz](https://www.instagram.com/fraumullerkz/)
* **Live GitHub Repository:** [https://github.com/mukhamedzhantileuke-art/Fraumuller](https://github.com/mukhamedzhantileuke-art/Fraumuller)

---

## 2. Team Members & Page Allocation

| Team Member | Assigned Pages | Stylesheet | Responsibilities |
|---|---|---|---|
| **Tileuke Mukhamedzhan** | `index.html`, `about.html`, `reservation.html` | `css/tileuke.css` | Landing page, history, table booking form with confirmation container, layout alignment. |
| **Alan Baiguzhinov** | `menu.html`, `contacts.html`, `feedback.html` | `css/alan.css` | Menu dishes & drinks, contacts & business hours, customer feedback with collapse form. |
| **Nurmuhammadjon Abdurahmonov** | `order.html`, `colophon.html` | `css/nurmuhammadjon.css` | Online food delivery checkout, Colophon technical specifications, project CSS optimization. |

* **Shared Stylesheet:** `css/base.css` (Shared palette, serif headings, and JavaScript state classes).

---

## 3. Three User Journeys (End-to-End Walkthroughs)

Every journey described below can be performed completely and independently by a single visitor using their screen, with no dead ends, no `href="#"`, and with clear completion:

### 🚶 Journey 1: "Найти адрес, режим работы и забронировать столик на вечер"
1. **Start:** Посетитель заходит на главную страницу (`index.html`), видит информацию о заведении и баннер.
2. **Шаг 1:** В блоке «Отзыв шеф-повара» нажимает кнопку **«Забронировать стол»** или переходит через навигацию на страницу `reservation.html`.
3. **Шаг 2:** Ознакамливается с предупреждением (Bootstrap Alert) о подтверждении броней в пиковые часы.
4. **Шаг 3:** Заполняет форму бронирования: вводит имя, телефон, дату, время, количество гостей, выбирает зал (Основной / Терраса) и повод визита.
5. **End:** Нажимает кнопку **«Забронировать»** (`#booking-form`). Форма отправляется, и для JavaScript уже подготовлен контейнер `#booking-confirmation` для вывода подтверждения номера брони. При необходимости точного адреса нажимает в меню **«Контакты»** (`contacts.html`), где видит адрес «ул. Темирбека Жургенова, 18/1», телефон и схему работы с 12:00 до 02:00.

### 🚶 Journey 2: "Выбрать горячие блюда в меню и оформить доставку на дом"
1. **Start:** Посетитель открывает страницу `menu.html` через единую навигацию сайта.
2. **Шаг 1:** Просматривает раздел «Горячие блюда и Гриль» (`#hot`), изучает цены (Стейк Рибай 8 500 ₸, Баварские колбаски 3 200 ₸, Пицца Пепперони 3 500 ₸).
3. **Шаг 2:** Нажимает кнопку **«Заказать с доставкой →»**, которая напрямую переводит его на страницу доставки `order.html`.
4. **Шаг 3:** Изучает условия доставки по Астане (время 45–60 мин, бесплатная доставка от 7 000 ₸, 4 шага выполнения заказа).
5. **Шаг 4:** В форме оформления доставки выбирает основное блюдо (`#dishSelect`), количество порций, вводит контактные данные, дату и адрес доставки, выбирает способ оплаты (Kaspi QR / карта курьеру / наличные).
6. **End:** Нажимает кнопку **«Оформить доставку»** (`#order-form`). Данные фиксируются, и подготовленный блок `#order-confirmation` готов принять статус заказа от скрипта.

### 🚶 Journey 3: "Изучить отзывы гостей и оставить собственное впечатление"
1. **Start:** Посетитель переходит на страницу отзывов `feedback.html`.
2. **Шаг 1:** Видит агрегированный рейтинг заведения (5/5 на основе 16 оценок, прогресс-бары оценок) и реальные отзывы гостей с фотографиями блюд и интерьера.
3. **Шаг 2:** Нажимает кнопку **«✎ Оставить свой отзыв»**, открывающую интерактивную форму отзыва через нативный Bootstrap Collapse (`#reviewFormCollapse`).
4. **Шаг 3:** Выставляет оценку от 1 до 5, указывает достоинства, недостатки и пишет комментарий в поле с валидацией `required`.
5. **End:** Нажимает кнопку **«Отправить отзыв»** в фирменном цвете `btn-danger`. Форма завершает сценарий, а контейнер `#review-confirmation` готов отобразить благодарность за отзыв.

---

## 4. JavaScript Readiness (Freeze State)

Перед заморозкой структуры HTML/CSS подготовлены все необходимые хуки для JavaScript:
1. **Уникальные английские ID:**
   * Формы: `#booking-form`, `#order-form`, `#feedback-form`
   * Поля ввода: `#fullName`, `#phoneNumber`, `#resDate`, `#resTime`, `#guestCount`, `#zone`, `#dishSelect`, `#portionsCount`, `#clientName`, `#clientPhone`, `#clientEmail`, `#deliveryDate`, `#deliveryAddress`, `#review-rating`, `#review-pros`, `#review-cons`, `#review-comment`
2. **Контейнеры подтверждения и вывода результатов:**
   * `#booking-confirmation` (на `reservation.html`)
   * `#order-confirmation` (на `order.html`)
   * `#review-confirmation` (на `feedback.html`)
   * `#reviews-list` (якорный блок списка отзывов)
3. **CSS-классы состояний в `css/base.css`:**
   * `.hidden` — скрытие элементов (`display: none !important`)
   * `.selected` — подсветка выбранных карточек / строк
   * `.field-error`, `.is-invalid-custom` — подсветка ошибок валидации
   * `.field-success`, `.is-valid-custom` — подсветка корректных полей
   * `.feedback-success`, `.feedback-error` — информационные плашки для вывода сообщений JS

---

## 5. Site Consistency & Standards Applied
* **Единая навигация:** Все 8 страниц содержат одинаковый `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">` с 8 ссылками (`Главная`, `Меню`, `Контакты`, `Отзывы`, `Доставка`, `Бронь столов`, `О нас`, `О проекте`), активная ссылка подсвечена золотым цветом (`.nav-link.active`).
* **Единая палитра:** Тёмное дерево (`rgba(43, 30, 22, 1)`), пергамент (`#F5F2EB`), фирменный DarkRed (`DarkRed` / `#6e0000`), благородное золото (`#D4AF37`).
* **Единая шапка и футер:** Тёмный `header.container-fluid` и `footer.container-fluid` с единым копирайтом «Frau Muller © 2026».
* **Отсутствие мертвых ссылок:** Все ссылки ведут на реальные страницы или существующие якорные секции, ссылки `href="#"` полностью устранены.
* **Семантическая разметка:** `<main>`, `<header>`, `<footer>`, `<nav>`, `<article>`, `<section>`, `<aside>`, `<figure>`, `<figcaption>`, `<address>`, `<table>` с `<caption>`, `<thead>`, `<tbody>`, `<th scope="col/row">`, `<fieldset>` с `<legend>`.
* **Zero Horizontal Scrollbar:** Протестировано при ширине экрана 375px — отсутствие горизонтального скролла.

---

## 6. Quality Pass Findings & Fixes Log

Во время проверки проекта перед финальной заморозкой Midterm были выявлены и устранены следующие недочёты:
1. **`contacts.html`:** Исправлена опечатка в классе `container-fliud` → `container-fluid`, исправлен несуществующий класс `text-while` → `text-white`, удален инлайн-стиль, закрыты незакрытые теги `<ul>` и `<div>`, добавлен семантический тег `<address>`.
2. **`menu.html`:** Исправлен дублирующийся ID раздела (`id="hot"` во втором блоке заменен на `id="snacks"`), унифицирована навигация (добавлена ссылка «О проекте», стандартизировано название «Доставка»), добавлена прямая ссылка на заказ, добавлен `<caption>` в таблицы.
3. **`feedback.html`:** Устранены пустые заглушки `href="#"` в блоке сортировки (заменены на якорь `#reviews-list`), синяя кнопка `btn-primary` переведена в фирменный цвет `btn-danger`, добавлены `for` и `id` атрибуты к элементам формы отзыва, добавлен контейнер `#review-confirmation`.
4. **`reservation.html` & `order.html`:** Добавлены контейнеры `#booking-confirmation` и `#order-confirmation` для отображения результатов отправки форм.
5. **`css/base.css`:** Добавлены служебные классы состояний (`.hidden`, `.selected`, `.field-error`, `.field-success`, `.feedback-success`, `.feedback-error`) для последующей интерактивности на JavaScript.

---

## 7. Git Tag Freeze
* После фиксации всех изменений проект фиксируется Git-тегом: **`midterm`**.
