class NtRectangle extends NtBase {
    width: number;
    height: number;
    constructor(position: NtVec2, width: number, height: number) {
        super(position);
        this.width = width;
        this.height = height;
    }
    step() {
        super.step();
        this.aabb.min.set(this.position.x - this.width/2,
            this.position.y - this.height/2);
        this.aabb.max.set(this.position.x + this.width/2,
            this.position.y + this.height/2);
    }
    toString() {
        return `NtRectangle{position: ${this.position}, width: ${this.width}, `
            + `height: ${this.height}}`;
    }
}
