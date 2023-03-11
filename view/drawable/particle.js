import { BaseDrawable } from "./base-drawable.js";

export class Particle extends BaseDrawable{

    constructor(x,y,size,color,speedX,speedY){
        super();
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    update(frameTime){
        this.x += (frameTime * this.speedX);
        this.y += (frameTime * this.speedY);
        this.size -= frameTime * 2;
        if (this.size < 0) this.size = 0;
    }

    draw(canvas){
        canvas.setColor(this.color);
        canvas.fillRectangle(this.x-(this.size/2),this.y-(this.size/2),this.size,this.size);
    }
}