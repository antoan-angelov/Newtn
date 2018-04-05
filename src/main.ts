let circle4: NtBody = new NtBody(new NtVec2(150, 140), new NtRectangleShape(5, 5));
circle4.material.density = 0.002;
//circle4.apply_impulse(new NtVec2(1290, 0), new NtVec2());
circle4.force.set(10, 0);
//circle4.orientation = -Math.PI / 9;
console.log(circle4);

let circle7: NtBody = new NtBody(new NtVec2(450, 400), new NtCircleShape(40));
circle7.material.density = 0.002;
circle7.force.set(0, -350);
console.log(circle7);

let rect1: NtBody = new NtBody(new NtVec2(295, 170), new NtRectangleShape(0.5, 130));
rect1.material.density = 0.5;
rect1.make_static();
//rect1.make_static();
//rect1.friction = 0.6;
//console.log("force is " + rect1.force)
// force is NtVec2{x: 0, y: 13720.000000000002}
//rect1.orientation = -Math.PI / 8;
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
//world.gravity.set(0, 9.8);
world.add(circle4);
world.add(rect1);
//world.add(circle5);
//world.add(circle6);
//world.add(circle7);

setInterval(function() {
    let dt: number = 33/1000;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    world.step(dt);
    renderer.draw();
}, 33);

let mouse_joint: NtMouseJoint = new NtMouseJoint();
world.addJoint(mouse_joint);
canvas.addEventListener("mousedown", function(event){
    let point: NtVec2 = new NtVec2(event.pageX - canvas.offsetLeft,
        event.pageY - canvas.offsetTop);
    mouse_joint.mouse_down(point);
});
canvas.addEventListener("mousemove", function(event){
    let point: NtVec2 = new NtVec2(event.pageX - canvas.offsetLeft,
        event.pageY - canvas.offsetTop);
    mouse_joint.mouse_move(point);
});
canvas.addEventListener("mouseup", function(){
    mouse_joint.mouse_up();
});
