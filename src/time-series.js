class TimeSeries {
  constructor() {
    this.update = this.update.bind(this);
    this.measurements = [];
    this.g = document.querySelector('.time-series > svg > g');
    this.path;
    this.pathD;
    this.animate;

    this.drawChart = this.drawChart.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.addLabels = this.addLabels.bind(this);
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
  }

  drawChart() {
    const frag = document.createDocumentFragment();
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.classList.add('axis')
    yAxis.setAttribute('x1', '20');
    yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '20');
    yAxis.setAttribute('y2', '250');
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.classList.add('axis')
    xAxis.setAttribute('x1', '20');
    xAxis.setAttribute('y1', '250');
    xAxis.setAttribute('x2', '920');
    xAxis.setAttribute('y2', '250');
    frag.appendChild(yAxis);
    frag.appendChild(xAxis);
    this.g.appendChild(frag)
  }

  drawLine(diff) {
    const xRange = [20, 920];
    const yRange = [0, 250];
    const measurements = this.measurements.map((obj) => obj.width);
    const maxWidth = Math.max.apply(Math, measurements);
    const minWidth = Math.min.apply(Math, measurements);
    const minMax = minWidth + maxWidth;
    const measurementsLength = measurements.length;
    const xMove = (xRange[1] - xRange[0]) / measurementsLength;
    const yStart = 250 - ((yRange[1] - yRange[0]) / measurements.shift());
    let pathD = `M0,${yStart}`;
    for (let i = 0; i < measurementsLength - 1; i++) {
      const x = xMove * i;
      const y = 250 - (240 * (measurements[i] / minMax));
      const lineTo = `L${x},${y}`;
      pathD += lineTo;
    }
    if (diff < 0) {
      const elems = this.pathD.split('L');
      const cut = elems.slice(0, diff);
      this.pathD = cut.join('L');
    } else if (diff > 0 && this.pathD) {
      const elems = this.pathD.split('L');
      const filler = Array(diff).fill(elems.slice(-1))
      const filled = elems.concat(filler);
      this.pathD = filled.join('L');
    }
    this.animate.setAttribute('from', this.pathD || 'M0,250L0,250L900,250');

    this.animate.setAttribute('to', pathD);
    this.animate.beginElement()
    this.pathD = pathD;
  }


  addLabels() {
    const xRange = [20, 920];
    const measurementsLength = this.measurements.length
    const xMove = (xRange[1] - xRange[0]) / measurementsLength;
    const yearArray = this.measurements.map(obj => obj.year);
    const labelSet = yearArray.reduce((acc, cur, idx) => {
      if (cur % 50 == 0) {
        acc.push({
          idx: idx,
          year: cur
        })
      }
      return acc
    }, []);
    const frag = document.createDocumentFragment();
    for (const data of labelSet) {
      const { year = '', idx = 0 } = data;
      const x = idx * xMove + 20;
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.classList.add('time-series__label')
      label.setAttribute('x', x - 18)
      label.setAttribute('y', 275);
      label.innerHTML = year;
      frag.appendChild(label);
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.classList.add('tick');
      tick.setAttribute('x1', x);
      tick.setAttribute('y1', '250');
      tick.setAttribute('x2', x);
      tick.setAttribute('y2', '260');
      frag.appendChild(tick);
    }
    this.g.appendChild(frag);
  }


  addAnimate() {
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animate.setAttribute('href', '#series-line');
    animate.setAttribute('attributeName', 'd');
    animate.setAttribute('attributeType', 'XML');
    animate.setAttribute('begin', '0s');
    animate.setAttribute('fill', 'freeze');
    animate.setAttribute('dur', '0.2s');
    this.g.appendChild(animate)
  }

  init() {
    this.drawChart();
    this.addAnimate();
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('series-line');
    path.id = 'series-line';
    this.g.appendChild(path);
    this.path = document.querySelector('.series-line');
    this.path.setAttribute('transform', 'matrix(1 0 0 1 20 0)')
    this.animate = document.querySelector('animate')
  }

  update(measurements) {
    const measurementsArr = measurements.slice(0);
    measurementsArr.pop();
    let diff = 0;
    if (this.measurements.length != measurementsArr.length) {
      diff = measurementsArr.length - this.measurements.length;
    }
    this.measurements = measurementsArr;
    this.drawLine(diff);
    const labels = document.querySelectorAll('.time-series__label');
    for (const label of labels) {
      this.g.removeChild(label);
    }
    this.addLabels();
  }
}

export default TimeSeries;