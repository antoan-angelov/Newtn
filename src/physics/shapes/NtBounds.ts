class NtBounds {
    readonly min: NtVec2 = new NtVec2();
    readonly max: NtVec2 = new NtVec2();
    constructor(min: NtVec2, max: NtVec2) {
        this.min = min;
        this.max = max;
    }
}
