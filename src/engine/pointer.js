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
    static #scrolling = false;
    static #listeners = {
        mousedown:[],
        mouseup:[],
        mousemove:[],
        touchstart:[],
        touchend:[],
        touchmove:[],
        keydown:[],
        keyup:[],
        wheel:[],
        dragstart:[],
        dragend:[],
        drag:[],
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

        window.addEventListener('contextmenu',e=>{e.preventDefault();return false;});
    }

    static addListener(callee,type,fn) {
        let listener = this.#listeners[type].find(({c})=>c===callee);
        if (listener) listener.fn = fn;
        else this.#listeners[type].push({c:callee,fn});
    }
    static removeListener(callee,type) {
        this.#listeners[type] = this.#listeners[type].filter((l)=>l.c!==callee);
    }
    static triggerListeners(type,e) {
        this.#listeners[type].forEach(l=>l.fn(e));
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

    static wheel = (e) => {
        clearTimeout(this.#scrolling);
        this.#scrolling = setTimeout(() => {
            this.#scrolling = false;
            this.delta = new Vector(0,0,0);
        }, 200);
        this.delta = new Vector(e.deltaX,e.deltaY,e.deltaZ);
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