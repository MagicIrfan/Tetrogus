import { BaseController } from "./base-controller.js";
import { MainMenuModel } from "../model/main-menu-model.js";
import { MainMenuView } from "../view/main-menu-view.js";


class MainMenu extends BaseController {

    constructor() {
        super(new MainMenuModel(), new MainMenuView());

        this.onTetrisClicked = () => {};
        this.onTetris99Clicked = () => {};
        this.onBotTrainingClicked = () => {};
    }

    bindFunctions() {
        super.bindFunctions();

        this.bindTetris = this.bindTetris.bind(this);
        this.bindTetris99 = this.bindTetris99.bind(this);
        this.bindBotTraining = this.bindBotTraining.bind(this);
        this.view.bindTetris(this.bindTetris);
        this.view.bindTetris99(this.bindTetris99);
        this.view.bindBotTraining(this.bindBotTraining);
    }

    bindTetris() {this.onTetrisClicked();}
    bindTetris99() {this.onTetris99Clicked();}
    bindBotTraining() {this.onBotTrainingClicked();}

}

export { MainMenu }