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
    toString() {
        return `NtRectangleShape{width: ${this.width}, height: ${this.height}}`;
    }
}
