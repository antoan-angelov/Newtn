"use strict";
var Rectangle =  (function () {
    function Rectangle(object) {
        this.object = object;
    }
    Rectangle.prototype.draw = function (canvas) {
        var position = this.object.position;
        var width = this.object.width;
        var height = this.object.height;
        if (this.object.collisions.size > 0) {
            canvas.strokeStyle = '#ff0000';
        }
        else {
            canvas.strokeStyle = '#000000';
        }
        canvas.lineWidth = 3;
        canvas.beginPath();
        canvas.moveTo(position.x - width / 2, position.y - height / 2);
        canvas.lineTo(position.x + width / 2, position.y - height / 2);
        canvas.lineTo(position.x + width / 2, position.y + height / 2);
        canvas.lineTo(position.x - width / 2, position.y + height / 2);
        canvas.lineTo(position.x - width / 2, position.y - height / 2);
        canvas.stroke();
    };
    Rectangle.prototype.print = function () {
        console.log("Rectangle{position: " + this.object.position + ", " +
            ("width: " + this.object.width + ", " + this.object.height));
    };
    return Rectangle;
}());
var Renderer =  (function () {
    function Renderer(canvas) {
        this.canvas = canvas;
        this.renderables = [];
    }
    Renderer.prototype.draw = function () {
        for (var _i = 0, _a = this.renderables; _i < _a.length; _i++) {
            var object = _a[_i];
            object.draw(this.canvas);
        }
    };
    Renderer.prototype.add = function (object) {
        if (object instanceof NtRectangle) {
            this.renderables.push(new Rectangle(object));
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
        this.position = new NtVec();
        this.velocity = new NtVec();
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
        this.min = new NtVec();
        this.max = new NtVec();
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
        return false;
    };
    NtCollisionResolver.prototype.resolve = function (manifold) {
        var A = manifold.A;
        var B = manifold.B;
        var relativeVelocity = NtVec.subtract(B.velocity, A.velocity);
        var collisionNormal = manifold.normal;
        var velocityAlondNormal = NtVec.dotProduct(relativeVelocity, collisionNormal);
        var e = Math.min(A.restitution, B.restitution);
        var j = -(1 + e) * velocityAlondNormal;
        j /= A.inverse_mass + B.inverse_mass;
        var impulse = NtVec.multiply(collisionNormal, j);
        A.velocity.subtract(NtVec.multiply(impulse, A.inverse_mass));
        B.velocity.add(NtVec.multiply(impulse, B.inverse_mass));
    };
    return NtCollisionResolver;
}());
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
                NtCollisionUtils.calculateNormal(manifold, overlap, n);
                return true;
            }
        }
        return false;
    };
    NtCollisionUtils.calculateNormal = function (manifold, overlap, n) {
        if (overlap.x > overlap.y) {
            manifold.normal = new NtVec(0, Math.sign(n.x));
            manifold.penetration = overlap.x;
        }
        else {
            manifold.normal = new NtVec(Math.sign(n.y), 0);
            manifold.penetration = overlap.y;
        }
    };
    return NtCollisionUtils;
}());
var NtManifold =  (function () {
    function NtManifold(A, B) {
        this.penetration = 0;
        this.normal = new NtVec();
        this.A = A;
        this.B = B;
    }
    return NtManifold;
}());
var phys1 = new NtRectangle(new NtVec(370, 160), 50, 40);
phys1.mass = 20;
phys1.velocity.set(-1.5, 0);
console.log(phys1);
var phys2 = new NtRectangle(new NtVec(10, 160), 50, 40);
phys2.mass = 20;
phys2.velocity.set(1.5, 0);
console.log(phys2);
var phys3 = new NtRectangle(new NtVec(200, 190), 150, 120);
phys3.mass = 20;
console.log(phys3);
var phys4 = new NtRectangle(new NtVec(210, -60), 50, 40);
phys4.mass = 20;
phys4.velocity.set(0, 1.5);
console.log(phys4);
var phys5 = new NtRectangle(new NtVec(210, 370), 50, 40);
phys5.mass = 20;
phys5.velocity.set(0, -1.5);
console.log(phys5);
var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext("2d");
var renderer = new Renderer(canvasContext);
var world = new NtWorld(renderer);
world.add(phys1);
world.add(phys2);
world.add(phys3);
world.add(phys4);
world.add(phys5);
setInterval(function () {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    world.step();
    renderer.draw();
}, 33);
