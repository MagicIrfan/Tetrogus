import { BaseGameView } from "./base-game-view.js";
import { Color } from "./utils/color.js";

class BotTrainingView extends BaseGameView {

    constructor() {
        super();
        this.activateAIButton.destroy();
        this.elements.delete(this.activateAIButton);
        this.pauseButton.x = -10;
        this.backToMenuButton.x = 10;
    }

    draw(data) {
        super.draw();

        this.drawPlayerGame(data.grid, data.score, data.level, data.rowsDestroyed, 4);

        this.canvas.setColor(new Color(255,255,255,1));

        this.canvas.drawText("Génération : " + data.generation, "Arial", 3, -80, -40);
        this.canvas.drawText("Bots en vie : "+data.botsAlive+"/"+data.nbBots, "Arial", 3, -80, -35);

        this.canvas.setColor(new Color(0,0,0,1));

        this.canvas.drawText("Coefficients :", "Courier New", 2, -40, -6);
        this.canvas.drawText("maxHeight :   " + (data.coefficients.maxHeightCoefficient      ).toFixed(10) , "Courier New", 1.2, -40, -3);
        this.canvas.drawText("sumHeight :   " + (data.coefficients.sumHeightCoefficient      ).toFixed(10) , "Courier New", 1.2, -40, -1);
        this.canvas.drawText("lineClears :  " + (data.coefficients.lineClearsCoefficient     ).toFixed(10) , "Courier New", 1.2, -40, 1);
        this.canvas.drawText("holes :       " + (data.coefficients.holesCoefficient          ).toFixed(10) , "Courier New", 1.2, -40, 3);
        this.canvas.drawText("height :      " + (data.coefficients.heightVariationCoefficient).toFixed(10) , "Courier New", 1.2, -40, 5);
        this.canvas.drawText("unReachable : " + (data.coefficients.unReachableCoefficient    ).toFixed(10) , "Courier New", 1.2, -40, 7);

        this.drawFPS();

        this.drawPostProcessCanvas();
    }

}

export { BotTrainingView };
