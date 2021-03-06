class Circle extends Renderable {
    constructor(object: NtBody) {
        super(object);
    }

    draw(canvas: CanvasRenderingContext2D) {
        let position: NtVec2 = this.object.position;
        let radius = (<NtCircleShape>this.object.shape).radius;
        if (this.object.collisions.size > 0) {
            canvas.strokeStyle = 'rgba(247, 186, 197, 0.8)';
            canvas.fillStyle = 'rgba(247, 186, 197, 0.6)'
        } else {
            canvas.strokeStyle = 'rgba(255, 255, 255, 0.8)'
            canvas.fillStyle = 'rgba(255, 255, 255, 0.5)'
        }
        canvas.lineWidth = 2;
        canvas.beginPath();
        canvas.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        canvas.closePath();
        canvas.stroke();
        canvas.fill();
    }

    print() {
        console.log(`Circle{position: ${this.object.position}, ` +
            `shape: ${this.object.shape}}`);
    }
}
