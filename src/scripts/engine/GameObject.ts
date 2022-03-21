import {Vec2} from "@/scripts/engine/Vec2";
import {Scene} from "@/scripts/engine/Scene";

import * as PIXI from 'pixi.js';

export abstract class GameObject {
    protected _pos: Vec2;
    scene: Scene | null = null;
    dead = false;
    display?: PIXI.DisplayObject;

    protected constructor(pos: Vec2 = Vec2.zero) {
        // this.scene = scene;
        this._pos = pos;
        // this.initGraphics();
    }

    set pos(value: Vec2) {
        this._pos = value;
        this.display?.position.set(this.pos.x, this.pos.y);
    }

    get pos() {
        return this._pos;
    }

    abstract update(): void;

    abstract initGraphics(): void;

    // abstract draw(ctx: CanvasRenderingContext2D): void;

    fixedUpdate(time: number): void {

    }

    destroy(): void {
        if (this.scene) {
            this.scene.objects.delete(this);
            if (this.display)
                this.scene.removeChild(this.display);
        }
        this.dead = true;
    }

    setScene(scene: Scene) {
        this.scene = scene;
        this.initGraphics();
        if (this.display)
            this.scene.addChild(this.display);
    }
}
