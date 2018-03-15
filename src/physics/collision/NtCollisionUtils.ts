class NtCollisionUtils {
    static AABBvsAABB(A: NtBody, B: NtBody): boolean  {
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
                return true;
            }
        }
        return false;
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

    static AABBvsCircle(A: NtBody, B: NtBody) {
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
        let min_dist: number = Number.MAX_VALUE;
        for (let i: number = 0; i < 4; i++) {
            let side: NtVec2 = NtCollisionUtils.segmentProjection(B.position,
                temp_list[i * 2], temp_list[i * 2 + 1]);
            let side_dist: number = NtVec2.distanceSquared(side, B.position);
            if (min_dist > side_dist) {
                min_dist = side_dist;
            }
        }
        if (min_dist > b_shape.radius * b_shape.radius) {
            return false;
        }
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

    static polygonVsPolygon(manifold: NtManifold): boolean {
        let penetration_result: [number, number] =
            this.axisLeastPenetration(manifold.A, manifold.B);
        let penetration: number = penetration_result[0];
        let vertex_index: number = penetration_result[1];
        if (penetration < 0) {
            // shapes not overlapping
            return false;
        }
        manifold.penetration = penetration;
        let shape_a: NtPolygonShape = <NtPolygonShape>manifold.A.shape;
        manifold.normal = NtVec2.rotate(shape_a.normals[vertex_index],
            manifold.A.orientation);
        return true;
    }

    static axisLeastPenetration(A: NtBody, B: NtBody): [number, number] {
        let best_distance: number = -Number.MAX_VALUE;
        let best_index: number = -1;
        let shape_a: NtPolygonShape = <NtPolygonShape>A.shape;
        let shape_b: NtPolygonShape = <NtPolygonShape>B.shape;
        for (var i = 0; i < shape_a.vertices.length; i++) {
            let face_normal: NtVec2 =
                NtVec2.rotate(shape_a.normals[i], A.orientation);
            let relative_normal: NtVec2 =
                NtVec2.rotate(face_normal, B.orientation);
            let support_point_local: NtVec2 =
                shape_b.get_support_point(relative_normal.negate());
            let support_point: NtVec2 = NtVec2.add(B.position,
                NtVec2.rotate(support_point_local, -B.orientation));
            let vertex: NtVec2 = NtVec2.add(A.position,
                NtVec2.rotate(shape_a.vertices[i], A.orientation));
            let dot: number = NtVec2.dotProduct(face_normal,
                NtVec2.subtract(support_point, vertex));
            if (dot > best_distance) {
                best_distance = dot;
                best_index = i;
            }
        }
        return [-best_distance, best_index];
    }
}
