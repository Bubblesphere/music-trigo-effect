"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Math.toRadian = function (angle) {
	return angle * Math.PI / 180;
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
		    _ref2$maxRadius = _ref2.maxRadius,
		    maxRadius = _ref2$maxRadius === undefined ? 100 : _ref2$maxRadius;

		_classCallCheck(this, Effect);

		this.p = p;
		this.prev = {};
		this.next = {};
		this.rgbMode = rgbMode;
		this.secondaryColor = secondaryColor;
		this.strokeWidth = strokeWidth;
		this.cycleRate = cycleRate;
		this.init = {};
		this.maxRadius = maxRadius;

		this.innerCircle = new Circle({
			radius: innerCircleRadius,
			origin: maxRadius
		});

		this.outerCircle = new Circle({
			radius: innerCircleRadius,
			origin: maxRadius
		});
	}

	_createClass(Effect, [{
		key: "drawLine",
		value: function drawLine(lineAngle) {
			this.outerCircle.Radius = this.randomInteger(this.innerCircle.radius, this.maxRadius - this.strokeWidth);

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
			this.innerCircle.Origin = val / 2;
			this.outerCircle.Origin = val / 2;
		}
	}]);

	return Effect;
}();

var sketch = function sketch(p) {
	var effect = new Effect(p, {
		rgbMode: 0,
		secondaryColor: 200,
		strokeWidth: 4,
		circleRadius: 20,
		cycleRate: 8
	});

	p.setup = function () {
		var el = document.getElementById("node");
		var size = el.offsetWidth < el.offsetHeight ? el.offsetWidth : el.offsetHeight;
		effect.MaxRadius = size / 2;
		p.createCanvas(size, size);
		p.frameRate(8);
	};

	p.windowResized = function () {
		var el = document.getElementById("node");
		var size = el.offsetWidth < el.offsetHeight ? el.offsetWidth : el.offsetHeight;
		effect.MaxRadius = size / 2;
		p.resizeCanvas(size, size);
	};

	p.draw = function () {
		p.clear();

		// 360 / strokeWidth donne le nombre de ligne à générer
		for (var i = 0; i < 360; i = i + effect.StrokeWidth) {
			effect.drawLine(i);
		}
	};
};

new p5(sketch, "node");