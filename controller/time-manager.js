class TimeManager {

    constructor() {
        this.lastFrametime = this.getTime();
    }

    update() {
        this.time = this.getTime();
        this.delta = (this.time - this.lastFrametime)/1000;
        this.lastFrametime = this.time;
    }

    getTime() {
        return window.performance.now();
    }

    getDelta() {
        return this.delta;
    }

}

export { TimeManager }