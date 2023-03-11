import { BaseDrawable } from "./base-drawable.js";
import { Color } from  "../utils/color.js"
import { TetrominoColor } from "../../model/game/tetromino-color.js";
import { ImageManager } from "../../resources/image-manager.js";
import { Resources } from "../../resources/resources.js";

export class GridView extends BaseDrawable{

    constructor(width,height,size,offsetX,offsetY,backgroundColor,lineColor,isPlayer){
        super();
        this.width = width;
        this.height = height;
        this.size = size;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.backgroundColor = backgroundColor;
        this.lineColor = lineColor;
        this.isPlayer = isPlayer;
        this.softDropIntensity = 0;
    }

    update(frameTime){
        if(this.softDropIntensity > 0){
            this.softDropIntensity -= (frameTime * 5);
        }
        else{
            this.softDropIntensity = 0;
        }
    }

    draw(grid,canvas){

        canvas.context.globalAlpha = 1;
        // Dessine la grille
        canvas.setColor(this.backgroundColor);
        canvas.fillRectangle(this.offsetX - grid.width/2 * this.size, this.offsetY - grid.height/2 * this.size, grid.width * this.size, grid.height * this.size);
        if (this.lineColor.a > 0) {
            canvas.setColor(this.lineColor);
            for (let y = 1; y < grid.height; y++) {
                canvas.drawLine(
                    this.offsetX + (-grid.width/2)*this.size,
                    this.offsetY + (y - grid.height/2)*this.size,
                    this.offsetX + (grid.width/2)*this.size,
                    this.offsetY + (y - grid.height/2)*this.size
                )
            }
            for (let x = 1; x < grid.width; x++) {
                canvas.drawLine(
                    this.offsetX + (x-grid.width/2)*this.size,
                    this.offsetY - (grid.height/2)*this.size,
                    this.offsetX + (x-grid.width/2)*this.size,
                    this.offsetY + (grid.height/2)*this.size
                )
            }
        }

        // Dessine un bloc sur la grille
        const drawBlock = (x, y, block, tint) => {
            let img = this.getBlockSprite(block.color);
            canvas.drawImage(img, this.offsetX + (-grid.width/2 + x)*this.size, this.offsetY + (-grid.height/2 + y)*this.size, this.size, this.size);
            if(tint.a === 0){
                return;
            }
            canvas.setColor(tint);
            canvas.fillRectangle(this.offsetX + (-grid.width/2 + x)*this.size, this.offsetY + (-grid.height/2 + y)*this.size, this.size, this.size)
        }

        // Dessine les blocs de la grille
        for (let y = 0; y < grid.matrix.length; y++) {
            let row = grid.matrix[y];
            for (let x = 0; x < row.length; x++) {
                let block = row[x];
                if (block) {
                    drawBlock(x, y, block, new Color(0,0,0,(this.isPlayer)?0.2:0));
                }
            }
        }

        // Dessine une prédiction de l'emplacement du tetromino actif
        if (this.isPlayer) {
            canvas.context.globalAlpha = 0.3;
            let copyTetromino = grid.copyTetromino;
            if (copyTetromino) {
                copyTetromino.blocks.forEach(data => {
                    drawBlock(data.x, data.y, data.block, new Color(0,0,0,0));
                });
            }
            canvas.context.globalAlpha = 1;
        }

        // Dessine les blocs du tetromino actif
        let tint = new Color(255,255,255,0);
        if (this.isPlayer) tint.a = this.softDropIntensity;

        let tetromino = grid.tetromino;
        if (tetromino) {
            tetromino.blocks.forEach(data => {
                drawBlock(data.x, data.y, data.block, tint);
            });
        }
    }

    getBlockSprite(color) {
        let path = "";
        switch (color) {
            case TetrominoColor.Cyan:       path = Resources.Images.CyanBlock; break;
            case TetrominoColor.Blue:       path = Resources.Images.BlueBlock; break;
            case TetrominoColor.Orange:     path = Resources.Images.OrangeBlock; break;
            case TetrominoColor.Yellow:     path = Resources.Images.YellowBlock; break;
            case TetrominoColor.Green:      path = Resources.Images.GreenBlock; break;
            case TetrominoColor.Purple:     path = Resources.Images.PurpleBlock; break;
            case TetrominoColor.Red:        path = Resources.Images.RedBlock; break;
            case TetrominoColor.Grey:       path = Resources.Images.GrayBlock; break;
            default: return;
        }
        return ImageManager.Get(path);
    }

    getBlockPosition(x,y){
        return {x:this.offsetX + (-this.width/2 + x)*this.size + this.size/2, y:this.offsetY + (-this.height/2 + y)*this.size + this.size/2};
    }
}