function openModal(modalSelector, modalTimerId) {
	const modal = document.querySelector(modalSelector);

	modal.classList.add('show');
	modal.classList.remove('hide');
	document.body.style.overflow = 'hidden';

	console.log(modalTimerId);
	if(modalTimerId) {
		clearInterval(modalTimerId);
	}
	
}

/* закрытие мод.окна */
function closeModalWindow(modalSelector) {
	const modal = document.querySelector(modalSelector);

	modal.classList.add('hide');
	modal.classList.remove('show');
	document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {
	/* модальное окно */

	const modalTrigger = document.querySelectorAll(triggerSelector),
				modal = document.querySelector(modalSelector);
	
	/* открытие модального окна */
	modalTrigger.forEach(item => {
			item.addEventListener('click', () => openModal(modalSelector, modalTimerId));
		});	

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModalWindow(modalSelector);
		}
	});

	/* закрытие мод. окна по нажатию Esc */
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show') ) {
			closeModalWindow(modalSelector);
		}
	});

	/* открытие мод. окна при скролле страницы до конца */
	function showModalScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal(modalSelector, modalTimerId);
			window.removeEventListener('scroll', showModalScroll);
		}
	}
	window.addEventListener('scroll', showModalScroll);
}

export default modal;
export {closeModalWindow};
export {openModal};