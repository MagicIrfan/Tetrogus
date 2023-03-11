import { MainMenu } from "./main-menu.js";
import { Tetris } from "./tetris.js";
import { Tetris99 } from "./tetris99.js";
import { BotTraining } from "./bot-training.js";
import { TimeManager } from "./time-manager.js";

class App {

    constructor() {
        this.timeManager = new TimeManager();
        this.startMainMenu();
    }

    update() {
        this.timeManager.update();
        let frameTime = this.timeManager.getDelta();
        this.controller.update(frameTime);
    }

    start(controller) {
        if (this.controller)
            this.controller.destroy();
        this.controller = controller;
    }

    startMainMenu() {
        this.start(new MainMenu());
        this.controller.onTetrisClicked = () => { this.startTetris(); }
        this.controller.onTetris99Clicked = () => { this.startTetris99(); }
        this.controller.onBotTrainingClicked = () => { this.startBotTraining(); }
    }

    startTetris() {
        this.start(new Tetris());
        this.controller.onBackToMenu = () => {this.startMainMenu();};
    }

    startTetris99() {
        this.start(new Tetris99());
        this.controller.onBackToMenu = () => {this.startMainMenu();};
    }

    startBotTraining() {
        this.start(new BotTraining());
        this.controller.onBackToMenu = () => {this.startMainMenu();};
    }

}

export { App };
