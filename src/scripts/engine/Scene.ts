import {GameObject} from "@/scripts/engine/GameObject";

import * as PIXI from 'pixi.js';
import {GameMain} from "@/scripts/engine/GameMain";
import {Graphics} from "pixi.js";
import {Timer} from "@/scripts/engine/Timer";
import {Transition} from "@/scripts/game/Transition";
import {Vec2} from "@/scripts/engine/Vec2";

export const SSCD = require('sscd').sscd;

export class Scene extends PIXI.Container {
    objects: Set<GameObject> = new Set<GameObject>();
    objectsWithTag: Map<string, Set<GameObject>>;
    collisionWorld: any = new SSCD.World({grid_size: 200});
    gameMain: GameMain;
    transition: Transition = new Transition(Vec2.zero);

    constructor(gameMain: GameMain) {
        super();
        this.objectsWithTag = new Map<string, Set<GameObject>>();
        this.gameMain = gameMain;
        this.sortableChildren = true;
        this.addObject(this.transition);
    }

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
        this.transition.fixedUpdate(time);
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
