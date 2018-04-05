abstract class NtPolygonShape extends NtShapeBase {
    readonly vertices: NtVec2[];
    readonly normals: NtVec2[] = [];

    constructor(vertices: NtVec2[]) {
        super();
        this.vertices = vertices;
        this.calculate_surface_normals();
    }

    get_bounds_for_orientation(orientation: number): NtBounds {
        let bounds: NtBounds = new NtBounds(
            new NtVec2(Number.MAX_VALUE, Number.MAX_VALUE),
            new NtVec2(-Number.MAX_VALUE, -Number.MAX_VALUE));
        for (let i = 0; i < this.vertices.length; i++) {
            let oriented_coordinates: NtVec2 =
                NtVec2.rotate(this.vertices[i], orientation);
            if (bounds.min.x > oriented_coordinates.x) {
                bounds.min.x = oriented_coordinates.x;
            }
            if (bounds.min.y > oriented_coordinates.y) {
                bounds.min.y = oriented_coordinates.y;
            }
            if (bounds.max.x < oriented_coordinates.x) {
                bounds.max.x = oriented_coordinates.x;
            }
            if (bounds.max.y < oriented_coordinates.y) {
                bounds.max.y = oriented_coordinates.y;
            }
        }
        return bounds;
    }

    private calculate_surface_normals() {
        // assume vertices are clockwise
        for (var i = 0; i<this.vertices.length; i++) {
            let vertex1: NtVec2 = this.vertices[i];
            let vertex2: NtVec2 =
                this.vertices[(i + 1) % this.vertices.length];
            let dx: number = vertex2.x - vertex1.x;
            let dy: number = vertex2.y - vertex1.y;
            let edge: NtVec2 = new NtVec2(dx, dy);
            let normal: NtVec2 = new NtVec2(-dy, dx).normalize();
            if (NtVec2.crossProduct(edge, normal) < 0) {
                this.normals.push(normal);
            } else {
                this.normals.push(normal.negate());
            }
        }
    }

    get_support_point(direction: NtVec2): NtVec2 {
        let best_projection: number = -Number.MAX_VALUE;
        let best_vertex: NtVec2 = this.vertices[0];
        this.vertices.forEach(function(vertex) {
            let projection: number = NtVec2.dotProduct(vertex, direction);
            if (projection > best_projection) {
                best_vertex = vertex;
                best_projection = projection;
            }
        });
        return best_vertex;
    }

    get_moment_of_inertia(density: number): number {
        // assume convex polygon
        // assume center of mass is at (0, 0)
        let inertia_total: number = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            let v1: NtVec2 = this.vertices[i];
            let v2: NtVec2 = this.vertices[(i + 1) % this.vertices.length];
            let D: number = NtVec2.crossProduct(v1, v2);
            let intx2: number = v1.x * v1.x + v2.x * v1.x + v2.x * v2.x;
            let inty2: number = v1.y * v1.y + v2.y * v1.y + v2.y * v2.y;
            inertia_total += (0.25 * D / 3) * (intx2 + inty2);
        }
        inertia_total *= density;
        return inertia_total;
    }

    is_point_in_shape(point: NtVec2): boolean {
        let expected_sign: number = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            let v1: NtVec2 = this.vertices[i];
            let v2: NtVec2 = this.vertices[(i + 1) % this.vertices.length];
            let D: number = this.cross_product(v1, point, v2);
            if (D == 0) {
                continue;
            }
            if (expected_sign == 0) {
                expected_sign = Math.sign(D);
            } else if (Math.sign(D) != expected_sign) {
                return false;
            }
        }
        return true;
    }

    private cross_product(origin: NtVec2, point1: NtVec2, point2: NtVec2): number {
        return NtVec2.crossProduct(NtVec2.subtract(point1, origin),
            NtVec2.subtract(point2, origin));
    }

    intersection_with_segment(start: NtVec2, end: NtVec2): NtVec2|null {
        for (let i = 0; i < this.vertices.length; i++) {
            let v1: NtVec2 = this.vertices[i];
            let v2: NtVec2 = this.vertices[(i + 1) % this.vertices.length];
            let result: NtVec2|null = this.segment_intersection(start, end, v1, v2);
            if (result) {
                return result;
            }
        }
        return null;
    }

    private segment_intersection(start1: NtVec2, end1: NtVec2, start2: NtVec2, end2: NtVec2): NtVec2|null {
        let p: NtVec2 = start1;
        let r: NtVec2 = NtVec2.subtract(end1, start1);
        let q: NtVec2 = start2;
        let s: NtVec2 = NtVec2.subtract(end2, start2);
        let qp: NtVec2 = NtVec2.subtract(q, p);
        let rxs: number = NtVec2.crossProduct(r, s);
        let qpxr: number = (NtVec2.crossProduct(qp, r));
        let t: number = NtVec2.crossProduct(qp, s) / rxs;
        let u: number = qpxr / rxs;
        if (qpxr != 0 && rxs == 0) {
            // parallel
            return null;
        }  else if (rxs != 0 && t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return NtVec2.multiply(r, t).add(p);
        }
        return null;
    }
}
