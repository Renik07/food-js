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