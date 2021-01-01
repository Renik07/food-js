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