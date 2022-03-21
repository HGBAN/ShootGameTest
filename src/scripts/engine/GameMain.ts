// import {$time} from "@/scripts/engine/Time";
import {Time} from "@/scripts/engine/Time";
import {Fps} from "@/scripts/engine/Fps";
import {Scene} from "@/scripts/engine/Scene";
import {Scene1} from "@/scripts/game/Scene1";
import {Timer} from "@/scripts/engine/Timer";
import {Input} from "@/scripts/engine/Input";
import {TestScene} from "@/scripts/game/TestScene";

import * as PIXI from 'pixi.js';
import {Scene2} from "@/scripts/game/Scene2";

export class GameMain {
    readonly app = new PIXI.Application({width: 720, height: 1280});
    fps: Fps;
    scene?: Scene;
    fixedTimeStep = 0.016;
    fixedTime = 0;
    resetTime = false;
    resources: Map<string, string> = new Map<string, string>();

    constructor() {
        this.app.ticker.add(delta => this.gameLoopCallback(delta));
        this.app.renderer.backgroundColor = 0x36424B;
        this.fps = new Fps();

        this.loadResources().then(()=>{
            this.scene = new Scene2(this);
            this.scene.addObject(this.fps);
            this.app.stage = this.scene;
        });
        // this.scene = new Scene1(this);
        // this.scene = new TestScene(this);
    }

    loadResources() {
        return new Promise((resolve) => {
            this.resources.set('player_bullet', require('@/assets/player_bullet.png'));
            this.resources.set('bullet_1', require('@/assets/1.png'));
            this.resources.set('bullet_2', require('@/assets/2.png'));
            this.resources.set('bullet_3', require('@/assets/3.png'));
            this.resources.set('back_1', require('@/assets/back_1.png'));

            for (const path of this.resources.values()) {
                this.app.loader.add(path);
            }
            this.app.loader.load(()=>{
                resolve(null);
            });
        });
    }

    getTexture(key: string) {
        const path = this.resources.get(key);
        if (!path)
            return undefined;
        return this.app.loader.resources[path].texture;
    }

    update(): void {
        this.fps.update();
        Input.update();
        this.scene?.update();
    }

    fixedUpdate(): void {
        this.scene?.fixedUpdate(this.fixedTimeStep);
    }

    // draw(): void {
    // this.fps.draw(this.context);
    // this.scene.draw(this.context);
    // }

    gameLoopCallback = (delta: number): void => {
        let time = (delta / 60);
        if (this.resetTime) {
            time = 0;
            this.resetTime = false;
        }

        Time.update(time);
        // if (this.resetTime) {
        //     Time.update(time);
        //     this.resetTime = false;
        // }

        this.update();

        this.fixedTime += Time.deltaTime;
        while (this.fixedTime >= this.fixedTimeStep) {
            this.fixedTime -= this.fixedTimeStep;
            this.fixedUpdate();
        }
    }
}
