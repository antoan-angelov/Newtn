class NtManifold  {
    A: NtBody;
    B: NtBody;
    penetration: number = 0;
    normal: NtVec2 = new NtVec2();
    constructor(A: NtBody, B: NtBody) {
        this.A = A;
        this.B = B;
    }
}
