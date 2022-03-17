import {IndexObject} from "@/scripts/engine/PropTransformer";

export class Vec2 implements IndexObject {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static get zero(): Vec2 {
        return new Vec2(0, 0);
    }

    add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    sub(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    mul(num: number): Vec2 {
        return new Vec2(this.x * num, this.y * num);
    }

    get normalize(): Vec2 {
        const dis = this.dis;
        if (dis == 0)
            return Vec2.zero;
        return new Vec2(this.x / dis, this.y / dis);
    }

    get dis(): number {
        return Math.sqrt(this.disSquare);
    }

    get disSquare(): number {
        return this.x * this.x + this.y * this.y;
    }

    addAngle(angle: number): Vec2 {
        const rad = angle * Math.PI / 180;
        const v = this.normalize;
        const [cosA, sinA] = [Math.cos(rad), Math.sin(rad)];
        return new Vec2(cosA * v.x - sinA * v.y, sinA * v.x + cosA * v.y);
    }

    get clone() {
        return new Vec2(this.x, this.y);
    }

    equals(other: Vec2) {
        return this.x == other.x && this.y == other.y;
    }
}
