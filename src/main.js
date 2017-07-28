Math.randomBetween = (from, to) => {
		return Math.floor(Math.random() * (to - from + 1) + from);
}

class Circle {
	constructor({
		radius: radius,
		origin: origin
	}) {
		this._radius = radius
		this._origin = origin;
	}

	get radius() { return this._radius; }
	set radius(val) { this._radius = val; }
	set origin(val) { this._origin = val; }

	CoordonatesAtRadian(radian) {
		const cosAngle = Math.cos(radian);
		const sinAngle = Math.sin(radian);

		return {
			x: this._origin + this._radius * cosAngle,
			y: this._origin + this._radius * sinAngle
		}
	}
}

class Effect {
	constructor(p, {
		rgbMode: rgbMode = 0,
		secondaryColor: secondaryColor = 200,
		strokeWidth: strokeWidth = 4,
		innerCircleRadius: innerCircleRadius = 20,
		cycleRate: cycleRate = 8,
		amplitude: amplitude = 90,
		element: element = "effect"
	}={}) {
		this._p = p;
		this._rgbMode = rgbMode;
		this._secondaryColor = secondaryColor;
		this._strokeWidth = strokeWidth;
		this._cycleRate = cycleRate;
		
		this._el = document.getElementById(element);

		this._prev = {};
		this._init = {};
		
		const maxDiameter = this._el.offsetWidth < this._el.offsetHeight ? this._el.offsetWidth: this._el.offsetHeight;
		this._maxRadius = maxDiameter / 2;

		this._innerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this._maxRadius
		});

		this._outerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this._maxRadius
		})

		this._setAmplitude(amplitude);

		this._p.frameRate(cycleRate);

		this._events = {
			beforeSetup: new Event('beforeSetup'),
			afterSetup: new Event('afterSetup'),
			beforeResize: new Event('beforeResize'),
			afterResize: new Event('afterResize'),
			beforeDraw: new Event('beforeDraw'),
			afterDraw: new Event('afterDraw'),
			onLineDraw: new Event('onLineDraw'),
		}

		this._p.setup = () => {
			this._el.dispatchEvent(this._events.beforeSetup);
			this._trackElementSize();
			const diameter = this._maxRadius * 2;
			this._p.createCanvas(diameter , diameter);
			this._el.dispatchEvent(this._events.afterSetup);
		}

		this._p.windowResized = () => {
			this._el.dispatchEvent(this._events.beforeResize);
			this._trackElementSize();
			const diameter = this._maxRadius * 2;
			this._p.resizeCanvas(diameter, diameter);
			this._el.dispatchEvent(this._events.afterResize);
		}

		this._p.draw = () => {
			this._el.dispatchEvent(this._events.beforeDraw);
			this._p.clear();

			for(var lineAngle = 0; lineAngle < 360; lineAngle = lineAngle + this._strokeWidth) {
				this._outerCircle.radius = Math.randomBetween(this._minLineLength, this._maxRadius - this._strokeWidth)

				const radianAngle = this._p.radians(lineAngle)
				const startCoordonates = this._innerCircle.CoordonatesAtRadian(radianAngle);
				const endCoordonates = this._outerCircle.CoordonatesAtRadian(radianAngle);
				
				this._drawLine(startCoordonates, endCoordonates);	
				this._linkExtremities(lineAngle, endCoordonates);
			}
			this._el.dispatchEvent(this._events.afterDraw);
		}
	}

	_trackElementSize() {
		this._maxRadius = (this._el.offsetWidth < this._el.offsetHeight ? this._el.offsetWidth : this._el.offsetHeight) / 2;
		this._innerCircle.origin = this._maxRadius;
		this._outerCircle.origin = this._maxRadius;
	}

	_linkExtremities(lineAngle, endCoordonates) {
		const isFirstLine = lineAngle == 0;
		if (isFirstLine) {
				this._trackLineExtremitiesAsInitial(endCoordonates);
		} else {
				this._drawPreviousAndCurrentExtremityLink(endCoordonates);
		}

		this._trackLineExtremitiesAsPrevious(endCoordonates);

		const isLastLine = lineAngle + this._strokeWidth > 359;
		if (isLastLine) {
			this._drawCurrentAndInitialExtremityLink(endCoordonates);
		}
	}

	_trackLineExtremitiesAsInitial(endCoordonates) {
			this._init.x = endCoordonates.x;
			this._init.y = endCoordonates.y;
	}

	_drawPreviousAndCurrentExtremityLink(endCoordonates) {
		this._drawLine(this._prev, endCoordonates);
	}
	
	_trackLineExtremitiesAsPrevious(endCoordonates) {
			this._prev.x = endCoordonates.x;
			this._prev.y = endCoordonates.y;
	}

	_drawCurrentAndInitialExtremityLink(endCoordonates) {
		this._drawLine(endCoordonates, this._init)
	}

	_drawLine(startCoordonates, endCoordonates, newColor = true) {
		if (newColor) {
			this._p.stroke(this._getRandomColor());
		}
		this._el.dispatchEvent(this._events.onLineDraw);
		this._p.line(startCoordonates.x, startCoordonates.y, endCoordonates.x, endCoordonates.y);
	}

	_getRandomColor() {
		if (this._rgbMode == 0) {
			return this._p.color(Math.randomBetween(0, 256), this._secondaryColor, this._secondaryColor);
		} else if (this._rgbMode == 1) {
			return this._p.color(this._secondaryColor, Math.randomBetween(0, 256), this._secondaryColor);
		} else {
			return this._p.color(this._secondaryColor, this._secondaryColor, Math.randomBetween(0, 256));
		}
	}

	_setAmplitude(val) {
		this._amplitude = val;
		const maxAmplitude = (this._maxRadius - this._strokeWidth) - this._innerCircle.radius;
		this._minLineLength = this._innerCircle.radius + (100 - this._amplitude) / 100 * maxAmplitude;
	}

	get amplitude() { return this._rgbMode; }
	set amplitude(val) { this._setAmplitude(val);}
	get rgbMode() { return this._rgbMode; }
	set rgbMode(val) { this._rgbMode = val; }
	get secondaryColor() { return this._secondaryColor; }
	set secondaryColor(val) { this._secondaryColor = val; }
	get strokeWidth() { return this._strokeWidth; }
	set strokeWidth(val) { this._strokeWidth = val; this._p.strokeWeight(val); }
	get cycleRate() { return this._cycleRate; }
	set cycleRate(val) { this._cycleRate = val; this._p.frameRate(val); }
	get innerCircleRadius() { return this._innerCircleRadius; }
	set innerCircleRadius(val) { 
		this._innerCircle.radius = val > this._maxRadius  - this._strokeWidth - this._strokeWidth ? this._maxRadius  - this._strokeWidth - this._strokeWidth : val; 
		this._setAmplitude(this._amplitude);
	}
}	

const p5 = new p5(p => {
	p.effect = new Effect(p, {
		rgbMode:  0,
		secondaryColor: 200,
		strokeWidth: 10,
		circleRadius: 50,
		cycleRate: 12,
		amplitude: 5,
		element: "node"
	});
}, "node");