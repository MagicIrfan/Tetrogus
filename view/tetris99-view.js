import { Color } from "./utils/color.js";
import { BaseGameView } from "./base-game-view.js";
import { Button } from "./html/button.js";
import { Sound } from "./utils/sound.js";
import { GridView } from "./drawable/gridview.js";
import { Resources } from "../resources/resources.js";

class Tetris99View extends BaseGameView {

    constructor() {
        super();
        this.playerScale = 3.4;
        this.width = 10;
        this.height = 20;
        this.victory = false;
        this.playerGrid = new GridView(10,20,this.playerScale,0,0,new Color(0,0,0,1),new Color(50,50,50,1),true);
    }

    draw(data) {
        super.draw();

        let botGrids = data.botGrids;
        for (let i = 0; i < 98; i++) {
            let rowLength = 7;
            let x = i%rowLength;
            let y = Math.floor(i/rowLength)%7;
            let offsetX;
            let offsetY = y*10.5 - 10.5*3;
            if (i < 49) {
                offsetX = -58 + x*5.5 - this.width/2 * this.playerScale;
            } else {
                offsetX = 58 - x*5.5 + this.width/2 * this.playerScale;
            }    

            if (data.gamesOver[i]) {
                this.canvas.setColor(new Color(0,0,0,1));
                this.canvas.fillRectangle(offsetX-2, offsetY-2, 4, 4);
                this.canvas.setColor(new Color(255,255,0,1));
                this.canvas.drawText("KO", "Tetris", 2, offsetX-1.5, offsetY-1.4);
            } else {
                let grid = new GridView(10,20,0.5,offsetX,offsetY,new Color(50,50,50,1),new Color(0,0,0,0),false);
                grid.draw(botGrids[i],this.canvas)
            }
        }
        this.drawPlayerGame(data.grid, data.score, data.level, data.rowsDestroyed, this.playerScale);

        this.drawFPS();

        this.drawPostProcessCanvas();
    }

    drawPlayerGame(grid, score, level, rowsDestroyed, scale) {
        super.drawPlayerGame(grid,score,level,rowsDestroyed,scale);
        if(this.victory){
            this.drawVictory();
        }
    }

    gameVictory() {
        this.victory = true;
        this.pauseButton.destroy();
        this.backToMenuButton.destroy();
        this.activateAIButton.destroy();
        this.elements.delete(this.pauseButton);
        this.elements.delete(this.backToMenuButton);
        this.elements.delete(this.activateAIButton);
        this.backToMenuButton = new Button({
            text: "Menu Principal",
            x: 0,
            y: 5,
            width: 20,
            height: 10,
            size: 2,
            color: "rgb(255,255,255)",
            background: "rgb(230,150,0)",
            backgroundHover: "rgb(255,200,0)",
            backgroundClick: "rgb(255,220,50)",
        });
        this.backToMenuButton.onClick = this.backToMenu;
        this.elements.add(this.backToMenuButton);
        this.music.stop();
        this.music_alt.stop();
        let gameOverSound = new Sound(Resources.Sounds.GameOver, 0.2);
        gameOverSound.play();
    }

    drawVictory(){
        this.canvas.setColor(new Color(25,197,0,1));
        this.canvas.fillRectangle(-44, -20, 88, 40);
        this.canvas.setColor(new Color(255,255,255,1));
        this.canvas.drawText("TU AS GAGNE", "Impact", 8,-20,-15)
    }

}

export { Tetris99View };