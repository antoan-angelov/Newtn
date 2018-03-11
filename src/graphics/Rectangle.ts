class Rectangle implements IRenderable {
    object: NtRectangle;
    constructor(object: NtRectangle) {
        this.object = object;
    }

    draw(canvas: CanvasRenderingContext2D) {
        let position: NtVec2 = this.object.position;
        let width = this.object.width;
        let height = this.object.height;
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
            `width: ${this.object.width}, ${this.object.height}}`);
    }
}
