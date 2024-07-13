import { vec2, vec3 } from "./vector.js";

export class Point {
    constructor(e) {
        this.id = e.identifier || 0;
        this.startx = e.pageX;
        this.starty = e.pageY;
        this.x = e.pageX;
        this.y = e.pageY;
        this.t = Date.now();
    }
}

export class Pointer {
    static #x = 0;
    static #y = 0;
    static #keycodes = {};
    static #scrolling = false;
    static isScrolling = false;
    static isDragging = false;
    static buttons = [false,false,false];
    static touches = [];
    static delta = vec3(0,0,0);

    static init() {
        window.addEventListener('mousemove',this.mousemove);
        window.addEventListener('mousedown',this.mousedown);
        window.addEventListener('mouseup',this.mouseup);
        window.addEventListener('keydown',this.keydown);
        window.addEventListener('keyup',this.keyup);
        window.addEventListener('wheel',this.wheel);
        window.addEventListener('touchmove',this.touchmove);
        window.addEventListener('touchstart',this.touchstart);
        window.addEventListener('touchend',this.touchend);
        window.addEventListener('contextmenu',e=>{e.preventDefault();return false;});

    }

    static set pos({x,y}) { this.#x = x; this.#y = y; }
    static get pos() { return { x:this.#x, y:this.#y }; }

    static mousemove = (e) => {
        e.preventDefault();
        this.pos = vec2(e.pageX, e.pageY);
        this.buttons.forEach((b,i)=>{
            if(b) {
                b.x = e.pageX;
                b.y = e.pageY;
            }
        });
        if(this.hasDragged) {
            if(!this.isDragging) {
                this.isDragging = true;
            }
        }
    }
    static mousedown = (e) => {
        e.preventDefault();
        this.pos = vec2(e.pageX, e.pageY);
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
        let targettouches = [...e.targetTouches];
        targettouches.forEach(t=>{
            let touch = this.touches.find(tt=>tt.id===t.identifier);
            if(touch) {
                touch.x = t.pageX;
                touch.y = t.pageY;
            }
        });
        this.pos = vec2(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
        if(this.hasDragged) {
            if(!this.isDragging) {
                this.isDragging = true;
            }
        }
    }

    static touchstart = (e) => {
        const touch = e.changedTouches[0];
        this.touches.push(new Point(touch));
        this.pos = vec2(this.touches[0].x, this.touches[0].y);
    }

    static touchend = (e) => {
        const touch = e.changedTouches[0];
        this.touches = this.touches.filter(t=>t.id!==touch.identifier);
        if(!this.hasDragged) {
            this.isDragging = false;
        }
    }

    static keydown = (e) => {
        this.#keycodes[e.code] = true;
    }
    static keyup = (e) => {
        this.#keycodes[e.code] = false;
    }

    static wheel = (e) => {
        e.preventDefault();
        this.delta = vec3(e.deltaX,e.deltaY,e.deltaZ);
        if(this.#scrolling) {
            clearTimeout(this.#scrolling);
        }
        this.#scrolling = setTimeout(()=> {
            this.#scrolling = false;
            this.delta = vec3(0,0,0);
        },200);
    }

    static get keycodes() {
        return this.#keycodes;
    }

    static get hasDragged() {
        return this.buttons.some(b=>b && b.x !== b.startX && b.y !== b.startY) ||
            this.touches.some(t=>t && t.x !== t.startX && t.y !== t.startY);
    }

    static get export () {
        return {
            pos: this.pos,
            buttons: this.buttons,
            touches: this.touches,
            delta: this.delta,
            keycodes: this.keycodes,
            hasDragged: this.hasDragged,
            isDragging: this.isDragging
        }
    }
}

window.Pointer = Pointer;