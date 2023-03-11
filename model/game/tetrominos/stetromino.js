import { Tetromino } from "./tetromino.js";
import { TetrominoColor } from "../tetromino-color.js";

export class STetromino extends Tetromino
{
    constructor(){
        super(TetrominoColor.Green);
        this.registerBlock(1,0);
        this.registerBlock(2,0);
        this.registerBlock(0,1);
        this.registerBlock(1,1);
    }


}