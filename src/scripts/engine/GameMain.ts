// import {$time} from "@/scripts/engine/Time";
import {Time} from "@/scripts/engine/Time";
import {Fps} from "@/scripts/engine/Fps";
import {Scene} from "@/scripts/engine/Scene";
import {TestScene} from "@/scripts/game/TestScene";
import {Timer} from "@/scripts/engine/Timer";
import {Input} from "@/scripts/engine/Input";

export class GameMain {
    context: CanvasRenderingContext2D;
    fps: Fps;
    scene: Scene = new TestScene();
    fixedTimeStep = 0.016;
    fixedTime = 0;
    resetTime = false;

    constructor(private canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d');
        if (context == null) {
            throw new Error('context为null');
        }

        this.context = context;
        this.fps = new Fps();

    }

    update(): void {
        this.fps.update();
        Input.update();
        this.scene.update();
    }

    fixedUpdate(): void {
        this.scene.fixedUpdate(this.fixedTimeStep);
    }

    draw(): void {
        this.fps.draw(this.context);
        this.scene.draw(this.context);
    }

    gameLoopCallback = (time: number): void => {

        Time.update(time);
        if (this.resetTime) {
            Time.update(time);
            this.resetTime = false;
        }
        // console.log(1);

        // console.log($time.deltaTime);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.font = "40px Arial";
        // this.context.fillText((1000 / Time.deltaTime).toString(), 0, 30);
        this.update();
        // this.scene.fixedUpdate(Time.deltaTime);
        this.fixedTime += Time.deltaTime;
        while (this.fixedTime >= this.fixedTimeStep) {
            this.fixedTime -= this.fixedTimeStep;
            this.fixedUpdate();
        }

        this.draw();
        requestAnimationFrame(this.gameLoopCallback);
        // console.log(this.context);

    }
}
