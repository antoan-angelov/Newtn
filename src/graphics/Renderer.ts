class Renderer implements NtIRenderer {
    canvas: CanvasRenderingContext2D;
    renderables: Renderable[];
    width: number;
    height: number;
    constructor(canvas: CanvasRenderingContext2D, width: number,
            height: number) {
        this.canvas = canvas;
        this.renderables = [];
        this.width = width;
        this.height = height;
    }
    draw():void {
        this.canvas.clearRect(0, 0, this.width, this.height);
        let gradient = this.canvas.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0,'#90C3D4');
        gradient.addColorStop(1,"#82B0BF");
        this.canvas.fillStyle = gradient;
        this.canvas.fillRect(0, 0, this.width, this.height);
        this.draw_lines();
        for (let object of this.renderables) {
            object.draw(this.canvas);
        }
    }
    private draw_lines() {
        this.canvas.lineWidth = 0.5;
        let line_space = 100;
        let lines_per_row: number = this.width / line_space;
        let lines_per_column: number = this.height / line_space;
        this.canvas.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < lines_per_column; i++) {
            this.canvas.beginPath();
            this.canvas.moveTo(0, i * line_space);
            this.canvas.lineTo(this.width, i * line_space)
            this.canvas.stroke();
        }
        for (let i = 0; i < lines_per_row; i++) {
            this.canvas.beginPath();
            this.canvas.moveTo(i * line_space, 0);
            this.canvas.lineTo(i * line_space, this.height)
            this.canvas.stroke();
        }
    }
    add(object: NtBody):void {
        if (object.shape instanceof NtRectangleShape) {
            this.renderables.push(new Rectangle(object));
        } else if (object.shape instanceof NtCircleShape) {
            this.renderables.push(new Circle(object));
        }
    }
    remove(object: NtBody):void {
        let index = this.renderables.findIndex(renderable =>
            renderable.object == object);
        if (index == -1) {
            return;
        }
        this.renderables.splice(index, 1);
    }
}
