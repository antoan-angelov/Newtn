class NtRaycaster {
    private world: NtWorld;

    constructor(world: NtWorld) {
        this.world = world;
    }

    raycast(emitting_body: NtBody, origin: NtVec2, target: NtVec2, manifold: NtRaycastManifold): boolean {
        let bodies: NtBody[] = this.world.list;
        for (let body of bodies) {
            if (emitting_body == body) {
                continue;
            }
            let origin_local: NtVec2 = NtVec2.rotate(NtVec2.subtract(origin, body.position),
                -body.orientation);
            let target_local: NtVec2 = NtVec2.rotate(NtVec2.subtract(target, body.position),
                -body.orientation);
            let intersection: NtVec2|null =
                body.shape.intersection_with_segment(origin_local, target_local);
            if (intersection) {
                manifold.intersection_global.setVec(
                    NtVec2.add(NtVec2.rotate(intersection, body.orientation), body.position));
                manifold.other_body = body;
                return true;
            }
        }
        return false;
    }
}
