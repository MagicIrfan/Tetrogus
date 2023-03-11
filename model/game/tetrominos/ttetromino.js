import { Tetromino } from "./tetromino.js";
import { TetrominoColor } from "../tetromino-color.js";

export class TTetromino extends Tetromino
{
    constructor(){
        super(TetrominoColor.Purple);
        this.registerBlock(1,0);
        this.registerBlock(0,1);
        this.registerBlock(1,1);
        this.registerBlock(2,1);
    }

    
}