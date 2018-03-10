abstract class NtBase {
    private static counter = 0;
    position: NtVec;
    id: number;
    collisions: Set<NtBase>;
    constructor(position: NtVec) {
        this.position = position;
        this.id = NtBase.counter++;
        this.collisions = new Set<NtBase>();
    }
    abstract collidesWith(object: NtBase):boolean;
}
