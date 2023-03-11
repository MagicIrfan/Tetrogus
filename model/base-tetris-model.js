import {BaseModel} from "./base-model.js";

class BaseTetrisModel extends BaseModel {

    constructor() {
        super();

        this.paused = false;

        // view functions
        this.viewMove = () => {};
        this.viewRotate = () => {};
        this.viewHold = () => {};
        this.viewSoftDrop = () => {};
        this.viewHardDrop = () => {};
        this.viewTetrominoHitGround = () => {};
        this.viewTetrominoFixGround = () => {};
        this.viewLineClear = () => {};
        this.viewRelativeHeightUpdate = () => {};
        this.viewGamePaused = () => {};
        this.viewGameOver = () => {};
        this.viewActivateAI = () => {};
    }

    bindViewMove(callback) { this.viewMove = callback; }
    bindViewRotate(callback) { this.viewRotate = callback; }
    bindViewHold(callback) { this.viewHold = callback; }
    bindViewSoftDrop(callback) { this.viewSoftDrop = callback; }
    bindViewHardDrop(callback) { this.viewHardDrop = callback; }
    bindViewTetrominoHitGround(callback) { this.viewTetrominoHitGround = callback; }
    bindViewTetrominoFixGround(callback) { this.viewTetrominoFixGround = callback; }
    bindViewLineClear(callback) { this.viewLineClear = callback; }
    bindViewRelativeHeightUpdate(callback) { this.viewRelativeHeightUpdate = callback; }
    bindViewGamePaused(callback) { this.viewGamePaused = callback; }

    pause() { this.paused = !this.paused; this.viewGamePaused(this.paused); }

}

export { BaseTetrisModel };
