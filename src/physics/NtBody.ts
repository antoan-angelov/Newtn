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
    private _mass: number = 0;
    private _inverse_mass: number = 0;

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
        this.aabb.min.setVec(NtVec2.add(this.position, this.shape.bounds.min));
        this.aabb.max.setVec(NtVec2.add(this.position, this.shape.bounds.max));
    }

    calculate_mass() {
        this._mass = this.shape.area * this.material.density;
        this._inverse_mass = 1 / this._mass;
    }

    apply_impulse(impulse: NtVec2) {
        this.velocity.add(NtVec2.multiply(impulse, this.inverse_mass));
    }

    get mass():number {
        return this._mass;
    }

    get inverse_mass():number {
        return this._inverse_mass;
    }
}
