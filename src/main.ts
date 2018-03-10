let phys1: NtRectangle = new NtRectangle(new NtVec(370, 160), 50, 40);
phys1.mass = 20;
phys1.velocity.set(-1.5, 0);
console.log(phys1);

let phys2: NtRectangle = new NtRectangle(new NtVec(10, 160), 50, 40);
phys2.mass = 20;
phys2.velocity.set(1.5, 0);
console.log(phys2);

let phys3: NtRectangle = new NtRectangle(new NtVec(200, 190), 150, 120);
phys3.mass = 20;
console.log(phys3);

let phys4: NtRectangle = new NtRectangle(new NtVec(210, -60), 50, 40);
phys4.mass = 20;
phys4.velocity.set(0, 1.5);
console.log(phys4);

let phys5: NtRectangle = new NtRectangle(new NtVec(210, 370), 50, 40);
phys5.mass = 20;
phys5.velocity.set(0, -1.5);
console.log(phys5);

let canvas: HTMLCanvasElement =
    <HTMLCanvasElement> document.getElementById('myCanvas');
let canvasContext: CanvasRenderingContext2D =
    <CanvasRenderingContext2D> canvas.getContext("2d");

let renderer = new Renderer(canvasContext);
let world: NtWorld = new NtWorld(renderer);
world.add(phys1);
world.add(phys2);
world.add(phys3);
world.add(phys4);
world.add(phys5);

setInterval(function() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    world.step();
    renderer.draw();
}, 33);
