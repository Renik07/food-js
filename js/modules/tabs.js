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