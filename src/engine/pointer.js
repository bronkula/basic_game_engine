import { vec3 } from "./vector.js";

export class Pointer {
    static #x = 0;
    static #y = 0;
    static #keycodes = {};
    static #scrolling = false;
    static buttons = [false,false,false];
    static touches = [];
    static delta = vec3(0,0,0);

    static init() {
        window.addEventListener('mousemove',this.mousemove);
        window.addEventListener('mousedown',this.mousedown);
        window.addEventListener('mouseup',this.mouseup);
    }

    static set pos({x,y}) { this.#x = x; this.#y = y; }
    static get pos() { return { x:this.#x, y:this.#y }; }

    static mousemove = (e) => {
        this.pos = {x:e.pageX, y:e.pageY};
    }
    static mousedown = (e) => {
        this.pos = {x:e.pageX, y:e.pageY};
    }
    static mouseup = (e) => {

    }
}