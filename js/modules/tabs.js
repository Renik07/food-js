function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
	const tabs = document.querySelectorAll(tabsSelector),
				tabsParent = document.querySelector(tabsParentSelector),
				tabsContent = document.querySelectorAll(tabsContentSelector);

	/* 1) Скрытие ненужных табов */			
	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});
		/* убираем класс активности */
		tabs.forEach(item => {
			item.classList.remove(activeClass);
		});
	}
	/* 2) Функция показа табов */
	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add(activeClass);
	}
	hideTabContent();
	showTabContent();

	/* 3) Делегирование событий и назначения обработчика событий */
	tabsParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains(tabsSelector.slice(1))) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});
}

export default tabs;