class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(data) {
    for (const observer of this.observers) {
      observer(data);
    }
  }
}

export default Observable;
