class NtCirclePolygonResolver implements NtIResolver {
    manifold: NtManifold;
    A: NtBody;
    B: NtBody;
    circle_shape: NtCircleShape;
    poly_shape: NtPolygonShape;

    constructor(manifold: NtManifold) {
        this.manifold = manifold;
        this.A = manifold.A;
        this.B = manifold.B;
        this.circle_shape = <NtCircleShape>this.A.shape;
        this.poly_shape = <NtPolygonShape>this.B.shape;
    }

    resolve(): boolean {
        let edge_penetration: [number, number]|null = this.get_edge_min_penetration();
        if (!edge_penetration) {
            return false;
        }
        let face_index: number = edge_penetration[0];
        let separation: number = edge_penetration[1];

        if (separation < 0.0001) {
            this.populate_manifold_for_circle_center_inside_poly(face_index);
            return true;
        }
        return this.populate_manifold_according_to_side_of_edge(edge_penetration);
    }

    private populate_manifold_according_to_side_of_edge(
            edge_penetration: [number, number]): boolean {
        let face_index: number = edge_penetration[0];
        let separation: number = edge_penetration[1];
        // get face's vertuces
        let poly_vertices: NtVec2[] =  this.poly_shape.vertices;
        let v1: NtVec2 = poly_vertices[face_index];
        let v2: NtVec2 = poly_vertices[(face_index + 1) % poly_vertices.length];
        // circle center to polygon model space
        let center:NtVec2 = NtVec2.rotate(NtVec2.subtract(this.A.position, this.B.position),
            -this.B.orientation);
        // determine which voronoi region of the edge center of the circle lies within
        let dot1: number = NtVec2.dotProduct(NtVec2.subtract(center, v1), NtVec2.subtract(v2, v1));
        let dot2: number = NtVec2.dotProduct(NtVec2.subtract(center, v2), NtVec2.subtract(v1, v2));
        this.manifold.penetration = this.circle_shape.radius - separation;

        if (dot1 <= 0) {
            return this.populate_manifold_for_nearest_vertex(v1, center);
        } else if (dot2 <= 0) {
            return this.populate_manifold_for_nearest_vertex(v2, center);
        }
        return this.populate_manifold_for_nearest_face(v1, center, face_index);
    }

    private get_edge_min_penetration(): [number, number]|null {
        let center:NtVec2 = NtVec2.rotate(NtVec2.subtract(this.A.position, this.B.position),
            -this.B.orientation);
        let separation: number = -Number.MAX_VALUE;
        let face_normal: number = 0;
        for (let i = 0; i < this.poly_shape.vertices.length; i++) {
            let s: number = NtVec2.dotProduct(this.poly_shape.normals[i],
                NtVec2.subtract(center, this.poly_shape.vertices[i]));
            if (s > this.circle_shape.radius) {
                return null;
            }
            if (s > separation) {
                separation = s;
                face_normal = i;
            }
        }
        return [face_normal, separation];
    }

    private populate_manifold_for_circle_center_inside_poly(face_index: number) {
        this.manifold.normal.setVec(
            NtVec2.rotate(this.poly_shape.normals[face_index], this.B.orientation).negate());
        this.manifold.contact_points.push(
            NtVec2.multiply(this.manifold.normal, this.circle_shape.radius)
            .add(this.A.position));
        this.manifold.penetration = this.circle_shape.radius;
    }

    private populate_manifold_for_nearest_vertex(vertex: NtVec2,
            center: NtVec2): boolean {
        let radius: number = this.circle_shape.radius;
        if (NtVec2.distanceSquared(center, vertex) > radius * radius) {
            return false;
        }
        let n: NtVec2 = NtVec2.rotate(NtVec2.subtract(vertex, center),
            this.B.orientation).normalize();
        this.manifold.normal = n;
        vertex = NtVec2.rotate(vertex, this.B.orientation).add(this.B.position);
        this.manifold.contact_points.push(vertex);
        return true;
    }

    private populate_manifold_for_nearest_face(vertex: NtVec2,
            center: NtVec2, face_index: number): boolean {
        let n: NtVec2 = this.poly_shape.normals[face_index];
        if (NtVec2.dotProduct(NtVec2.subtract(center, vertex), n) > this.circle_shape.radius) {
            return false;
        }
        n =  NtVec2.rotate(n, this.B.orientation);
        this.manifold.normal = n.negate();
        this.manifold.contact_points.push(NtVec2.add(
            NtVec2.multiply(this.manifold.normal, this.circle_shape.radius), this.A.position));
        return true;
    }
}
