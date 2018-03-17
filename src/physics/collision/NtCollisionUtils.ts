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
        manifold.contact_points.push(NtVec2.add(A.position, NtVec2.rotate(
            NtVec2.multiply(manifold.normal, a_shape.radius), A.orientation)));
        return true;
    }

    static AABBvsCircle(A: NtBody, B: NtBody) {
        let b_shape: NtCircleShape = <NtCircleShape>B.shape;
        let abox: NtAABB = A.aabb;
        let temp_list: NtVec2[] = [
            // top
            new NtVec2(abox.min.x, abox.min.y), new NtVec2(abox.max.x, abox.min.y),
            // bottom
            new NtVec2(abox.min.x, abox.max.y), new NtVec2(abox.max.x, abox.max.y),
            // left
            new NtVec2(abox.min.x, abox.min.y), new NtVec2(abox.min.x, abox.max.y),
            // right
            new NtVec2(abox.max.x, abox.min.y), new NtVec2(abox.max.x, abox.max.y)];
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

    private static segmentProjection(point: NtVec2, A: NtVec2, B: NtVec2): NtVec2 {
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
        let A: NtBody = manifold.A;
        let B: NtBody = manifold.B;
        let penetration_a_result: [number, number] = this.axisLeastPenetration(A, B);
        if (penetration_a_result[0] >= 0) {
            // shapes not overlapping
            return false;
        }
        let penetration_b_result: [number, number] = this.axisLeastPenetration(B, A);
        if (penetration_b_result[0] >= 0) {
            // shapes not overlapping
            return false;
        }

        let ref_poly: NtPolygonShape;
        let ref_body: NtBody;
        let inc_body: NtBody;
        let ref_index: number;
        let flip: boolean;
        if (penetration_a_result[0] > penetration_b_result[0]) {
            ref_body = A;
            inc_body = B;
            ref_poly = <NtPolygonShape>A.shape;
            ref_index = penetration_a_result[1];
            flip = false;
        } else {
            ref_body = B;
            inc_body = A;
            ref_poly = <NtPolygonShape>B.shape;
            ref_index = penetration_b_result[1];
            flip = true;
        }

        let inc_face: [NtVec2, NtVec2] = this.find_incident_face(ref_body, inc_body, ref_index);

        let v1: NtVec2 = ref_poly.vertices[ref_index];
        let v2: NtVec2 = ref_poly.vertices[(ref_index + 1) % ref_poly.vertices.length];

        // transform vertices to world space
        v1 = NtVec2.add(ref_body.position, NtVec2.rotate(v1, ref_body.orientation));
        v2 = NtVec2.add(ref_body.position, NtVec2.rotate(v2, ref_body.orientation));

        // face side normal
        let side_plane_normal: NtVec2 = NtVec2.subtract(v2, v1).normalize();
        // orthogonize
        let ref_face_normal: NtVec2 = new NtVec2(side_plane_normal.y, -side_plane_normal.x);
        let ref_c: number = NtVec2.dotProduct(ref_face_normal, v1);
        let neg_side: number = -NtVec2.dotProduct(side_plane_normal, v1);
        let pos_side: number = NtVec2.dotProduct(side_plane_normal, v2);
        let side_plane_normal_neg: NtVec2 = NtVec2.negate(side_plane_normal);
        if (this.clip(side_plane_normal_neg, neg_side, inc_face) < 2) {
            return false;
        }
        if (this.clip(side_plane_normal, pos_side, inc_face) < 2) {
            return false;
        }

        manifold.normal = NtVec2.multiply(ref_face_normal, flip ? -1 : 1);

        // keep points behind reference face
        manifold.penetration = 0;
        let cp: number = 0;
        let separation: number = NtVec2.dotProduct(ref_face_normal, inc_face[0]) - ref_c;
        if (separation <= 0) {
            manifold.contact_points[cp] = inc_face[0]
            manifold.penetration += -separation;
            ++cp;
        }

        separation =  NtVec2.dotProduct(ref_face_normal, inc_face[1]) - ref_c;
        if (separation <= 0) {
            manifold.contact_points[cp] = inc_face[1]
            manifold.penetration += -separation;
            ++cp;
            manifold.penetration /= cp;
        }
        return true;
    }

    private static clip(n: NtVec2, c: number, face: [NtVec2, NtVec2]): number {
        let sp: number = 0;
        let out: [NtVec2, NtVec2] = [face[0], face[1]];

        // distances from each endpoint to the line
        // d = ax + by - c
        let d1: number = NtVec2.dotProduct(n, face[0]) - c;
        let d2: number = NtVec2.dotProduct(n, face[1]) - c;

        // if negative (behind plane), clip
        if (d1 <= 0) {
            out[sp++] = face[0];
        }
        if (d2 <= 0) {
            out[sp++] = face[1];
        }

        // if points are on different sides on the plane,
        // push intersection point
        if (d1 * d2 < 0) {
            let alpha: number = d1 / (d1 - d2);
            out[sp] = NtVec2.add(face[0], NtVec2.multiply(
                NtVec2.subtract(face[1], face[0]), alpha));
            sp++;
        }
        face[0] = out[0];
        face[1] = out[1];
        return sp;
    }

    private static find_incident_face(ref_body: NtBody, inc_body: NtBody,
            reference_index: number): [NtVec2, NtVec2] {
        let ref_poly: NtPolygonShape = <NtPolygonShape>ref_body.shape;
        let inc_poly: NtPolygonShape = <NtPolygonShape>inc_body.shape;
        let ref_normal: NtVec2 = ref_poly.normals[reference_index];
        // calculate reference normal in incident space
        // first to world space
        ref_normal = NtVec2.rotate(ref_normal, ref_body.orientation);
        // and now to incident space
        ref_normal = NtVec2.rotate(ref_normal, -inc_body.orientation);

        let inc_face: number = 0;
        let min_dot: number = Number.MAX_VALUE;
        for (let i = 0; i < inc_poly.vertices.length; i++) {
            let dot: number = NtVec2.dotProduct(ref_normal, inc_poly.normals[i]);
            if (dot < min_dot) {
                min_dot = dot;
                inc_face = i;
            }
        }
        let result: [NtVec2, NtVec2] = [new NtVec2(), new NtVec2()];
        result[0] =  NtVec2.add(inc_body.position, NtVec2.rotate(
            inc_poly.vertices[inc_face], inc_body.orientation));
        inc_face = (inc_face + 1) % inc_poly.vertices.length;
        result[1] = NtVec2.add(inc_body.position, NtVec2.rotate(
            inc_poly.vertices[inc_face], inc_body.orientation));
        return result;
    }

    static axisLeastPenetration(A: NtBody, B: NtBody): [number, number] {
        let best_distance: number = -Number.MAX_VALUE;
        let best_index: number = -1;
        let shape_a: NtPolygonShape = <NtPolygonShape>A.shape;
        let shape_b: NtPolygonShape = <NtPolygonShape>B.shape;
        for (var i = 0; i < shape_a.vertices.length; i++) {
            let face_normal: NtVec2 = NtVec2.rotate(shape_a.normals[i], A.orientation);
            let relative_normal: NtVec2 = NtVec2.rotate(face_normal, -B.orientation);
            let support_point_local: NtVec2 =
                shape_b.get_support_point(NtVec2.negate(relative_normal));
            let vertex_world: NtVec2 = NtVec2.add(A.position,
                NtVec2.rotate(shape_a.vertices[i], A.orientation));
            // to B local coordinate space
            let vertex: NtVec2 = NtVec2.rotate(vertex_world.subtract(B.position), -B.orientation);
            let dot: number = NtVec2.dotProduct(relative_normal,
                NtVec2.subtract(support_point_local, vertex));
            if (dot > best_distance) {
                best_distance = dot;
                best_index = i;
            }
        }
        return [best_distance, best_index];
    }
}
