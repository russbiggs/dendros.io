class SiteList {
  constructor(siteObserver, sampleObserver) {
    this.siteObserver = siteObserver;
    this.sampleObserver = sampleObserver;
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
      elem.innerHTML = `${site.metadata.siteName} ${site.metadata.firstYear}-${site.metadata.lastYear}`;
      elem.addEventListener('click', () => {
        const previousActive = document.querySelector('.site-list__item--active');
        previousActive.classList.remove('site-list__item--active');
        elem.classList.add('site-list__item--active');
        this.siteObserver.notify(site);
        const sample = site.samples[0];
        this.sampleObserver.notify(sample.measurements);
      })
      frag.appendChild(elem);
    }
    this.list.appendChild(frag);
    document.querySelector('.site-list').firstChild.classList.add('site-list__item--active');

  }
}

export default SiteList;