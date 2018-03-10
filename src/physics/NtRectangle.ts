class NtRectangle extends NtBase {
    width: number;
    height: number;
    constructor(position: NtVec, width: number, height: number) {
        super(position);
        this.width = width;
        this.height = height;
    }
    collidesWith(object: NtBase):boolean {
        if (object instanceof NtRectangle) {
            return this.doRectanglesOverlap(<NtRectangle> object);
        }
        return false;
    }
    private doRectanglesOverlap(other: NtRectangle) {
        return !(other.position.x + other.width < this.position.x
            || this.position.x + this.width < other.position.x
            || other.position.y + other.height < this.position.y
            || this.position.y + this.height < other.position.y);
    }
    toString() {
        return `NtRectangle{position: ${this.position}, width: ${this.width}, `
            + `height: ${this.height}}`;
    }
}
