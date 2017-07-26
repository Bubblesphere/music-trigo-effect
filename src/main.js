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

	CoordonateAtRadian(radian) {
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
			for(var i = 0; i < 360; i = i + this.StrokeWidth) {
					this.drawLine(i);
			}
		}
	}
	
	trackElementSize() {
		this.maxRadius = (this.el.offsetWidth < this.el.offsetHeight ? this.el.offsetWidth : this.el.offsetHeight) / 2;
		this.innerCircle.Origin = this.maxRadius;
		this.outerCircle.Origin = this.maxRadius;
	}

	drawLine(lineAngle) {
			this.outerCircle.Radius = Math.randomBetween(this.innerCircle.radius, this.maxRadius - this.strokeWidth)

			const radianAngle = this.p.radians(lineAngle)
			const start = this.innerCircle.CoordonateAtRadian(radianAngle);
			const end = this.outerCircle.CoordonateAtRadian(radianAngle);
			
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

	getRandomColor() {
		if (this.rgbMode == 0) {
			return this.p.color(Math.randomBetween(0, 256), this.secondaryColor, this.secondaryColor);
		} else if (this.rgbMode == 1) {
			return this.p.color(this.secondaryColor, Math.randomBetween(0, 256), this.secondaryColor);
		} else {
			return this.p.color(this.secondaryColor, this.secondaryColor, Math.randomBetween(0, 256));
		}
	}

	get RgbMode() { return this.rgbMode; }
	set RgbMode(val) { this.rgbMode = val; }

	get SecondaryColor() { return this.secondaryColor; }
	set SecondaryColor(val) { this.secondaryColor = val; }

	get StrokeWidth() { return this.strokeWidth; }
	set StrokeWidth(val) { this.strokeWidth = val; }

	get CycleRate() { return this.cycleRate; }
	set CycleRate(val) { this.cycleRate = val; }

	set InnerCircleRadius(val) { 
		this.innerCircle.Radius = val; 
	}
}	

new p5(p => {
	new Effect(p, {
		rgbMode:  0,
		secondaryColor: 200,
		strokeWidth: 10,
		circleRadius: 50,
		cycleRate: 1,
		element: "node"
	});
}, "node");