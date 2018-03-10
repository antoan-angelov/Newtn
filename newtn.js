"use strict";
var phys1 = new NtRectangle(new NtVec(10, 30), 50, 40);
console.log(phys1);
var phys2 = new NtRectangle(new NtVec(100, 30), 20, 80);
console.log(phys2);
var phys3 = new NtRectangle(new NtVec(200, 60), 150, 120);
console.log(phys3);
var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext("2d");
var renderer = new Renderer(canvasContext);
var world = new NtWorld(renderer);
world.add(phys1);
world.add(phys2);
world.add(phys3);
renderer.draw();
var Rectangle =  (function () {
    function Rectangle(object) {
        this.object = object;
    }
    Rectangle.prototype.draw = function (canvas) {
        var position = this.object.position;
        var width = this.object.width;
        var height = this.object.height;
        canvas.lineWidth = 1;
        canvas.beginPath();
        canvas.moveTo(position.x, position.y);
        canvas.lineTo(position.x + width, position.y);
        canvas.lineTo(position.x + width, position.y + height);
        canvas.lineTo(position.x, position.y + height);
        canvas.lineTo(position.x, position.y);
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
var NtBase =  (function () {
    function NtBase(position) {
        this.position = position;
    }
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
var NtRectangle =  (function (_super) {
    __extends(NtRectangle, _super);
    function NtRectangle(position, width, height) {
        var _this = _super.call(this, position) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    NtRectangle.prototype.toString = function () {
        return "NtRectangle{position: " + this.position + ", width: " + this.width + ", "
            + ("height: " + this.height + "}");
    };
    return NtRectangle;
}(NtBase));
var NtVec =  (function () {
    function NtVec(x, y) {
        this.x = x;
        this.y = y;
    }
    NtVec.prototype.toString = function () {
        return "NtVec{x: " + this.x + ", y: " + this.y + "}";
    };
    return NtVec;
}());
var NtWorld =  (function () {
    function NtWorld(renderer) {
        this.renderer = renderer;
        this.list = [];
    }
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
