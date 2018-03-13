class NtRectangleShape extends NtShapeBase {
    readonly width: number;
    readonly height: number;
    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
    }
    calculate_bounds(): NtBounds {
        return new NtBounds(new NtVec2(-this.width/2, -this.height/2),
            new NtVec2(this.width/2, this.height/2));
    }
    calculate_area(): number {
        return this.width * this.height;
     }
    toString() {
        return `NtRectangleShape{width: ${this.width}, height: ${this.height}}`;
    }
}
