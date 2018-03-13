class NtWorld {
    renderer: NtIRenderer;
    list: NtBase[];
    collisionResolver: NtCollisionResolver;
    constructor(renderer: NtIRenderer) {
        this.renderer = renderer;
        this.list = [];
        this.collisionResolver = new NtCollisionResolver();
    }
    step(dt: number) {
        let that = this;
        this.list.forEach(function(element) {
            element.collisions.clear();
            element.step(dt);
        });
        this.list.forEach(function(outer) {
            that.list.forEach(function(inner) {
                if (outer == inner
                    || !(outer.layers & inner.layers)
                    || outer.collisions.has(inner)) {
                    return;
                }
                let manifold: NtManifold = new NtManifold(inner, outer);
                if (that.collisionResolver.hasCollision(manifold)) {
                    outer.collisions.add(inner);
                    inner.collisions.add(outer);
                    that.collisionResolver.resolve(manifold);
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
