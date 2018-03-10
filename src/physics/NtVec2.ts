class NtVec2 {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    add(other: NtVec2) {
        this.x += other.x;
        this.y += other.y;
    }
    subtract(other: NtVec2) {
        this.x -= other.x;
        this.y -= other.y;
    }
    fromVec(other: NtVec2) {
        this.x = other.x;
        this.y = other.y;
    }
    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `NtVec2{x: ${this.x}, y: ${this.y}}`;
    }
    static add(A: NtVec2, B: NtVec2): NtVec2 {
        return new NtVec2(A.x + B.x, A.y + B.y);
    }
    static subtract(A: NtVec2, B: NtVec2): NtVec2 {
        return new NtVec2(A.x - B.x, A.y - B.y);
    }
    static multiply(A: NtVec2, n: number): NtVec2 {
        return new NtVec2(A.x * n, A.y * n);
    }
    static dotProduct(A: NtVec2, B: NtVec2): number {
        return A.x * B.x + A.y * B.y;
    }
}
