"use strict";
var Renderable = /** @class */ (function () {
    function Renderable(object) {
        this.object = object;
    }
    return Renderable;
}());
//# sourceMappingURL=Renderable.js.map
"use strict";
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
var Circle = /** @class */ (function (_super) {
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
//# sourceMappingURL=Circle.js.map
"use strict";
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
var Rectangle = /** @class */ (function (_super) {
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
//# sourceMappingURL=Rectangle.js.map
"use strict";
var Renderer = /** @class */ (function () {
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
//# sourceMappingURL=Renderer.js.map
"use strict";
var NtBody = /** @class */ (function () {
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
        this.torque = 0;
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
        this.position.add(NtVec2.multiply(this.velocity, dt));
        this.velocity.add(NtVec2.multiply(this.force, dt / this.mass));
        this.angular_velocity += this.torque * (dt / this._inertia);
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
    Object.defineProperty(NtBody.prototype, "inertia", {
        get: function () {
            return this._inertia;
        },
        set: function (value) {
            this._inertia = value;
            if (value != 0) {
                this._inverse_inertia = 1 / value;
            }
            else {
                this._inverse_inertia = Number.MAX_VALUE;
            }
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
//# sourceMappingURL=NtBody.js.map
"use strict";
//# sourceMappingURL=NtIRenderer.js.map
"use strict";
var NtMaterial = /** @class */ (function () {
    function NtMaterial(density, restitution) {
        if (density === void 0) { density = 0.5; }
        if (restitution === void 0) { restitution = 1; }
        this.density = density;
        this.restitution = restitution;
    }
    return NtMaterial;
}());
//# sourceMappingURL=NtMaterial.js.map
"use strict";
var NtVec2 = /** @class */ (function () {
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
//# sourceMappingURL=NtVec2.js.map
"use strict";
var NtWorld = /** @class */ (function () {
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
                    console.log("collision likely!");
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
//# sourceMappingURL=NtWorld.js.map
"use strict";
var NtShapeBase = /** @class */ (function () {
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
//# sourceMappingURL=NtShapeBase.js.map
"use strict";
var NtBounds = /** @class */ (function () {
    function NtBounds(min, max) {
        this.min = new NtVec2();
        this.max = new NtVec2();
        this.min = min;
        this.max = max;
    }
    return NtBounds;
}());
//# sourceMappingURL=NtBounds.js.map
"use strict";
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
var NtCircleShape = /** @class */ (function (_super) {
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
    NtCircleShape.prototype.toString = function () {
        return "NtCircleShape{radius: " + this.radius + "}";
    };
    return NtCircleShape;
}(NtShapeBase));
//# sourceMappingURL=NtCircleShape.js.map
"use strict";
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
var NtPolygonShape = /** @class */ (function (_super) {
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
        // assume vertices are clockwise
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
    return NtPolygonShape;
}(NtShapeBase));
//# sourceMappingURL=NtPolygonShape.js.map
"use strict";
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
var NtRectangleShape = /** @class */ (function (_super) {
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
//# sourceMappingURL=NtRectangleShape.js.map
"use strict";
var NtAABB = /** @class */ (function () {
    function NtAABB() {
        this.min = new NtVec2();
        this.max = new NtVec2();
    }
    return NtAABB;
}());
//# sourceMappingURL=NtAABB.js.map
"use strict";
var NtCollisionResolver = /** @class */ (function () {
    function NtCollisionResolver() {
    }
    NtCollisionResolver.prototype.isCollisionLikely = function (A, B) {
        var a_shape = A.shape;
        var b_shape = B.shape;
        if (a_shape instanceof NtPolygonShape
            && b_shape instanceof NtCircleShape) {
            return NtCollisionUtils.AABBvsCircle(A, B);
        }
        else if (a_shape instanceof NtCircleShape
            && b_shape instanceof NtPolygonShape) {
            return NtCollisionUtils.AABBvsCircle(B, A);
        }
        else {
            return NtCollisionUtils.AABBvsAABB(A, B);
        }
    };
    NtCollisionResolver.prototype.hasCollision = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var a_shape = A.shape;
        var b_shape = B.shape;
        if (a_shape instanceof NtPolygonShape
            && b_shape instanceof NtPolygonShape) {
            return NtCollisionUtils.polygonVsPolygon(manifold);
        }
        else if (a_shape instanceof NtCircleShape
            && b_shape instanceof NtCircleShape) {
            return NtCollisionUtils.CircleVsCircle(manifold);
        }
        return false;
    };
    NtCollisionResolver.prototype.resolve = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var relativeVelocity = NtVec2.subtract(B.velocity, A.velocity);
        var collisionNormal = manifold.normal;
        var velocityAlondNormal = NtVec2.dotProduct(relativeVelocity, collisionNormal);
        // ignore collision if objects are not moving towards each other
        if (velocityAlondNormal > 0) {
            return;
        }
        // calculate restitution
        var e = Math.min(A.material.restitution, B.material.restitution);
        // calculate impulse scalar
        var j = -(1 + e) * velocityAlondNormal;
        j /= A.inverse_mass + B.inverse_mass;
        // apply impulse
        var impulse = NtVec2.multiply(collisionNormal, j);
        A.apply_impulse(NtVec2.negate(impulse));
        B.apply_impulse(impulse);
        // calculate friction
        // recalculate after normal impulse is applied
        relativeVelocity = NtVec2.subtract(B.velocity, A.velocity);
        var tangent = (NtVec2.subtract(relativeVelocity, NtVec2.multiply(collisionNormal, velocityAlondNormal)));
        tangent.normalize();
        // apply along the friction vector
        var jt = -NtVec2.dotProduct(relativeVelocity, tangent);
        jt = jt / (A.inverse_mass + B.inverse_mass);
        // following Coulomb's law, mu is average between the two frictions
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
//# sourceMappingURL=NtCollisionResolver.js.map
"use strict";
var NtCollisionUtils = /** @class */ (function () {
    function NtCollisionUtils() {
    }
    NtCollisionUtils.AABBvsAABB = function (A, B) {
        var n = NtVec2.subtract(B.position, A.position);
        var abox = A.aabb;
        var bbox = B.aabb;
        var overlap = new NtVec2();
        // half extents along x axis for each object
        var a_extent = (abox.max.x - abox.min.x) / 2;
        var b_extent = (bbox.max.x - bbox.min.x) / 2;
        // calculate overlap on x axis
        overlap.x = a_extent + b_extent - Math.abs(n.x);
        if (overlap.x > 0) {
            // half extents along y axis for each object
            var a_extent_1 = (abox.max.y - abox.min.y) / 2;
            var b_extent_1 = (bbox.max.y - bbox.min.y) / 2;
            // calculate overlap on y axis
            overlap.y = a_extent_1 + b_extent_1 - Math.abs(n.y);
            if (overlap.y > 0) {
                return true;
            }
        }
        return false;
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
    NtCollisionUtils.AABBvsCircle = function (A, B) {
        var b_shape = B.shape;
        var abox = A.aabb;
        var temp_list = [
            // top
            new NtVec2(abox.min.x, abox.min.y),
            new NtVec2(abox.max.x, abox.min.y),
            // bottom
            new NtVec2(abox.min.x, abox.max.y),
            new NtVec2(abox.max.x, abox.max.y),
            // left
            new NtVec2(abox.min.x, abox.min.y),
            new NtVec2(abox.min.x, abox.max.y),
            // right
            new NtVec2(abox.max.x, abox.min.y),
            new NtVec2(abox.max.x, abox.max.y)
        ];
        var min_dist = Number.MAX_VALUE;
        for (var i = 0; i < 4; i++) {
            var side = NtCollisionUtils.segmentProjection(B.position, temp_list[i * 2], temp_list[i * 2 + 1]);
            var side_dist = NtVec2.distanceSquared(side, B.position);
            if (min_dist > side_dist) {
                min_dist = side_dist;
            }
        }
        if (min_dist > b_shape.radius * b_shape.radius) {
            return false;
        }
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
    NtCollisionUtils.polygonVsPolygon = function (manifold) {
        var penetration_result = this.axisLeastPenetration(manifold.A, manifold.B);
        var penetration = penetration_result[0];
        var vertex_index = penetration_result[1];
        if (penetration < 0) {
            // shapes not overlapping
            return false;
        }
        manifold.penetration = penetration;
        var shape_a = manifold.A.shape;
        manifold.normal = NtVec2.rotate(shape_a.normals[vertex_index], manifold.A.orientation);
        return true;
    };
    NtCollisionUtils.axisLeastPenetration = function (A, B) {
        var best_distance = -Number.MAX_VALUE;
        var best_index = -1;
        var shape_a = A.shape;
        var shape_b = B.shape;
        for (var i = 0; i < shape_a.vertices.length; i++) {
            var face_normal = NtVec2.rotate(shape_a.normals[i], A.orientation);
            var relative_normal = NtVec2.rotate(face_normal, B.orientation);
            var support_point_local = shape_b.get_support_point(relative_normal.negate());
            var support_point = NtVec2.add(B.position, NtVec2.rotate(support_point_local, -B.orientation));
            var vertex = NtVec2.add(A.position, NtVec2.rotate(shape_a.vertices[i], A.orientation));
            var dot = NtVec2.dotProduct(face_normal, NtVec2.subtract(support_point, vertex));
            if (dot > best_distance) {
                best_distance = dot;
                best_index = i;
            }
        }
        return [-best_distance, best_index];
    };
    return NtCollisionUtils;
}());
//# sourceMappingURL=NtCollisionUtils.js.map
"use strict";
var NtManifold = /** @class */ (function () {
    function NtManifold(A, B) {
        this.penetration = 0;
        this.normal = new NtVec2();
        this.A = A;
        this.B = B;
    }
    return NtManifold;
}());
//# sourceMappingURL=NtManifold.js.map
"use strict";
var circle4 = new NtBody(new NtVec2(150, 340), new NtRectangleShape(40, 40));
circle4.material.density = 0.002;
circle4.force.set(150, -100);
circle4.orientation = -Math.PI / 4;
console.log(circle4);
var circle7 = new NtBody(new NtVec2(450, 400), new NtCircleShape(40));
circle7.material.density = 0.002;
circle7.force.set(0, -350);
console.log(circle7);
var rect1 = new NtBody(new NtVec2(280, 170), new NtRectangleShape(350, 140));
rect1.material.density = 10;
rect1.friction = 0.6;
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
//world.add(circle5);
//world.add(circle6);
//world.add(circle7);
setInterval(function () {
    var dt = 33 / 1000;
    world.step(dt);
    renderer.draw();
}, 33);
//# sourceMappingURL=main.js.map