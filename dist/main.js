'use strict';

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

		this._radius = radius;
		this._origin = origin;
	}

	_createClass(Circle, [{
		key: 'CoordonatesAtRadian',
		value: function CoordonatesAtRadian(radian) {
			var cosAngle = Math.cos(radian);
			var sinAngle = Math.sin(radian);

			return {
				x: this._origin + this._radius * cosAngle,
				y: this._origin + this._radius * sinAngle
			};
		}
	}, {
		key: 'radius',
		get: function get() {
			return this._radius;
		},
		set: function set(val) {
			this._radius = val;
		}
	}, {
		key: 'origin',
		set: function set(val) {
			this._origin = val;
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
		    _ref2$amplitude = _ref2.amplitude,
		    amplitude = _ref2$amplitude === undefined ? 90 : _ref2$amplitude,
		    _ref2$element = _ref2.element,
		    element = _ref2$element === undefined ? "effect" : _ref2$element;

		_classCallCheck(this, Effect);

		this._p = p;
		this._rgbMode = rgbMode;
		this._secondaryColor = secondaryColor;
		this._strokeWidth = strokeWidth;
		this._cycleRate = cycleRate;

		this._el = document.getElementById(element);

		this._prev = {};
		this._init = {};

		var maxDiameter = this._el.offsetWidth < this._el.offsetHeight ? this._el.offsetWidth : this._el.offsetHeight;
		this._maxRadius = maxDiameter / 2;

		this._innerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this._maxRadius
		});

		this._outerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this._maxRadius
		});

		this._setAmplitude(amplitude);

		this._p.frameRate(cycleRate);

		this._events = {
			beforeSetup: new Event('beforeSetup'),
			afterSetup: new Event('afterSetup'),
			beforeResize: new Event('beforeResize'),
			afterResize: new Event('afterResize'),
			beforeDraw: new Event('beforeDraw'),
			afterDraw: new Event('afterDraw'),
			onLineDraw: new Event('onLineDraw')
		};

		this._p.setup = function () {
			_this._el.dispatchEvent(_this._events.beforeSetup);
			_this._trackElementSize();
			var diameter = _this._maxRadius * 2;
			_this._p.createCanvas(diameter, diameter);
			_this._el.dispatchEvent(_this._events.afterSetup);
		};

		this._p.windowResized = function () {
			_this._el.dispatchEvent(_this._events.beforeResize);
			_this._trackElementSize();
			var diameter = _this._maxRadius * 2;
			_this._p.resizeCanvas(diameter, diameter);
			_this._el.dispatchEvent(_this._events.afterResize);
		};

		this._p.draw = function () {
			_this._el.dispatchEvent(_this._events.beforeDraw);
			_this._p.clear();

			for (var lineAngle = 0; lineAngle < 360; lineAngle = lineAngle + _this._strokeWidth) {
				_this._outerCircle.radius = Math.randomBetween(_this._minLineLength, _this._maxRadius - _this._strokeWidth);

				var radianAngle = _this._p.radians(lineAngle);
				var startCoordonates = _this._innerCircle.CoordonatesAtRadian(radianAngle);
				var endCoordonates = _this._outerCircle.CoordonatesAtRadian(radianAngle);

				_this._drawLine(startCoordonates, endCoordonates);
				_this._linkExtremities(lineAngle, endCoordonates);
			}
			_this._el.dispatchEvent(_this._events.afterDraw);
		};
	}

	_createClass(Effect, [{
		key: '_trackElementSize',
		value: function _trackElementSize() {
			this._maxRadius = (this._el.offsetWidth < this._el.offsetHeight ? this._el.offsetWidth : this._el.offsetHeight) / 2;
			this._innerCircle.origin = this._maxRadius;
			this._outerCircle.origin = this._maxRadius;
		}
	}, {
		key: '_linkExtremities',
		value: function _linkExtremities(lineAngle, endCoordonates) {
			var isFirstLine = lineAngle == 0;
			if (isFirstLine) {
				this._trackLineExtremitiesAsInitial(endCoordonates);
			} else {
				this._drawPreviousAndCurrentExtremityLink(endCoordonates);
			}

			this._trackLineExtremitiesAsPrevious(endCoordonates);

			var isLastLine = lineAngle + this._strokeWidth > 359;
			if (isLastLine) {
				this._drawCurrentAndInitialExtremityLink(endCoordonates);
			}
		}
	}, {
		key: '_trackLineExtremitiesAsInitial',
		value: function _trackLineExtremitiesAsInitial(endCoordonates) {
			this._init.x = endCoordonates.x;
			this._init.y = endCoordonates.y;
		}
	}, {
		key: '_drawPreviousAndCurrentExtremityLink',
		value: function _drawPreviousAndCurrentExtremityLink(endCoordonates) {
			this._drawLine(this._prev, endCoordonates);
		}
	}, {
		key: '_trackLineExtremitiesAsPrevious',
		value: function _trackLineExtremitiesAsPrevious(endCoordonates) {
			this._prev.x = endCoordonates.x;
			this._prev.y = endCoordonates.y;
		}
	}, {
		key: '_drawCurrentAndInitialExtremityLink',
		value: function _drawCurrentAndInitialExtremityLink(endCoordonates) {
			this._drawLine(endCoordonates, this._init);
		}
	}, {
		key: '_drawLine',
		value: function _drawLine(startCoordonates, endCoordonates) {
			var newColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			if (newColor) {
				this._p.stroke(this._getRandomColor());
			}
			this._el.dispatchEvent(this._events.onLineDraw);
			this._p.line(startCoordonates.x, startCoordonates.y, endCoordonates.x, endCoordonates.y);
		}
	}, {
		key: '_getRandomColor',
		value: function _getRandomColor() {
			if (this._rgbMode == 0) {
				return this._p.color(Math.randomBetween(0, 256), this._secondaryColor, this._secondaryColor);
			} else if (this._rgbMode == 1) {
				return this._p.color(this._secondaryColor, Math.randomBetween(0, 256), this._secondaryColor);
			} else {
				return this._p.color(this._secondaryColor, this._secondaryColor, Math.randomBetween(0, 256));
			}
		}
	}, {
		key: '_setAmplitude',
		value: function _setAmplitude(val) {
			this._amplitude = val;
			var maxAmplitude = this._maxRadius - this._strokeWidth - this._innerCircle.radius;
			this._minLineLength = this._innerCircle.radius + (100 - this._amplitude) / 100 * maxAmplitude;
		}
	}, {
		key: 'amplitude',
		get: function get() {
			return this._rgbMode;
		},
		set: function set(val) {
			this._setAmplitude(val);
		}
	}, {
		key: 'rgbMode',
		get: function get() {
			return this._rgbMode;
		},
		set: function set(val) {
			this._rgbMode = val;
		}
	}, {
		key: 'secondaryColor',
		get: function get() {
			return this._secondaryColor;
		},
		set: function set(val) {
			this._secondaryColor = val;
		}
	}, {
		key: 'strokeWidth',
		get: function get() {
			return this._strokeWidth;
		},
		set: function set(val) {
			this._strokeWidth = val;this._p.strokeWeight(val);
		}
	}, {
		key: 'cycleRate',
		get: function get() {
			return this._cycleRate;
		},
		set: function set(val) {
			this._cycleRate = val;this._p.frameRate(val);
		}
	}, {
		key: 'innerCircleRadius',
		get: function get() {
			return this._innerCircleRadius;
		},
		set: function set(val) {
			this._innerCircle.radius = val > this._maxRadius - this._strokeWidth - this._strokeWidth ? this._maxRadius - this._strokeWidth - this._strokeWidth : val;
			this._setAmplitude(this._amplitude);
		}
	}]);

	return Effect;
}();

var p5 = new p5(function (p) {
	p.effect = new Effect(p, {
		rgbMode: 0,
		secondaryColor: 200,
		strokeWidth: 10,
		circleRadius: 50,
		cycleRate: 30,
		amplitude: 50,
		element: "node"
	});
}, "node");