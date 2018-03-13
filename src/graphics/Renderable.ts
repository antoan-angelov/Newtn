abstract class Renderable {
    object: NtBody;
    constructor(object: NtBody) {
        this.object = object;
    }
    abstract draw(canvas: CanvasRenderingContext2D):void;
}
