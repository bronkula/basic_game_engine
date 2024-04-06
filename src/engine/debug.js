
const objectString = (o) => {
    let [opl,opr,opc=', '] = Array.isArray(o) ? ['[',']'] : ['{','}'];
    return `<span class="bug-o">${opl}</span>${
        Object.keys(o).map(k => bugString(k,o[k],'bug-prop')).join(`<span class="bug-o">${opc}</span>`)
    }<span class="bug-o">${opr}</span>`;
}

const valueString = (v) => {
    const span = (v) => `<span class="bug-v">${v}</span>`;
    if (typeof v == 'string') {
        return span(`"${v}"`);
    } else if (typeof v == 'object') {
        return objectString(v);
    } else if (typeof v == 'function') {
        return span(v.toString());
    } else if (typeof v == 'number') {
        return span(v.toString());
    } else if (typeof v == 'boolean') {
        return span(v.toString());
    } else {
        return span(v);
    }
}

const bugString = (k,v,type='bug') => {
    return `<div class="${type}"><strong>${k}</strong> ${valueString(v)}</div>`;
}

export class Bug {
    constructor(name,checker) {
        this.name = name;
        this.checker = checker;
        Dbgr.add(this);
    }

    get toString() {
        return bugString(this.name,this.checker());
    }
}

export class Dbgr {
    static #items = [];

    static get(name) { return this.#items.find(i => i.name == name); }
    static add(item) { this.#items.push(item); }
    static remove(name) { this.#items = this.#items.filter(i => i.name != name); }
    static type(type) { return this.#items.filter(i => i.type == type); }

    static draw() {
        document.querySelector('.debugger .list')
            .innerHTML = this.#items.map(i => i.toString).join('');

        if (Dbgr.quick !== undefined) {
            document.querySelector('.debugger .quick')
                .innerHTML = bugString("Quick", Dbgr.quick);
        }
    }
}