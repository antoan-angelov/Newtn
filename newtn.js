"use strict";
var Renderable =  (function () {
    function Renderable(object) {
        this.object = object;
    }
    return Renderable;
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
var Circle =  (function (_super) {
    __extends(Circle, _super);
    function Circle(object) {
        return _super.call(this, object) || this;
    }
    Circle.prototype.draw = function (canvas) {
        var position = this.object.position;
        var radius = this.object.shape.radius;
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
            ("shape: " + this.object.shape + "}"));
    };
    return Circle;
}(Renderable));
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
var Rectangle =  (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(object) {
        return _super.call(this, object) || this;
    }
    Rectangle.prototype.draw = function (canvas) {
        var position = this.object.position;
        var rect_shape = this.object.shape;
        var width = rect_shape.width;
        var height = rect_shape.height;
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
            ("width: " + this.object.shape + "}"));
    };
    return Rectangle;
}(Renderable));
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
        if (object.shape instanceof NtRectangleShape) {
            this.renderables.push(new Rectangle(object));
        }
        else if (object.shape instanceof NtCircleShape) {
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
        this.force = new NtVec2();
        this.layers = 1;
        this._mass = 0;
        this._inverse_mass = 0;
        this.position.fromVec(position);
        this.id = NtBase.counter++;
    }
    NtBase.prototype.step = function (dt) {
        this.position.add(NtVec2.multiply(this.velocity, dt));
        this.velocity.add(NtVec2.multiply(this.force, dt / this.mass));
    };
    NtBase.prototype.apply_impulse = function (impulse) {
        this.velocity.add(NtVec2.multiply(impulse, this.inverse_mass));
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
var NtBody =  (function () {
    function NtBody(position, shape, material) {
        if (material === void 0) { material = new NtMaterial(); }
        this.collisions = new Set();
        this.aabb = new NtAABB();
        this.position = new NtVec2();
        this.velocity = new NtVec2();
        this.force = new NtVec2();
        this.layers = 1;
        this.friction = 1;
        this._mass = 0;
        this._inverse_mass = 0;
        this.position.fromVec(position);
        this.shape = shape;
        this.material = material;
        this.calculate_mass();
    }
    NtBody.prototype.step = function (dt) {
        this.calculate_mass();
        this.position.add(NtVec2.multiply(this.velocity, dt));
        this.velocity.add(NtVec2.multiply(this.force, dt / this.mass));
        this.aabb.min.setVec(NtVec2.add(this.position, this.shape.bounds.min));
        this.aabb.max.setVec(NtVec2.add(this.position, this.shape.bounds.max));
    };
    NtBody.prototype.calculate_mass = function () {
        this._mass = this.shape.area * this.material.density;
        this._inverse_mass = 1 / this._mass;
    };
    NtBody.prototype.apply_impulse = function (impulse) {
        this.velocity.add(NtVec2.multiply(impulse, this.inverse_mass));
    };
    Object.defineProperty(NtBody.prototype, "mass", {
        get: function () {
            return this._mass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NtBody.prototype, "inverse_mass", {
        get: function () {
            return this._inverse_mass;
        },
        enumerable: true,
        configurable: true
    });
    return NtBody;
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
    NtCircle.prototype.step = function (dt) {
        _super.prototype.step.call(this, dt);
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
var NtMaterial =  (function () {
    function NtMaterial(density, restitution) {
        if (density === void 0) { density = 0.5; }
        if (restitution === void 0) { restitution = 1; }
        this.density = density;
        this.restitution = restitution;
    }
    return NtMaterial;
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
    NtRectangle.prototype.step = function (dt) {
        _super.prototype.step.call(this, dt);
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
    NtVec2.prototype.setVec = function (A) {
        this.x = A.x;
        this.y = A.y;
        return this;
    };
    NtVec2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    NtVec2.prototype.normalize = function () {
        return this.divide(this.length());
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
    NtVec2.negate = function (A) {
        return new NtVec2(-A.x, -A.y);
    };
    return NtVec2;
}());
var NtWorld =  (function () {
    function NtWorld(renderer) {
        this.renderer = renderer;
        this.list = [];
        this.collisionResolver = new NtCollisionResolver();
    }
    NtWorld.prototype.step = function (dt) {
        var that = this;
        this.list.forEach(function (element) {
            element.collisions.clear();
            element.step(dt);
        });
        this.list.forEach(function (outer) {
            that.list.forEach(function (inner) {
                if (outer == inner
                    || !(outer.layers & inner.layers)
                    || outer.collisions.has(inner)) {
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
var NtShapeBase =  (function () {
    function NtShapeBase() {
        this._bounds = null;
        this._area = -1;
    }
    Object.defineProperty(NtShapeBase.prototype, "bounds", {
        get: function () {
            this._bounds = this._bounds || this.calculate_bounds();
            return this._bounds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NtShapeBase.prototype, "area", {
        get: function () {
            if (this._area == -1) {
                this._area = this.calculate_area();
            }
            return this._area;
        },
        enumerable: true,
        configurable: true
    });
    return NtShapeBase;
}());
var NtBounds =  (function () {
    function NtBounds(min, max) {
        this.min = new NtVec2();
        this.max = new NtVec2();
        this.min = min;
        this.max = max;
    }
    return NtBounds;
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
var NtCircleShape =  (function (_super) {
    __extends(NtCircleShape, _super);
    function NtCircleShape(radius) {
        var _this = _super.call(this) || this;
        _this.radius = radius;
        return _this;
    }
    NtCircleShape.prototype.calculate_bounds = function () {
        return new NtBounds(new NtVec2(-this.radius, -this.radius), new NtVec2(this.radius, this.radius));
    };
    NtCircleShape.prototype.calculate_area = function () {
        return Math.PI * this.radius * this.radius;
    };
    NtCircleShape.prototype.toString = function () {
        return "NtCircleShape{radius: " + this.radius + "}";
    };
    return NtCircleShape;
}(NtShapeBase));
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
var NtRectangleShape =  (function (_super) {
    __extends(NtRectangleShape, _super);
    function NtRectangleShape(width, height) {
        var _this = _super.call(this) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    NtRectangleShape.prototype.calculate_bounds = function () {
        return new NtBounds(new NtVec2(-this.width / 2, -this.height / 2), new NtVec2(this.width / 2, this.height / 2));
    };
    NtRectangleShape.prototype.calculate_area = function () {
        return this.width * this.height;
    };
    NtRectangleShape.prototype.toString = function () {
        return "NtRectangleShape{width: " + this.width + ", height: " + this.height + "}";
    };
    return NtRectangleShape;
}(NtShapeBase));
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
        var a_shape = A.shape;
        var b_shape = B.shape;
        if (a_shape instanceof NtRectangleShape
            && b_shape instanceof NtRectangleShape) {
            return NtCollisionUtils.AABBvsAABB(manifold);
        }
        else if (a_shape instanceof NtCircleShape
            && b_shape instanceof NtCircleShape) {
            return NtCollisionUtils.CircleVsCircle(manifold);
        }
        else if (a_shape instanceof NtRectangleShape
            && b_shape instanceof NtCircleShape) {
            return NtCollisionUtils.AABBvsCircle(manifold);
        }
        else if (a_shape instanceof NtCircleShape
            && b_shape instanceof NtRectangleShape) {
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
        if (velocityAlondNormal > 0) {
            return;
        }
        var e = Math.min(A.material.restitution, B.material.restitution);
        var j = -(1 + e) * velocityAlondNormal;
        j /= A.inverse_mass + B.inverse_mass;
        var impulse = NtVec2.multiply(collisionNormal, j);
        A.apply_impulse(NtVec2.negate(impulse));
        B.apply_impulse(impulse);
        relativeVelocity = NtVec2.subtract(B.velocity, A.velocity);
        var tangent = (NtVec2.subtract(relativeVelocity, NtVec2.multiply(collisionNormal, velocityAlondNormal)));
        tangent.normalize();
        var jt = -NtVec2.dotProduct(relativeVelocity, tangent);
        jt = jt / (A.inverse_mass + B.inverse_mass);
        var mu = (A.friction + B.friction) / 2;
        var friction_impulse = new NtVec2();
        if (Math.abs(jt) < j * mu) {
            friction_impulse.setVec(NtVec2.multiply(tangent, jt));
        }
        else {
            friction_impulse.setVec(NtVec2.multiply(tangent, -j * mu));
        }
        A.velocity.subtract(NtVec2.multiply(friction_impulse, A.inverse_mass));
        B.velocity.add(NtVec2.multiply(friction_impulse, B.inverse_mass));
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
        var a_shape = A.shape;
        var b_shape = B.shape;
        var n = NtVec2.subtract(B.position, A.position);
        var min_distance = a_shape.radius + b_shape.radius;
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
            manifold.penetration = a_shape.radius;
            manifold.normal = new NtVec2(1, 0);
        }
        return true;
    };
    NtCollisionUtils.AABBvsCircle = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var b_shape = B.shape;
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
        if (dist_squared > b_shape.radius * b_shape.radius) {
            return false;
        }
        var distance = NtVec2.distance(closest, B.position);
        var normal = NtVec2.subtract(B.position, closest).divide(distance);
        manifold.penetration = b_shape.radius - distance;
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
var circle4 = new NtBody(new NtVec2(150, 400), new NtCircleShape(40));
circle4.material.density = 0.002;
circle4.force.set(150, -50);
console.log(circle4);
var circle7 = new NtBody(new NtVec2(450, 400), new NtCircleShape(40));
circle7.material.density = 0.002;
circle7.force.set(0, -350);
console.log(circle7);
var rect1 = new NtBody(new NtVec2(280, 270), new NtRectangleShape(350, 140));
rect1.material.density = 10;
console.log(rect1);
var circle5 = new NtBody(new NtVec2(150, 50), new NtCircleShape(40));
circle5.material.density = 0.002;
circle5.force.set(0, 80);
console.log(circle5);
var circle6 = new NtBody(new NtVec2(450, 250), new NtCircleShape(40));
circle6.material.density = 0.002;
circle6.force.setVec(new NtVec2(-80, 0));
console.log(circle6);
var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext("2d");
var renderer = new Renderer(canvasContext, canvas.width, canvas.height);
var world = new NtWorld(renderer);
world.add(circle4);
world.add(circle7);
world.add(rect1);
setInterval(function () {
    var dt = 33 / 1000;
    world.step(dt);
    renderer.draw();
}, 33);
