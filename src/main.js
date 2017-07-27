Math.randomBetween = (from, to) => {
		return Math.floor(Math.random() * (to - from + 1) + from);
}

class Circle {
	constructor({
		radius: radius,
		origin: origin
	}) {
		this.radius = radius
		this.origin = origin;
	}

	get Radius() { return this.radius; }

	set Radius(val) { this.radius = val; }

	set Origin(val) { this.origin = val; }

	CoordonatesAtRadian(radian) {
		const cosAngle = Math.cos(radian);
		const sinAngle = Math.sin(radian);

		return {
			x: this.origin + this.radius * cosAngle,
			y: this.origin + this.radius * sinAngle
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
		this.p = p;
		this.rgbMode = rgbMode;
		this.secondaryColor = secondaryColor;
		this.strokeWidth = strokeWidth;
		this.cycleRate = cycleRate;
		
		this.el = document.getElementById(element);

		this.prev = {};
		this.init = {};
		
		const maxDiameter = this.el.offsetWidth < this.el.offsetHeight ? this.el.offsetWidth: this.el.offsetHeight;
		this.maxRadius = maxDiameter / 2;

		this.innerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this.maxRadius
		});

		this.outerCircle = new Circle({
			radius: innerCircleRadius,
			origin: this.maxRadius
		})

		this.setAmplitude(amplitude);

		this.p.frameRate(cycleRate);

		this.p.setup = () => {
			this.trackElementSize();
			const diameter = this.maxRadius * 2;
			this.p.createCanvas(diameter , diameter);
		}

		this.p.windowResized = () => {
			this.trackElementSize();
			const diameter = this.maxRadius * 2;
			this.p.resizeCanvas(diameter, diameter);
		}

		this.p.draw = () => {
			this.p.clear();

			// loop 360/strokeWidth times for a full circle of lines
			for(var lineAngle = 0; lineAngle < 360; lineAngle = lineAngle + this.strokeWidth) {
				this.outerCircle.Radius = Math.randomBetween(this.minLineLength, this.maxRadius - this.strokeWidth)

				const radianAngle = this.p.radians(lineAngle)
				const startCoordonates = this.innerCircle.CoordonatesAtRadian(radianAngle);
				const endCoordonates = this.outerCircle.CoordonatesAtRadian(radianAngle);
				
				this.drawLine(startCoordonates, endCoordonates);	
				this.linkExtremities(lineAngle, endCoordonates);
			}
		}
	}

	trackElementSize() {
		this.maxRadius = (this.el.offsetWidth < this.el.offsetHeight ? this.el.offsetWidth : this.el.offsetHeight) / 2;
		this.innerCircle.Origin = this.maxRadius;
		this.outerCircle.Origin = this.maxRadius;
	}

	linkExtremities(lineAngle, endCoordonates) {
		const isFirstLine = lineAngle == 0;
		if (isFirstLine) {
				this.trackLineExtremitiesAsInitial(endCoordonates);
		} else {
				this.drawPreviousAndCurrentExtremityLink(endCoordonates);
		}

		this.trackLineExtremitiesAsPrevious(endCoordonates);

		const isLastLine = lineAngle + this.strokeWidth > 359;
		if (isLastLine) {
			this.drawCurrentAndInitialExtremityLink(endCoordonates);
		}
	}

	trackLineExtremitiesAsInitial(endCoordonates) {
			this.init.x = endCoordonates.x;
			this.init.y = endCoordonates.y;
	}

	drawPreviousAndCurrentExtremityLink(endCoordonates) {
		this.drawLine(this.prev, endCoordonates);
	}
	
	trackLineExtremitiesAsPrevious(endCoordonates) {
			this.prev.x = endCoordonates.x;
			this.prev.y = endCoordonates.y;
	}

	drawCurrentAndInitialExtremityLink(endCoordonates) {
		this.drawLine(endCoordonates, this.init)
	}

	drawLine(startCoordonates, endCoordonates, newColor = true) {
		if (newColor) {
			this.p.stroke(this.getRandomColor());
		}
		this.p.line(startCoordonates.x, startCoordonates.y, endCoordonates.x, endCoordonates.y);
	}

	getRandomColor() {
		if (this.rgbMode == 0) {
			return this.p.color(Math.randomBetween(0, 256), this.secondaryColor, this.secondaryColor);
		} else if (this.rgbMode == 1) {
			return this.p.color(this.secondaryColor, Math.randomBetween(0, 256), this.secondaryColor);
		} else {
			return this.p.color(this.secondaryColor, this.secondaryColor, Math.randomBetween(0, 256));
		}
	}

	setAmplitude(val) {
		this.amplitude = val;
		const maxAmplitude = (this.maxRadius - this.strokeWidth) - this.innerCircle.radius;
		const hypothecalMinLineLength = (100 - this.amplitude) / 100 * maxAmplitude
		this.minLineLength = hypothecalMinLineLength === 0 ? this.innerCircle.radius : hypothecalMinLineLength;
	}

	get Amplitude() { return this.rgbMode; }
	set Amplitude(val) { this.setAmplitude(val);}
	get RgbMode() { return this.rgbMode; }
	set RgbMode(val) { this.rgbMode = val; }
	get SecondaryColor() { return this.secondaryColor; }
	set SecondaryColor(val) { this.secondaryColor = val; }
	get StrokeWidth() { return this.strokeWidth; }
	set StrokeWidth(val) { this.strokeWidth = val; this.p.strokeWeight(val); }
	get CycleRate() { return this.cycleRate; }
	set CycleRate(val) { this.cycleRate = val; this.p.frameRate(val); }
	get InnerCircleRadius() { return InnerCircleRadius; }
	set InnerCircleRadius(val) { this.innerCircle.Radius = val; }
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