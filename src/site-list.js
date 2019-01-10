import { del, keys } from 'idb-keyval';

class SiteList {
  constructor(dataStore, siteObserver, sampleObserver) {
    this.dataStore = dataStore;
    this.siteObserver = siteObserver;
    this.sampleObserver = sampleObserver;
    this.list = document.querySelector('.site-list');
    this.deleteBtn = document.querySelector('.btn-delete-db');
    this.update = this.update.bind(this);

    this.deleteData = this.deleteData.bind(this);

    this.addEventListeners();
  }


  addEventListeners() {
    this.deleteBtn.addEventListener('click', this.deleteData);
  }

  deleteData() {
    keys(this.dataStore).then((keys) => {
      const siteCount = keys.length;
      const confirmDialog = confirm(`Are you sure you want to delete all ${siteCount} site(s) from your local DB`);
      if (confirmDialog == true) {
        const promises = [];
        for (const key of keys) {
          const site = del(key, this.dataStore);
          promises.push(site);
        }
        Promise.all(promises).then(() => {
          this.siteObserver.notify({});
          this.sampleObserver.notify([]);
          this.update();
        });
      }
    });
  }

  update(data) {
    const sites = data || [];
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
        const same = this.siteObserver.notify(site);
        if (!same) {
          const sample = site.samples[0];
          this.sampleObserver.notify(sample.measurements);
        }

      })
      frag.appendChild(elem);
    }
    this.list.appendChild(frag);
    const siteList = document.querySelector('.site-list')
    if (siteList.firstChild) {
      siteList.firstChild.classList.add('site-list__item--active');
    }
  }
}

export default SiteList;