class NtCircleShape extends NtShapeBase {
    readonly radius: number;
    constructor(radius: number) {
        super();
        this.radius = radius;
    }
    get_bounds_for_orientation(): NtBounds  {
        return new NtBounds(new NtVec2(-this.radius, -this.radius),
            new NtVec2(this.radius, this.radius));
    }
    calculate_area(): number {
        return Math.PI * this.radius * this.radius;
    }
    get_moment_of_inertia(density: number): number {
        return density * Math.PI * Math.pow(this.radius, 4);
    }
    is_point_in_shape(point: NtVec2): boolean {
        return point.x * point.x + point.y * point.y < this.radius * this.radius;
    }
    intersection_with_segment(E: NtVec2, L: NtVec2): NtVec2|null {
        let C: NtVec2 = new NtVec2(0, 0);
        let r: number = this.radius;

        let d: NtVec2 = NtVec2.subtract(L, E);
        let f: NtVec2 = NtVec2.subtract(E, C);
        let a: number = NtVec2.dotProduct(d, d);
        let b: number = 2 * NtVec2.dotProduct(f, d);
        let c: number = NtVec2.dotProduct(f, f) - r * r;
        let discriminant_squared: number = b * b - 4 * a * c;
        if (discriminant_squared < 0) {
            // no intersection
            return null;
        }
        let discriminant = Math.sqrt(discriminant_squared);
        let t1: number = (-b - discriminant) / (2 * a);
        let t2: number = (-b + discriminant) / (2 * a);
        if (t1 >= 0 && t1 <= 1) {
            return NtVec2.multiply(d, t1).add(E);
        }
        if (t2 >=0 && t2 <= 1) {
            return NtVec2.multiply(d, t2).add(E);
        }
        return null;
    }
    toString() {
        return `NtCircleShape{radius: ${this.radius}}`;
    }
}
