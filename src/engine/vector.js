
export class Vector {
    #parts = [0,0,0];

    constructor(...parts) {
        this.#parts = parts.length === 0 ? [0,0,0] :
        Array.isArray(parts[0]) ? [...parts[0]] :
        [...parts];
    }

    scale(float) {
        return new this.constructor(this.#parts.map(p => p * float));
    }

    get x() { return this.#parts[0]; }
    get y() { return this.#parts[1]; }
    get z() { return this.#parts[2]; }

    get xy() { return {x:this.#parts[0], y:this.#parts[1]}; }
    get xyz() { return {x:this.#parts[0], y:this.#parts[1], z:this.#parts[2]}; }

    get parts() { return [...this.#parts]; }

    set x(v) { this.#parts[0] = v; }
    set y(v) { this.#parts[1] = v; }
    set z(v) { this.#parts[2] = v; }
}