import {GameObject} from "@/scripts/engine/GameObject";
import {Timer} from "@/scripts/engine/Timer";
import {Time} from "@/scripts/engine/Time";
import {Vec2} from "@/scripts/engine/Vec2";

import * as PIXI from 'pixi.js';
import * as Fonts from '../data/TextStyles'

export class Fps extends GameObject {
    private _interval: number;
    private timer: Timer;
    private _fps = 0;
    display = new PIXI.Text('FPS:0', Fonts.fpsText);

    constructor(pos: Vec2 = new Vec2(0, 30), interval = 0.5) {
        super(pos);
        this._interval = interval;
        this.timer = new Timer(this._interval);
        this.timer.timeOverCallback = () => {
            this._fps = 1 / Time.deltaTime * Time.timeScale;
            this.timer.reset();
        };
        this.initGraphics();
    }

    set interval(interval: number) {
        this._interval = interval;
    }

    // draw(ctx: CanvasRenderingContext2D): void {
    //     ctx.lineWidth = 2;
    //     ctx.fillStyle = "#000";
    //     ctx.fillText('FPS:' + this._fps.toFixed(2), this.pos.x, this.pos.y);
    // }

    update(): void {
        this.timer.update();
        this.display.text = 'FPS:' + this._fps.toFixed(2);
    }

    initGraphics(): void {
        this.display.position.set(0, 0);
    }
}
