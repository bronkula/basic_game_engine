
const objectString = (o) => {
    let [opl,opr,opc=','] = Array.isArray(o) ? ['[',']'] : ['{','}'];
    return `<span class="bug-o">${opl}</span>` +
        Object.entries(o).map(
            ([k,v]) => bugString(k,v,'bug-prop')
        ,`<span class="bug-o">${opc}</span> `) +
        `<span class="bug-o">${opr}</span>`;
}

const valueString = (v) => {
    let output = '';
    if (typeof v === 'string') {
        output = `<span class="bug-v bug-s">${v}</span>`;
    } else if (typeof v === 'number') {
        output = `<span class="bug-v bug-n">${Math.round((v + Number.EPSILON) * 100) / 100}</span>`;
    } else {
        output = `<span class="bug-v">${v}</span>`;
    }
    return output;
}

const bugString = (k,v,type='bug') => {
    return `<div class="${type}"><strong>${k}</strong> ${
        (typeof v === 'object') ? objectString(v) : valueString(v)
    }</div>`;
}

export class Bug {
    constructor(name, checker) {
        this.name = name;
        this.checker = checker;
        Dbgr.add(this);
    }

    valueString = valueString.bind(this);
    objectString = objectString.bind(this);

    get toString() {
        return bugString(this.name, this.checker());
    }
}

export class Dbgr {
    static _items = [];

    static get(name) { return this._items.find(o => o.name === name); }
    static type(type) { return this._items.filter(o => o.type === type); }
    static add(item) { this._items.push(item); }
    static remove(name) { this._items = this._items.filter(o => o.name !== name); }

    static draw() {
        let div = document.querySelector('.debugger .list');
        div.innerHTML = this._items.reduce((r,o) => r+o.toString, '');

        if(this.quick) {
            div = document.querySelector('.debugger .quick');
            div.innerHTML = bugString("quick", this.quick);
        }
    }
}