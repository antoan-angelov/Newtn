class NtManifold  {
    A: NtBase;
    B: NtBase;
    penetration: number = 0;
    normal: NtVec = new NtVec();
    constructor(A: NtBase, B: NtBase) {
        this.A = A;
        this.B = B;
    }
}
