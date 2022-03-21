import {Bullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";

export class ObjectPool<T> {
    stack: Array<T> = [];

    createCallback: () => T;

    constructor(create: () => T) {
        this.createCallback = create;
    }

    get(): T {
        const obj = this.stack.pop();
        if (obj) {
            return obj;
        } else {
            return this.createCallback();
        }
    }

    push(obj: T) {
        this.stack.push(obj);
        // console.log(this.queue.length);
    }
}

export const bulletPool = new ObjectPool<Bullet>(() => {
    return new Bullet(Vec2.zero);
});
