class NtRectangleShape extends NtPolygonShape {
    readonly width: number;
    readonly height: number;
    constructor(width: number, height: number) {
        super([new NtVec2(-width/2, -height/2),
                new NtVec2(width/2, -height/2),
                new NtVec2(width/2, height/2),
                new NtVec2(-width/2, height/2)]);
        this.width = width;
        this.height = height;
    }
    calculate_area(): number {
        return this.width * this.height;
     }
    toString() {
        return `NtRectangleShape{width: ${this.width}, height: ${this.height}}`;
    }
}
