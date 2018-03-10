abstract class NtBase {
    private static counter = 0;
    readonly position: NtVec2 = new NtVec2();
    readonly velocity: NtVec2 = new NtVec2();
    readonly collisions: Set<NtBase> = new Set<NtBase>();
    readonly aabb: NtAABB = new NtAABB();
    restitution: number = 1;
    id: number;
    private _mass: number = 0;
    private _inverse_mass: number = 0;

    constructor(position: NtVec2) {
        this.position.fromVec(position);
        this.id = NtBase.counter++;
    }
    step() {
        this.position.add(this.velocity);
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
