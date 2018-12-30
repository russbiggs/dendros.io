class SiteList {
  constructor(siteName, observer) {
    this.observer = observer;
    this.list = document.querySelector('.site-list');
    this.update = this.update.bind(this);
  }

  update(data) {
    const sites = data || {};
    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }
    const frag = document.createDocumentFragment();
    for (const site of sites) {
      const elem = document.createElement('li');
      elem.classList.add('site-list__item');
      elem.innerHTML = site.metadata.siteName;
      elem.addEventListener('click', () => {
        this.observer.notify(site);
      })
      frag.appendChild(elem);
    }
    this.list.appendChild(frag);
  }
}

export default SiteList;