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
}
