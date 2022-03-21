import {GameObject} from "@/scripts/engine/GameObject";
import {Sprite} from "pixi.js";
import {Scene} from "@/scripts/engine/Scene";
import {Vec2} from "@/scripts/engine/Vec2";

//卷轴背景
export class Background extends GameObject {
    display;
    scene: Scene;
    speed = 50;
    dir = new Vec2(0, 1);
    height = 0;

    constructor(scene: Scene, back: string) {
        super();
        this.scene = scene;
        const texture = this.scene.gameMain.getTexture(back);
        this.display = new Sprite(texture);
        this.display.zIndex = -1;
        this.scene.addChild(this.display);
        this.scene.sortChildren();
        // this.scene.addChild(this.display);

        const height = texture?.height;
        if (height) {
            this.pos = new Vec2(0, 1280 - height);
            this.height = height;
        }
    }

    initGraphics(): void {

    }

    update(): void {

    }

    fixedUpdate(time: number) {
        this.pos = this.pos.add(this.dir.mul(this.speed * time));
        if (this.pos.y >= 0) {
            this.pos = new Vec2(0, 1280 - this.height);
        }
    }
}
