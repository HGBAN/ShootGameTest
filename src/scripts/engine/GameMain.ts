// import {$time} from "@/scripts/engine/Time";
import {Time} from "@/scripts/engine/Time";
import {Fps} from "@/scripts/engine/Fps";
import {Scene} from "@/scripts/engine/Scene";
import {Scene1} from "@/scripts/game/Scene1";
import {Timer} from "@/scripts/engine/Timer";
import {Input} from "@/scripts/engine/Input";
import {TestScene} from "@/scripts/game/TestScene";

import * as PIXI from 'pixi.js';

export class GameMain {
    readonly app = new PIXI.Application({width: 720, height: 1280});
    fps: Fps;
    scene: Scene;
    fixedTimeStep = 0.016;
    fixedTime = 0;
    resetTime = false;

    constructor() {
        this.app.ticker.add(delta => this.gameLoopCallback(delta));
        this.app.renderer.backgroundColor = 0x36424B;
        this.fps = new Fps();
        this.scene = new Scene1(this);
        this.scene.addObject(this.fps);
        this.app.stage = this.scene;


        this.app.loader.add(require('@/assets/1.png')).load();
        // console.log(this.app.loader.resources[require('@/assets/1.png')])
    }

    update(): void {
        this.fps.update();
        Input.update();
        this.scene.update();
    }

    fixedUpdate(): void {
        this.scene.fixedUpdate(this.fixedTimeStep);
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
