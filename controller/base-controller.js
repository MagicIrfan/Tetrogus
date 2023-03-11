class BaseController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.bindFunctions();
    }

    destroy() {
        this.view.destroy();
    }

    update(frameTime) {
        this.model.update(frameTime);
    }

    bindFunctions() {
        this.bindViewUpdate = this.bindViewUpdate.bind(this);
        this.bindViewDraw = this.bindViewDraw.bind(this);
        this.model.bindViewDraw(this.bindViewDraw);
        this.model.bindViewUpdate(this.bindViewUpdate);
    }

    bindViewUpdate(frameTime) {this.view.update(frameTime);}
    bindViewDraw(data) {this.view.draw(data);}

}

export { BaseController }