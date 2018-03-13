let circle4: NtBody = new NtBody(new NtVec2(150, 400), new NtCircleShape(40));
circle4.mass = 20;
circle4.force.set(0, -50);
console.log(circle4);

let rect1: NtBody = new NtBody(new NtVec2(150, 270), new NtRectangleShape(250, 140));
rect1.mass = 4;
rect1.force.set(3.5, 0);
console.log(rect1);

let circle5: NtBody = new NtBody(new NtVec2(150, 50), new NtCircleShape(40));
circle5.mass = 20;
circle5.force.set(0, 80);
console.log(circle5);

let circle6: NtBody = new NtBody(new NtVec2(450, 250), new NtCircleShape(40));
circle6.mass = 20;
circle6.layers = 4;
circle6.apply_impulse(new NtVec2(-580, 0));
console.log(circle6);

let canvas: HTMLCanvasElement =
    <HTMLCanvasElement> document.getElementById('myCanvas');
let canvasContext: CanvasRenderingContext2D =
    <CanvasRenderingContext2D> canvas.getContext("2d");

let renderer = new Renderer(canvasContext, canvas.width, canvas.height);
let world: NtWorld = new NtWorld(renderer);
world.add(circle4);
world.add(circle5);
world.add(circle6);
world.add(rect1);

setInterval(function() {
    let dt: number = 33/1000;
    world.step(dt);
    renderer.draw();
}, 33);
