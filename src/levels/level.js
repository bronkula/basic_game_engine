import { drawCircle, drawLine, drawRect } from "../engine/canvas.js";
import { Bug, Dbgr } from "../engine/debug.js";
import { Pointer } from "../engine/pointer.js";

export class Level {
    constructor() {
        this.setup();
    }
    setup = async () => {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.setScreenSize();

        new Bug("Pointer",()=>Pointer.pos.xy);
        new Bug("Pointer isDragging",()=>Pointer.isDragging);
        new Bug("Pointer buttons",()=>Pointer.buttons);
        new Bug("Pointer touches",()=>Pointer.touches);
        new Bug("Pointer keycodes",()=>Pointer.keycodes);
        new Bug("Pointer delta",()=>Pointer.delta.xyz);

        Pointer.addListener(this, 'dragend', ()=>{console.log('dragend')});
        Pointer.addListener(this, 'dragstart', ()=>{console.log('dragstart')});
    }

    run() {
        drawRect(this.ctx,0,0,window.innerWidth,window.innerHeight,{fillStyle:'white'});

        if (Pointer.isDragging) {
            Pointer.buttons.forEach((b) => {
                if (b) {
                    drawLine(this.ctx,b.startx,b.starty,Pointer.pos.x,Pointer.pos.y,{strokeStyle:'gray',lineWidth:2});
                }
            })
        }

        drawCircle(this.ctx,Pointer.pos.x,Pointer.pos.y,10,0,Math.PI*2,{fillStyle:'red'});

        // Dbgr.quick = {w:window.innerWidth,h:window.innerHeight};
        Dbgr.draw();
    }

    setScreenSize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.canvas.width = w;
        this.canvas.height = h;
    }
}