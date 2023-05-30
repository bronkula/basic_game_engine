import { drawCircle, drawLine, drawRect } from "../engine/canvas.js";
import { Bug, Dbgr } from "../engine/debug.js";
import { Pointer } from "../engine/pointer.js";

export class Level {
    constructor() {
        this.setup();

        new Bug('pointer pos', () => Pointer.pos.xy);
        new Bug('pointer isDragging', () => Pointer.isDragging);
        new Bug('pointer hasDragged', () => Pointer.hasDragged);
        new Bug('buttons', () => Pointer.buttons);
        new Bug('touches', () => Pointer.touches);
        new Bug('keys', () => Pointer.keycodes);
        new Bug('wheel', () => Pointer.delta.xyz);
    }
    setup = async () => {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.setScreenSize();
    }

    run() {

        drawRect(this.ctx,0,0,window.innerWidth,window.innerHeight,{fillStyle:'white'});
        if (Pointer.isDragging) {
            Pointer.buttons.forEach((b) => {
                if (b) drawLine(this.ctx,b.x,b.y,Pointer.pos.x,Pointer.pos.y,{strokeStyle:'#bbb',lineWidth:2});
            });
        }
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