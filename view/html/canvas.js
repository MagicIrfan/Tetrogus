import { HtmlElement } from "./html-element.js";

class Canvas extends HtmlElement {

    constructor() {
        super();
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        this.canvas.style = "position: absolute";
        this.context = this.canvas.getContext("2d");

        this.scale = 1;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }

    destroy() {
        document.body.removeChild(this.canvas);
    }

    setSize(width, height) {
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.scale = this.canvas.height * 0.01;
        }
    }

    transformContext() {
        this.context.lineWidth = 0.2;
        this.context.translate(this.canvas.width * this.anchorX, this.canvas.height * this.anchorY);
        this.context.scale(this.scale, this.scale);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setColor(color) {
        this.context.fillStyle = color.getText();
        this.context.strokeStyle = color.getText();
    }

    setAnchor(x, y) {
        this.anchorX = x;
        this.anchorY = y;
    }

    fillRectangle(x, y, w, h) {
        this.context.save();
        this.transformContext();
        this.context.fillRect(x, y, w, h);
        this.context.restore();
    }

    drawRectangle(x, y, w, h) {
        this.context.save();
        this.transformContext();
        this.context.strokeRect(x, y, w, h);
        this.context.restore();
    }

    drawImage(img, x, y, w, h) {
        this.context.save();
        this.transformContext();
        this.context.drawImage(img, x, y, w, h);
        this.context.restore();
    }

    drawText(text, font, size, x, y) {
        this.context.save();
        this.transformContext();
        this.context.translate(0, size);
        this.context.font = size + "px " + font;
        this.context.fillText(text, x, y);
        this.context.restore();
    }

    drawLine(x1, y1, x2, y2) {
        this.context.save();
        this.transformContext();
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.restore();
    }

}

export { Canvas }