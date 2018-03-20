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
        var orientation = this.object.orientation;
        var vertices = rect_shape.vertices;
        var vertex1 = NtVec2.rotate(vertices[0], orientation);
        canvas.moveTo(position.x + vertex1.x, position.y + vertex1.y);
        for (var i = 1; i < vertices.length; i++) {
            var vertex2 = NtVec2.rotate(vertices[i], orientation);
            canvas.lineTo(position.x + vertex2.x, position.y + vertex2.y);
        }
        canvas.lineTo(position.x + vertex1.x, position.y + vertex1.y);
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
        this.angular_velocity = 0;
        this.torque = 1;
        this.orientation = 0;
        this._mass = 0;
        this._inverse_mass = 0;
        this._inertia = 1;
        this._inverse_inertia = 1;
        this.position.fromVec(position);
        this.shape = shape;
        this.material = material;
        this.calculate_mass();
    }
    NtBody.prototype.step = function (dt) {
        this.calculate_mass();
        this.velocity.add(NtVec2.multiply(this.force, this._inverse_mass * dt));
        this.angular_velocity += this.torque * this._inverse_inertia * dt;
        this.position.add(NtVec2.multiply(this.velocity, dt));
        this.orientation += this.angular_velocity * dt;
        var bounds = this.shape.get_bounds_for_orientation(this.orientation);
        this.aabb.min.setVec(NtVec2.add(this.position, bounds.min));
        this.aabb.max.setVec(NtVec2.add(this.position, bounds.max));
    };
    NtBody.prototype.calculate_mass = function () {
        this._mass = this.shape.area * this.material.density;
        if (this._mass != 0) {
            this._inverse_mass = 1 / this._mass;
        }
        else {
            this._inverse_mass = Number.MAX_VALUE;
        }
        this._inertia = this.shape.get_moment_of_inertia(this.material.density);
        this._inverse_inertia = this._inertia != 0 ? 1 / this._inertia : 0;
    };
    NtBody.prototype.apply_impulse = function (impulse, contact) {
        this.velocity.add(NtVec2.multiply(impulse, this.inverse_mass));
        this.angular_velocity += NtVec2.crossProduct(contact, impulse) * this.inverse_inertia;
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
    Object.defineProperty(NtBody.prototype, "inertia", {
        get: function () {
            return this._inertia;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NtBody.prototype, "inverse_inertia", {
        get: function () {
            return this._inverse_inertia;
        },
        enumerable: true,
        configurable: true
    });
    return NtBody;
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
    NtVec2.prototype.addScalar = function (scalar) {
        this.x += scalar;
        this.y += scalar;
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
    NtVec2.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
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
    NtVec2.negate = function (A) {
        return new NtVec2(-A.x, -A.y);
    };
    NtVec2.crossProduct = function (A, B) {
        return A.x * B.y - A.y * B.x;
    };
    NtVec2.crossProductScalarSecond = function (A, scalar) {
        return new NtVec2(scalar * A.y, -scalar * A.x);
    };
    NtVec2.crossProductScalarFirst = function (A, scalar) {
        return new NtVec2(-scalar * A.y, scalar * A.x);
    };
    NtVec2.rotate = function (A, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        return new NtVec2(cos * A.x - sin * A.y, sin * A.x + cos * A.y);
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
        for (var i = 0; i < this.list.length - 1; i++) {
            var outer = this.list[i];
            for (var j = i + 1; j < this.list.length; j++) {
                var inner = this.list[j];
                if (!(outer.layers & inner.layers)
                    || outer.collisions.has(inner)) {
                    return;
                }
                if (that.collisionResolver.isCollisionLikely(inner, outer)) {
                    var manifold = new NtManifold(inner, outer);
                    if (that.collisionResolver.hasCollision(manifold)) {
                        outer.collisions.add(inner);
                        inner.collisions.add(outer);
                        that.collisionResolver.resolve(manifold);
                    }
                }
            }
        }
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
        this._area = -1;
    }
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
    NtCircleShape.prototype.get_bounds_for_orientation = function () {
        return new NtBounds(new NtVec2(-this.radius, -this.radius), new NtVec2(this.radius, this.radius));
    };
    NtCircleShape.prototype.calculate_area = function () {
        return Math.PI * this.radius * this.radius;
    };
    NtCircleShape.prototype.get_moment_of_inertia = function (density) {
        return density * Math.PI * Math.pow(this.radius, 4);
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
var NtPolygonShape =  (function (_super) {
    __extends(NtPolygonShape, _super);
    function NtPolygonShape(vertices) {
        var _this = _super.call(this) || this;
        _this.normals = [];
        _this.vertices = vertices;
        _this.calculate_surface_normals();
        return _this;
    }
    NtPolygonShape.prototype.get_bounds_for_orientation = function (orientation) {
        var bounds = new NtBounds(new NtVec2(Number.MAX_VALUE, Number.MAX_VALUE), new NtVec2(-Number.MAX_VALUE, -Number.MAX_VALUE));
        for (var i = 0; i < this.vertices.length; i++) {
            var oriented_coordinates = NtVec2.rotate(this.vertices[i], orientation);
            if (bounds.min.x > oriented_coordinates.x) {
                bounds.min.x = oriented_coordinates.x;
            }
            if (bounds.min.y > oriented_coordinates.y) {
                bounds.min.y = oriented_coordinates.y;
            }
            if (bounds.max.x < oriented_coordinates.x) {
                bounds.max.x = oriented_coordinates.x;
            }
            if (bounds.max.y < oriented_coordinates.y) {
                bounds.max.y = oriented_coordinates.y;
            }
        }
        return bounds;
    };
    NtPolygonShape.prototype.calculate_surface_normals = function () {
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex1 = this.vertices[i];
            var vertex2 = this.vertices[(i + 1) % this.vertices.length];
            var dx = vertex2.x - vertex1.x;
            var dy = vertex2.y - vertex1.y;
            var edge = new NtVec2(dx, dy);
            var normal = new NtVec2(-dy, dx).normalize();
            if (NtVec2.crossProduct(edge, normal) < 0) {
                this.normals.push(normal);
            }
            else {
                this.normals.push(normal.negate());
            }
        }
    };
    NtPolygonShape.prototype.get_support_point = function (direction) {
        var best_projection = -Number.MAX_VALUE;
        var best_vertex = this.vertices[0];
        this.vertices.forEach(function (vertex) {
            var projection = NtVec2.dotProduct(vertex, direction);
            if (projection > best_projection) {
                best_vertex = vertex;
                best_projection = projection;
            }
        });
        return best_vertex;
    };
    NtPolygonShape.prototype.get_moment_of_inertia = function (density) {
        var inertia_total = 0;
        for (var i = 0; i < this.vertices.length; i++) {
            var v1 = this.vertices[i];
            var v2 = this.vertices[(i + 1) % this.vertices.length];
            var D = NtVec2.crossProduct(v1, v2);
            var intx2 = v1.x * v1.x + v2.x * v1.x + v2.x * v2.x;
            var inty2 = v1.y * v1.y + v2.y * v1.y + v2.y * v2.y;
            inertia_total += (0.25 * D / 3) * (intx2 + inty2);
        }
        inertia_total *= density;
        return inertia_total;
    };
    return NtPolygonShape;
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
        var _this = _super.call(this, [new NtVec2(-width / 2, -height / 2),
            new NtVec2(width / 2, -height / 2),
            new NtVec2(width / 2, height / 2),
            new NtVec2(-width / 2, height / 2)]) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    NtRectangleShape.prototype.calculate_area = function () {
        return this.width * this.height;
    };
    NtRectangleShape.prototype.toString = function () {
        return "NtRectangleShape{width: " + this.width + ", height: " + this.height + "}";
    };
    return NtRectangleShape;
}(NtPolygonShape));
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
    NtCollisionResolver.prototype.isCollisionLikely = function (A, B) {
        return NtCollisionUtils.AABBvsAABB(A, B);
    };
    NtCollisionResolver.prototype.hasCollision = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var a_shape = A.shape;
        var b_shape = B.shape;
        if (a_shape instanceof NtPolygonShape
            && b_shape instanceof NtPolygonShape) {
            return new NtPolygonPolygonCollision(manifold).hasCollision();
        }
        else if (a_shape instanceof NtCircleShape
            && b_shape instanceof NtCircleShape) {
            return new NtCircleCircleCollision(manifold).hasCollision();
        }
        else if (a_shape instanceof NtCircleShape
            && b_shape instanceof NtPolygonShape) {
            return new NtCirclePolygonCollision(manifold).hasCollision();
        }
        else if (a_shape instanceof NtPolygonShape
            && b_shape instanceof NtCircleShape) {
            manifold.A = B;
            manifold.B = A;
            return new NtCirclePolygonCollision(manifold).hasCollision();
        }
        return false;
    };
    NtCollisionResolver.prototype.resolve = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var collisionNormal = manifold.normal;
        for (var i = 0; i < manifold.contact_points.length; i++) {
            var contact_point = manifold.contact_points[i];
            var ra = NtVec2.subtract(contact_point, A.position);
            var rb = NtVec2.subtract(contact_point, B.position);
            var relative_vel = NtVec2.subtract(B.velocity, A.velocity)
                .add(NtVec2.crossProductScalarFirst(rb, B.angular_velocity))
                .subtract(NtVec2.crossProductScalarFirst(ra, A.angular_velocity));
            var velocity_along_normal = NtVec2.dotProduct(relative_vel, collisionNormal);
            var ra_length = NtVec2.crossProduct(ra, collisionNormal);
            var rb_length = NtVec2.crossProduct(rb, collisionNormal);
            var denominator = A.inverse_mass + B.inverse_mass
                + ra_length * ra_length * A.inverse_inertia
                + rb_length * rb_length * B.inverse_inertia;
            var collision_context = {
                contact_point: contact_point, ra: ra, rb: rb, ra_length: ra_length, rb_length: rb_length, denominator: denominator,
                relative_vel: relative_vel, velocity_along_normal: velocity_along_normal
            };
            if (velocity_along_normal > 0) {
                return;
            }
            this.apply_impulse(manifold, collision_context);
            this.apply_friction(manifold, collision_context);
        }
    };
    NtCollisionResolver.prototype.apply_impulse = function (manifold, collision_context) {
        var A = manifold.A;
        var B = manifold.B;
        var ra = collision_context.ra;
        var rb = collision_context.rb;
        var impulse = this.get_impulse(manifold, collision_context);
        A.apply_impulse(NtVec2.negate(impulse), NtVec2.rotate(ra, -A.orientation));
        B.apply_impulse(impulse, NtVec2.rotate(rb, -B.orientation));
    };
    NtCollisionResolver.prototype.get_impulse = function (manifold, collision_context) {
        var j = this.calculate_j(manifold, collision_context);
        return NtVec2.multiply(manifold.normal, j);
    };
    NtCollisionResolver.prototype.calculate_j = function (manifold, collision_context) {
        var e = Math.min(manifold.A.material.restitution, manifold.B.material.restitution);
        var j = -(1 + e) * collision_context.velocity_along_normal;
        j /= collision_context.denominator;
        j /= manifold.contact_points.length;
        collision_context.j = j;
        return j;
    };
    NtCollisionResolver.prototype.apply_friction = function (manifold, collision_context) {
        var A = manifold.A;
        var B = manifold.B;
        var ra = collision_context.ra;
        var rb = collision_context.rb;
        var relative_vel = NtVec2.subtract(B.velocity, A.velocity)
            .add(NtVec2.crossProductScalarFirst(rb, B.angular_velocity))
            .subtract(NtVec2.crossProductScalarFirst(ra, A.angular_velocity));
        var collisionNormal = manifold.normal;
        var tangent = NtVec2.subtract(relative_vel, NtVec2.multiply(collisionNormal, NtVec2.dotProduct(relative_vel, collisionNormal))).normalize();
        collision_context.tangent = tangent;
        var friction_impulse = this.get_friction_impulse(manifold, collision_context);
        A.apply_impulse(NtVec2.negate(friction_impulse), ra);
        B.apply_impulse(friction_impulse, rb);
    };
    NtCollisionResolver.prototype.calculate_jt = function (manifold, collision_context) {
        var jt = -NtVec2.dotProduct(collision_context.relative_vel, collision_context.tangent);
        jt /= collision_context.denominator;
        jt /= manifold.contact_points.length;
        return jt;
    };
    NtCollisionResolver.prototype.get_friction_impulse = function (manifold, collision_context) {
        var mu = (manifold.A.friction + manifold.B.friction) / 2;
        var friction_impulse = new NtVec2();
        var jt = this.calculate_jt(manifold, collision_context);
        if (Math.abs(jt) < collision_context.j * mu) {
            friction_impulse.setVec(NtVec2.multiply(collision_context.tangent, jt));
        }
        else {
            friction_impulse.setVec(NtVec2.multiply(collision_context.tangent, -collision_context.j * mu));
        }
        return friction_impulse;
    };
    return NtCollisionResolver;
}());
var NtCollisionUtils =  (function () {
    function NtCollisionUtils() {
    }
    NtCollisionUtils.AABBvsAABB = function (A, B) {
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
                return true;
            }
        }
        return false;
    };
    return NtCollisionUtils;
}());
var NtManifold =  (function () {
    function NtManifold(A, B) {
        this.penetration = 0;
        this.normal = new NtVec2();
        this.contact_points = [];
        this.A = A;
        this.B = B;
    }
    return NtManifold;
}());
var NtCircleCircleCollision =  (function () {
    function NtCircleCircleCollision(manifold) {
        this.manifold = manifold;
    }
    NtCircleCircleCollision.prototype.hasCollision = function () {
        var A = this.manifold.A;
        var B = this.manifold.B;
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
            this.manifold.penetration = min_distance - distance;
            this.manifold.normal = NtVec2.divide(n, distance);
        }
        else {
            this.manifold.penetration = a_shape.radius;
            this.manifold.normal = new NtVec2(1, 0);
        }
        this.manifold.contact_points.push(NtVec2.add(A.position, NtVec2.rotate(NtVec2.multiply(this.manifold.normal, a_shape.radius), A.orientation)));
        return true;
    };
    return NtCircleCircleCollision;
}());
var NtCirclePolygonCollision =  (function () {
    function NtCirclePolygonCollision(manifold) {
        this.manifold = manifold;
        this.A = manifold.A;
        this.B = manifold.B;
        this.circle_shape = this.A.shape;
        this.poly_shape = this.B.shape;
    }
    NtCirclePolygonCollision.prototype.hasCollision = function () {
        var edge_penetration = this.get_edge_min_penetration();
        if (!edge_penetration) {
            return false;
        }
        var face_index = edge_penetration[0];
        var separation = edge_penetration[1];
        if (separation < 0.0001) {
            this.populate_manifold_for_circle_center_inside_poly(face_index);
            return true;
        }
        return this.populate_manifold_according_to_side_of_edge(edge_penetration);
    };
    NtCirclePolygonCollision.prototype.populate_manifold_according_to_side_of_edge = function (edge_penetration) {
        var face_index = edge_penetration[0];
        var separation = edge_penetration[1];
        var poly_vertices = this.poly_shape.vertices;
        var v1 = poly_vertices[face_index];
        var v2 = poly_vertices[(face_index + 1) % poly_vertices.length];
        var center = NtVec2.rotate(NtVec2.subtract(this.A.position, this.B.position), -this.B.orientation);
        var dot1 = NtVec2.dotProduct(NtVec2.subtract(center, v1), NtVec2.subtract(v2, v1));
        var dot2 = NtVec2.dotProduct(NtVec2.subtract(center, v2), NtVec2.subtract(v1, v2));
        this.manifold.penetration = this.circle_shape.radius - separation;
        if (dot1 <= 0) {
            return this.populate_manifold_for_nearest_vertex(v1, center);
        }
        else if (dot2 <= 0) {
            return this.populate_manifold_for_nearest_vertex(v2, center);
        }
        return this.populate_manifold_for_nearest_face(v1, center, face_index);
    };
    NtCirclePolygonCollision.prototype.get_edge_min_penetration = function () {
        var center = NtVec2.rotate(NtVec2.subtract(this.A.position, this.B.position), -this.B.orientation);
        var separation = -Number.MAX_VALUE;
        var face_normal = 0;
        for (var i = 0; i < this.poly_shape.vertices.length; i++) {
            var s = NtVec2.dotProduct(this.poly_shape.normals[i], NtVec2.subtract(center, this.poly_shape.vertices[i]));
            if (s > this.circle_shape.radius) {
                return null;
            }
            if (s > separation) {
                separation = s;
                face_normal = i;
            }
        }
        return [face_normal, separation];
    };
    NtCirclePolygonCollision.prototype.populate_manifold_for_circle_center_inside_poly = function (face_index) {
        this.manifold.normal.setVec(NtVec2.rotate(this.poly_shape.normals[face_index], this.B.orientation).negate());
        this.manifold.contact_points.push(NtVec2.multiply(this.manifold.normal, this.circle_shape.radius)
            .add(this.A.position));
        this.manifold.penetration = this.circle_shape.radius;
    };
    NtCirclePolygonCollision.prototype.populate_manifold_for_nearest_vertex = function (vertex, center) {
        var radius = this.circle_shape.radius;
        if (NtVec2.distanceSquared(center, vertex) > radius * radius) {
            return false;
        }
        var n = NtVec2.rotate(NtVec2.subtract(vertex, center), this.B.orientation).normalize();
        this.manifold.normal = n;
        vertex = NtVec2.rotate(vertex, this.B.orientation).add(this.B.position);
        this.manifold.contact_points.push(vertex);
        return true;
    };
    NtCirclePolygonCollision.prototype.populate_manifold_for_nearest_face = function (vertex, center, face_index) {
        var n = this.poly_shape.normals[face_index];
        if (NtVec2.dotProduct(NtVec2.subtract(center, vertex), n) > this.circle_shape.radius) {
            return false;
        }
        n = NtVec2.rotate(n, this.B.orientation);
        this.manifold.normal = n.negate();
        this.manifold.contact_points.push(NtVec2.add(NtVec2.multiply(this.manifold.normal, this.circle_shape.radius), this.A.position));
        return true;
    };
    return NtCirclePolygonCollision;
}());
var NtPolygonPolygonCollision =  (function () {
    function NtPolygonPolygonCollision(manifold) {
        this.manifold = manifold;
        this.A = manifold.A;
        this.B = manifold.B;
    }
    NtPolygonPolygonCollision.prototype.hasCollision = function () {
        var penetration_a_result = this.axis_least_penetration(this.A, this.B);
        if (penetration_a_result[0] >= 0) {
            return false;
        }
        var penetration_b_result = this.axis_least_penetration(this.B, this.A);
        if (penetration_b_result[0] >= 0) {
            return false;
        }
        var ref_poly;
        var ref_body;
        var inc_body;
        var ref_index;
        var flip;
        if (penetration_a_result[0] > penetration_b_result[0]) {
            ref_body = this.A;
            inc_body = this.B;
            ref_poly = this.A.shape;
            ref_index = penetration_a_result[1];
            flip = false;
        }
        else {
            ref_body = this.B;
            inc_body = this.A;
            ref_poly = this.B.shape;
            ref_index = penetration_b_result[1];
            flip = true;
        }
        var inc_face = this.find_incident_face(ref_body, inc_body, ref_index);
        var v1 = ref_poly.vertices[ref_index];
        var v2 = ref_poly.vertices[(ref_index + 1) % ref_poly.vertices.length];
        v1 = NtVec2.add(ref_body.position, NtVec2.rotate(v1, ref_body.orientation));
        v2 = NtVec2.add(ref_body.position, NtVec2.rotate(v2, ref_body.orientation));
        var side_plane_normal = NtVec2.subtract(v2, v1).normalize();
        var ref_face_normal = new NtVec2(side_plane_normal.y, -side_plane_normal.x);
        var ref_c = NtVec2.dotProduct(ref_face_normal, v1);
        var neg_side = -NtVec2.dotProduct(side_plane_normal, v1);
        var pos_side = NtVec2.dotProduct(side_plane_normal, v2);
        var side_plane_normal_neg = NtVec2.negate(side_plane_normal);
        if (this.clip(side_plane_normal_neg, neg_side, inc_face) < 2) {
            return false;
        }
        if (this.clip(side_plane_normal, pos_side, inc_face) < 2) {
            return false;
        }
        this.manifold.normal = NtVec2.multiply(ref_face_normal, flip ? -1 : 1);
        this.manifold.penetration = 0;
        var cp = 0;
        var separation = NtVec2.dotProduct(ref_face_normal, inc_face[0]) - ref_c;
        if (separation <= 0) {
            this.manifold.contact_points[cp] = inc_face[0];
            this.manifold.penetration += -separation;
            ++cp;
        }
        separation = NtVec2.dotProduct(ref_face_normal, inc_face[1]) - ref_c;
        if (separation <= 0) {
            this.manifold.contact_points[cp] = inc_face[1];
            this.manifold.penetration += -separation;
            ++cp;
            this.manifold.penetration /= cp;
        }
        return true;
    };
    NtPolygonPolygonCollision.prototype.clip = function (n, c, face) {
        var sp = 0;
        var out = [face[0], face[1]];
        var d1 = NtVec2.dotProduct(n, face[0]) - c;
        var d2 = NtVec2.dotProduct(n, face[1]) - c;
        if (d1 <= 0) {
            out[sp++] = face[0];
        }
        if (d2 <= 0) {
            out[sp++] = face[1];
        }
        if (d1 * d2 < 0) {
            var alpha = d1 / (d1 - d2);
            out[sp] = NtVec2.add(face[0], NtVec2.multiply(NtVec2.subtract(face[1], face[0]), alpha));
            sp++;
        }
        face[0] = out[0];
        face[1] = out[1];
        return sp;
    };
    NtPolygonPolygonCollision.prototype.find_incident_face = function (ref_body, inc_body, reference_index) {
        var ref_poly = ref_body.shape;
        var inc_poly = inc_body.shape;
        var ref_normal = ref_poly.normals[reference_index];
        ref_normal = NtVec2.rotate(ref_normal, ref_body.orientation);
        ref_normal = NtVec2.rotate(ref_normal, -inc_body.orientation);
        var inc_face = 0;
        var min_dot = Number.MAX_VALUE;
        for (var i = 0; i < inc_poly.vertices.length; i++) {
            var dot = NtVec2.dotProduct(ref_normal, inc_poly.normals[i]);
            if (dot < min_dot) {
                min_dot = dot;
                inc_face = i;
            }
        }
        var result = [new NtVec2(), new NtVec2()];
        result[0] = NtVec2.add(inc_body.position, NtVec2.rotate(inc_poly.vertices[inc_face], inc_body.orientation));
        inc_face = (inc_face + 1) % inc_poly.vertices.length;
        result[1] = NtVec2.add(inc_body.position, NtVec2.rotate(inc_poly.vertices[inc_face], inc_body.orientation));
        return result;
    };
    NtPolygonPolygonCollision.prototype.axis_least_penetration = function (A, B) {
        var best_distance = -Number.MAX_VALUE;
        var best_index = -1;
        var shape_a = A.shape;
        var shape_b = B.shape;
        for (var i = 0; i < shape_a.vertices.length; i++) {
            var face_normal = NtVec2.rotate(shape_a.normals[i], A.orientation);
            var relative_normal = NtVec2.rotate(face_normal, -B.orientation);
            var support_point_local = shape_b.get_support_point(NtVec2.negate(relative_normal));
            var vertex_world = NtVec2.add(A.position, NtVec2.rotate(shape_a.vertices[i], A.orientation));
            var vertex = NtVec2.rotate(vertex_world.subtract(B.position), -B.orientation);
            var dot = NtVec2.dotProduct(relative_normal, NtVec2.subtract(support_point_local, vertex));
            if (dot > best_distance) {
                best_distance = dot;
                best_index = i;
            }
        }
        return [best_distance, best_index];
    };
    return NtPolygonPolygonCollision;
}());
var circle4 = new NtBody(new NtVec2(150, 340), new NtCircleShape(140));
circle4.material.density = 0.002;
circle4.force.set(150, -100);
circle4.orientation = -Math.PI / 4;
console.log(circle4);
var circle7 = new NtBody(new NtVec2(450, 400), new NtCircleShape(40));
circle7.material.density = 0.002;
circle7.force.set(0, -350);
console.log(circle7);
var rect1 = new NtBody(new NtVec2(280, 170), new NtRectangleShape(70, 70));
rect1.material.density = 0.0002;
rect1.orientation = -Math.PI / 8;
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
world.add(rect1);
setInterval(function () {
    var dt = 33 / 1000;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    world.step(dt);
    renderer.draw();
}, 33);
