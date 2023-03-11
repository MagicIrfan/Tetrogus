import { BotTrainingModel } from "../model/bot-training-model.js";
import { BotTrainingView } from "../view/bot-training-view.js";
import {BaseTetris} from "./base-tetris.js";

class BotTraining extends BaseTetris {

    constructor() {
        super(new BotTrainingModel(), new BotTrainingView());
    }

    update(frameTime) {
        this.view.update(frameTime);
        this.model.update(frameTime);
    }

}

export { BotTraining }
