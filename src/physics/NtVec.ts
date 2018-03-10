class NtVec {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    add(other: NtVec) {
        this.x += other.x;
        this.y += other.y;
    }
    subtract(other: NtVec) {
        this.x -= other.x;
        this.y -= other.y;
    }
    fromVec(other: NtVec) {
        this.x = other.x;
        this.y = other.y;
    }
    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `NtVec{x: ${this.x}, y: ${this.y}}`;
    }
    static add(A: NtVec, B: NtVec): NtVec {
        return new NtVec(A.x + B.x, A.y + B.y);
    }
    static subtract(A: NtVec, B: NtVec): NtVec {
        return new NtVec(A.x - B.x, A.y - B.y);
    }
    static multiply(A: NtVec, n: number): NtVec {
        return new NtVec(A.x * n, A.y * n);
    }
    static dotProduct(A: NtVec, B: NtVec): number {
        return A.x * B.x + A.y * B.y;
    }
}
