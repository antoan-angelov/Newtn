class Rectangle extends Renderable {
    constructor(object: NtBody) {
        super(object);
    }

    draw(canvas: CanvasRenderingContext2D) {
        let position: NtVec2 = this.object.position;
        let rect_shape: NtRectangleShape = <NtRectangleShape>this.object.shape;
        if (this.object.collisions.size > 0) {
            canvas.strokeStyle = 'rgba(247, 186, 197, 0.8)';
            canvas.fillStyle = 'rgba(247, 186, 197, 0.6)'
        } else {
            canvas.strokeStyle = 'rgba(255, 255, 255, 0.8)'
            canvas.fillStyle = 'rgba(255, 255, 255, 0.5)'
        }
        canvas.lineWidth = 2;
        canvas.beginPath();
        let orientation: number = this.object.orientation;
        let vertices: NtVec2[] = rect_shape.vertices;
        let vertex1: NtVec2 = NtVec2.rotate(vertices[0], orientation);
        canvas.moveTo(position.x + vertex1.x, position.y + vertex1.y);
        for (var i = 1; i < vertices.length; i++) {
            let vertex2: NtVec2 = NtVec2.rotate(vertices[i], orientation);
            canvas.lineTo(position.x + vertex2.x, position.y + vertex2.y);
        }
        canvas.lineTo(position.x + vertex1.x, position.y + vertex1.y);
        canvas.closePath();
        canvas.stroke();
        canvas.fill();
    }

    print() {
        console.log(`Rectangle{position: ${this.object.position}, ` +
            `width: ${this.object.shape}}`);
    }
}
