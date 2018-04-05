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
    addScalar(scalar: number): NtVec2 {
        this.x += scalar;
        this.y += scalar;
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
    setVec(A: NtVec2): NtVec2 {
        this.x = A.x;
        this.y = A.y;
        return this;
    }
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize(): NtVec2 {
        return this.divide(this.length());
    }
    negate(): NtVec2 {
        this.x = -this.x;
        this.y = -this.y;
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
    static crossProduct(A: NtVec2, B: NtVec2): number {
        return A.x * B.y - A.y * B.x;
    }
    static crossProductScalarSecond(A: NtVec2, scalar: number): NtVec2 {
        return new NtVec2(scalar * A.y, -scalar * A.x);
    }
    static crossProductScalarFirst(A: NtVec2, scalar: number): NtVec2 {
        return new NtVec2(-scalar * A.y, scalar * A.x);
    }
    static rotate(A: NtVec2, angle: number): NtVec2 {
        let cos: number = Math.cos(angle);
        let sin: number = Math.sin(angle);
        return new NtVec2(cos * A.x - sin * A.y, sin * A.x + cos * A.y);
    }
    static normalize(A: NtVec2): NtVec2 {
        return new NtVec2().setVec(A).normalize();
    }
}
