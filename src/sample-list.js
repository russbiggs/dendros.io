class SampleList {
  constructor(observer) {
    this.observer = observer;
    this.data;
    this.sampleTitle = document.querySelector('.sample-title');
    this.list = document.querySelector('.sample-list');
    this.update = this.update.bind(this);
  }

  update(data) {
    const metadata = data.metadata || {};
    const siteId = metadata.siteId || '';
    this.sampleTitle.innerHTML = `${siteId} samples`;
    const samples = data.samples || [];
    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }
    const frag = document.createDocumentFragment();
    for (const sample of samples) {
      const elem = document.createElement('li');
      elem.classList.add('sample-list__item');
      elem.innerHTML = sample.sampleId;
      elem.addEventListener('click', () => {
        const active = document.querySelector('.sample-list__item--active');
        if (active) active.classList.remove('sample-list__item--active');
        elem.classList.add('sample-list__item--active');
        this.observer.notify(sample.measurements);
      });
      frag.appendChild(elem);
    }
    this.list.appendChild(frag);
    this.list.firstChild.classList.add('sample-list__item--active');
  }
}

export default SampleList;

