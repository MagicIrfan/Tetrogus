import {ITetromino} from "./tetrominos/itetromino.js";
import {JTetromino} from "./tetrominos/jtetromino.js";
import {LTetromino} from "./tetrominos/ltetromino.js";
import {OTetromino} from "./tetrominos/otetromino.js";
import {STetromino} from "./tetrominos/stetromino.js";
import {TTetromino} from "./tetrominos/ttetromino.js";
import {ZTetromino} from "./tetrominos/ztetromino.js";

class TetrominoGenerator {

    constructor() {
        this.tetrominoClasses = [
            ITetromino,
            JTetromino,
            LTetromino,
            OTetromino,
            STetromino,
            TTetromino,
            ZTetromino
        ];
        this.coefficients = new Map();
        this.baseCoefficient = 2;
        for (const tClass of this.tetrominoClasses) {
            this.coefficients.set(tClass, this.baseCoefficient);
        }
    }

    generateTetromino() {
        let constructors = [];
        for (const tConstructor of this.coefficients) {
            for (let i = 0; i < tConstructor[1]; i++) {
                constructors.push(tConstructor[0]);
            }
        }
        let rand = Math.floor(Math.random() * constructors.length);
        let tetromino = new constructors[rand];
        for (const tClass of this.tetrominoClasses) {
            this.coefficients.set(tClass, this.coefficients.get(tClass) + 1);
        }
        this.coefficients.set(tetromino.constructor, this.baseCoefficient);
        return tetromino;
    }

}

export { TetrominoGenerator }