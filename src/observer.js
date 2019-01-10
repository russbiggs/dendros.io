class Observable {
  constructor() {
    this.observers = [];
    this.data;
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(data) {
    if (this.data != data) {
      this.data = data;
      for (const observer of this.observers) {
        observer(data);
      }
      return false;
    } else {
      return true;
    }
  }
}

export default Observable;
