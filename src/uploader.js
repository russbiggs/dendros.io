
import { get, keys, set } from 'idb-keyval';
import rwl from 'rwl';


class Uploader {
  constructor(dataStore, observer, siteList, data) {
    this.timeout;
    this.dataStore = dataStore;
    this.observer = observer;
    this.siteList = siteList;
    this.data = data;
    this.form = document.querySelector('.js-upload-form');
    this.fileAddBtn = document.querySelector('.js-upload-form__add');
    this.fileInput = document.querySelector('.js-upload-form__file-input');
    this.statusElem = document.querySelector('.js-upload-form__status');
    this.formSubmit = this.formSubmit.bind(this);
    this.update = this.update.bind(this);
    this.addFile = this.addFile.bind(this);
    this.fileChange = this.fileChange.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    this.form.addEventListener('submit', this.formSubmit);
    this.fileInput.addEventListener('change', this.fileChange);
    this.fileAddBtn.addEventListener('click', this.addFile);
  }

  update(data) {
    if (Object.keys(data).length > 0 && data.constructor === Object) {
      this.data = true;
    } else {
      this.data = false;
    }
  }

  addFile() {
    this.fileInput.click();
  }

  fileChange() {
    this.form.dispatchEvent(new Event('submit'));
  }

  formSubmit(e) {
    console.log("submit")
    clearTimeout(this.timeout);
    e.preventDefault();
    const file = document.querySelector('.js-upload-form__file-input').files[0];
    if (file.name.slice(-3) != 'rwl') {
      this.statusElem.innerHTML = 'file must have .rwl file extension';
      this.statusElem.classList.add('upload-form__status--visible');
      this.statusElem.classList.add('upload-form__status--failure');
      return false;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const rwlData = rwl(text);
      const rwlJSON = JSON.parse(rwlData)
      const siteId = rwlJSON.metadata.siteId;
      set(siteId, rwlJSON, this.dataStore).then(() => {
        this.statusElem.innerHTML = `${siteId} added`;
        this.statusElem.classList.add('upload-form__status--visible');
        this.statusElem.classList.add('upload-form__status--success');
        this.timeout = setTimeout(() => {
          this.statusElem.classList.remove('upload-form__status--visible');
        }, 3000)
        if (!this.data) {
          this.observer.notify(rwlJSON);
          this.data = true;
        }
        keys(this.dataStore).then((keys) => {
          if (keys.length > 0) {
            const promises = [];
            for (const key of keys) {
              const site = get(key, this.dataStore);
              promises.push(site);
            }
            Promise.all(promises).then((sites) => {
              this.siteList.update(sites);
            });
          }
        });
      });
    }
    reader.readAsText(file);
    return false;
  }
}

export default Uploader;