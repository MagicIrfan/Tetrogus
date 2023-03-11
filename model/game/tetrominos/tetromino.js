import { Block } from "../block.js";

export class Tetromino
{
    constructor(color){
        this.color = color;
        this.blocks = [];
        if (this.constructor === Tetromino) {
            throw new TypeError('Abstract class "Tetromino" cannot be instantiated directly');
        }
    }

    registerBlock(x, y) {
        this.blocks.push({
            x: x,
            y: y,
            block: new Block(this.color)
        });
    }
    
    center() {
        let x1 = this.blocks.at(0).x;
        let x2 = this.blocks.at(0).x;
        let y1 = this.blocks.at(0).y;
        let y2 = this.blocks.at(0).y;
        for (const block of this.blocks) {
            if (block.x < x1) x1 = block.x;
            if (block.x > x2) x2 = block.x;
            if (block.y < y1) y1 = block.y;
            if (block.y > y2) y2 = block.y;
        }
        return {
            x: Math.floor((x1+x2)/2),
            y: Math.floor((y1+y2)/2)
        };
    }
    
}