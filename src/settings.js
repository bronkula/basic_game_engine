
export class Settings {
    static #props = {};

    static get(prop) { return this.#props[prop]; }
    static add(prop,value) {
        if(!Object.getOwnPropertyDescriptors(this)[prop]) {
            Object.defineProperty(this,prop,{
                configurable:true,
                enumerable:true,
                get:()=>this.#props[prop],
                set:(val)=>{this.#props[prop]=val;},
            });
        }
        this.#props[prop] = value;
    }
    static remove(prop) { delete this.#props[prop]; }
}