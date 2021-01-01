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