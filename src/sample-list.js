class SampleList {
  constructor(observer) {
    this.observer = observer;
    this.data;
    this.sampleTitle = document.querySelector('.sample-title');
    this.list = document.querySelector('.sample-list');
    this.update = this.update.bind(this);
  }

  update(data) {
    this.sampleTitle.innerHTML = `${data.metadata.siteId || ''} samples`;
    const samples = data.samples || [];
    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }
    const frag = document.createDocumentFragment();
    for (const sample of samples) {
      const elem = document.createElement('li');
      elem.classList.add('sample-list__item');
      elem.innerHTML = sample.sampleId;
      elem.addEventListener('click', () => this.observer.notify(sample.measurements));
      frag.appendChild(elem);
    }
    this.list.appendChild(frag);

  }
}

export default SampleList;

