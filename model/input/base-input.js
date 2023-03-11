class BaseInput {

    constructor(game) {
        this.game = game;
        this.enabled = true;
    }

    update(frameTime) {

    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    moveLeft() {
        if (!this.enabled)
            return;
        this.game.moveLeft();
    }

    moveRight() {
        if (!this.enabled)
            return;
        this.game.moveRight();
    }

    rotate() {
        if (!this.enabled)
            return;
        this.game.rotateRight();
    }

    hold() {
        if (!this.enabled)
            return;
        this.game.holdTetromino();
    }

    softDrop() {
        if (!this.enabled)
            return;
        this.game.accelerate();
    }

    hardDrop() {
        if (!this.enabled)
            return;
        this.game.fallTetromino();
    }

}

export { BaseInput };
