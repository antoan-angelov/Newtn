abstract class NtBase {
    private static counter = 0;
    readonly position: NtVec = new NtVec();
    readonly velocity: NtVec = new NtVec();
    readonly collisions: Set<NtBase> = new Set<NtBase>();
    readonly aabb: NtAABB = new NtAABB();
    restitution: number = 1;
    id: number;
    private _mass: number = 0;
    private _inverse_mass: number = 0;

    constructor(position: NtVec) {
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
