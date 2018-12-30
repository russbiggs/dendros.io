


class Modal {
  constructor() {
    this.modal = document.querySelector('.js-modal');
    this.background = document.querySelector('.js-modal__background');
    this.title = document.querySelector('.modal-title');
    this.body = document.querySelector('.js-modal__body');
    this.uploadBtn = document.querySelector('.js-btn-upload')
    this.closeBtn = document.querySelector('.js-modal-close-btn');
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    this.closeBtn.addEventListener('click', this.close);
    this.uploadBtn.addEventListener('click', () => this.open('Upload a new .rwl file'));
  }


  open(text) {
    this.title.innerHTML = text;
    this.modal.classList.add('modal--visible')
    this.background.classList.add('modal__background--visible');
    this.body.classList.add('modal__body--visible');
  }

  close() {
    this.modal.classList.remove('modal--visible')
    this.background.classList.remove('modal__background--visible');
    this.body.classList.remove('modal__body--visible');
  }
}

export default Modal;