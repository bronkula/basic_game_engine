import { Level } from "../levels/level.js";
import { Pointer } from "./pointer.js";
import { Settings } from "./settings.js";

class Game {
    constructor() {
        this.level = new Level();
        this.previoustime = Date.now();

        Pointer.init();

        this.run();
    }

    run = () => {
        let newtime = Date.now();
        Settings.dt = (newtime - this.previoustime) / 1000;
        this.previoustime = newtime;

        this.level.run();

        requestAnimationFrame(this.run);
    }
}

window.addEventListener("DOMContentLoaded", () => { new Game(); });