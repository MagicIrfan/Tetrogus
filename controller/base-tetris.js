import { BaseController } from "./base-controller.js";

class BaseTetris extends BaseController {

    constructor(model, view) {
        super(model, view);
        this.onBackToMenu = () => {};
    }

    bindFunctions() {
        super.bindFunctions();

        // model functions
        this.bindModelPause = this.bindModelPause.bind(this);
        this.bindBackToMenu = this.bindBackToMenu.bind(this);
        this.view.bindModelPause(this.bindModelPause);
        this.view.bindBackToMenu(this.bindBackToMenu);

        // view functions
        this.bindViewMove = this.bindViewMove.bind(this);
        this.bindViewRotate = this.bindViewRotate.bind(this);
        this.bindViewHold = this.bindViewHold.bind(this);
        this.bindViewSoftDrop = this.bindViewSoftDrop.bind(this);
        this.bindViewHardDrop = this.bindViewHardDrop.bind(this);
        this.bindViewTetrominoHitGround = this.bindViewTetrominoHitGround.bind(this);
        this.bindViewTetrominoFixGround = this.bindViewTetrominoFixGround.bind(this);
        this.bindViewLineClear = this.bindViewLineClear.bind(this);
        this.bindViewRelativeHeightUpdate = this.bindViewRelativeHeightUpdate.bind(this);
        this.bindViewGamePaused = this.bindViewGamePaused.bind(this);
        this.model.bindViewMove(this.bindViewMove);
        this.model.bindViewRotate(this.bindViewRotate);
        this.model.bindViewHold(this.bindViewHold);
        this.model.bindViewSoftDrop(this.bindViewSoftDrop);
        this.model.bindViewHardDrop(this.bindViewHardDrop);
        this.model.bindViewTetrominoHitGround(this.bindViewTetrominoHitGround);
        this.model.bindViewTetrominoFixGround(this.bindViewTetrominoFixGround);
        this.model.bindViewRelativeHeightUpdate(this.bindViewRelativeHeightUpdate);
        this.model.bindViewLineClear(this.bindViewLineClear);
        this.model.bindViewGamePaused(this.bindViewGamePaused);
    }

    bindModelPause() {this.model.pause();}
    bindBackToMenu() {this.onBackToMenu();}

    bindViewMove() {this.view.move();}
    bindViewRotate() {this.view.rotate();}
    bindViewHold() {this.view.hold();}
    bindViewSoftDrop() {this.view.softDrop();}
    bindViewHardDrop() {this.view.hardDrop();}
    bindViewTetrominoHitGround() {this.view.tetrominoHitGround();}
    bindViewTetrominoFixGround() {this.view.tetrominoFixGround();}
    bindViewLineClear(amount) {this.view.lineClear(amount);}
    bindViewRelativeHeightUpdate(relativeHeight) {this.view.relativeHeightUpdate(relativeHeight);}
    bindViewGamePaused(paused) {this.view.pause(paused);}

}

export { BaseTetris }