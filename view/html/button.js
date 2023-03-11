import { HtmlElement } from "./html-element.js";
import { Window } from "../utils/window.js";

class Button extends HtmlElement {

    constructor(params) {
        super();

        this.hover = false;
        this.click = false;

        this.text = params.text??"Button";
        this.size = params.size??2;
        this.weight = params.weight??"bold";
        this.color = params.color??"rgb(0,0,0)";
        this.background = params.background??"rgb(230,230,230)";
        this.backgroundHover = params.backgroundHover??"rgb(220,220,220)";
        this.backgroundClick = params.backgroundClick??"rgb(210,210,210)";
        this.borderRadius = params.borderRadius??0.5;
        this.width = params.width??10;
        this.height = params.height??5;
        this.x = params.x??20;
        this.y = params.y??20;
        this.button = document.createElement("button");
        document.body.appendChild(this.button);

        this.button.style.position = "absolute";
        this.button.style.transitionDuration = "200ms";

        this.onClick = () => {};
        this.button.addEventListener("mouseup", () => { if (this.click) this.onClick(); });
        this.button.addEventListener("mouseover", () => { this.hover = true; });
        this.button.addEventListener("mouseout", () => { this.hover = false; this.click = false; });
        this.button.addEventListener("mousedown", () => { this.click = true; });
    }

    destroy() {
        document.body.removeChild(this.button);
    }

    update() {
        let scale = Window.Height()/100;
        let width = this.width * scale;
        let height = this.height * scale;

        if (this.click) {
            this.button.style.background = this.backgroundClick;
        } else if (this.hover) {
            this.button.style.background = this.backgroundHover;
        } else {
            this.button.style.background = this.background;
        }
        this.button.style.color = this.color;
        this.button.style.border = "none";
        this.button.style.borderRadius = (this.borderRadius*scale)+"px";
        this.button.style.left = (Window.Width()/2 + this.x*scale - width/2) + "px";
        this.button.style.top = (Window.Height()/2 + this.y*scale - height/2) + "px";
        this.button.style.width = width + "px";
        this.button.style.height = height + "px";
        this.button.style.fontSize = (this.size*scale) + "px";
        this.button.style.fontWeight = this.weight;
        this.button.innerHTML = this.text;
    }

}

export { Button }
