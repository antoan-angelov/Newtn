"use strict";
var Circle =  (function () {
    function Circle(object) {
        this.object = object;
    }
    Circle.prototype.draw = function (canvas) {
        var position = this.object.position;
        var radius = this.object.radius;
        if (this.object.collisions.size > 0) {
            canvas.strokeStyle = 'rgba(247, 186, 197, 0.8)';
            canvas.fillStyle = 'rgba(247, 186, 197, 0.6)';
        }
        else {
            canvas.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            canvas.fillStyle = 'rgba(255, 255, 255, 0.5)';
        }
        canvas.lineWidth = 2;
        canvas.beginPath();
        canvas.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        canvas.closePath();
        canvas.stroke();
        canvas.fill();
    };
    Circle.prototype.print = function () {
        console.log("Circle{position: " + this.object.position + ", " +
            ("radius: " + this.object.radius + "}"));
    };
    return Circle;
}());
var Rectangle =  (function () {
    function Rectangle(object) {
        this.object = object;
    }
    Rectangle.prototype.draw = function (canvas) {
        var position = this.object.position;
        var width = this.object.width;
        var height = this.object.height;
        if (this.object.collisions.size > 0) {
            canvas.strokeStyle = 'rgba(247, 186, 197, 0.8)';
            canvas.fillStyle = 'rgba(247, 186, 197, 0.6)';
        }
        else {
            canvas.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            canvas.fillStyle = 'rgba(255, 255, 255, 0.5)';
        }
        canvas.lineWidth = 2;
        canvas.beginPath();
        canvas.moveTo(position.x - width / 2, position.y - height / 2);
        canvas.lineTo(position.x + width / 2, position.y - height / 2);
        canvas.lineTo(position.x + width / 2, position.y + height / 2);
        canvas.lineTo(position.x - width / 2, position.y + height / 2);
        canvas.lineTo(position.x - width / 2, position.y - height / 2);
        canvas.closePath();
        canvas.stroke();
        canvas.fill();
    };
    Rectangle.prototype.print = function () {
        console.log("Rectangle{position: " + this.object.position + ", " +
            ("width: " + this.object.width + ", " + this.object.height + "}"));
    };
    return Rectangle;
}());
var Renderer =  (function () {
    function Renderer(canvas, width, height) {
        this.canvas = canvas;
        this.renderables = [];
        this.width = width;
        this.height = height;
    }
    Renderer.prototype.draw = function () {
        this.canvas.clearRect(0, 0, this.width, this.height);
        var gradient = this.canvas.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#90C3D4');
        gradient.addColorStop(1, "#82B0BF");
        this.canvas.fillStyle = gradient;
        this.canvas.fillRect(0, 0, this.width, this.height);
        this.draw_lines();
        for (var _i = 0, _a = this.renderables; _i < _a.length; _i++) {
            var object = _a[_i];
            object.draw(this.canvas);
        }
    };
    Renderer.prototype.draw_lines = function () {
        this.canvas.lineWidth = 0.5;
        var line_space = 100;
        var lines_per_row = this.width / line_space;
        var lines_per_column = this.height / line_space;
        this.canvas.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        for (var i = 0; i < lines_per_column; i++) {
            this.canvas.beginPath();
            this.canvas.moveTo(0, i * line_space);
            this.canvas.lineTo(this.width, i * line_space);
            this.canvas.stroke();
        }
        for (var i = 0; i < lines_per_row; i++) {
            this.canvas.beginPath();
            this.canvas.moveTo(i * line_space, 0);
            this.canvas.lineTo(i * line_space, this.height);
            this.canvas.stroke();
        }
    };
    Renderer.prototype.add = function (object) {
        if (object instanceof NtRectangle) {
            this.renderables.push(new Rectangle(object));
        }
        else if (object instanceof NtCircle) {
            this.renderables.push(new Circle(object));
        }
    };
    Renderer.prototype.remove = function (object) {
        var index = this.renderables.findIndex(function (renderable) {
            return renderable.object == object;
        });
        if (index == -1) {
            return;
        }
        this.renderables.splice(index, 1);
    };
    return Renderer;
}());
var NtAABB =  (function () {
    function NtAABB() {
        this.min = new NtVec();
        this.max = new NtVec();
    }
    return NtAABB;
}());
var NtBase =  (function () {
    function NtBase(position) {
        this.position = new NtVec2();
        this.velocity = new NtVec2();
        this.collisions = new Set();
        this.aabb = new NtAABB();
        this.restitution = 1;
        this._mass = 0;
        this._inverse_mass = 0;
        this.position.fromVec(position);
        this.id = NtBase.counter++;
    }
    NtBase.prototype.step = function () {
        this.position.add(this.velocity);
    };
    Object.defineProperty(NtBase.prototype, "mass", {
        get: function () {
            return this._mass;
        },
        set: function (value) {
            this._mass = value;
            this._inverse_mass = 1 / value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NtBase.prototype, "inverse_mass", {
        get: function () {
            return this._inverse_mass;
        },
        enumerable: true,
        configurable: true
    });
    NtBase.counter = 0;
    return NtBase;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NtCircle =  (function (_super) {
    __extends(NtCircle, _super);
    function NtCircle(position, radius) {
        var _this = _super.call(this, position) || this;
        _this.radius = radius;
        return _this;
    }
    NtCircle.prototype.step = function () {
        _super.prototype.step.call(this);
        this.aabb.min.set(this.position.x - this.radius, this.position.y - this.radius);
        this.aabb.max.set(this.position.x + this.radius, this.position.y + this.radius);
    };
    NtCircle.prototype.toString = function () {
        return "NtCircle{position: " + this.position + ", radius: " + this.radius + "}";
    };
    return NtCircle;
}(NtBase));
var NtCollisionUtils =  (function () {
    function NtCollisionUtils() {
    }
    NtCollisionUtils.AABBvsAABB = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var n = NtVec.subtract(B.position, A.position);
        var abox = A.aabb;
        var bbox = B.aabb;
        var overlap = new NtVec();
        var a_extent = (abox.max.x - abox.min.x) / 2;
        var b_extent = (bbox.max.x - bbox.min.x) / 2;
        overlap.x = a_extent + b_extent - Math.abs(n.x);
        if (overlap.x > 0) {
            var a_extent_1 = (abox.max.y - abox.min.y) / 2;
            var b_extent_1 = (bbox.max.y - bbox.min.y) / 2;
            overlap.y = a_extent_1 + b_extent_1 - Math.abs(n.y);
            if (overlap.y > 0) {
                return NtCollisionUtils.calculateNormal(manifold, overlap, n);
            }
        }
        return false;
    };
    NtCollisionUtils.calculateNormal = function (manifold, overlap, n) {
        if (overlap.x > overlap.y) {
            if (n.x < 0) {
                manifold.normal = new NtVec(-1, 0);
            }
            else {
                manifold.normal = new NtVec(1, 0);
            }
            manifold.penetration = overlap.x;
            return true;
        }
        else {
            if (n.y < 0) {
                manifold.normal = new NtVec(0, -1);
            }
            else {
                manifold.normal = new NtVec(0, 1);
            }
            manifold.penetration = overlap.y;
            return true;
        }
    };
    return NtCollisionUtils;
}());
var NtManifold =  (function () {
    function NtManifold() {
    }
    return NtManifold;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NtRectangle =  (function (_super) {
    __extends(NtRectangle, _super);
    function NtRectangle(position, width, height) {
        var _this = _super.call(this, position) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    NtRectangle.prototype.step = function () {
        _super.prototype.step.call(this);
        this.aabb.min.set(this.position.x - this.width / 2, this.position.y - this.height / 2);
        this.aabb.max.set(this.position.x + this.width / 2, this.position.y + this.height / 2);
    };
    NtRectangle.prototype.toString = function () {
        return "NtRectangle{position: " + this.position + ", width: " + this.width + ", "
            + ("height: " + this.height + "}");
    };
    return NtRectangle;
}(NtBase));
var NtVec =  (function () {
    function NtVec(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    NtVec.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
    };
    NtVec.prototype.subtract = function (other) {
        this.x -= other.x;
        this.y -= other.y;
    };
    NtVec.prototype.fromVec = function (other) {
        this.x = other.x;
        this.y = other.y;
    };
    NtVec.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
    };
    NtVec.prototype.toString = function () {
        return "NtVec{x: " + this.x + ", y: " + this.y + "}";
    };
    NtVec.add = function (A, B) {
        return new NtVec(A.x + B.x, A.y + B.y);
    };
    NtVec.subtract = function (A, B) {
        return new NtVec(A.x - B.x, A.y - B.y);
    };
    NtVec.multiply = function (A, n) {
        return new NtVec(A.x * n, A.y * n);
    };
    NtVec.dotProduct = function (A, B) {
        return A.x * B.x + A.y * B.y;
    };
    return NtVec;
}());
var NtVec2 =  (function () {
    function NtVec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    NtVec2.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    };
    NtVec2.prototype.subtract = function (other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    };
    NtVec2.prototype.multiply = function (n) {
        this.x *= n;
        this.y *= n;
        return this;
    };
    NtVec2.prototype.divide = function (n) {
        this.x /= n;
        this.y /= n;
        return this;
    };
    NtVec2.prototype.fromVec = function (other) {
        this.x = other.x;
        this.y = other.y;
        return this;
    };
    NtVec2.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    NtVec2.prototype.toString = function () {
        return "NtVec2{x: " + this.x + ", y: " + this.y + "}";
    };
    NtVec2.fromVec = function (A) {
        return new NtVec2(A.x, A.y);
    };
    NtVec2.add = function (A, B) {
        return new NtVec2(A.x + B.x, A.y + B.y);
    };
    NtVec2.subtract = function (A, B) {
        return new NtVec2(A.x - B.x, A.y - B.y);
    };
    NtVec2.multiply = function (A, n) {
        return new NtVec2(A.x * n, A.y * n);
    };
    NtVec2.divide = function (A, n) {
        return new NtVec2(A.x / n, A.y / n);
    };
    NtVec2.dotProduct = function (A, B) {
        return A.x * B.x + A.y * B.y;
    };
    NtVec2.distance = function (A, B) {
        var dx = A.x - B.x;
        var dy = A.y - B.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    NtVec2.distanceSquared = function (A, B) {
        var dx = A.x - B.x;
        var dy = A.y - B.y;
        return dx * dx + dy * dy;
    };
    NtVec2.equal = function (A, B) {
        return A.x == B.x && A.y == B.y;
    };
    return NtVec2;
}());
var NtWorld =  (function () {
    function NtWorld(renderer) {
        this.renderer = renderer;
        this.list = [];
        this.collisionResolver = new NtCollisionResolver();
    }
    NtWorld.prototype.step = function () {
        var that = this;
        this.list.forEach(function (element) {
            element.collisions.clear();
            element.step();
        });
        this.list.forEach(function (outer) {
            that.list.forEach(function (inner) {
                if (outer == inner || outer.collisions.has(inner)) {
                    return;
                }
                var manifold = new NtManifold(inner, outer);
                if (that.collisionResolver.hasCollision(manifold)) {
                    outer.collisions.add(inner);
                    inner.collisions.add(outer);
                    that.collisionResolver.resolve(manifold);
                }
            });
        });
    };
    NtWorld.prototype.add = function (object) {
        this.list.push(object);
        this.renderer.add(object);
    };
    NtWorld.prototype.remove = function (object) {
        var index = this.list.indexOf(object);
        if (index == -1) {
            return;
        }
        this.list.splice(index, 1);
        this.renderer.remove(object);
    };
    return NtWorld;
}());
var NtAABB =  (function () {
    function NtAABB() {
        this.min = new NtVec2();
        this.max = new NtVec2();
    }
    return NtAABB;
}());
var NtCollisionResolver =  (function () {
    function NtCollisionResolver() {
    }
    NtCollisionResolver.prototype.hasCollision = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        if (A instanceof NtRectangle && B instanceof NtRectangle) {
            return NtCollisionUtils.AABBvsAABB(manifold);
        }
        else if (A instanceof NtCircle && B instanceof NtCircle) {
            return NtCollisionUtils.CircleVsCircle(manifold);
        }
        else if (A instanceof NtRectangle && B instanceof NtCircle) {
            return NtCollisionUtils.AABBvsCircle(manifold);
        }
        else if (A instanceof NtCircle && B instanceof NtRectangle) {
            manifold.A = B;
            manifold.B = A;
            return NtCollisionUtils.AABBvsCircle(manifold);
        }
        return false;
    };
    NtCollisionResolver.prototype.resolve = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var relativeVelocity = NtVec2.subtract(B.velocity, A.velocity);
        var collisionNormal = manifold.normal;
        var velocityAlondNormal = NtVec2.dotProduct(relativeVelocity, collisionNormal);
        var e = Math.min(A.restitution, B.restitution);
        var j = -(1 + e) * velocityAlondNormal;
        j /= A.inverse_mass + B.inverse_mass;
        var impulse = NtVec2.multiply(collisionNormal, j);
        A.velocity.subtract(NtVec2.multiply(impulse, A.inverse_mass));
        B.velocity.add(NtVec2.multiply(impulse, B.inverse_mass));
    };
    return NtCollisionResolver;
}());
var NtCollisionUtils =  (function () {
    function NtCollisionUtils() {
    }
    NtCollisionUtils.AABBvsAABB = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var n = NtVec2.subtract(B.position, A.position);
        var abox = A.aabb;
        var bbox = B.aabb;
        var overlap = new NtVec2();
        var a_extent = (abox.max.x - abox.min.x) / 2;
        var b_extent = (bbox.max.x - bbox.min.x) / 2;
        overlap.x = a_extent + b_extent - Math.abs(n.x);
        if (overlap.x > 0) {
            var a_extent_1 = (abox.max.y - abox.min.y) / 2;
            var b_extent_1 = (bbox.max.y - bbox.min.y) / 2;
            overlap.y = a_extent_1 + b_extent_1 - Math.abs(n.y);
            if (overlap.y > 0) {
                NtCollisionUtils.calculateNormal(manifold, overlap, n);
                return true;
            }
        }
        return false;
    };
    NtCollisionUtils.calculateNormal = function (manifold, overlap, n) {
        if (overlap.x > overlap.y) {
            manifold.normal = new NtVec2(0, Math.sign(n.x));
            manifold.penetration = overlap.x;
        }
        else {
            manifold.normal = new NtVec2(Math.sign(n.y), 0);
            manifold.penetration = overlap.y;
        }
    };
    NtCollisionUtils.CircleVsCircle = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var n = NtVec2.subtract(B.position, A.position);
        var min_distance = A.radius + B.radius;
        min_distance *= min_distance;
        if (NtVec2.distanceSquared(A.position, B.position) > min_distance) {
            return false;
        }
        var distance = NtVec2.distance(A.position, B.position);
        if (distance != 0) {
            manifold.penetration = min_distance - distance;
            manifold.normal = NtVec2.divide(n, distance);
        }
        else {
            manifold.penetration = A.radius;
            manifold.normal = new NtVec2(1, 0);
        }
        return true;
    };
    NtCollisionUtils.AABBvsCircle = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var abox = A.aabb;
        var temp_list = [
            new NtVec2(abox.min.x, abox.min.y),
            new NtVec2(abox.max.x, abox.min.y),
            new NtVec2(abox.min.x, abox.max.y),
            new NtVec2(abox.max.x, abox.max.y),
            new NtVec2(abox.min.x, abox.min.y),
            new NtVec2(abox.min.x, abox.max.y),
            new NtVec2(abox.max.x, abox.min.y),
            new NtVec2(abox.max.x, abox.max.y)
        ];
        var closest = new NtVec2(Number.MAX_VALUE, Number.MAX_VALUE);
        var min_dist = Number.MAX_VALUE;
        for (var i = 0; i < 4; i++) {
            var side = NtCollisionUtils.segmentProjection(B.position, temp_list[i * 2], temp_list[i * 2 + 1]);
            var side_dist = NtVec2.distanceSquared(side, B.position);
            if (min_dist > side_dist) {
                closest = side;
                min_dist = side_dist;
            }
        }
        var dist_squared = NtVec2.distanceSquared(closest, B.position);
        if (dist_squared > B.radius * B.radius) {
            return false;
        }
        var distance = NtVec2.distance(closest, B.position);
        var normal = NtVec2.subtract(B.position, closest).divide(distance);
        manifold.penetration = B.radius - distance;
        manifold.normal = normal;
        return true;
    };
    NtCollisionUtils.segmentProjection = function (point, A, B) {
        var segment_length_squared = NtVec2.distanceSquared(A, B);
        if (segment_length_squared == 0) {
            return NtVec2.fromVec(A);
        }
        var t = ((point.x - A.x) * (B.x - A.x)
            + (point.y - A.y) * (B.y - A.y)) / segment_length_squared;
        t = Math.max(0, Math.min(1, t));
        return new NtVec2(A.x + t * (B.x - A.x), A.y + t * (B.y - A.y));
    };
    return NtCollisionUtils;
}());
var NtManifold =  (function () {
    function NtManifold(A, B) {
        this.penetration = 0;
        this.normal = new NtVec2();
        this.A = A;
        this.B = B;
    }
    return NtManifold;
}());
var phys1 = new NtRectangle(new NtVec2(370, 160), 50, 40);
phys1.mass = 20;
phys1.velocity.set(-1.5, 0);
console.log(phys1);
var phys2 = new NtRectangle(new NtVec2(10, 160), 50, 40);
phys2.mass = 20;
phys2.velocity.set(1.5, 0);
console.log(phys2);
var phys3 = new NtRectangle(new NtVec2(200, 190), 150, 120);
phys3.mass = 20;
console.log(phys3);
var phys4 = new NtRectangle(new NtVec2(210, -60), 50, 40);
phys4.mass = 20;
phys4.velocity.set(0, 1.5);
console.log(phys4);
var phys5 = new NtRectangle(new NtVec2(210, 370), 50, 40);
phys5.mass = 20;
phys5.velocity.set(0, -1.5);
console.log(phys5);
var circle1 = new NtCircle(new NtVec2(100, 50), 20);
circle1.mass = 20;
circle1.velocity.set(0.5, 0.5);
console.log(circle1);
var circle2 = new NtCircle(new NtVec2(250, 50), 30);
circle2.mass = 30;
circle2.velocity.set(-0.5, 0.5);
console.log(circle2);
var circle3 = new NtCircle(new NtVec2(150, 150), 40);
circle3.mass = 340;
circle3.velocity.set(0, -1);
console.log(circle3);
var circle4 = new NtCircle(new NtVec2(150, 400), 40);
circle4.mass = 20;
circle4.velocity.set(0, -0.5);
console.log(circle4);
var rect1 = new NtRectangle(new NtVec2(150, 270), 250, 140);
rect1.mass = 40;
console.log(rect1);
var circle5 = new NtCircle(new NtVec2(150, 50), 40);
circle5.mass = 20;
circle5.velocity.set(0, 0.8);
console.log(circle5);
var circle6 = new NtCircle(new NtVec2(450, 250), 40);
circle6.mass = 20;
circle6.velocity.set(-0.8, 0);
console.log(circle6);
var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext("2d");
var renderer = new Renderer(canvasContext, canvas.width, canvas.height);
var world = new NtWorld(renderer);
world.add(circle4);
world.add(circle5);
world.add(circle6);
world.add(rect1);
setInterval(function () {
    world.step();
    renderer.draw();
}, 33);
