class BaseModel {

    constructor() {

        this.viewUpdate = () => {};
        this.viewDraw = () => {};

    }

    update(frameTime) {
        this.viewUpdate(frameTime);
        this.viewDraw(this.makeViewData());
    }

    makeViewData() {
        return {};
    }

    bindViewUpdate(callback) { this.viewUpdate = callback; }
    bindViewDraw(callback) { this.viewDraw = callback; }

}

export { BaseModel };