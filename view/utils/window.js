class Window {

    static window = new Window();

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        this.keysPressed = new Set();

        this.keysPressedCurrentFrame = new Set();
        this.keysPressedLastFrame = new Set();
    }

    handleKeyDown(event) {
        if (!this.keysPressed.has(event.key)) this.keysPressed.add(event.key);
    }

    handleKeyUp(event) {
        if (this.keysPressed.has(event.key)) this.keysPressed.delete(event.key);
    }

    static Width() {
        return window.innerWidth;
    }

    static Height() {
        return window.innerHeight;
    }

    static Update() {
        this.window.keysPressedLastFrame.clear();
        for (const key of this.window.keysPressedCurrentFrame) {
            this.window.keysPressedLastFrame.add(key);
        }
        this.window.keysPressedCurrentFrame.clear();
        for (const key of this.window.keysPressed) {
            this.window.keysPressedCurrentFrame.add(key);
        }
    }

    static KeyPressed(key) {
        return this.window.keysPressedCurrentFrame.has(key) && !this.window.keysPressedLastFrame.has(key);
    }

    static KeyHold(key) {
        return this.window.keysPressedCurrentFrame.has(key);
    }

}

export { Window };