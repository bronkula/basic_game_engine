
export class Pointer {
    static #x;
    static #y;

    static init() {
        this.#x = 0;
        this.#y = 0;
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