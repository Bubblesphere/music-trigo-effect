"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Circle = function () {
	function Circle(p) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    _ref$rgbMode = _ref.rgbMode,
		    rgbMode = _ref$rgbMode === undefined ? 0 : _ref$rgbMode,
		    _ref$secondaryColor = _ref.secondaryColor,
		    secondaryColor = _ref$secondaryColor === undefined ? 200 : _ref$secondaryColor,
		    _ref$strokeWidth = _ref.strokeWidth,
		    strokeWidth = _ref$strokeWidth === undefined ? 4 : _ref$strokeWidth,
		    _ref$circleRadius = _ref.circleRadius,
		    circleRadius = _ref$circleRadius === undefined ? 20 : _ref$circleRadius,
		    _ref$cycleRate = _ref.cycleRate,
		    cycleRate = _ref$cycleRate === undefined ? 8 : _ref$cycleRate,
		    _ref$halfSize = _ref.halfSize,
		    halfSize = _ref$halfSize === undefined ? 100 : _ref$halfSize;

		_classCallCheck(this, Circle);

		this.p = p;
		this.prev = {};
		this.next = {};
		this.rgbMode = rgbMode;
		this.secondaryColor = secondaryColor;
		this.strokeWidth = strokeWidth;
		this.circleRadius = circleRadius;
		this.cycleRate = cycleRate;
		this.halfSize = halfSize;
		this.init = {};
	}

	_createClass(Circle, [{
		key: "drawLine",
		value: function drawLine(lineAngle) {
			// dépasse pas les limites de l'écran
			var lineLength = this.randomInteger(this.circleRadius, this.p.height / 2 - this.strokeWidth);

			// point correspondant à l'angle entre le milieu, et le premier cercle imaginaire
			var start = {
				x: this.halfSize + this.circleRadius / 2 * Math.cos(lineAngle * Math.PI / 180),
				y: this.halfSize + this.circleRadius / 2 * Math.sin(lineAngle * Math.PI / 180)
			};

			// point correspondant à l'angle entre le milieu, et le deuxième cercle imaginaire
			var end = {
				x: this.halfSize + lineLength * Math.cos(lineAngle * Math.PI / 180),
				y: this.halfSize + lineLength * Math.sin(lineAngle * Math.PI / 180)
			};

			if (lineAngle == 0) {
				this.init.x = end.x;
				this.init.y = end.y;
			} else {
				this.p.line(this.prev.x, this.prev.y, end.x, end.y);
			}

			// dessine la ligne
			this.p.strokeWeight(this.strokeWidth);
			this.p.stroke(this.getRandomColor());
			this.p.line(start.x, start.y, end.x, end.y);

			// Keep track of the ending coordonates
			this.prev.x = end.x;
			this.prev.y = end.y;

			if (lineAngle + this.strokeWidth > 359) {
				this.p.line(this.prev.x, this.prev.y, this.init.x, this.init.y);
			}
		}
	}, {
		key: "getRandomColor",
		value: function getRandomColor() {
			if (this.rgbMode == 0) {
				return this.p.color(this.randomInteger(0, 256), this.secondaryColor, this.secondaryColor);
			} else if (this.rgbMode == 1) {
				return this.p.color(secondaryColor, this.randomInteger(0, 256), this.secondaryColor);
			} else {
				return this.p.color(this.secondaryColor, this.secondaryColor, this.randomInteger(0, 256));
			}
		}
	}, {
		key: "randomInteger",
		value: function randomInteger(min, max) {
			return Math.random() * (max - min) + min;
		}
	}, {
		key: "RgbMode",
		get: function get() {
			return this.rgbMode;
		},
		set: function set(val) {
			this.rgbMode = val;
		}
	}, {
		key: "SecondaryColor",
		get: function get() {
			return this.secondaryColor;
		},
		set: function set(val) {
			this.secondaryColor = val;
		}
	}, {
		key: "StrokeWidth",
		get: function get() {
			return this.strokeWidth;
		},
		set: function set(val) {
			this.strokeWidth = val;
		}
	}, {
		key: "CircleRadius",
		get: function get() {
			return this.circleRadius;
		},
		set: function set(val) {
			this.circleRadius = val;
		}
	}, {
		key: "CycleRate",
		get: function get() {
			return this.cycleRate;
		},
		set: function set(val) {
			this.cycleRate = val;
		}
	}, {
		key: "HalfSize",
		get: function get() {
			return this.halfSize;
		},
		set: function set(val) {
			this.halfSize = val;
		}
	}]);

	return Circle;
}();

var sketch = function sketch(p) {
	var circle = new Circle(p, {
		rgbMode: 0,
		secondaryColor: 200,
		strokeWidth: 4,
		circleRadius: 20,
		cycleRate: 8
	});

	p.setup = function () {
		var el = document.getElementById("node");
		var size = el.offsetWidth < el.offsetHeight ? el.offsetWidth : el.offsetHeight;
		circle.HalfSize = size / 2;
		p.createCanvas(size, size);
		p.frameRate(8);
	};

	p.windowResized = function () {
		var el = document.getElementById("node");
		var size = el.offsetWidth < el.offsetHeight ? el.offsetWidth : el.offsetHeight;
		circle.HalfSize = size / 2;
		p.resizeCanvas(size, size);
	};

	p.draw = function () {
		p.clear();

		// 360 / strokeWidth donne le nombre de ligne à générer
		for (var i = 0; i < 360; i = i + circle.StrokeWidth) {
			circle.drawLine(i);
		}

		//
	};
};

new p5(sketch, "node");