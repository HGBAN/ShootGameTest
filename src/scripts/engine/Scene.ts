import {GameObject} from "@/scripts/engine/GameObject";

import * as PIXI from 'pixi.js';

export const SSCD = require('sscd').sscd;

export class Scene extends PIXI.Container{
    objects: Set<GameObject> = new Set<GameObject>();
    collisionWorld: any = new SSCD.World({grid_size:200});

    addObject(obj: GameObject): void {
        obj.setScene(this);
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

    // draw(ctx: CanvasRenderingContext2D): void {
    //     for (const obj of this.objects) {
    //         obj.draw(ctx);
    //     }
    // }
}
