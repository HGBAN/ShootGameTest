export class Color {
    r = 0;
    g = 0;
    b = 0;

    constructor(r: number, g: number, b: number);
    constructor(colorStr: string);

    constructor(rOrStr: any = 0, g: number = 0, b: number = 0) {
        if (typeof rOrStr == 'number') {
            this.r = Math.floor(rOrStr);
            this.g = Math.floor(g);
            this.b = Math.floor(b);
        } else if (typeof rOrStr == 'string') {
            const str = rOrStr.substr(1);
            const rStr = str.substr(0, 2);
            const gStr = str.substr(2, 2);
            const bStr = str.substr(4, 2);
            this.r = parseInt(rStr, 16);
            this.g = parseInt(gStr, 16);
            this.b = parseInt(bStr, 16);
        }
    }

    mix(other: Color, alpha: number = 0.5): Color {
        return new Color(this.mixChannel(this.r, other.r, alpha),
            this.mixChannel(this.g, other.g, alpha),
            this.mixChannel(this.b, other.b, alpha));
    }

    mixChannel(a: number, b: number, alpha: number = 0.5) {
        return a * alpha + b * (1 - alpha);
    }

    toString() {
        return '#' + this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
    }

    valueOf() {
        let result = this.r;
        result = (result << 8) + this.g;
        result = (result << 8) + this.b;
        return result;
    }
}
