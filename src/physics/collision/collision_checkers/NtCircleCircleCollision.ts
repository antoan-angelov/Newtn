class NtCircleCircleCollision implements NtIResolver {

    manifold: NtManifold;

    constructor(manifold: NtManifold) {
        this.manifold = manifold;
    }

    hasCollision(): boolean {
        let A: NtBody = this.manifold.A;
        let B: NtBody = this.manifold.B;
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
            this.manifold.penetration = min_distance - distance;
            this.manifold.normal = NtVec2.divide(n, distance);
        }  else {
            this.manifold.penetration = a_shape.radius;
            this.manifold.normal = new NtVec2(1, 0);
        }
        this.manifold.contact_points.push(NtVec2.add(A.position, NtVec2.rotate(
            NtVec2.multiply(this.manifold.normal, a_shape.radius), A.orientation)));
        return true;
    }
}
