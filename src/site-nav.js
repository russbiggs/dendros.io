class SiteNav {
  constructor() {
    this.isOpen = false;
    this.siteNav = document.querySelector('.js-site-nav');
    this.openBtn = document.querySelector('.js-btn-site-select');
    this.closeBtn = document.querySelector('.js-btn-site-close');

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.addEventListeners();

  }

  addEventListeners() {
    this.openBtn.addEventListener('click', this.open);
    this.closeBtn.addEventListener('click', this.close);
  }

  open() {
    this.siteNav.classList.add('site-nav--visible');
  }

  close() {
    this.siteNav.classList.remove('site-nav--visible');
  }
}

export default SiteNav;