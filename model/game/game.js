import { Grid } from "./grid.js";
import { Score } from "./score.js";

class Game {
    constructor() {
        this.grid = new Grid(10, 20);
        this.totalTime = 0;
        this.timer = 0;
        this.bonusTimer = 0;
        this.score = new Score();
        this.level = 0;
        this.rowsDestroyed = 0;
        this.rowsDestroyedOnLevel = 0
        this.isOver = false;
        this.isHold = false;

        this.onMove = () => {};
        this.onRotate = () => {};
        this.onSoftDrop = () => {};
        this.onHardDrop = () => {};
        this.onTetrominoHitGround = () => {};
        this.onTetrominoFixGround = () => {};
        this.onHold = () => {};
        this.onLineClear = () => {};
        this.onGameOver = () => {};
        this.onRelativeHeightUpdate = () => {};
    }

    update(frameTime) {
        if (this.isOver)
            return;
        this.totalTime += frameTime;

        if (this.grid.tetromino && !this.grid.canTetrominoMove(this.grid.tetromino,0,1)) {
            if (this.bonusTimer > 0) {
                this.bonusTimer -= frameTime;
                return;
            }
        }

        if (this.timer > 0) {
            this.timer -= frameTime;
        } else {
            this.timer = this.makeTimer();
            this.tick();
        }

        this.fallCopyTetromino();

    }

    tick() {
        this.applyDestroyRows();
        this.onRelativeHeightUpdate(this.grid.getRelativeHeight());

        if (this.grid.tetromino) {
            if (this.grid.moveTetromino(this.grid.tetromino, 0, 1)) {
                if (!this.grid.canTetrominoMove(this.grid.tetromino, 0, 1)) {
                    this.isHold = false;
                    this.hitGround();
                }
            } else {
                // S'execute si le tetromino a touché le sol
                this.fixTetrominoOnGrid();
                this.timer = 0.3; // Respawn plus vite
                this.onTetrominoFixGround();
            }
        } else {
            if (this.grid.isFull()) {
                this.gameOver();
            } else {
                this.grid.spawnTetromino();
                this.bonusTimer = 1.5;
            }
        }
    }

    gameOver() {
        this.onGameOver();
        this.isOver = true;
    }

    accelerate() {
        if(this.isOver)
            return;
        if (!this.grid.tetromino)
            return;

        if (this.timer < 0.05)
            return;

        if (!this.grid.canTetrominoMove(this.grid.tetromino, 0, 1)){
            return;
        }
        this.timer = 0.05;
        this.onSoftDrop();
    }

    makeTimer() {
        const linearInterpolate = (a, b, alpha) => {
            return a*(1-alpha) + b*alpha;
        }
        return linearInterpolate(1, 0.01, this.level/15);
    }

    moveLeft() {
        if(this.isOver)
            return;
        if (!this.grid.moveTetromino(this.grid.tetromino,-1, 0))
            return;
        if (!this.grid.canTetrominoMove(this.grid.tetromino, 0, 1)) {
            this.hitGround();
        }
        this.fallCopyTetromino();
        this.onMove();
    }

    moveRight() {
        if(this.isOver)
            return;
        if (!this.grid.moveTetromino(this.grid.tetromino,1, 0))
            return;
        if (!this.grid.canTetrominoMove(this.grid.tetromino, 0, 1)) {
            this.hitGround();
        }
        this.fallCopyTetromino();
        this.onMove();
    }

    rotateRight() {
        if(this.isOver)
            return;
        if (!this.grid.rotateRight(this.grid.tetromino))
            return;
        this.fallCopyTetromino();

        let timer = this.makeTimer()
        if (this.timer > timer && this.grid.canTetrominoMove(this.grid.tetromino, 0, 1)) {
            this.timer = timer;
        }

        this.onRotate();
    }

    fallTetromino() {
        if(this.isOver)
            return;
        if (!this.grid.tetromino)
            return;
        this.isHold = false;
        this.timer = 0;
        this.grid.fallTetromino(this.grid.tetromino);
        this.fixTetrominoOnGrid();
        this.onHardDrop();
    }

    fallCopyTetromino() {
        if (this.grid.copyTetromino && this.grid.tetromino) {
            this.grid.copyPosition(this.grid.tetromino, this.grid.copyTetromino);
            this.grid.fallTetromino(this.grid.copyTetromino);
        }
    }

    holdTetromino() {
        if(this.isOver || this.isHold)
            return;
        let toHold = null;
        if (this.grid.tetromino) {
            toHold = this.grid.tetromino;
        }
        if (this.grid.holdTetromino) {
            this.grid.tetromino = this.grid.holdTetromino;
            this.grid.moveToSpawn(this.grid.tetromino);
            this.grid.holdTetromino = null;
            this.isHold = false;
        } else {
            this.grid.spawnTetromino();
            this.grid.nextTetromino = this.grid.generateTetromino();
            this.isHold = false;
        }
        if (toHold) {
            this.grid.holdTetromino = new toHold.constructor();
            this.isHold = true;
        }

        if(this.grid.tetromino){
            this.grid.copyTetromino = new this.grid.tetromino.constructor();
            this.grid.copyPosition(this.grid.tetromino, this.grid.copyTetromino);
        }
        this.onHold();
        this.timer = this.makeTimer();
    }

    hitGround() {
        if(this.isOver)
            return;
        this.onTetrominoHitGround();
    }

    fixTetrominoOnGrid() {
        if(this.isOver)
            return;
        this.grid.fixTetrominoOnGrid();
        let fullRows = this.grid.getFullRows();
        this.score.update(fullRows.length, this.level);
        if (fullRows.length > 0) {
            this.rowsToDestroy = fullRows;
            this.rowsDestroyedOnLevel += fullRows.length;
            this.rowsDestroyed += fullRows.length;
            if(this.rowsDestroyedOnLevel >= 10 && this.level < 15){
                this.level += 1;
                this.rowsDestroyedOnLevel = 0;
            }
            let fullRowIndexes = [];
            for (const fullRow of fullRows) {
                fullRowIndexes.push(this.grid.matrix.indexOf(fullRow));
            }
            this.onLineClear(fullRowIndexes);
            this.grid.clearRows(fullRows);
            this.timer = 0.2;
        }
    }

    applyDestroyRows() {
        if(this.isOver)
            return;
        if (this.rowsToDestroy) {
            this.grid.destroyRows(this.rowsToDestroy);
            delete this.rowsToDestroy;
        }
    }
}

export { Game }