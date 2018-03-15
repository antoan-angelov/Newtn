class NtWorld {
    renderer: NtIRenderer;
    list: NtBody[];
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
        for (let i = 0; i < this.list.length-1; i++) {
            let outer: NtBody = this.list[i];
            for (let j = i+1; j < this.list.length; j++) {
                let inner: NtBody = this.list[j];
                if (!(outer.layers & inner.layers)
                    || outer.collisions.has(inner)) {
                    return;
                }
                if (that.collisionResolver.isCollisionLikely(inner, outer)) {
                    console.log("collision likely!")
                    let manifold: NtManifold = new NtManifold(inner, outer);
                    if (that.collisionResolver.hasCollision(manifold)) {
                        outer.collisions.add(inner);
                        inner.collisions.add(outer);
                        that.collisionResolver.resolve(manifold);
                    }
                }
            }
        }
    }
    add(object: NtBody) {
        this.list.push(object);
        this.renderer.add(object);
    }
    remove(object: NtBody) {
        var index: number = this.list.indexOf(object);
        if (index == -1) {
            return;
        }
        this.list.splice(index, 1);
        this.renderer.remove(object);
    }
}
