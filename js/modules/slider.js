function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {

	const slider = document.querySelector(container),
				btnPrev = document.querySelector(prevArrow),
				btnNext = document.querySelector(nextArrow),
				slides = document.querySelectorAll(slide),
				currentNumber = document.getElementById(currentCounter),
				totalNumber = document.getElementById(totalCounter),
				slidesWrapper = document.querySelector(wrapper),
				slidesField = document.querySelector(field),
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

export default slider;