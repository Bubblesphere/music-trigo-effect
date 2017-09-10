"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		key: "CoordonatesAtRadian",
		value: function CoordonatesAtRadian(radian) {
			var cosAngle = Math.cos(radian);
			var sinAngle = Math.sin(radian);

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
		    secondaryColor = _ref2$secondaryColor === undefined ? 0 : _ref2$secondaryColor,
		    _ref2$strokeWidth = _ref2.strokeWidth,
		    strokeWidth = _ref2$strokeWidth === undefined ? 6 : _ref2$strokeWidth,
		    _ref2$innerCircleRadi = _ref2.innerCircleRadius,
		    innerCircleRadius = _ref2$innerCircleRadi === undefined ? 20 : _ref2$innerCircleRadi,
		    _ref2$cycleRate = _ref2.cycleRate,
		    cycleRate = _ref2$cycleRate === undefined ? 25 : _ref2$cycleRate,
		    _ref2$amplitude = _ref2.amplitude,
		    amplitude = _ref2$amplitude === undefined ? 100 : _ref2$amplitude,
		    _ref2$element = _ref2.element,
		    element = _ref2$element === undefined ? "effect" : _ref2$element;

		_classCallCheck(this, Effect);

		this.p = p;
		this.rgbMode = rgbMode;
		this.secondaryColor = secondaryColor;
		this.cycleRate = cycleRate;
		this.strokeWidth = strokeWidth;
		this.el = document.getElementById(element);

		this.prev = {};
		this.init = {};

		var maxDiameter = this.el.offsetWidth < this.el.offsetHeight ? this.el.offsetWidth : this.el.offsetHeight;
		this.maxRadius = maxDiameter / 2;

		this.innerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this.maxRadius
		});

		this.outerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this.maxRadius
		});

		this.setAmplitude(amplitude);

		this.p.frameRate(cycleRate);

		this.pFFT = new p5.FFT();
		this.mic = new p5.AudioIn();
		this.mic.start();
		this.pFFT.setInput(this.mic);

		this.p.setup = function () {
			_this.trackElementSize();
			var diameter = _this.maxRadius * 2;
			_this.p.createCanvas(diameter, diameter);
			_this.setStrokeWidth(_this.strokeWidth);
		};

		this.p.windowResized = function () {
			_this.trackElementSize();
			var diameter = _this.maxRadius * 2;
			_this.p.resizeCanvas(diameter, diameter);
		};

		this.p.draw = function () {
			var level = _this.mic.getLevel();
			var waveform = _this.pFFT.analyze().filter(function (amp) {
				return amp > 20;
			});
			_this.size = _this.p.map(level, 0, 1, 0, _this.maxRadius);

			if (_this.size > _this.prevSize) {
				_this.setInnerCircleRadius(_this.size);
			} else {
				_this.size = _this.prevSize - 3 > 0 ? _this.prevSize - 3 : 0;
				_this.setInnerCircleRadius(_this.size);
			}
			_this.prevSize = _this.size;

			_this.p.clear();
			var waveformIncrement = waveform.length / 360;
			for (var lineAngle = 0; lineAngle < 360; lineAngle = lineAngle + _this.strokeWidth) {
				//this.outerCircle.Radius = Math.randomBetween(this.minLineLength, this.maxRadius - this.strokeWidth)

				_this.outerCircle.Radius = _this.p.map(waveform[Math.floor(lineAngle * waveformIncrement)], 0, 255, _this.minLineLength, _this.maxRadius - _this.strokeWidth);

				var radianAngle = _this.p.radians(lineAngle);
				var startCoordonates = _this.innerCircle.CoordonatesAtRadian(radianAngle);
				var endCoordonates = _this.outerCircle.CoordonatesAtRadian(radianAngle);

				_this.drawLine(startCoordonates, endCoordonates);
				_this.linkExtremities(lineAngle, endCoordonates);
			}
		};
	}

	_createClass(Effect, [{
		key: "trackElementSize",
		value: function trackElementSize() {
			this.maxRadius = (this.el.offsetWidth < this.el.offsetHeight ? this.el.offsetWidth : this.el.offsetHeight) / 2;
			this.innerCircle.Origin = this.maxRadius;
			this.outerCircle.Origin = this.maxRadius;
		}
	}, {
		key: "linkExtremities",
		value: function linkExtremities(lineAngle, endCoordonates) {
			var isFirstLine = lineAngle == 0;
			if (isFirstLine) {
				this.trackLineExtremitiesAsInitial(endCoordonates);
			} else {
				this.drawPreviousAndCurrentExtremityLink(endCoordonates);
			}

			this.trackLineExtremitiesAsPrevious(endCoordonates);

			var isLastLine = lineAngle + this.strokeWidth > 359;
			if (isLastLine) {
				this.drawCurrentAndInitialExtremityLink(endCoordonates);
			}
		}
	}, {
		key: "trackLineExtremitiesAsInitial",
		value: function trackLineExtremitiesAsInitial(endCoordonates) {
			this.init.x = endCoordonates.x;
			this.init.y = endCoordonates.y;
		}
	}, {
		key: "drawPreviousAndCurrentExtremityLink",
		value: function drawPreviousAndCurrentExtremityLink(endCoordonates) {
			this.drawLine(this.prev, endCoordonates);
		}
	}, {
		key: "trackLineExtremitiesAsPrevious",
		value: function trackLineExtremitiesAsPrevious(endCoordonates) {
			this.prev.x = endCoordonates.x;
			this.prev.y = endCoordonates.y;
		}
	}, {
		key: "drawCurrentAndInitialExtremityLink",
		value: function drawCurrentAndInitialExtremityLink(endCoordonates) {
			this.drawLine(endCoordonates, this.init);
		}
	}, {
		key: "drawLine",
		value: function drawLine(startCoordonates, endCoordonates) {
			var newColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			if (newColor) {
				this.p.stroke(this.getRandomColor());
			}
			this.p.line(startCoordonates.x, startCoordonates.y, endCoordonates.x, endCoordonates.y);
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
		key: "setAmplitude",
		value: function setAmplitude(val) {
			this.amplitude = val;
			var maxAmplitude = this.maxRadius - this.strokeWidth - this.innerCircle.radius;
			this.minLineLength = this.innerCircle.radius + (100 - this.amplitude) / 100 * maxAmplitude;
		}
	}, {
		key: "setStrokeWidth",
		value: function setStrokeWidth(val) {
			this.strokeWidth = val;
			this.p.strokeWeight(val);
		}
	}, {
		key: "setInnerCircleRadius",
		value: function setInnerCircleRadius(val) {
			this.innerCircle.Radius = val > this.maxRadius - this.strokeWidth - 30 ? this.maxRadius - this.strokeWidth - 30 : val;
			this.setAmplitude(this.amplitude);
		}
	}, {
		key: "Amplitude",
		get: function get() {
			return this.rgbMode;
		},
		set: function set(val) {
			this.setAmplitude(val);
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
			this.setStrokeWidth(val);
		}
	}, {
		key: "CycleRate",
		get: function get() {
			return this.cycleRate;
		},
		set: function set(val) {
			this.cycleRate = val;this.p.frameRate(val);
		}
	}, {
		key: "InnerCircleRadius",
		get: function get() {
			return InnerCircleRadius;
		},
		set: function set(val) {
			this.setInnerCircleRadius(val);
		}
	}]);

	return Effect;
}();

var p5 = new p5(function (p) {
	p.effect = new Effect(p, {
		rgbMode: 0,
		secondaryColor: 0,
		strokeWidth: 4,
		circleRadius: 50,
		cycleRate: 25,
		amplitude: 100,
		element: "node"
	});
}, "node");