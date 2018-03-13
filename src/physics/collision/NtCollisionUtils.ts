class NtCollisionUtils {
    static AABBvsAABB(manifold: NtManifold): boolean  {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
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

    static CircleVsCircle(manifold: NtManifold): boolean {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let a_shape: NtCircleShape = <NtCircleShape>A.shape;
        let b_shape: NtCircleShape = <NtCircleShape>B.shape;
        let n: NtVec2 = NtVec2.subtract(B.position, A.position);
        let min_distance: number = a_shape.radius + b_shape.radius;
        min_distance *= min_distance;

        if (NtVec2.distanceSquared(A.position, B.position) > min_distance) {
            return false;
        }
        let distance: number = NtVec2.distance(A.position, B.position);
        if (distance != 0) {
            manifold.penetration = min_distance - distance;
            manifold.normal = NtVec2.divide(n, distance);
        }  else {
            manifold.penetration = a_shape.radius;
            manifold.normal = new NtVec2(1, 0);
        }
        return true;
    }

    static AABBvsCircle(manifold: NtManifold) {
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let b_shape: NtCircleShape = <NtCircleShape>B.shape;
        let abox: NtAABB = A.aabb;
        let temp_list: NtVec2[] = [
            // top
            new NtVec2(abox.min.x, abox.min.y),
            new NtVec2(abox.max.x, abox.min.y),
            // bottom
            new NtVec2(abox.min.x, abox.max.y),
            new NtVec2(abox.max.x, abox.max.y),
            // left
            new NtVec2(abox.min.x, abox.min.y),
            new NtVec2(abox.min.x, abox.max.y),
            // right
            new NtVec2(abox.max.x, abox.min.y),
            new NtVec2(abox.max.x, abox.max.y)];
        let closest: NtVec2 = new NtVec2(Number.MAX_VALUE, Number.MAX_VALUE);
        let min_dist: number = Number.MAX_VALUE;
        for (let i: number = 0; i < 4; i++) {
            let side: NtVec2 = NtCollisionUtils.segmentProjection(B.position,
                temp_list[i * 2], temp_list[i * 2 + 1]);
            let side_dist: number = NtVec2.distanceSquared(side, B.position);
            if (min_dist > side_dist) {
                closest = side;
                min_dist = side_dist;
            }
        }
        let dist_squared: number = NtVec2.distanceSquared(closest, B.position);
        if (dist_squared > b_shape.radius * b_shape.radius) {
            return false;
        }
        let distance: number = NtVec2.distance(closest, B.position);
        let normal: NtVec2 =
            NtVec2.subtract(B.position, closest).divide(distance);
        manifold.penetration = b_shape.radius - distance;
        manifold.normal = normal;
        return true;
    }

    private static segmentProjection(point: NtVec2, A: NtVec2,
            B: NtVec2): NtVec2 {
        let segment_length_squared: number = NtVec2.distanceSquared(A, B);
        if (segment_length_squared == 0) {
            return NtVec2.fromVec(A);
        }
        let t: number = ((point.x - A.x) * (B.x - A.x)
            + (point.y - A.y) * (B.y - A.y)) / segment_length_squared;
        t = Math.max(0, Math.min(1, t));
        return new NtVec2(A.x + t * (B.x - A.x), A.y + t * (B.y - A.y));
    }
}
