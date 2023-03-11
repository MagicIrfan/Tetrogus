import {Button} from "./html/button.js";
import {BaseView} from "./base-view.js";
import { Color } from "./utils/color.js";
import { Resources } from "../resources/resources.js";
import { ImageManager } from "../resources/image-manager.js";

class MainMenuView extends BaseView {

    constructor() {
        super();
        this.tetrisButton = new Button({
            text: "Tetris",
            x: 0,
            y: 10,
            width: 40,
            height: 8,
            size: 3,
        });
        this.tetris99Button = new Button({
            text: "Tetris 99",
            x: 0,
            y: 20,
            width: 40,
            height: 8,
            size: 3,
        });
        this.botTrainingButton = new Button({
            text: "Entrainement de l'IA",
            x: 0,
            y: 30,
            width: 40,
            height: 8,
            size: 3,
        });
        this.elements.add(this.tetrisButton);
        this.elements.add(this.tetris99Button);
        this.elements.add(this.botTrainingButton);
        this.backgroundColor = new Color(100,200,255,1);
    }

    draw(){
        super.draw();
        this.canvas.setColor(new Color(0,0,0,1))
        this.canvas.drawText("TETROGUS","Tetris",12,-37,-10)
        this.canvas.drawImage(ImageManager.Get(Resources.Images.Tetrogus),-10,-40,20,30);
    }

    bindTetris(callback) {
        this.tetrisButton.onClick = callback;
    }

    bindTetris99(callback) {
        this.tetris99Button.onClick = callback;
    }

    bindBotTraining(callback) {
        this.botTrainingButton.onClick = callback;
    }

}

export { MainMenuView }