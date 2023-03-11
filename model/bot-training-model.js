import {Game} from "./game/game.js";
import {BotInput} from "./input/bot-input.js";
import {BaseTetrisModel} from "./base-tetris-model.js";

class BotTrainingModel extends BaseTetrisModel {

    constructor() {
        super();

        this.games = [];
        this.inputs = [];
        this.nbBots = 200;
        this.nbKeepBots = 20;
        this.botsAlive = 0;
        this.speed = 10;
        this.generation = 0;

        this.winnerId = 0;

        for (let i = 0; i < this.nbBots; i++) {
            let input = new BotInput();

            input.maxHeightCoefficient          = this.random(0,1);
            input.sumHeightCoefficient          = this.random(0,1);
            input.lineClearsCoefficient         = this.random(0,1);
            input.holesCoefficient              = this.random(0,1);
            input.heightVariationCoefficient    = this.random(0,1);
            input.unReachableCoefficient        = this.random(0,1);

            this.inputs.push(input);
        }

    }

    update(frameTime) {
        this.frameTime = (this.paused)?0:frameTime;

        let winner = this.games[this.winnerId];

        if (this.botsAlive === 0) {
            this.newGeneration();
        }

        for (let i = 0; i < this.speed; i++) {

            this.botsAlive = 0;
            let bestScore = 0;
            for (let i = 0; i < this.games.length; i++) {
                let game = this.games[i];
                if (!game.isOver) {
                    this.botsAlive++;
                    if (game.score.points > bestScore) {
                        bestScore = game.score.points;
                        this.winnerId = i;
                    }
                }
            }

            for (const input of this.inputs) {
                input.update(this.frameTime);
            }
            for (const game of this.games) {
                game.update(this.frameTime);
            }
        }

        if (winner) {
            winner.onMove = () => {};
            winner.onRotate = () => {};
            winner.onHardDrop = () => {};
            winner.onLineClear = () => {};
        }
        winner = this.games[this.winnerId];
        winner.onMove = () => {this.viewMove();};
        winner.onRotate = () => {this.viewRotate();};
        winner.onHardDrop = () => {this.viewHardDrop();};
        winner.onLineClear = (lines) => {this.viewLineClear(lines);};

        this.viewDraw(this.makeViewData());
    }

    makeViewData() {
        return {
            grid:           this.games[this.winnerId].grid,
            score:          this.games[this.winnerId].score.points,
            level:          this.games[this.winnerId].level,
            rowsDestroyed:  this.games[this.winnerId].rowsDestroyed,
            nbBots:         this.nbBots,
            botsAlive:      this.botsAlive,
            generation:     this.generation,
            coefficients:   {
                maxHeightCoefficient        : this.inputs[this.winnerId].maxHeightCoefficient,
                sumHeightCoefficient        : this.inputs[this.winnerId].sumHeightCoefficient,
                lineClearsCoefficient       : this.inputs[this.winnerId].lineClearsCoefficient,
                holesCoefficient            : this.inputs[this.winnerId].holesCoefficient,
                heightVariationCoefficient  : this.inputs[this.winnerId].heightVariationCoefficient,
                unReachableCoefficient      : this.inputs[this.winnerId].unReachableCoefficient,
            },
        };
    }

    newGeneration() {

        if (this.generation > 0) {
            // Map games with their inputs
            let gameMap = new Map();
            for (let i = 0; i < this.nbBots; i++) {
                let game = this.games[i];
                let input = this.inputs[i];
                gameMap.set(game, input);
            }
            // Sort games by score
            this.games.sort((a,b) => b.score.points - a.score.points);
            let sortedCoefficients = [];
            for (let i = 0; i < this.nbKeepBots; i++) {
                let game = this.games[i];
                let input = gameMap.get(game);
                sortedCoefficients.push({
                    score                       : game.score.points,
                    maxHeightCoefficient        : input.maxHeightCoefficient,
                    sumHeightCoefficient        : input.sumHeightCoefficient,
                    lineClearsCoefficient       : input.lineClearsCoefficient,
                    holesCoefficient            : input.holesCoefficient,
                    heightVariationCoefficient  : input.heightVariationCoefficient,
                    unReachableCoefficient      : input.unReachableCoefficient,
                });
            }
            console.log("score min: " + this.games[this.nbBots-1].score.points +  ", score max: " + this.games[0].score.points, sortedCoefficients);

            // generate new inputs
            this.inputs = [];
            for (let i = 0; i < this.nbKeepBots; i++) {
                let game = this.games[i];
                let input = gameMap.get(game);
                this.inputs.push(input);
            }
            for (let i = 0; i < this.nbBots - this.nbKeepBots; i++) {
                let input = new BotInput();
                let baseInput = this.inputs[Math.floor(Math.random()*this.nbKeepBots)];
                input.maxHeightCoefficient          = this.clamp(baseInput.maxHeightCoefficient       + this.random(-0.1, 0.1) , 0, 1);
                input.sumHeightCoefficient          = this.clamp(baseInput.sumHeightCoefficient       + this.random(-0.1, 0.1) , 0, 1);
                input.lineClearsCoefficient         = this.clamp(baseInput.lineClearsCoefficient      + this.random(-0.1, 0.1) , 0, 1);
                input.holesCoefficient              = this.clamp(baseInput.holesCoefficient           + this.random(-0.1, 0.1) , 0, 1);
                input.heightVariationCoefficient    = this.clamp(baseInput.heightVariationCoefficient + this.random(-0.1, 0.1) , 0, 1);
                input.unReachableCoefficient        = this.clamp(baseInput.unReachableCoefficient     + this.random(-0.1, 0.1) , 0, 1);
                this.inputs.push(input);
            }
        }

        this.generation++;

        this.games = [];
        for (let i = 0; i < this.nbBots; i++) {
            let game = new Game();
            let input = this.inputs[i];
            input.game = game;
            this.games.push(game);
        }
        this.winnerId = 0;
    }

    random(min, max) {
        return Math.random() * (max-min) + min;
    }

    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

}

export { BotTrainingModel };
