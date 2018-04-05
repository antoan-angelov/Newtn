class NtBody {
    readonly collisions: Set<NtBody> = new Set<NtBody>();
    readonly aabb: NtAABB = new NtAABB();
    readonly position: NtVec2 = new NtVec2();
    readonly velocity: NtVec2 = new NtVec2();
    readonly force: NtVec2 = new NtVec2();
    readonly gravity: NtVec2 = new NtVec2();
    shape: NtShapeBase;
    material: NtMaterial;
    layers: number = 1;
    friction: number = 1;
    angular_velocity: number = 0;
    torque: number = 0;
    orientation: number = 0;
    raycaster: NtRaycaster|null = null;
    resolver: NtCollisionResolver;
    private _mass: number = 0;
    private _inverse_mass: number = 0;
    private _inertia: number = 1;
    private _inverse_inertia: number = 1;
    private _is_static: boolean = false;

    constructor(position: NtVec2, shape: NtShapeBase,
            material: NtMaterial = new NtMaterial()) {
        this.resolver = new NtCollisionResolver();
        this.position.fromVec(position);
        this.shape = shape;
        this.material = material;
        this.calculate_mass();
    }

    step(dt: number) {
        if (!this._is_static) {
            this.calculate_mass();
            let gravity_force: NtVec2 = NtVec2.multiply(this.gravity, this._mass);
            let total_force: NtVec2 = NtVec2.add(this.force, gravity_force);
            this.velocity.add(NtVec2.multiply(total_force, this._inverse_mass * dt));
            this.angular_velocity += this.torque * this._inverse_inertia * dt;
            let future_position: NtVec2 = NtVec2.multiply(this.velocity, dt).add(this.position);
            let raycast_manifold: NtRaycastManifold = new NtRaycastManifold();
            if (this.raycaster && this.raycaster.raycast(this,
                    this.position, future_position, raycast_manifold)) {
                this.position.setVec(raycast_manifold.intersection_global)
                    .add(NtVec2.normalize(this.velocity).negate().multiply(2));
                let collision_manifold: NtManifold =
                    new NtManifold(this, <NtBody>raycast_manifold.other_body);
                this.resolver.hasCollision(collision_manifold);
                this.resolver.resolve(collision_manifold);
            } else {
                this.position.setVec(future_position);
            }
            this.orientation += this.angular_velocity * dt;
        }
        let bounds: NtBounds = this.shape.get_bounds_for_orientation(this.orientation);
        this.aabb.min.setVec(NtVec2.add(this.position, bounds.min));
        this.aabb.max.setVec(NtVec2.add(this.position, bounds.max));
    }

    apply_impulse(impulse: NtVec2, contact: NtVec2) {
        this.velocity.add(NtVec2.multiply(impulse, this.inverse_mass));
        this.angular_velocity += NtVec2.crossProduct(contact, impulse) * this.inverse_inertia;
    }

    make_static() {
        this.velocity.set(0, 0);
        this.angular_velocity = 0;
        this.force.set(0, 0);
        this.gravity.set(0, 0);
        this.material.density = Number.MAX_VALUE;
        this.calculate_mass();
        this._is_static = true;
    }

    is_point_in_body(point: NtVec2): boolean {
        return this.shape.is_point_in_shape(point);
    }

    private calculate_mass() {
        if(this.material.density == Number.MAX_VALUE) {
            this._mass = Number.MAX_VALUE;
            this._inverse_mass = 0;
        } else if(this.material.density == 0) {
            this._mass = 0;
            this._inverse_mass = Number.MAX_VALUE;
        } else {
            this._mass = this.shape.area * this.material.density;
            this._inverse_mass = (this._mass != 0) ? 1 / this._mass : Number.MAX_VALUE;
        }
        this._inertia = this.shape.get_moment_of_inertia(this.material.density);
        this._inverse_inertia = this._inertia != 0 ? 1 / this._inertia : 0;
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

    get inverse_inertia(): number {
        return this._inverse_inertia;
    }

    get is_static(): boolean {
        return this._is_static;
    }
}
