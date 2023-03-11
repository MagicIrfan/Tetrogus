import { Canvas } from "./html/canvas.js";
import { Color } from './utils/color.js';
import { Window } from "./utils/window.js";

export class BaseView {
    constructor() {
        this.elements = new Set();
        this.canvas = new Canvas();
        this.postProcessCanvas = new Canvas();
        this.postProcessCanvas.canvas.style.filter = "brightness(0.8) contrast(5) saturate(0.8) blur(5vh)";
        this.postProcessCanvas.canvas.style.mixBlendMode = "screen";
        this.elements.add(this.canvas);
        this.elements.add(this.postProcessCanvas);
        this.backgroundColor = new Color(255,255,255,1);
    }

    destroy() {
        for (const element of this.elements) {
            element.destroy();
        }
    }

    update(frameTime) {
        this.frameTime = frameTime;
        Window.Update();
        for (const element of this.elements) {
            element.update();
        }
    }

    draw() {
        this.canvas.setSize(Window.Width(), Window.Height());
        this.postProcessCanvas.setSize(Window.Width(), Window.Height());
        this.canvas.clear();
        this.canvas.setColor(this.backgroundColor);
        this.canvas.context.fillRect(0, 0, Window.Width(), Window.Height())
        this.postProcessCanvas.clear();
    }

    drawFPS() {
        this.canvas.setColor(new Color(0,0,0,1));
        this.canvas.setAnchor(0,0);
        this.canvas.fillRectangle(0, 0, 11, 4.5);
        this.canvas.setColor(new Color(255, 255, 255,1));
        this.canvas.drawText("FPS: " + (1/this.frameTime).toFixed(0), "Arial", 2, 1, 1);
        this.canvas.setAnchor(0.5,0.5);
    }

    drawPostProcessCanvas() {
        this.postProcessCanvas.context.drawImage(this.canvas.canvas, 0, 0, Window.Width(), Window.Height());
    }
}
