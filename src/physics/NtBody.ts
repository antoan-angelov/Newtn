class NtBody {
    readonly collisions: Set<NtBody> = new Set<NtBody>();
    readonly aabb: NtAABB = new NtAABB();
    readonly position: NtVec2 = new NtVec2();
    readonly velocity: NtVec2 = new NtVec2();
    readonly force: NtVec2 = new NtVec2();
    shape: NtShapeBase;
    material: NtMaterial;
    layers: number = 1;
    friction: number = 1;
    angular_velocity: number = 0;
    torque: number = 0;
    orientation: number = 0;
    private _mass: number = 0;
    private _inverse_mass: number = 0;
    private _inertia: number = 1;
    private _inverse_inertia: number = 1;

    constructor(position: NtVec2, shape: NtShapeBase,
            material: NtMaterial = new NtMaterial()) {
        this.position.fromVec(position);
        this.shape = shape;
        this.material = material;
        this.calculate_mass();
    }

    step(dt: number) {
        this.calculate_mass();
        this.position.add(NtVec2.multiply(this.velocity, dt));
        this.velocity.add(NtVec2.multiply(this.force, dt / this.mass));
        this.angular_velocity += this.torque * (dt / this._inertia);
        this.orientation += this.angular_velocity * dt;

        let bounds: NtBounds =
            this.shape.get_bounds_for_orientation(this.orientation)
        this.aabb.min.setVec(NtVec2.add(this.position, bounds.min));
        this.aabb.max.setVec(NtVec2.add(this.position, bounds.max));
    }

    calculate_mass() {
        this._mass = this.shape.area * this.material.density;
        if (this._mass != 0) {
            this._inverse_mass = 1 / this._mass;
        } else {
            this._inverse_mass = Number.MAX_VALUE;
        }
    }

    apply_impulse(impulse: NtVec2) {
        this.velocity.add(NtVec2.multiply(impulse, this.inverse_mass));
    }

    get mass(): number {
        return this._mass;
    }

    get inverse_mass(): number {
        return this._inverse_mass;
    }

    get inertia(): number {
        return this._inertia;
    }

    set inertia(value: number) {
        this._inertia = value;
        if (value != 0) {
            this._inverse_inertia = 1 / value;
        } else {
            this._inverse_inertia = Number.MAX_VALUE;
        }
    }

    get inverse_inertia(): number {
        return this._inverse_inertia;
    }
}
