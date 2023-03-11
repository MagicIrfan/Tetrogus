import { BaseTetris } from "./base-tetris.js";

class BaseTetrisPlayable extends BaseTetris {

    constructor(model, view) {
        super(model, view);
    }

    bindFunctions() {
        super.bindFunctions();

        // model functions
        this.bindModelMoveLeft = this.bindModelMoveLeft.bind(this);
        this.bindModelMoveRight = this.bindModelMoveRight.bind(this);
        this.bindModelRotate = this.bindModelRotate.bind(this);
        this.bindModelHold = this.bindModelHold.bind(this);
        this.bindModelSoftDrop = this.bindModelSoftDrop.bind(this);
        this.bindModelHardDrop = this.bindModelHardDrop.bind(this);
        this.bindModelActivateAI = this.bindModelActivateAI.bind(this);
        this.view.bindModelMoveLeft(this.bindModelMoveLeft);
        this.view.bindModelMoveRight(this.bindModelMoveRight);
        this.view.bindModelRotate(this.bindModelRotate);
        this.view.bindModelHold(this.bindModelHold);
        this.view.bindModelSoftDrop(this.bindModelSoftDrop);
        this.view.bindModelHardDrop(this.bindModelHardDrop);
        this.view.bindModelActivateAI(this.bindModelActivateAI);

        // view functions
        this.bindViewGameOver = this.bindViewGameOver.bind(this);
        this.bindViewActivateAI = this.bindViewActivateAI.bind(this);
        this.model.bindViewGameOver(this.bindViewGameOver);
        this.model.bindViewActivateAI(this.bindViewActivateAI);
    }

    bindModelMoveLeft() {this.model.moveLeft();}
    bindModelMoveRight() {this.model.moveRight();}
    bindModelRotate() {this.model.rotate();}
    bindModelHold() {this.model.hold();}
    bindModelSoftDrop() {this.model.softDrop();}
    bindModelHardDrop() {this.model.hardDrop();}
    bindModelActivateAI() {this.model.activateAI(); }

    bindViewGameOver() {this.view.gameOver();}
    bindViewActivateAI(activate) {this.view.activateAI(activate); }

}

export { BaseTetrisPlayable }
