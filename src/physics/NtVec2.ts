class NtVec2 {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    add(other: NtVec2): NtVec2 {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    subtract(other: NtVec2): NtVec2 {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    multiply(n: number): NtVec2 {
        this.x *= n;
        this.y *= n;
        return this;
    }
    divide(n: number): NtVec2 {
        this.x /= n;
        this.y /= n;
        return this;
    }
    fromVec(other: NtVec2): NtVec2 {
        this.x = other.x;
        this.y = other.y;
        return this;
    }
    set(x: number, y: number): NtVec2 {
        this.x = x;
        this.y = y;
        return this;
    }
    toString() {
        return `NtVec2{x: ${this.x}, y: ${this.y}}`;
    }
    static fromVec(A: NtVec2): NtVec2 {
        return new NtVec2(A.x, A.y);
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
    static divide(A: NtVec2, n: number): NtVec2 {
        return new NtVec2(A.x / n, A.y / n);
    }
    static dotProduct(A: NtVec2, B: NtVec2): number {
        return A.x * B.x + A.y * B.y;
    }
    static distance(A: NtVec2, B: NtVec2): number {
        let dx = A.x - B.x;
        let dy = A.y - B.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    static distanceSquared(A: NtVec2, B: NtVec2): number {
        let dx = A.x - B.x;
        let dy = A.y - B.y;
        return dx * dx + dy * dy;
    }
    static equal(A: NtVec2, B: NtVec2): boolean {
        return A.x == B.x && A.y == B.y;
    }
    static negate(A: NtVec2): NtVec2 {
        return new NtVec2(-A.x, -A.y);
    }
}
