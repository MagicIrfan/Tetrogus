import { BaseTetrisPlayable } from "./base-tetris-playable.js";
import { Tetris99Model } from "../model/tetris99-model.js";
import { Tetris99View } from "../view/tetris99-view.js";

class Tetris99 extends BaseTetrisPlayable {

    constructor() {
        super(new Tetris99Model(), new Tetris99View());
    }

    bindFunctions() {
        super.bindFunctions();

        // view functions
        this.bindViewVictory = this.bindViewVictory.bind(this);
        this.model.bindViewVictory(this.bindViewVictory);
    }

    bindViewVictory(){
        this.view.gameVictory();
    }

}

export { Tetris99 };