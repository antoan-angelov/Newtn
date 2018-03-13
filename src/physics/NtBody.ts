class NtBody {
    private static counter = 0;
    readonly position: NtVec2 = new NtVec2();
    readonly velocity: NtVec2 = new NtVec2();
    readonly collisions: Set<NtBody> = new Set<NtBody>();
    readonly aabb: NtAABB = new NtAABB();
    readonly shape: NtShapeBase;
    restitution: number = 1;
    id: number;
    force: NtVec2 = new NtVec2();
    layers: number = 1;
    private _mass: number = 0;
    private _inverse_mass: number = 0;

    constructor(position: NtVec2, shape: NtShapeBase) {
        this.position.fromVec(position);
        this.shape = shape;
        this.id = NtBody.counter++;
    }
    step(dt: number) {
        this.position.add(NtVec2.multiply(this.velocity, dt));
        this.velocity.add(NtVec2.multiply(this.force, dt / this.mass));
        this.aabb.min.setVec(NtVec2.add(this.position, this.shape.bounds.min));
        this.aabb.max.setVec(NtVec2.add(this.position, this.shape.bounds.max));
    }
    apply_impulse(impulse: NtVec2) {
        this.velocity.add(NtVec2.multiply(impulse, this.inverse_mass));
    }
    get mass(): number {
        return this._mass;
    }
    set mass(value: number) {
        this._mass = value;
        this._inverse_mass = 1 / value;
    }
    get inverse_mass(): number {
        return this._inverse_mass;
    }
}
