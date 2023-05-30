import { Vector } from "./vector.js";

export class Point {
    constructor(touch) {
        this.id = touch.identifier || 0;
        this.startx = touch.pageX;
        this.starty = touch.pageY;
        this.x = touch.pageX;
        this.y = touch.pageY;
        this.t = Date.now();
    }
}

export class Pointer {
    static #x = 0;
    static #y = 0;

    static hasDragged = false;
    static isDragging = false;
    static buttons = [false,false,false];
    static touches = [];


    static init() {
        window.addEventListener('mousemove',this.mousemove);
        window.addEventListener('mousedown',this.mousedown);
        window.addEventListener('mouseup',this.mouseup);
    }

    static mousemove = (e) => {
        e.preventDefault();
        this.pos = {x:e.pageX, y:e.pageY};
        if (this.hasDragged) {
            if (!this.isDragging) {
                this.isDragging = true;
            }
        }
    }
    static mousedown = (e) => {
        e.preventDefault();
        this.buttons[e.button] = new Point(e);
    }
    static mouseup = (e) => {
        e.preventDefault();
        this.buttons[e.button] = false;
        if(!this.hasDragged) {
            this.isDragging = false;
        }
    }

    static set pos({x,y}) { this.#x = x; this.#y = y; }
    static get pos() { return new Vector(this.#x, this.#y); }
    
    static get x() { return this.#x; }
    static get y() { return this.#y; }

    static get hasDragged() {
        return this.buttons.some(b => b && b.x!=this.pos.x && b.y!=this.pos.y) ||
            this.touches.some(t => t && t.x!=this.pos.x && t.y!=this.pos.y);
    }
}