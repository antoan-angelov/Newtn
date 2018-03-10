class NtWorld {
    renderer: NtIRenderer;
    list: NtBase[];
    constructor(renderer: NtIRenderer) {
        this.renderer = renderer;
        this.list = [];
    }
    step() {
        let that = this;
        this.list.forEach(function(element) {
            element.collisions.clear();
        });
        this.list.forEach(function(outer) {
            that.list.forEach(function(inner) {
                if (outer == inner) {
                    return;
                }
                if (outer.collidesWith(inner)) {
                    outer.collisions.add(inner);
                    inner.collisions.add(outer);
                }
            });
        });
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
