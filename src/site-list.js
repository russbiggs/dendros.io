import { del, get, keys } from 'idb-keyval';

class SiteList {
  constructor(dataStore, siteObserver, sampleObserver) {
    this.dataStore = dataStore;
    this.siteObserver = siteObserver;
    this.sampleObserver = sampleObserver;
    this.list = document.querySelector('.site-list');
    this.deleteBtn = document.querySelector('.btn-delete-db');

    this.update = this.update.bind(this);
    this.deleteSite = this.deleteSite.bind(this);
    this.deleteData = this.deleteData.bind(this);

    this.addEventListeners();
  }


  addEventListeners() {
    this.deleteBtn.addEventListener('click', this.deleteData);
  }

  deleteSite(key) {
    const confirmDialog = confirm(`Are you sure you want to delete ${key}?`);
    if (confirmDialog == true) {
      del(key, this.dataStore).then(() => {
        this.update();
        keys(this.dataStore).then((keys) => {
          if (keys.length > 0) {
            get(keys[0], this.dataStore).then((data) => {
              this.siteObserver.notify(data);
            });
            const promises = [];
            for (const key of keys) {
              const site = get(key, this.dataStore);
              promises.push(site);
            }
            Promise.all(promises).then((sites) => {
              this.siteObserver.data = sites[0];
              this.update(sites);
              this.sampleObserver.notify(sites[0].samples[0].measurements);
            });
          } else {
            this.siteObserver.notify({});
            this.sampleObserver.notify([]);
            this.update();
          }
        });
      });
    }
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
      const deleteBtn = document.createElement('div');
      const icon = document.createElement('i');
      icon.setAttribute('data-feather', 'delete');
      deleteBtn.classList.add('site-delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteSite(site.metadata.siteId);
      })
      deleteBtn.appendChild(icon);
      const text = document.createTextNode(`${site.metadata.siteName} ${site.metadata.firstYear}-${site.metadata.lastYear}`);
      elem.appendChild(text);
      elem.appendChild(deleteBtn);
      elem.addEventListener('click', () => {
        const active = document.querySelector('.site-list__item--active');
        active.classList.remove('site-list__item--active');
        elem.classList.add('site-list__item--active');
        const same = this.siteObserver.notify(site);
        if (!same) {
          const sample = site.samples[0];
          this.sampleObserver.notify(sample.measurements);
        }
      })
      frag.appendChild(elem);
    }
    if (sites.length) {
      this.sampleObserver.notify(sites[0].samples[0].measurements);
    }
    this.list.appendChild(frag);
    const siteList = document.querySelector('.site-list');
    if (siteList.firstChild) {
      siteList.firstChild.classList.add('site-list__item--active');
    }
    feather.replace();
  }
}

export default SiteList;