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
    toString() {
        return `NtCircleShape{radius: ${this.radius}}`;
    }
}
