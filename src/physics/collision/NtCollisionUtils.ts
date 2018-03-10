class NtCollisionUtils {
    static AABBvsAABB(manifold: NtManifold): boolean  {
        let A: NtBase = manifold.A;
        let B: NtBase = manifold.B;
        let n: NtVec2 = NtVec2.subtract(B.position, A.position);
        let abox: NtAABB = A.aabb;
        let bbox: NtAABB = B.aabb;
        let overlap: NtVec2 = new NtVec2();

        // half extents along x axis for each object
        let a_extent: number = (abox.max.x - abox.min.x) / 2;
        let b_extent: number = (bbox.max.x - bbox.min.x) / 2;

        // calculate overlap on x axis
        overlap.x = a_extent + b_extent - Math.abs(n.x);
        if (overlap.x > 0) {
            // half extents along y axis for each object
            let a_extent: number = (abox.max.y - abox.min.y) / 2;
            let b_extent: number = (bbox.max.y - bbox.min.y) / 2;

            // calculate overlap on y axis
            overlap.y = a_extent + b_extent - Math.abs(n.y);
            if (overlap.y > 0) {
                NtCollisionUtils.calculateNormal(manifold, overlap, n);
                return true;
            }
        }
        return false;
    }

    private static calculateNormal(manifold: NtManifold, overlap: NtVec2,
            n: NtVec2) {
        //  find out which axis has least penetration
        if (overlap.x > overlap.y) {
            manifold.normal = new NtVec2(0, Math.sign(n.x));
            manifold.penetration = overlap.x;
        } else {
            manifold.normal = new NtVec2(Math.sign(n.y), 0);
            manifold.penetration = overlap.y;
        }
    }
}
