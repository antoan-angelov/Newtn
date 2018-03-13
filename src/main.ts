let phys1: NtRectangle = new NtRectangle(new NtVec2(370, 160), 50, 40);
phys1.mass = 20;
phys1.velocity.set(-1.5, 0);
console.log(phys1);

let phys2: NtRectangle = new NtRectangle(new NtVec2(10, 160), 50, 40);
phys2.mass = 20;
phys2.velocity.set(1.5, 0);
console.log(phys2);

let phys3: NtRectangle = new NtRectangle(new NtVec2(200, 190), 150, 120);
phys3.mass = 20;
console.log(phys3);

let phys4: NtRectangle = new NtRectangle(new NtVec2(210, -60), 50, 40);
phys4.mass = 20;
phys4.velocity.set(0, 1.5);
console.log(phys4);

let phys5: NtRectangle = new NtRectangle(new NtVec2(210, 370), 50, 40);
phys5.mass = 20;
phys5.velocity.set(0, -1.5);
console.log(phys5);

let circle1: NtCircle = new NtCircle(new NtVec2(100, 50), 20);
circle1.mass = 20;
circle1.velocity.set(0.5, 0.5);
console.log(circle1);

let circle2: NtCircle = new NtCircle(new NtVec2(250, 50), 30);
circle2.mass = 30;
circle2.velocity.set(-0.5, 0.5);
console.log(circle2);

let circle3: NtCircle = new NtCircle(new NtVec2(150, 150), 40);
circle3.mass = 340;
circle3.velocity.set(0, -1);
console.log(circle3);


let circle4: NtCircle = new NtCircle(new NtVec2(150, 400), 40);
circle4.mass = 20;
circle4.force.set(0, -50);
console.log(circle4);

let rect1: NtRectangle = new NtRectangle(new NtVec2(150, 270), 250, 140);
rect1.mass = 4;
rect1.force.set(3.5, 0);
console.log(rect1);

let circle5: NtCircle = new NtCircle(new NtVec2(150, 50), 40);
circle5.mass = 20;
circle5.force.set(0, 80);
console.log(circle5);

let circle6: NtCircle = new NtCircle(new NtVec2(450, 250), 40);
circle6.mass = 20;
circle6.velocity.set(-0.8, 0);
circle6.apply_impulse(new NtVec2(-580, 0));
console.log(circle6);

let canvas: HTMLCanvasElement =
    <HTMLCanvasElement> document.getElementById('myCanvas');
let canvasContext: CanvasRenderingContext2D =
    <CanvasRenderingContext2D> canvas.getContext("2d");

let renderer = new Renderer(canvasContext, canvas.width, canvas.height);
let world: NtWorld = new NtWorld(renderer);
//world.add(phys1);
// world.add(phys2);
 //world.add(phys3);
// world.add(phys4);
// world.add(phys5);
// world.add(circle1);
// world.add(circle2);
// world.add(circle3);
world.add(circle4);
world.add(circle5);
world.add(circle6);
world.add(rect1);

setInterval(function() {
    let dt: number = 33/1000;
    world.step(dt);
    renderer.draw();
}, 33);
