import { BaseGameView } from "./base-game-view.js";
import { GridView } from "./drawable/gridview.js";
import { Color } from "./utils/color.js";


class TetrisView extends BaseGameView {
    constructor() {
        super();
        this.playerGrid = new GridView(10,20,4,0,0,new Color(0,0,0,1),new Color(50,50,50,1),true);
    }

    draw(data) {
        super.draw();

        this.drawPlayerGame(data.grid, data.score, data.level, data.rowsDestroyed, 4);

        this.drawFPS();

        this.drawPostProcessCanvas();
    }


}

export { TetrisView }