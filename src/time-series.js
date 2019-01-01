class TimeSeries {
  constructor() {
    this.update = this.update.bind(this);
    this.measurements = [];
    this.g = document.querySelector('.time-series > svg > g');

    this.drawChart = this.drawChart.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.addLabels = this.addLabels.bind(this);
    this.update = this.update.bind(this);
  }

  update() {
  }
}

export default TimeSeries;