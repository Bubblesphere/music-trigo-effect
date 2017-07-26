"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Math.toRadian = function (angle) {
	return angle * Math.PI / 180;
};

Math.randomBetween = function (from, to) {
	return Math.floor(Math.random() * (to - from + 1) + from);
};

var Circle = function () {
	function Circle(_ref) {
		var radius = _ref.radius,
		    origin = _ref.origin;

		_classCallCheck(this, Circle);

		this.radius = radius;
		this.origin = origin;
	}

	_createClass(Circle, [{
		key: "CoordonateAtAngle",
		value: function CoordonateAtAngle(angle) {
			var radianAngle = Math.toRadian(angle);
			var cosAngle = Math.cos(radianAngle);
			var sinAngle = Math.sin(radianAngle);

			return {
				x: this.origin + this.radius * cosAngle,
				y: this.origin + this.radius * sinAngle
			};
		}
	}, {
		key: "Radius",
		get: function get() {
			return this.radius;
		},
		set: function set(val) {
			this.radius = val;
		}
	}, {
		key: "Origin",
		set: function set(val) {
			this.origin = val;
		}
	}]);

	return Circle;
}();

var Effect = function () {
	function Effect(p) {
		var _this = this;

		var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    _ref2$rgbMode = _ref2.rgbMode,
		    rgbMode = _ref2$rgbMode === undefined ? 0 : _ref2$rgbMode,
		    _ref2$secondaryColor = _ref2.secondaryColor,
		    secondaryColor = _ref2$secondaryColor === undefined ? 200 : _ref2$secondaryColor,
		    _ref2$strokeWidth = _ref2.strokeWidth,
		    strokeWidth = _ref2$strokeWidth === undefined ? 4 : _ref2$strokeWidth,
		    _ref2$innerCircleRadi = _ref2.innerCircleRadius,
		    innerCircleRadius = _ref2$innerCircleRadi === undefined ? 20 : _ref2$innerCircleRadi,
		    _ref2$cycleRate = _ref2.cycleRate,
		    cycleRate = _ref2$cycleRate === undefined ? 8 : _ref2$cycleRate,
		    _ref2$element = _ref2.element,
		    element = _ref2$element === undefined ? "effect" : _ref2$element;

		_classCallCheck(this, Effect);

		this.p = p;
		this.prev = {};
		this.next = {};
		this.rgbMode = rgbMode;
		this.secondaryColor = secondaryColor;
		this.strokeWidth = strokeWidth;
		this.cycleRate = cycleRate;
		this.init = {};
		this.el = document.getElementById(element);
		this.maxDiameter = this.el.offsetWidth < this.el.offsetHeight ? this.el.offsetWidth : this.el.offsetHeight;
		this.maxRadius = this.maxDiameter / 2;

		this.innerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this.maxRadius
		});

		this.outerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this.maxRadius
		});

		this.p.frameRate(cycleRate);

		this.p.setup = function () {
			_this.setup();
		};

		this.p.windowResized = function () {
			_this.resize();
		};

		this.p.draw = function () {
			_this.draw();
		};
	}

	_createClass(Effect, [{
		key: "drawLine",
		value: function drawLine(lineAngle) {
			this.outerCircle.Radius = Math.randomBetween(this.innerCircle.radius, this.maxRadius - this.strokeWidth);

			var start = this.innerCircle.CoordonateAtAngle(lineAngle);
			var end = this.outerCircle.CoordonateAtAngle(lineAngle);

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
				return this.p.color(Math.randomBetween(0, 256), this.secondaryColor, this.secondaryColor);
			} else if (this.rgbMode == 1) {
				return this.p.color(this.secondaryColor, Math.randomBetween(0, 256), this.secondaryColor);
			} else {
				return this.p.color(this.secondaryColor, this.secondaryColor, Math.randomBetween(0, 256));
			}
		}
	}, {
		key: "getSize",
		value: function getSize() {
			return this.el.offsetWidth < this.el.offsetHeight ? this.el.offsetWidth : this.el.offsetHeight;
		}
	}, {
		key: "setup",
		value: function setup() {
			var size = this.getSize();
			this.p.createCanvas(size, size);
		}
	}, {
		key: "resize",
		value: function resize() {
			var size = this.getSize();
			this.MaxRadius = size / 2;
			this.p.resizeCanvas(size, size);
		}
	}, {
		key: "draw",
		value: function draw() {
			this.p.clear();

			// 360 / strokeWidth donne le nombre de ligne à générer
			for (var i = 0; i < 360; i = i + this.StrokeWidth) {
				this.drawLine(i);
			}
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
		key: "CycleRate",
		get: function get() {
			return this.cycleRate;
		},
		set: function set(val) {
			this.cycleRate = val;
		}
	}, {
		key: "InnerCircleRadius",
		set: function set(val) {
			this.innerCircle.Radius = val;
		}
	}, {
		key: "MaxRadius",
		set: function set(val) {
			this.maxRadius = val;
			this.innerCircle.Origin = val;
			this.outerCircle.Origin = val;
		}
	}]);

	return Effect;
}();

new p5(function (p) {
	new Effect(p, {
		rgbMode: 0,
		secondaryColor: 200,
		strokeWidth: 10,
		circleRadius: 50,
		cycleRate: 1,
		element: "node"
	});
}, "node");