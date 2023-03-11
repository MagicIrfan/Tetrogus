import { BaseInput } from "./base-input.js";

class BotInput extends BaseInput {

    constructor(game) {
        super(game);
        this.timer = 0.5;
        this.currentTetromino = null;
        this.nextActions = [];

        this.maxHeightCoefficient = 0.01;
        this.sumHeightCoefficient = 0.03;
        this.lineClearsCoefficient = 0.17;
        this.holesCoefficient = 0.45;
        this.heightVariationCoefficient = 0.3;
        this.unReachableCoefficient = 0.95;
    }

    update(frameTime) {

        if (!this.enabled)
            return;

        if (this.game.isOver)
            return;

        if (this.game.grid.tetromino && this.currentTetromino !== this.game.grid.tetromino) {
            this.currentTetromino = this.game.grid.tetromino;
            this.newTetromino(this.currentTetromino);
        }

        if (this.timer < 0) {
            this.timer = this.game.makeTimer() * 0.1;
            if (this.timer > 0.05) this.timer = 0.05;
            this.tick();
        } else {
            this.timer -= frameTime;
        }
    }

    newTetromino(gameTetromino) {

        const copyBlocksCoordinates = (source, destination) => {
            for (let i = 0; i < this.currentTetromino.blocks.length; i++) {
                destination.blocks[i].x = source.blocks[i].x;
                destination.blocks[i].y = source.blocks[i].y;
            }
        }

        const tryActions = (moves, rotations) => {
            let tetromino = new this.currentTetromino.constructor();
            copyBlocksCoordinates(gameTetromino, tetromino);

            for (let i = 0; i < rotations; i++) {
                if (!this.game.grid.rotateRight(tetromino)) {
                    return null;
                }
            }

            if (!this.game.grid.moveTetromino(tetromino, moves, 0)) {
                return null;
            }

            this.game.grid.fallTetromino(tetromino);

            return this.getScore(this.game.grid, tetromino);
        }

        const generateActionsArray = (rotations, moves) => {

            let actions = [];
            for (let j = 0; j < rotations; j++) {
                actions.push(() => {this.rotate();});
            }
            for (let j = 0; j < Math.abs(moves); j++) {
                if (Math.sign(moves) > 0)
                    actions.push(() => {this.moveRight();});
                else
                    actions.push(() => {this.moveLeft();});
            }
            actions.push(() => {this.hardDrop();});
            return actions;
        }

        let bestResult = null;

        for (let rotations = 0; rotations < 4; rotations++) {
            let moves = 0;
            while (true) {
                let result = tryActions(moves, rotations);
                if (result === null)
                    break;

                if (!bestResult || bestResult < result) {
                    bestResult = result;

                    this.nextActions = generateActionsArray(rotations, moves);
                }
                moves++;
            }
            moves = 0;
            while (true) {
                let result = tryActions(moves, rotations);
                if (result === null)
                    break;

                if (!bestResult || bestResult < result) {
                    bestResult = result;

                    this.nextActions = generateActionsArray(rotations, moves);
                }
                moves--;
            }
        }

    }

    getScore(grid, tetromino) {

        let resultGrid = [];
        let width = grid.width;
        let height = grid.height;
        for (let y = 0; y < height; y++) {
            resultGrid.push([].fill(grid.matrix[y].length));
            for (let x = 0; x < width; x++) {
                resultGrid[y][x] = (grid.matrix[y][x])?1:0;
            }
        }
        for (const block of tetromino.blocks) {
            resultGrid[block.y][block.x] = 1;
        }

        let maxHeight = 0;
        let sumHeight = 0;
        let lineClears = 0;
        let holes = 0;
        let heightVariation = 0;
        let unReachable = 0;

        // Lignes completes
        for (let i = resultGrid.length-1; i >= 0; i--) {
            let row = resultGrid[i];
            let isFull = true;
            for (const block of row) {
                if (block === 0) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) {
                lineClears++;
                resultGrid.splice(i, 1);
                let emptyRow = [].fill(width);
                for (let j = 0; j < width; j++) emptyRow.push(0);
                resultGrid.splice(0, 0, emptyRow);
            }
        }

        // Hauteur max variation de hauteur
        let lastColumnHeight = null;
        for (let x = 0; x < width; x++) {
            let columnHeight = height;
            for (let y = 0; y < height; y++) {
                if (resultGrid[y][x] === 1) {
                    let nbUnreachable = 0;
                    while (true) {
                        nbUnreachable++;
                        if (!resultGrid[y+nbUnreachable]) break;
                        if (resultGrid[y+nbUnreachable][x] === 0) {
                            unReachable++;
                        }
                    }
                    break;
                }
                columnHeight--;
            }
            sumHeight += columnHeight;
            if (maxHeight < columnHeight) {
                maxHeight = columnHeight;
            }
            if (lastColumnHeight !== null) {
                heightVariation += Math.abs(lastColumnHeight - columnHeight);
            }
            lastColumnHeight = columnHeight;
        }

        // Nombre de trous
        let visited = [];
        for (let y = 0; y < height; y++) {
            visited.push([].fill(width));
            for (let x = 0; x < width; x++) {
                visited[y][x] = 0;
            }
        }
        const isEmpty = (x, y) => {
            if (x<0||x>=width || y<0||y>=height) return false;

            return resultGrid[y][x] === 0;
        }
        const isHole = (x, y) => {
            if (y === 0) {
                return false;
            }
            if (isEmpty(x-1, y) && visited[y][x-1] === 0) {
                visited[y][x-1] = 1;
                if (!isHole(x-1, y)) return false;
            }
            if (isEmpty(x+1, y) && visited[y][x+1] === 0) {
                visited[y][x+1] = 1;
                if (!isHole(x+1, y)) return false;
            }
            if (isEmpty(x, y-1) && visited[y-1][x] === 0) {
                visited[y-1][x] = 1;
                if (!isHole(x, y-1)) return false;
            }
            if (isEmpty(x, y+1) && visited[y+1][x] === 0) {
                visited[y+1][x] = 1;
                if (!isHole(x, y+1)) return false;
            }
            return true;
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (visited[y][x] === 0) {
                    visited[y][x] = 1;
                    if (resultGrid[y][x] === 0) {
                        if (isHole(x, y)) {
                            holes++;
                        }
                    }
                }
            }
        }

        return (
            - maxHeight * this.maxHeightCoefficient
            - sumHeight * this.sumHeightCoefficient
            + lineClears * this.lineClearsCoefficient
            - holes * this.holesCoefficient
            - heightVariation * this.heightVariationCoefficient
            - unReachable * this.unReachableCoefficient
        );
    }

    tick() {
        if (this.nextActions.length > 0) {
            this.nextActions[0]();
            this.nextActions.splice(0, 1);
        }
    }

}

export { BotInput }