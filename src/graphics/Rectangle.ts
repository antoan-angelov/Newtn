class Rectangle implements IRenderable {
    object: NtRectangle;
    constructor(object: NtRectangle) {
        this.object = object;
    }

    draw(canvas: CanvasRenderingContext2D) {
        let position: NtVec = this.object.position;
        let width = this.object.width;
        let height = this.object.height;
        if (this.object.collisions.size > 0) {
            canvas.strokeStyle = '#ff0000';
        } else {
            canvas.strokeStyle = '#000000'
        }
        canvas.lineWidth = 3;
        canvas.beginPath();
        canvas.moveTo(position.x - width/2, position.y - height/2);
        canvas.lineTo(position.x + width/2, position.y - height/2);
        canvas.lineTo(position.x + width/2, position.y + height/2);
        canvas.lineTo(position.x - width/2, position.y + height/2);
        canvas.lineTo(position.x - width/2, position.y - height/2);
        canvas.stroke();
    }

    print() {
        console.log(`Rectangle{position: ${this.object.position}, ` +
            `width: ${this.object.width}, ${this.object.height}`);
    }
}
