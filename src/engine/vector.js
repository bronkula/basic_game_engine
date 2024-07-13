export class Vector {
    constructor(...parts) {
        this.parts =
            parts.length === 0 ? [0,0] :
            Array.isArray(parts[0]) ? [...parts[0]] :
            [...parts];
    }

    add({parts}) {
        return new this.constructor(
            ...parts.map((part,index)=>part + this.parts[index])
        )
    }
    subtract({parts}) {
        return new this.constructor(
            ...parts.map((part,index)=>this.parts[index] - part)
        )
    }
    multiply(scalar) {
        return new this.constructor(
            ...this.parts.map(part=>part * scalar)
        )
    }
    lerp({parts},scalar) {
        return new this.constructor(
            ...parts.map((part,index)=>this.parts[index] + (part - this.parts[index]) * scalar)
        )
    }
    distance({parts}) {
        return Math.hypot(
            ...parts.map((part,index)=>part - this.parts[index])
        )
    }
    magnitude() {
        return Math.hypot(...this.parts);
    }
    normalize() {
        return this.multiply(1 / this.magnitude());
    }
    dot({parts}) {
        return parts.reduce((acc,part,index)=>acc + part * this.parts[index],0);
    }
    cross({parts}) {
        return new this.constructor(
            this.parts[1] * parts[2] - this.parts[2] * parts[1],
            this.parts[2] * parts[0] - this.parts[0] * parts[2],
            this.parts[0] * parts[1] - this.parts[1] * parts[0]
        )
    }
    clamp(min,max) {
        return new this.constructor(
            ...this.parts.map(part=>Math.min(Math.max(part,min),max))
        )
    }

    get copy() {
        return new this.constructor(this.parts);
    }

    get x() { return this.parts[0]; }
    get y() { return this.parts[1]; }
    get z() { return this.parts[2]; }

    set x(value) { this.parts[0] = value; }
    set y(value) { this.parts[1] = value; }
    set z(value) { this.parts[2] = value; }
}

export class Vec2 extends Vector {}
export class Vec3 extends Vector {}
export const vec2 = (...parts) => new Vec2(...parts);
export const vec3 = (...parts) => new Vec3(...parts);
