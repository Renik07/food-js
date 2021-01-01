/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calculator.js":
/*!**********************************!*\
  !*** ./js/modules/calculator.js ***!
  \**********************************/
/***/ ((module) => {

function calculator() {
	/* calculator */
	const result = document.querySelector('.calculating__result span');

	let sex, ratio,	height, weight, age;

	/* добавление значений по умолчании при наличии их в ЛС */
	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio');
	} else {
		ratio = 1.375;
		localStorage.setItem('ratio', ratio);
	}

	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem('sex');
	} else {
		sex = 'female';
		localStorage.setItem('sex', sex);
	}
	
	/* проверка данных с ЛС и добавление класса активности */
	function initLocalSettings(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach(elem => {
			elem.classList.remove(activeClass);
			if (elem.getAttribute('id') === localStorage.getItem('sex')) {
				elem.classList.add(activeClass);
			}
			if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
				elem.classList.add(activeClass);
			}
		});
	}
	initLocalSettings('#gender div', 'calculating__choose-item_active');
	initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

	function calcTotal() {
		if (!height || !weight || !age) {
			result.textContent = '???';
			return;
		}

		if (sex === 'female') {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}
	calcTotal();

	function getStaticInfo(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach(elem => {
			elem.addEventListener('click', (event) => {
				event.target
				if (event.target.getAttribute('data-ratio')) {
					ratio = +event.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', ratio);
				} else {
					sex = event.target.getAttribute('id');
					localStorage.setItem('sex', sex);
				}
	
				elements.forEach(element => {
					element.classList.remove(activeClass);
				});
				event.target.classList.add(activeClass);
	
				calcTotal();
			});
		});
	}

	getStaticInfo('#gender div', 'calculating__choose-item_active');
	getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

	/* функция обработки каждого отдельного input */
	function getDynamicInfo(selector) {
		const input = document.querySelector(selector);

		input.addEventListener('input', () => {
			/* подсвечиваем input, если ввели не число */
			if (input.value.match(/\D/g)) {
				input.style.backgroundColor = 'pink';
			} else {
				input.style.backgroundColor = 'white';
			}

			switch(input.getAttribute('id')) {
				case 'height':
					height = +input.value;
					break;
				case 'weight':
					weight = +input.value;
					break;
				case 'age':
					age = +input.value;
					break;
			}
			
			calcTotal();
		});
	}
	getDynamicInfo('#height');
	getDynamicInfo('#weight');
	getDynamicInfo('#age');
}

module.exports = calculator;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
	/* использование классов для карточек меню */
	class MenuCard {
		constructor(src, altText, subtitle, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.altText = altText;
			this.subtitle = subtitle;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 75;
			this.convertСurrency();
		}
		convertСurrency() {
			this.price = this.price * this.transfer;
		}
		render() {
			const elem = document.createElement('div');
			// условие добавление класса по умолчанию
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				elem.classList.add(this.classes);
			} else {
				this.classes.forEach(className => elem.classList.add(className));
			}
			
			elem.innerHTML = `
				
					<img src=${this.src} alt=${this.altText}>
					<h3 class="menu__item-subtitle">${this.subtitle}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
							<div class="menu__item-cost">Цена:</div>
							<div class="menu__item-total"><span>${this.price}</span> руб/день</div>
					</div>
				
			`;
			this.parent.append(elem);
		}
	}

	const getResource = async (url) => {
		const result = await fetch(url);
		// алгоритм избегания ошибок
		if (!result.ok) {
			throw new Error(`Could not fetch ${url}, status: ${result.status}`);
		}
		return await result.json();
	};

	/* getResource('http://localhost:3000/menu')
		.then(data => {
			data.forEach(({img, altimg, title, descr, price}) => {
				new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
			});
		}); */

	getResource('http://localhost:3000/menu')
		.then(data => createCard(data));
	
	function createCard(data) {
		// деструктуризация объекта на отдельные свойства
		data.forEach(({img, altimg, title, descr, price}) => {
			const element = document.createElement('div'),
						convertPrice = price * 75;

			element.classList.add('menu__item');
			element.innerHTML = `

				<img src=${img} alt=${altimg}>
				<h3 class="menu__item-subtitle">${title}</h3>
				<div class="menu__item-descr">${descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${convertPrice}</span> руб/день</div>
				</div>

			`;

			document.querySelector('.menu .container').append(element);
		});
	}
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
	/* Forms */

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с Вами свяжемся',
		failure: 'Что-то пошло не так'
	};

	forms.forEach(item => {
		bindPostData(item);
	});
	/* async - внутри функции будет асинхронный код */
	const postData = async (url, data) => {
		const result = await fetch(url, {
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});

		return await result.json();
	};

	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			let statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;

			form.insertAdjacentElement('afterend', statusMessage);
        
			const formData = new FormData(form);

			/* Берем formData c данными с формы, превращаем в массив массивов(entries),
			после превращаем в классический объект(Object.fromEntries),
			после превращаем в JSON */
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
			.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
			}).catch(() => {
					showThanksModal(message.failure);
			}).finally(() => {
					form.reset();
			});

		});
	}
	/* модальное окно после отправки данных */
	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');

		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div data-close class="modal__close">&times;</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModalWindow();
		}, 4000);
	}
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
	/* модальное окно */

	const modalTrigger = document.querySelectorAll('[data-modal]'),
				modal = document.querySelector('.modal');
	
	/* открытие модального окна */
	modalTrigger.forEach(item => {
			item.addEventListener('click', openModal);
		});	

	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId);
	}
	
	/* закрытие мод.окна */
	function closeModalWindow() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModalWindow();
		}
	});

	/* закрытие мод. окна по нажатию Esc */
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show') ) {
			closeModalWindow();
		}
	});

	const modalTimerId = setTimeout(openModal, 10000);

	/* открытие мод. окна при скролле страницы до конца */
	function showModalScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalScroll);
		}
	}
	window.addEventListener('scroll', showModalScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
	/* slider */

	const slider = document.querySelector('.offer__slider'),
				btnPrev = document.querySelector('.offer__slider-prev'),
				btnNext = document.querySelector('.offer__slider-next'),
				slides = document.querySelectorAll('.offer__slide'),
				currentNumber = document.getElementById('current'),
				totalNumber = document.getElementById('total'),
				slidesWrapper = document.querySelector('.offer__slider-wrapper'),
				slidesField = document.querySelector('.offer__slider-inner'),
				widthWrapper = window.getComputedStyle(slidesWrapper).width;
	let currentIndex = 1,
			offset = 0;

	totalNumber.textContent = slides.length;

	if (slides.length > 9) {
		totalNumber.textContent = slides.length;
		currentNumber.textContent = currentIndex;
	} else {
		totalNumber.textContent = `0${slides.length}`;
		currentNumber.textContent = `0${currentIndex}`;
	}

	/* навигация слайдера */
	slider.style.position = 'relative';
	const dots = document.createElement('ol'),
				dotsArray = [];
	dots.classList.add('carousel-indicators');
	slider.append(dots);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		/* каждой точке устанавливаем дата-атрибут и нумерацию */
		dot.setAttribute('data-slide-to', i + 1)
		dot.classList.add('dot');
		dots.append(dot);

		if (i == 0) {
			dot.classList.add('active');
		}
		dotsArray.push(dot);
	}

	/* ширина внутренней обертки для слайдов */
	slidesField.style.width = 100 * slides.length + '%';
	/* для каждого отдельного слайда задаем одинаковую ширину = ширину внешней обертки */
	slides.forEach(slide => {
		slide.style.width = widthWrapper;
	});

	btnNext.addEventListener('click', () => {
		/* deleteNotDigits(widthWrapper) регулярное выражение - удаляем "px" */
		if (offset == deleteNotDigits(widthWrapper) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += deleteNotDigits(widthWrapper);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (currentIndex == slides.length) {
			currentIndex = 1;
		} else {
			currentIndex++;
		}

		changeNumber();
		addClass();
	});

	btnPrev.addEventListener('click', () => {
		if (offset == 0) {
			offset = deleteNotDigits(widthWrapper) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(widthWrapper);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (currentIndex == 1) {
			currentIndex = slides.length;
		} else {
			currentIndex--;
		}

		changeNumber();
		addClass();
	});

	/* перебираем массив и на каждую точку вешаем событие клик */
	dotsArray.forEach(dot => {
		dot.addEventListener('click', (event) => {
			const slideTo = event.target.getAttribute('data-slide-to');
			/* перемещаем слайды при нажатии на точки */
			currentIndex = slideTo;
			offset = deleteNotDigits(widthWrapper) * (slideTo - 1);
			slidesField.style.transform = `translateX(-${offset}px)`;

			addClass();
			changeNumber();
		})
	});
	/* добавляем/удаляем класс активности */
	function addClass() {
		dotsArray.forEach(dot => {
			dot.classList.remove('active');
			dotsArray[currentIndex - 1].classList.add('active');
		});
	}
	/* изменяем нумерацию слайдов */
	function changeNumber() {
		if (slides.length > 9) {
			currentNumber.textContent = currentIndex;
		} else {
			currentNumber.textContent = `0${currentIndex}`;
		}
	}
	/* удаляем все что не цифры и заменяем на '' */
	function deleteNotDigits(str) {
		return +str.replace(/\D/g, '');
	}

	/* второй, более простой вариант слайдера */
	/* showSlides(currentIndex);
	
	if (slides.length < 10) {
			totalNumber.textContent = `0${slides.length}`;
		}

	function showSlides(i) {
		currentIndex = i;
		if (i >= slides.length) {
			currentIndex = 0;
		}
		if (i < 0) {
			currentIndex = slides.length - 1;
		}
		slides.forEach(item => {
			item.classList.add('hide');
		});
		slides[currentIndex].classList.add('show', 'fade');
		slides[currentIndex].classList.remove('hide');

		currentNumber.textContent = currentIndex + 1;
		if (currentNumber.textContent < 10) {
			currentNumber.textContent = `0${currentIndex + 1}`;
		}
	}

	btnNext.addEventListener('click', () => {
		currentIndex++;
		showSlides(currentIndex);
	});
	btnPrev.addEventListener('click', () => {
		currentIndex--;
		showSlides(currentIndex);
	}); */
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
	const tabs = document.querySelectorAll('.tabheader__item'),
				tabsParent = document.querySelector('.tabheader__items'),
				tabsContent = document.querySelectorAll('.tabcontent');

	/* 1) Скрытие ненужных табов */			
	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});
		/* убираем класс активности */
		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}
	/* 2) Функция показа табов */
	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}
	hideTabContent();
	showTabContent();

	/* 3) Делегирование событий и назначения обработчика событий */
	tabsParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
	/* timer */
	const deadline = '2021-09-01';

	/* функция разницы между временем */
	function getTimeRemaning(endtime) {
		const x = Date.parse(endtime) - Date.parse(new Date()),
					days = Math.floor(x / (1000 * 60 * 60 * 24)),
					hours = Math.floor((x / (1000 * 60 * 60) % 24)),
					minutes = Math.floor((x / (1000 * 60) % 60)),
					seconds = Math.floor(x / (1000) % 60);

		return {
			'total': x,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	/* добавляем ноль, если от 0 до 9 */
	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}
	/* функция установки таймера на страницу */
	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
					days = timer.querySelector('#days'),
					hours = timer.querySelector('#hours'),
					minutes = timer.querySelector('#minutes'),
					seconds = timer.querySelector('#seconds'),
					timeInterval = setInterval(updateClock, 1000);
		updateClock();
		/* функция обновления таймера каждую секунду */
		function updateClock() {
			/* расчет времени, который остался на данную секунду */
			const x = getTimeRemaning(endtime);

			/* устанавливаем расчетные величины на страницу */
			days.innerHTML = getZero(x.days);
			hours.innerHTML = getZero(x.hours);
			minutes.innerHTML = getZero(x.minutes);
			seconds.innerHTML = getZero(x.seconds);

			/* останавливаем таймер по окончании времени */
			if (x.total <= 0 ) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {
	
	const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
				modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
				cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
				calc = __webpack_require__(/*! ./modules/calculator */ "./js/modules/calculator.js"),
				forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
				slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
				timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");

	tabs();
	modal();
	cards();
	calc();
	forms();
	slider();
	timer();

});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map