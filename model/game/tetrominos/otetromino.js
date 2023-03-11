import { Tetromino } from "./tetromino.js";
import { TetrominoColor } from "../tetromino-color.js";

export class OTetromino extends Tetromino
{
    constructor(){
        super(TetrominoColor.Yellow);
        this.registerBlock(1,0);
        this.registerBlock(1,1);
        this.registerBlock(2,0);
        this.registerBlock(2,1);
    }


}