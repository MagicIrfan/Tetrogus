import { TetrisModel } from "./tetris-model.js";
import { Game99 } from "./game/game99.js";
import { PlayerInput } from "./input/player-input.js";
import { BotInput } from "./input/bot-input.js";

class Tetris99Model extends TetrisModel {

    constructor() {
        super();
        this.games = [];
        this.botGames = [];
        this.botGrids = [];
        this.gamesOver = [];
        for (let i = 0; i < 98; i++) {
            this.gamesOver.push(false);
        }
        this.playerGameOver = false;
        this.bots = [];
        this.games.push(this.playerGame);

        for (let i = 0; i < 98; i++) {
            let game = new Game99();
            let bot = new BotInput(game);
            game.onLineClear = (lines) => {this.gameLineClear(lines.length);};
            game.onGameOver = () => { this.gamesOver[this.botGames.indexOf(game)] = true; };
            this.games.push(game);
            this.botGames.push(game);
            this.botGrids.push(game.grid);
            this.bots.push(bot);
        }

        this.viewVictory = () => {};

    }

    bindViewVictory(callback) { this.viewVictory = callback; }

    isVictory(){
        for (let i = 0; i < 98; i++) {
            if(!this.gamesOver[i]){
                return false;
            }
        }
        return true;
    }

    start() {
        this.playerGame = new Game99();
        this.playerInput = new PlayerInput(this.playerGame);
        this.botInput = new BotInput(this.playerGame);
        this.botInput.setEnabled(false);
        this.playerGame.onMove = () => {this.viewMove();}
        this.playerGame.onRotate = () => {this.viewRotate();}
        this.playerGame.onHold = () => {this.viewHold();}
        this.playerGame.onSoftDrop = () => {this.viewSoftDrop();}
        this.playerGame.onHardDrop = () => {this.viewHardDrop();}
        this.playerGame.onTetrominoFixGround = () => {this.viewTetrominoFixGround();}
        this.playerGame.onTetrominoHitGround = () => {this.viewTetrominoHitGround();}
        this.playerGame.onLineClear = (lines) => {this.gameLineClear(lines.length); this.viewLineClear(lines);}
        this.playerGame.onRelativeHeightUpdate = (relativeHeight) => {this.viewRelativeHeightUpdate(relativeHeight);}
        this.playerGame.onGameOver = () => {
            if(!this.playerGameOver) {
                this.playerGameOver = true;
                this.viewGameOver();
            }
        }
    }

    update(frameTime) {
        this.frameTime = (this.paused)?0:frameTime;

        this.viewUpdate(frameTime);
        if(!this.playerGameOver){
            this.botInput.update(this.frameTime);
            for (const bot of this.bots) {
                bot.update(this.frameTime);
            }

            this.playerGame.update(this.frameTime);
            for (const botGame of this.botGames) {
                botGame.update(this.frameTime);
            }

            if(this.isVictory()){
                this.viewVictory();
                this.playerGameOver = true;
            }
        }
        this.viewDraw(this.makeViewData());
    }

    makeViewData() {
        return {
            grid: this.playerGame.grid,
            score: this.playerGame.score.points,
            level: this.playerGame.level,
            rowsDestroyed: this.playerGame.rowsDestroyed,
            botGrids: this.botGrids,
            gamesOver: this.gamesOver,
            isVictory: this.isVictory(),
        };
    }

    gameLineClear(amount) {
        this.sendLinesToRandom(Math.max(0, amount-1));
    }

    sendLinesToRandom(amount) {
        let i = Math.floor(Math.random() * this.games.length);
        this.games[i].addLines(amount);
    }
}

export { Tetris99Model };
