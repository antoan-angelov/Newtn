abstract class NtBase {
    private static counter = 0;
    readonly position: NtVec2 = new NtVec2();
    readonly velocity: NtVec2 = new NtVec2();
    readonly collisions: Set<NtBase> = new Set<NtBase>();
    readonly aabb: NtAABB = new NtAABB();
    restitution: number = 1;
    id: number;
    force: NtVec2 = new NtVec2();
    private _mass: number = 0;
    private _inverse_mass: number = 0;

    constructor(position: NtVec2) {
        this.position.fromVec(position);
        this.id = NtBase.counter++;
    }
    step(dt: number) {
        this.position.add(NtVec2.multiply(this.velocity, dt));
        this.velocity.add(NtVec2.multiply(this.force, dt / this.mass));
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
