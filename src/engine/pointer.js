import { Vector } from "./vector.js";

export class Point {
    constructor(e) {
        this.id = e.identifier || e.button || 0;
        this.startx = e.pageX;
        this.starty = e.pageY;
        this.x = e.pageX;
        this.y = e.pageY;
        this.t = Date.now();
    }
}

export class Key {
    constructor(e) {
        this.code = e.code;
        this.key = e.key;
        this.t = Date.now();
    }
}

export class Pointer {
    static #x = 0;
    static #y = 0;
    static #keycodes = {};
    static #scrollTimer = false;
    static #listeners = {
        keydown: [],
        keyup: [],
        mousemove: [],
        mousedown: [],
        mouseup: [],
        touchmove: [],
        touchstart: [],
        touchend: [],
        wheel: [],
        dragstart: [],
        dragend: [],
        drag: [],
        mouseclick: [],
        touchclick: [],
        keyclick: [],
    }

    static isDragging = false;
    static buttons = [false,false,false,false,false];
    static touches = [];
    static delta = new Vector(0,0,0);

    static init() {
        window.addEventListener('keydown',this.keydown);
        window.addEventListener('keyup',this.keyup);

        window.addEventListener('mousemove',this.mousemove);
        window.addEventListener('mousedown',this.mousedown);
        window.addEventListener('mouseup',this.mouseup);
        
        window.addEventListener('touchmove',this.touchmove);
        window.addEventListener('touchstart',this.touchstart);
        window.addEventListener('touchend',this.touchend);

        window.addEventListener('wheel',this.wheel);

        window.addEventListener('contextmenu',(e)=>{e.preventDefault(); return false;});
    }

    static addListener(callee, type, func) {
        let listener = this.#listeners[type].find(l => l.callee == callee);
        if (listener) listener.func = func;
        else this.#listeners[type].push({callee,func});
    }
    static removeListener(callee, type) {
        this.#listeners[type] = this.#listeners[type].filter(l => l.callee != callee);
    }
    static triggerListeners(type,e) {
        this.#listeners[type].forEach(l => l.func(e));
    }

    static keydown = (e) => {
        if (!this.#keycodes[e.code]) this.#keycodes[e.code] = new Key(e);
    }
    static keyup = (e) => {
        delete this.#keycodes[e.code];
    }

    static mousemove = (e) => {
        e.preventDefault();
        this.pos = {x:e.pageX, y:e.pageY};
        if (this.hasDragged) {
            if (!this.isDragging) {
                this.triggerListeners('dragstart',e);
                this.isDragging = true;
            } else {
                this.triggerListeners('drag',e);
            }
        }
    }
    static mousedown = (e) => {
        e.preventDefault();
        this.pos = {x:e.pageX, y:e.pageY};
        this.buttons[e.button] = new Point(e);
    }
    static mouseup = (e) => {
        e.preventDefault();
        this.buttons[e.button] = false;
        if (!this.hasDragged) {
            this.triggerListeners('dragend',e);
            this.isDragging = false;
        }
    }

    static touchmove = (e) => {
        let tts = [...e.targetTouches];
        tts.forEach((t) => {
            let tt = this.touches.find(tt => tt.id == t.identifier);
            if (tt) {
                tt.x = t.pageX;
                tt.y = t.pageY;
            }
        });
        this.pos = new Vector(tts[0].pageX, tts[0].pageY);
        if (this.hasDragged) {
            if (!this.isDragging) {
                this.triggerListeners('dragstart',e);
                this.isDragging = true;
            } else {
                this.triggerListeners('drag',e);
            }
        }
    }
    static touchstart = (e) => {
        let touch = e.changedTouches[0];
        this.touches.push(new Point(touch));
        this.pos = new Vector(touch.pageX, touch.pageY);
    }
    static touchend = (e) => {
        this.touches = this.touches.filter(t => ![...e.changedTouches].some(ct => ct.identifier == t.id));
        if (!this.hasDragged) {
            this.triggerListeners('dragend',e);
            this.isDragging = false;
        }
    }

    static wheel = (e) => {
        clearTimeout(this.#scrollTimer);
        this.#scrollTimer = setTimeout(() => {
            this.#scrollTimer = false;
            this.delta = new Vector(0,0,0);
        }, 200);
        this.delta = new Vector(e.deltaX, e.deltaY, e.deltaZ);
    }
    
    static set pos({x,y}) { this.#x = x; this.#y = y; }
    static get pos() { return new Vector( this.#x, this.#y ); }

    static get keycodes() { return this.#keycodes; }

    static get hasDragged() {
        return this.buttons.some(b => b && this.pos.x != b.startx && this.pos.y != b.starty);
    }
}