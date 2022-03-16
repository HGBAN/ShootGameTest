import {GameObject} from "@/scripts/engine/GameObject";

export const SSCD = require('sscd').sscd;

export class Scene {
    objects: Set<GameObject> = new Set<GameObject>();
    collisionWorld: any = new SSCD.World();

    addObject(obj: GameObject): void {
        obj.scene = this;
        this.objects.add(obj);
    }

    update(): void {
        for (const obj of this.objects) {
            obj.update();
        }
    }

    fixedUpdate(time: number): void {
        for (const obj of this.objects) {
            obj.fixedUpdate(time);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (const obj of this.objects) {
            obj.draw(ctx);
        }
    }
}
