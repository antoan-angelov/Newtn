class NtWorld {
    renderer: NtIRenderer;
    list: NtBase[];
    constructor(renderer: NtIRenderer) {
        this.renderer = renderer;
        this.list = [];
    }
    add(object: NtBase) {
        this.list.push(object);
        this.renderer.add(object);
    }
    remove(object: NtBase) {
        var index: number = this.list.indexOf(object);
        if (index == -1) {
            return;
        }
        this.list.splice(index, 1);
        this.renderer.remove(object);
    }
}
