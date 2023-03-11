import { ITetromino } from "./tetrominos/itetromino.js";
import { JTetromino } from "./tetrominos/jtetromino.js";
import { LTetromino } from "./tetrominos/ltetromino.js";
import { OTetromino } from "./tetrominos/otetromino.js";
import { STetromino } from "./tetrominos/stetromino.js";
import { TTetromino } from "./tetrominos/ttetromino.js";
import { ZTetromino } from "./tetrominos/ztetromino.js";
import { TetrominoGenerator } from "./tetromino-generator.js";

class Grid extends Object {

    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
        this.matrix = [];
        for (let i = 0; i < height; i++) {
            this.matrix.push(new Array(width).fill(null));
        }
        this.tetrominoGenerator = new TetrominoGenerator();
        this.tetromino = null;
        this.nextTetromino = this.generateTetromino();
        this.copyTetromino = null;
        this.holdTetromino = null;
    }

    isEmplacementFree(x, y) {
        //if (y < 0) return true;
        if (!this.isInGrid(x, y)) return false;
        let row = this.matrix[y];
        return row && !row[x];
    }

    copyPosition(source, destination){
        if(source && destination){
            for(let index = 0; index<source.blocks.length; index++){
                destination.blocks[index].x = source.blocks[index].x
                destination.blocks[index].y = source.blocks[index].y
            }
        }
    }

    canTetrominoMove(tetromino, x, y) {
        if (!tetromino)
            return false;

        for (let i = 0; i < tetromino.blocks.length; i++) {
            let data = tetromino.blocks[i];
            if (!this.isEmplacementFree(data.x + x, data.y + y)) {
                return false;
            }
        }

        return true;
    }

    moveTetromino(tetromino, x, y) {

        if (!tetromino)
            return false;

        if (!this.canTetrominoMove(tetromino, x, y))
            return false;

        tetromino.blocks.forEach(data => {
            data.x += x;
            data.y += y;
        });

        return true;
    }

    fixTetrominoOnGrid() {
        if (this.tetromino) {
            this.tetromino.blocks.forEach(data => {
                if (this.isInGrid(data.x, data.y)) {
                    this.matrix[data.y][data.x] = data.block;
                }
            })
        }
        this.tetromino = null;
    }

    generateTetromino() {
        return this.tetrominoGenerator.generateTetromino();
    }

    spawnTetromino() {
        this.tetromino = this.nextTetromino;
        this.nextTetromino = this.generateTetromino();
        this.copyTetromino = new this.tetromino.constructor()
        this.copyPosition(this.tetromino,this.copyTetromino)
        this.fallTetromino(this.copyTetromino)
        if (!this.moveToSpawn(this.tetromino)) {
            this.tetromino = null;
        }
    }

    moveToSpawn(tetromino) {
        let spawnX = Math.floor(this.width/2) - 2;
        if (!this.moveTetromino(tetromino,spawnX, 0)) {
            tetromino = null;
            return false;
        }
        for (let i = 0; i < tetromino.blocks.length; i++) {
            let data = tetromino.blocks[i];
            if (!this.isEmplacementFree(data.x, data.y)) {
                tetromino = null;
                return false;
            }
        }
        return true;
    }

    isInGrid(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    rotateRight(tetromino) {
        if (!tetromino)
            return false;

        let newCoordinates = [];
        for (const data of tetromino.blocks) {
            newCoordinates.push({
                x: data.x,
                y: data.y
            });
        }

        let x1, x2, y1, y2, sizeX, sizeY, size;

        const setBorderCoordinates = () => {
            x1 = newCoordinates[0].x;
            x2 = x1;
            y1 = newCoordinates[0].y;
            y2 = y1;
            for (const data of newCoordinates) {
                if (data.x < x1) x1 = data.x;
                if (data.x > x2) x2 = data.x;
                if (data.y < y1) y1 = data.y;
                if (data.y > y2) y2 = data.y;
            }
            sizeX = x2 - x1 + 1;
            sizeY = y2 - y1 + 1;
            size = (sizeX > sizeY)?sizeX:sizeY;
        }
        const moveToTopLeft = () => {
            for (const data of newCoordinates) {
                data.x -= x1;
                data.y -= y1;
            }
        }

        const translate = (x, y) => {
            for (const data of newCoordinates) {
                data.x += x;
                data.y += y;
            }
        }

        setBorderCoordinates();
        let originX = x1;
        let originY = y1;

        switch (tetromino.constructor) {
            case OTetromino: break;
            case ITetromino: {
                setBorderCoordinates();
                moveToTopLeft();
                setBorderCoordinates();
                translate(Math.floor((size-sizeX)/2), Math.floor((size-sizeY)/2));
                translate(-Math.floor((size-1)/2), -Math.floor((size-1)/2));
                // Rotate
                for (const data of newCoordinates) {
                    let tmp = data.x;
                    // noinspection JSSuspiciousNameCombination
                    data.x = data.y;
                    data.y = tmp;
                }
                translate(-Math.floor((size-sizeX)/2), -Math.floor((size-sizeY)/2));
                translate(Math.floor((size-1)/2), Math.floor((size-1)/2));
                // Move back to initial coordinates
                for (const data of newCoordinates) {
                    data.x += originX;
                    data.y += originY;
                }
                break;
            }
            case JTetromino:
            case LTetromino:
            case STetromino:
            case TTetromino:
            case ZTetromino: {
                moveToTopLeft();
                // Place center on (0;0)
                for (const data of newCoordinates) {
                    data.x -= (size - 1) / 2;
                    data.y -= (size - 1) / 2;
                }
                // Rotate
                for (const data of newCoordinates) {
                    let tmp = data.x;
                    data.x = -data.y;
                    data.y = tmp;
                }
                setBorderCoordinates();
                moveToTopLeft();
                // Move back to initial coordinates
                for (const data of newCoordinates) {
                    data.x += originX;
                    data.y += originY;
                }
                break;
            }
        }

        const testRotationAt = (x, y) => {
            translate(x, y);
            for (const data of newCoordinates) {
                if (!this.isEmplacementFree(data.x, data.y)) {
                    translate(-x, -y);
                    return false;
                }
            }
            return true;
        }
        const tests = [
            {x: 0, y:0},
            {x: 0, y:1},
            {x: 0, y:-1},
            {x: 1, y:0},
            {x: -1, y:0},
            {x: 0, y:2},
            {x: 0, y:-2},
            {x: 2, y:0},
            {x: -2, y:0},
        ];
        let canRotate = false;
        for (const test of tests) {
            if (testRotationAt(test.x, test.y)) {
                canRotate = true;
                break;
            }
        }
        if (!canRotate) return false;

        for (let i = 0; i < newCoordinates.length; i++) {
            tetromino.blocks[i].x = newCoordinates[i].x;
            tetromino.blocks[i].y = newCoordinates[i].y;
        }

        return true;
    }

    isFull(){
        let spawnX = Math.floor(this.width/2) - 2;
        for (let i = 0; i < this.nextTetromino.blocks.length; i++) {
            let data = this.nextTetromino.blocks[i];
            if (!this.isEmplacementFree(data.x + spawnX,data.y)) {
                return true
            }     
        }
        return false
    }

    fallTetromino(tetromino) {
        if (!tetromino)
            return;

        while(true){
            if(!this.moveTetromino(tetromino,0, 1)){
                break;
            }
        }
    }

    getFullRows() {
        let rows = [];
        for (let i = 0; i < this.matrix.length; i++) {
            let full = true;
            for (const element of this.matrix[i]) {
                if (!element) full = false;
            }
            if (full) {
                rows.push(this.matrix[i]);
            }
        }
        return rows;
    }

    clearRows(rows) {
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            for (let j = 0; j < row.length; j++) {
                row[j] = null;
            }
        }
    }

    destroyRows(rows) {
        let n = rows.length;

        for (let i = n-1; i >= 0; i--) {
            this.matrix.splice(this.matrix.indexOf(rows[i]), 1);
        }

        for (let i = 0; i < n; i++) {
            this.matrix.splice(0, 0, new Array(this.width).fill(null));
        }
    }

    getRelativeHeight() {
        let maxHeight = 0;
        for (let x = 0; x < this.width; x++) {
            let height = this.height;
            for (let y = 0; y < this.height; y++) {
                if (this.matrix[y][x] !== null) {
                    break;
                }
                height--;
            }
            if (maxHeight < height) maxHeight = height;
        }
        return maxHeight / this.height;
    }

}

export { Grid };