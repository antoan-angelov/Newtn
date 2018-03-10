class NtManifold  {
    A: NtBase;
    B: NtBase;
    penetration: number = 0;
    normal: NtVec2 = new NtVec2();
    constructor(A: NtBase, B: NtBase) {
        this.A = A;
        this.B = B;
    }
}
