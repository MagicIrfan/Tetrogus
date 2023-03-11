import { Tetromino } from "./tetromino.js";
import { TetrominoColor } from "../tetromino-color.js";

export class ITetromino extends Tetromino
{
    constructor(){
        super(TetrominoColor.Cyan);
        this.registerBlock(0,0);
        this.registerBlock(1,0);
        this.registerBlock(2,0);
        this.registerBlock(3,0);
    }
    
}