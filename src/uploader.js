
import rwl from 'rwl';
import { keys, set } from 'idb-keyval';

class Uploader {
  constructor(dataStore, observer, data) {
    this.timeout;
    this.dataStore = dataStore;
    this.observer = observer;
    this.data = data;
    this.form = document.querySelector('.js-upload-form');
    this.statusElem = document.querySelector('.js-upload-form__status')
    this.formSubmit = this.formSubmit.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    this.form.addEventListener('submit', this.formSubmit)
  }


  formSubmit(e) {
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
      })

    }
    reader.readAsText(file);
    return false;

  }

}

export default Uploader;