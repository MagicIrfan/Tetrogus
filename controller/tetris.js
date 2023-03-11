import { BaseTetrisPlayable } from "./base-tetris-playable.js";
import { TetrisModel } from "../model/tetris-model.js";
import { TetrisView } from "../view/tetris-view.js";

class Tetris extends BaseTetrisPlayable {

    constructor() {
        super(new TetrisModel(), new TetrisView());
    }

}

export { Tetris }