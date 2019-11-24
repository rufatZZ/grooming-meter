class Timer {
  constructor() {
    this.count = 0;
    this.timer = null;
  }

  startTimer() {
    return setInterval(() => this.count++, 1000);
  }

  reset() {
    clearInterval(this.timer);
    return (this.count = 0);
  }

  getTime() {
    return this.count++;
  }
}

module.exports = { Timer };
