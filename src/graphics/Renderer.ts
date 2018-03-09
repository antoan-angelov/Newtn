class Renderer implements NtIRenderer {
    canvas: CanvasRenderingContext2D;
    renderables: IRenderable[];
    constructor(canvas: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.renderables = [];
    }
    draw():void {
        for (let object of this.renderables) {
            object.draw(this.canvas);
        }
    }
    add(object: NtBase):void {
        if (object instanceof NtRectangle) {
            this.renderables.push(new Rectangle(object));
        }
    }
    remove(object: NtBase):void {
        let index = this.renderables.findIndex(renderable =>
            renderable.object == object);
        if (index == -1) {
            return;
        }
        this.renderables.splice(index, 1);
    }
}
