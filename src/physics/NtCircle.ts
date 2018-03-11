class NtCircle extends NtBase {
    radius: number;
    constructor(position: NtVec2, radius: number) {
        super(position);
        this.radius = radius;
    }
    step() {
        super.step();
        this.aabb.min.set(this.position.x - this.radius,
            this.position.y - this.radius);
        this.aabb.max.set(this.position.x + this.radius,
            this.position.y + this.radius);
    }
    toString() {
        return `NtCircle{position: ${this.position}, radius: ${this.radius}}`;
    }
}
