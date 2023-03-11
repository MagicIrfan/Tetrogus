import { BaseView } from "./base-view.js";
import { Color } from "./utils/color.js";
import { Button } from "./html/button.js";
import { Sound } from "./utils/sound.js";
import { ImageManager } from "../resources/image-manager.js";
import { Window } from "./utils/window.js";
import { TetrominoColor } from "../model/game/tetromino-color.js";
import { GridView } from "./drawable/gridview.js";
import { Particle } from "./drawable/particle.js";
import { Resources } from "../resources/resources.js";

class BaseGameView extends BaseView {

    constructor() {
        super();
        this.isGameOver = false;
        this.playerGrid = new GridView(10,20,4,0,0,new Color(0,0,0,1),new Color(50,50,50,1),true);
        this.particles = [];
        this.backgroundColor = new Color(0,0,0,1);

        this.music = new Sound(Resources.Sounds.Music, 0.5, true);
        this.music_alt = new Sound(Resources.Sounds.MusicAlt, 0, true);
        this.music.play();
        this.music_alt.play();

        this.modelMoveLeft = () => {};
        this.modelMoveRight = () => {};
        this.modelRotate = () => {};
        this.modelHold = () => {};
        this.modelSoftDrop = () => {};
        this.modelHardDrop = () => {};
        this.modelPause = () => {};
        this.modelActivateAI = () => {};
        this.backToMenu = () => {};

        this.pauseButton = new Button({
            text: "Pause",
            x: -20,
            y: -47,
            width: 19
        });
        this.pauseButton.onClick = () => {
            this.modelPause();
        }
        this.backToMenuButton = new Button({
            text: "Retour au menu",
            x: 0,
            y: -47,
            width: 19
        });
        this.backToMenuButton.onClick = () => {
            this.music.stop();
            this.music_alt.stop();
            this.backToMenu();
        };
        this.activateAIButton = new Button({
            text: "Activer le bot",
            x: 20,
            y: -47,
            width: 19
        });
        this.activateAIButton.onClick = () => {
            this.modelActivateAI();
        }
        this.elements.add(this.pauseButton);
        this.elements.add(this.backToMenuButton);
        this.elements.add(this.activateAIButton);
    }

    bindModelMoveLeft(callback) {this.modelMoveLeft = callback;}
    bindModelMoveRight(callback) {this.modelMoveRight = callback;}
    bindModelRotate(callback) {this.modelRotate = callback;}
    bindModelHold(callback) {this.modelHold = callback;}
    bindModelSoftDrop(callback) {this.modelSoftDrop = callback;}
    bindModelHardDrop(callback) {this.modelHardDrop = callback;}
    bindModelPause(callback) {this.modelPause = callback;}
    bindModelActivateAI(callback) {this.modelActivateAI = callback;}
    bindBackToMenu(callback) {this.backToMenu = callback;}

    move() { new Sound(Resources.Sounds.Move, 0.2).play(); }
    rotate() { new Sound(Resources.Sounds.Rotate, 0.2).play(); }
    hold() { new Sound(Resources.Sounds.Hold, 0.2).play(); }
    softDrop() { 
        new Sound(Resources.Sounds.SoftDrop, 0.2).play();
        this.playerGrid.softDropIntensity = 1;
    }
    hardDrop() { new Sound(Resources.Sounds.HardDrop, 0.2).play(); }
    tetrominoFixGround() { new Sound(Resources.Sounds.Fix, 0.2).play(); }
    tetrominoHitGround() { new Sound(Resources.Sounds.Landing, 0.2).play(); }
    lineClear(lines) {
        switch (lines.length) {
            case 1: new Sound(Resources.Sounds.LineClear1, 0.2).play(); break;
            case 2: new Sound(Resources.Sounds.LineClear2, 0.2).play(); break;
            case 3: new Sound(Resources.Sounds.LineClear3, 0.2).play(); break;
            case 4: new Sound(Resources.Sounds.LineClear4, 0.2).play(); break;
        }
        for(const y of lines){
            for(let x = 0; x < this.playerGrid.width; x++) {
                let position = this.playerGrid.getBlockPosition(x,y);
                for (let i = 0; i < 50; i++) {
                    this.particles.push(new Particle(
                        position.x + (Math.random()-0.5)*this.playerGrid.size,
                        position.y + (Math.random()-0.5)*this.playerGrid.size,
                        Math.random() * 1.2,
                        new Color(Math.random()*255,Math.random()*255,Math.random()*255,1),
                        (Math.random()-0.5) * 100,
                        (Math.random()-0.5) * 100
                    ));
                }
            }
        }
    }
    relativeHeightUpdate(relativeHeight) {
        this.music.setVolume((1-relativeHeight)*0.5);
        this.music_alt.setVolume(relativeHeight*2);
    }
    pause(paused) {
        this.paused = paused;
        this.pauseButton.text = (paused)?"Reprendre":"Pause";
    }

    activateAI(activate){
        this.activateAIButton.text = (activate)?"Désactiver le bot":"Activer le bot";
    }

    gameOver() {
        this.isGameOver = true;
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

    update(frameTime) {
        super.update(frameTime);

        if (Window.KeyPressed("ArrowUp")) this.modelRotate();
        if (Window.KeyHold("ArrowDown")) this.modelSoftDrop();
        if (Window.KeyPressed("ArrowLeft")) this.modelMoveLeft();
        if (Window.KeyPressed("ArrowRight")) this.modelMoveRight();
        if (Window.KeyPressed(" ")) this.modelHardDrop();
        if (Window.KeyPressed("H") ||Window.KeyPressed("h")) {
            this.modelHold();
        }

        this.playerGrid.update(frameTime);
        for(const particle of this.particles){
            particle.update(frameTime);
        }
        for (let i = this.particles.length-1; i >= 0 ; i--) {
            if (this.particles[i].size <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticle(){
        for(const particle of this.particles){
            particle.draw(this.canvas);
        }
    }

    drawPlayerGame(grid, score, level, rowsDestroyed, scale) {
        this.drawMainPlayerBackground(scale, grid.width+12, grid.height+2);
        this.playerGrid.draw(grid,this.canvas);
        this.drawNextTetromino(grid, scale);
        this.drawHoldTetromino(grid, scale);
        // Draw score
        this.canvas.setColor(new Color(0,0,0,1));
        this.canvas.drawText("Score: " + score, "Tetris", 2.5, (-grid.width/2 - 5)*scale, -19);
        this.canvas.drawText("Niveau: " + level, "Tetris", 1.5, (-grid.width/2 - 5)*scale, -15);
        this.canvas.drawText("Lignes détruites: " + rowsDestroyed, "Tetris", 1.5, (-grid.width/2 - 5)*scale, -12);
        this.drawParticle();
        if (this.paused) {
            this.drawPause();
        }
        if (this.isGameOver) {
            this.drawGameOver();
        }
    }

    drawPause() {
        this.canvas.setColor(new Color(100,100,100,1));
        this.canvas.fillRectangle(-20, -10, 40, 20);
        this.canvas.setColor(new Color(255,255,255,1));
        this.canvas.drawText("Jeu en pause", "Impact", 6,-16,-5)
    }

    drawGameOver(){
        this.canvas.setColor(new Color(197,25,0,1));
        this.canvas.fillRectangle(-44, -20, 88, 40);
        this.canvas.setColor(new Color(255,255,255,1));
        this.canvas.drawText("TU AS PERDU", "Impact", 8,-20,-15)
    }

    drawNextTetromino(grid, size){
        this.canvas.setColor(new Color(0,0,0,1));
        this.canvas.fillRectangle((grid.width/2 + 1)*size, (-grid.height/2)*size, size*4, size*4);

        let tetromino = grid.nextTetromino;
        if (tetromino) {
            let cellSize = size;
            tetromino.blocks.forEach(data => {
                let img = this.getBlockSprite(data.block.color);
                this.canvas.drawImage(img, (grid.width/2 + data.x + 1) * cellSize, (-grid.height/2 + data.y + 1) * cellSize, cellSize, cellSize);
            });
        }
    }

    drawHoldTetromino(grid, size) {
        this.canvas.setColor(new Color(0,0,0,1));
        this.canvas.fillRectangle((-grid.width/2 - 5)*size, (-grid.height/2)*size, size*4, size*4);

        let tetromino = grid.holdTetromino;
        if (tetromino) {
            let cellSize = size;
            tetromino.blocks.forEach(data => {
                let img = this.getBlockSprite(data.block.color);
                this.canvas.drawImage(img, (-grid.width/2 + data.x - 5) * cellSize, (-grid.height/2 + data.y + 1) * cellSize, cellSize, cellSize);
            });
        }
    }

    drawMainPlayerBackground(scale, sizeX, sizeY) {
        this.canvas.setColor(new Color(50,150,180,1));
        this.canvas.fillRectangle(-(sizeX/2)*scale, -(sizeY/2)*scale, (sizeX)*scale, (sizeY)*scale);
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

}

export { BaseGameView };