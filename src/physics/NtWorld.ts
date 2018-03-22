class NtWorld {
    renderer: NtIRenderer;
    list: NtBody[];
    joints: NtIJoint[];
    collisionResolver: NtCollisionResolver;
    constructor(renderer: NtIRenderer) {
        this.renderer = renderer;
        this.list = [];
        this.joints = [];
        this.collisionResolver = new NtCollisionResolver();
    }
    step(dt: number) {
        this.list.forEach(function(body) {
            body.collisions.clear();
            body.step(dt);
        });
        this.joints.forEach(function(joint) {
            joint.resolve();
        });
        for (let i = 0; i < this.list.length-1; i++) {
            let outer: NtBody = this.list[i];
            for (let j = i+1; j < this.list.length; j++) {
                let inner: NtBody = this.list[j];
                if (!(outer.layers & inner.layers)
                    || outer.collisions.has(inner)) {
                    return;
                }
                if (this.collisionResolver.isCollisionLikely(inner, outer)) {
                    let manifold: NtManifold = new NtManifold(inner, outer);
                    if (this.collisionResolver.hasCollision(manifold)) {
                        outer.collisions.add(inner);
                        inner.collisions.add(outer);
                        this.collisionResolver.resolve(manifold);
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
    addJoint(joint: NtIJoint) {
        this.joints.push(joint);
    }
    body_under_point(point: NtVec2): NtBody|null {
        for (let body of this.list) {
            let point_local: NtVec2 = NtVec2.rotate(NtVec2.subtract(point, body.position),
                -body.orientation);
            if (body.is_point_in_body(point_local)) {
                return body;
            }
        }
        return null;
    }
}
