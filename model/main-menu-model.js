import { BaseModel } from "./base-model.js";

class MainMenuModel extends BaseModel {

    constructor() {
        super();
    }

    update(frameTime) {
        this.viewUpdate(frameTime);
        this.viewDraw(this.makeViewData());
    }

}

export { MainMenuModel };
