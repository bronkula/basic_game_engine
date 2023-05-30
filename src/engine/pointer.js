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
    static #keycodes = {};

    static isDragging = false;
    static buttons = [false,false,false];
    static touches = [];


    static init() {
        window.addEventListener('keydown',this.keydown);
        window.addEventListener('keyup',this.keyup);
        window.addEventListener('mousemove',this.mousemove);
        window.addEventListener('mousedown',this.mousedown);
        window.addEventListener('mouseup',this.mouseup);
        window.addEventListener('touchmove',this.touchmove);
        window.addEventListener('touchstart',this.touchstart);
        window.addEventListener('touchend',this.touchend);

        window.addEventListener('contextmenu',e=>{e.preventDefault();return false;});
    }

    static keydown = (e) => {
        this.keycodes[e.code] = true;
    }
    static keyup = (e) => {
        delete this.keycodes[e.code];
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

    static touchmove = (e) => {
        let tts = [...e.targetTouches];
        tts.forEach(t => {
            let tt = this.touches.find(tt => tt.id === t.identifier);
            tt.x = t.pageX;
            tt.y = t.pageY;
        });
        this.pos = new Vector(tts[0].pageX,tts[0].pageY);
        if (this.hasDragged) {
            if (!this.isDragging) {
                this.isDragging = true;
            }
        }
    }
    static touchstart = (e) => {
        let touch = e.changedTouches[0];
        this.touches.push(new Point(touch));
        this.pos = new Vector(touch.pageX,touch.pageY);
    }
    static touchend = (e) => {
        this.touches = this.touches.filter((t) => ![...e.changedTouches].some(ct => ct.identifier === t.id));
        if(!this.hasDragged) {
            this.isDragging = false;
        }
    }

    static set pos({x,y}) { this.#x = x; this.#y = y; }
    static get pos() { return new Vector(this.#x, this.#y); }
    
    static get x() { return this.#x; }
    static get y() { return this.#y; }

    static get keycodes() { return this.#keycodes; }

    static get hasDragged() {
        return this.buttons.some(b => b && b.x!==this.pos.x && b.y!==this.pos.y) ||
            this.touches.some(t => t && t.x!==this.pos.x && t.y!==this.pos.y);
    }
}