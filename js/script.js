window.addEventListener('DOMContentLoaded', () => {
	/* tabs */
	const tabs = document.querySelectorAll('.tabheader__item'),
				tabsParent = document.querySelector('.tabheader__items');
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

	/* const modalTimerId = setTimeout(openModal, 10000); */

	/* открытие мод. окна при скролле страницы до конца */
	function showModalScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalScroll);
		}
	}
	window.addEventListener('scroll', showModalScroll);

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
			/* условие добавление класса по умолчанию */
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				elem.classList.add(this.element);
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
		/* алгоритм избегания ошибок */
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

	/* slider */

	const btnPrev = document.querySelector('.offer__slider-prev'),
				btnNext = document.querySelector('.offer__slider-next'),
				slides = document.querySelectorAll('.offer__slide'),
				currentNumber = document.getElementById('current'),
				totalNumber = document.getElementById('total');
	let currentIndex = 0;
			
	showSlides(currentIndex);
	
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
	});

});