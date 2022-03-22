import {GameObject} from "@/scripts/engine/GameObject";
import {Graphics} from "pixi.js";
import {Timer} from "@/scripts/engine/Timer";
import {Vec2} from "@/scripts/engine/Vec2";
import {Scene} from "@/scripts/engine/Scene";

//转场
export class Transition extends GameObject {
    //转场效果
    display: Graphics = new Graphics();
    //转场计时器
    transitionTimer: Timer = new Timer(2);
    //是否入场
    transitionIn = true;

    constructor(pos: Vec2) {
        super(pos);
        this.transitionTimer.timeOverCallback = () => {
            this.display.y = -1280;
        }
    }

    setScene(scene: Scene) {
        super.setScene(scene);
        this.display.zIndex = 10;
        scene.sortChildren();
    }

    initGraphics(): void {
        this.display.beginFill(0x0, 1);
        this.display.drawRect(0, 0, 720, 1280);
        this.display.endFill();
    }

    update(): void {
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.transitionTimer.update(time);

        if (!this.transitionTimer.isOver) {
            if (this.transitionIn) {
                this.display.y = -1280 * this.transitionTimer.progress;
            } else {
                this.display.y = 1280 * this.transitionTimer.progress - 1280;
            }
        }
    }
}
