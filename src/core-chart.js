


class CoreChart {
  constructor() {
    this.update = this.update.bind(this);
    this.measurements = [];
    this.g = document.querySelector('.core-chart > svg > g');
    this.tooltip = document.querySelector('.core-tooltip');


    this.drawCore = this.drawCore.bind(this);
    this.addLabels = this.addLabels.bind(this);
    this.update = this.update.bind(this);
  }

  drawCore() {
    while (this.g.lastChild) {
      this.g.removeChild(this.g.lastChild);
    }
    var totalArray = this.measurements.map(obj => obj.width);
    var totalLength = totalArray.reduce((a, b) => a + b, 0);
    const lengthRatio = 1000 / totalLength;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < this.measurements.length; i++) {
      const { width = 0, year = 0 } = this.measurements[i];
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      ring.setAttribute('y', 100);

      const x = (() => {
        if (width < 0 || i == 0) {
          return 0;
        } else {
          const previous = this.measurements.slice(0, i);
          const finalArray = previous.map(obj => obj.width);
          const sum = finalArray.reduce((a, b) => a + b, 0);
          return sum * lengthRatio * 0.75;
        }
      })();
      ring.setAttribute('x', x);
      ring.setAttribute('height', 50);
      const ringWidth = (() => width > 0 ? width * lengthRatio * 0.75 : 0)();
      ring.setAttribute('width', ringWidth);
      ring.classList.add('ring');
      ring.setAttribute('year', year);
      ring.addEventListener('mouseover', (e) => {
        this.tooltip.classList.add('core-tooltip--visible');
        this.tooltip.innerHTML = `year: ${year}<br/>width: ${width}μm`;
        this.tooltip.style.left = `${e.pageX}px`;
        this.tooltip.style.top = `${e.pageY - 28}px`;
      })
      ring.addEventListener('mouseout', () => this.tooltip.classList.remove('core-tooltip--visible'));
      frag.appendChild(ring);
    }
    this.g.appendChild(frag)


  }


  addLabels() {
    const yearArray = this.measurements.map(obj => obj.year);
    const labelSet = yearArray.reduce((accumulator, currentValue) => {
      if (currentValue % 50 == 0) {
        accumulator.push({
          year: currentValue
        })
      }
      return accumulator
    }, []);
    const frag = document.createDocumentFragment();
    for (const data of labelSet) {
      const { year = '' } = data;
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (() => {
        const ring = document.querySelector(`.ring[year='${year}']`);
        const ringX = ring.getAttribute('x');
        return ringX - 20 > 0 ? ringX - 20 : 0;
      })())
      label.setAttribute('y', 170);
      label.innerHTML = year;
      frag.appendChild(label);
    }
    this.g.appendChild(frag);
  }

  update(measurements) {
    this.measurements = measurements;
    this.drawCore();
    this.addLabels();
  }

}

export default CoreChart;

