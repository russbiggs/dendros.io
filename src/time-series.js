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
    yAxis.setAttribute('x1', '50');
    yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '50');
    yAxis.setAttribute('y2', '250');
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.classList.add('axis')
    xAxis.setAttribute('x1', '50');
    xAxis.setAttribute('y1', '250');
    xAxis.setAttribute('x2', '950');
    xAxis.setAttribute('y2', '250');
    frag.appendChild(yAxis);
    frag.appendChild(xAxis);
    this.g.appendChild(frag)
  }




  drawLine() {
    const xRange = [50, 950];
    const yRange = [0, 250];
    const measurements = this.measurements.map((obj) => obj.width);
    const maxWidth = Math.max.apply(Math, measurements);
    const minWidth = Math.min.apply(Math, measurements);
    const minMax = minWidth + maxWidth;
    const measurementsLength = measurements.length
    const xMove = (xRange[1] - xRange[0]) / measurementsLength;
    const yStart = (yRange[1] - yRange[0]) / measurements.shift();
    let pathD = `M0,${yStart}`;
    for (let i = 1; i < measurementsLength - 1; i++) {
      const x = xMove * i;
      const y = 240 * (measurements[i] / minMax);
      const lineTo = `L${x},${y}`;
      pathD += lineTo;
    }
    this.animate.setAttribute('from', this.pathD || 'M0,250L0,250L900,250');
    this.animate.setAttribute('to', pathD);
    this.animate.beginElement()
    this.pathD = pathD;
  }


  addLabels() {
    const xRange = [50, 950];
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
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.classList.add('time-series__label')
      label.setAttribute('x', idx * xMove)
      label.setAttribute('y', 275);
      label.innerHTML = year;
      frag.appendChild(label);
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
    this.path.setAttribute('transform', 'matrix(1 0 0 1 50 0)')
    this.animate = document.querySelector('animate')
  }

  update(measurements) {
    const measurementsArr = measurements.slice(0);
    measurementsArr.pop();
    this.measurements = measurementsArr;
    this.drawLine();
    const labels = document.querySelectorAll('.time-series__label');
    for (const label of labels) {
      this.g.removeChild(label);
    }
    this.addLabels();
  }
}

export default TimeSeries;
/*
function drawSeries(data, index) {
  var parseTime = d3.timeParse("%Y");
  var series = data.samples[index].measurements
  series.pop();
  var widths = [];
  for (var i = 0; i < series.length; i++) {
    widths.push(series[i].width);
  }
  var seriesWidthMax = Math.max.apply(null, widths)
  var x = d3.scaleTime()
    .rangeRound([0, width - 150]);
  var y = d3.scaleLinear()
    .rangeRound([250, 0]);
  var factor = seriesWidthMax / 250;
  var firstYear = parseInt(series[0].year);
  var lastYear = parseInt(series.slice(-1)[0].year);
  var yearRange = [];
  for (var i = 0; i <= (lastYear - firstYear); i++) {
    yearRange.push(parseTime(firstYear + i));
  }
  x.domain(d3.extent(yearRange));
  y.domain(d3.extent([0, 2000]));
  g2.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + 250 + ")")
    .call(d3.axisBottom(x));
  g2.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
  drawLine(series);
  function drawLine(series) {
    var line = d3.line()
      .x(function (d) {
        return x(parseTime(d.year));
      })
      .y(function (d) {
        return y(d.width / factor * 8);
      });
    g2.append("path")
      .datum(series)
      .attr("class", "series-line")
      .attr("d", line)
  }
  */