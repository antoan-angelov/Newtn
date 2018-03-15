let circle4: NtBody = new NtBody(new NtVec2(150, 340), new NtRectangleShape(40, 40));
circle4.material.density = 0.002;
circle4.force.set(150, -100);
circle4.orientation = -Math.PI / 4;
console.log(circle4);

let circle7: NtBody = new NtBody(new NtVec2(450, 400), new NtCircleShape(40));
circle7.material.density = 0.002;
circle7.force.set(0, -350);
console.log(circle7);

let rect1: NtBody = new NtBody(new NtVec2(280, 170), new NtRectangleShape(350, 140));
rect1.material.density = 10;
rect1.friction = 0.6;
rect1.orientation = -Math.PI / 8;
console.log(rect1);

let circle5: NtBody = new NtBody(new NtVec2(150, 50), new NtCircleShape(40));
circle5.material.density = 0.002;
circle5.force.set(0, 80);
console.log(circle5);

let circle6: NtBody = new NtBody(new NtVec2(450, 250), new NtCircleShape(40));
circle6.material.density = 0.002;
circle6.force.setVec(new NtVec2(-80, 0));
console.log(circle6);

let canvas: HTMLCanvasElement =
    <HTMLCanvasElement> document.getElementById('myCanvas');
let canvasContext: CanvasRenderingContext2D =
    <CanvasRenderingContext2D> canvas.getContext("2d");

let renderer = new Renderer(canvasContext, canvas.width, canvas.height);
let world: NtWorld = new NtWorld(renderer);
world.add(circle4);
world.add(rect1);
//world.add(circle5);
//world.add(circle6);
//world.add(circle7);

setInterval(function() {
    let dt: number = 33/1000;
    world.step(dt);
    renderer.draw();
}, 33);
