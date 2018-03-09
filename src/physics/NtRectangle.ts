class NtRectangle extends NtBase {
    width: number;
    height: number;
    constructor(position: NtVec, width: number, height: number) {
        super(position);
        this.width = width;
        this.height = height;
    }
    toString() {
        return `NtRectangle{position: ${this.position}, width: ${this.width}, `
            + `height: ${this.height}}`;
    }
}
