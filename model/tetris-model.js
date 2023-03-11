import { BaseTetrisModel } from "./base-tetris-model.js";
import { Game } from "./game/game.js";
import { PlayerInput } from "./input/player-input.js";
import { BotInput } from "./input/bot-input.js";

class TetrisModel extends BaseTetrisModel {

    constructor() {
        super();
        this.playerGame = null;
        this.playerInput = null;
        this.AIIsActivated = false;

        this.start();
    }

    start() {
        this.playerGame = new Game();
        this.playerInput = new PlayerInput(this.playerGame);
        this.botInput = new BotInput(this.playerGame);
        this.botInput.setEnabled(false);
        this.playerGame.onMove = () => {this.viewMove();}
        this.playerGame.onRotate = () => {this.viewRotate();}
        this.playerGame.onHold = () => {this.viewHold();}
        this.playerGame.onSoftDrop = () => {this.viewSoftDrop();}
        this.playerGame.onHardDrop = () => {this.viewHardDrop();}
        this.playerGame.onTetrominoFixGround = () => {this.viewTetrominoFixGround();}
        this.playerGame.onTetrominoHitGround = () => {this.viewTetrominoHitGround();}
        this.playerGame.onLineClear = (lines) => {this.viewLineClear(lines);}
        this.playerGame.onRelativeHeightUpdate = (relativeHeight) => {this.viewRelativeHeightUpdate(relativeHeight);}
        this.playerGame.onGameOver = () => {this.viewGameOver();}
    }

    update(frameTime) {
        this.frameTime = (this.paused)?0:frameTime;
        this.viewUpdate(frameTime);
        this.botInput.update(this.frameTime);
        this.playerGame.update(this.frameTime);
        this.viewDraw(this.makeViewData());
    }

    makeViewData() {
        return {
            grid: this.playerGame.grid,
            score: this.playerGame.score.points,
            level: this.playerGame.level,
            rowsDestroyed: this.playerGame.rowsDestroyed,
        };
    }

    moveLeft() { if (this.paused) return; this.playerInput.moveLeft(); }
    moveRight() { if (this.paused) return; this.playerInput.moveRight(); }
    rotate() { if (this.paused) return; this.playerInput.rotate(); }
    hold() { if (this.paused) return; this.playerInput.hold(); }
    softDrop() { if (this.paused) return; this.playerInput.softDrop(); }
    hardDrop() { if (this.paused) return; this.playerInput.hardDrop(); }
    activateAI() { 
        this.AIIsActivated = !this.AIIsActivated; 
        this.viewActivateAI(this.AIIsActivated);
        this.playerInput.setEnabled(!this.AIIsActivated);
        this.botInput.setEnabled(this.AIIsActivated);
    }
    bindViewGameOver(callback) { this.viewGameOver = callback; }
    bindViewActivateAI(callback) { this.viewActivateAI = callback; }
}

export { TetrisModel };
