import { drawCircle, drawRect } from "../engine/canvas.js";
import { Bug, Dbgr } from "../engine/debug.js";
import { Pointer } from "../engine/pointer.js";

export class Level {
    constructor() {
        this.setup();

        new Bug('pointer',()=>Pointer.pos);
    }
    setup = async () => {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.setScreenSize();
    }

    run() {
        drawRect(this.ctx,0,0,window.innerWidth,window.innerHeight,{fillStyle:'white'});
        drawCircle(this.ctx,Pointer.pos.x,Pointer.pos.y,10,0,Math.PI*2,{fillStyle:'red'});
        Dbgr.draw();
    }

    setScreenSize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.canvas.width = w;
        this.canvas.height = h;
    }
}