const objectString = (value) => {
    const [operator_left, operator_right, operator_separator=', '] = Array.isArray(value) ? ['[', ']'] : ['{', '}'];

    return `<span class="bug-o">${operator_left}</span> ${
        Object.entries(value).map(([k,v])=>bugString(k,v,'bug-prop')).join(operator_separator)
    } <span class="bug-o">${operator_right}</span>`;
}

const valueString = (value) => {
    if (typeof value === 'string') return `<span class="bug-v bug-s">"${value}"</span>`;
    if (typeof value === 'number') return `<span class="bug-v bug-n">${Math.round((value + Number.EPSILON) * 100 / 100)}</span>`;
    return `<span class="bug-v bug-unknown">${value}</span>`;
}

const bugString = (name, value, type='bug') => {
    return `<div class="${type}"><strong>${name}</strong>: ${
        (typeof value === 'object') ? objectString(value) : valueString(value)
    }</div>`;
}

export class Bug {
    constructor(name, checker) {
        this.name = name;
        this.checker = checker;
        Dbgr.add(this);
    }

    valuestring = valueString.bind(this);
    objectstring = objectString.bind(this);

    get toString() {
        return bugString(this.name, this.checker());
    }
}

export class Dbgr {
    static #items = [];
    static quick = null;

    static get(name) { return this.#items.find(i=>i.name===name); }
    static type(type) { return this.#items.filter(i=>i.type===type); }
    static add(item) { this.#items.push(item); }
    static remove(name) { this.#items = this.#items.filter(i=>i.name!==name); }

    static draw() {
        const div = document.querySelector('.debugger .list');
        div.innerHTML = this.#items.map(i=>i.toString).join('');

        if (this.quick) {
            const div = document.querySelector('.debugger .quick');
            div.innerHTML = bugString("quick", this.quick);
        }
    }
}