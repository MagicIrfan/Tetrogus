import { Game } from "./game.js";
import { Block } from "./block.js";
import { TetrominoColor } from "./tetromino-color.js";

class Game99 extends Game {

    constructor() {
        super();
    }
    
    addLines(amount) {
        const holePosition = Math.floor(Math.random() * this.grid.width);
        for (let i = 0; i < amount; i++) {
            let row = [].fill(this.grid.width);
            for (let x = 0; x < this.grid.width; x++) {
                if (x !== holePosition) row[x] = new Block(TetrominoColor.Grey);
                else row[x] = null;
            }
            this.grid.matrix.push(row);
            this.grid.matrix.splice(0, 1);
        }
        if (!this.grid.tetromino) {
            return;
        }

        while (true) {
            let moveUp = false;
            for (const block of this.grid.tetromino.blocks) {
                if (!this.grid.isEmplacementFree(block.x, block.y)) {
                    moveUp = true;
                    break;
                }
            }
            if (moveUp) {
                if (!this.grid.moveTetromino(this.grid.tetromino, 0, -1)) {
                    this.gameOver();
                    break;
                }
            } else {
                break;
            }
        }
    }

}

export { Game99 };
