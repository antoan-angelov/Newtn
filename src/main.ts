let phys1: NtRectangle = new NtRectangle(new NtVec(10, 30), 50, 40);
console.log(phys1);

let phys2: NtRectangle = new NtRectangle(new NtVec(190, 30), 20, 80);
console.log(phys2);

let phys3: NtRectangle = new NtRectangle(new NtVec(200, 60), 150, 120);
console.log(phys3);

let canvas: HTMLCanvasElement =
    <HTMLCanvasElement> document.getElementById('myCanvas');
let canvasContext: CanvasRenderingContext2D =
    <CanvasRenderingContext2D> canvas.getContext("2d");

let renderer = new Renderer(canvasContext);
let world: NtWorld = new NtWorld(renderer);
world.add(phys1);
world.add(phys2);
world.add(phys3);

world.step();
renderer.draw();
