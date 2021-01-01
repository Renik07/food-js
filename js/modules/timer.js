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