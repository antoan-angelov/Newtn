class Rectangle extends Renderable {
    constructor(object: NtBody) {
        super(object);
    }

    draw(canvas: CanvasRenderingContext2D) {
        let position: NtVec2 = this.object.position;
        let rect_shape: NtRectangleShape = <NtRectangleShape>this.object.shape;
        let width = rect_shape.width;
        let height = rect_shape.height;
        if (this.object.collisions.size > 0) {
            canvas.strokeStyle = 'rgba(247, 186, 197, 0.8)';
            canvas.fillStyle = 'rgba(247, 186, 197, 0.6)'
        } else {
            canvas.strokeStyle = 'rgba(255, 255, 255, 0.8)'
            canvas.fillStyle = 'rgba(255, 255, 255, 0.5)'
        }
        canvas.lineWidth = 2;
        canvas.beginPath();
        canvas.moveTo(position.x - width/2, position.y - height/2);
        canvas.lineTo(position.x + width/2, position.y - height/2);
        canvas.lineTo(position.x + width/2, position.y + height/2);
        canvas.lineTo(position.x - width/2, position.y + height/2);
        canvas.lineTo(position.x - width/2, position.y - height/2);
        canvas.closePath();
        canvas.stroke();
        canvas.fill();
    }

    print() {
        console.log(`Rectangle{position: ${this.object.position}, ` +
            `width: ${this.object.shape}}`);
    }
}
