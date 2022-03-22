import {GameObject} from "@/scripts/engine/GameObject";
import {Container, Graphics, Text} from "pixi.js";
import {Timer} from "@/scripts/engine/Timer";
import {Vec2} from "@/scripts/engine/Vec2";
import {Scene} from "@/scripts/engine/Scene";
import * as TextStyles from "@/scripts/data/TextStyles";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";

//转场
export class Transition extends GameObject {

    display: Container = new Container();
    //转场计时器
    transitionTimer: Timer = new Timer(2);
    //是否入场
    transitionIn = true;

    //转场效果
    transition: Graphics = new Graphics();
    //开场文字
    openText: Text;
    //文字显示计时器
    textTimer: Timer = new Timer(2, false);
    //文字是否淡入
    textIn = true;

    //事件组
    events: EntityEventList = new EntityEventList();

    constructor(pos: Vec2, openText: string = 'Stage 0') {
        super(pos);
        this.openText = new Text(openText, TextStyles.openText);
        this.transitionTimer.timeOverCallback = () => {
            if (this.transitionIn)
                this.transition.y = -1280;
            else
                this.transition.y = 0;
        }

        this.events.addEvent(new EntityEvent(() => this.events.currentPeriodTime >= 2.5,
            () => this.textTimer.reset()));
        this.events.addEvent(new EntityEvent(() => this.events.currentPeriodTime >= 8.5,
            () => {
                this.textTimer.reset();
                this.textIn = false;
            }));
    }

    setScene(scene: Scene) {
        super.setScene(scene);
        this.display.zIndex = 10;
        scene.sortChildren();
    }

    initGraphics(): void {
        this.transition.beginFill(0x0, 1);
        this.transition.drawRect(0, 0, 720, 1280);
        this.transition.endFill();

        this.openText.position.set(360 - this.openText.width / 2, 640 - this.openText.height / 2);
        this.openText.alpha = 0;

        this.display.addChild(this.transition, this.openText);
    }

    update(): void {
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.transitionTimer.update(time);
        this.textTimer.update(time);
        this.events.update(time);

        if (!this.transitionTimer.isOver) {
            if (this.transitionIn) {
                this.transition.y = -1280 * this.transitionTimer.progress;
            } else {
                this.transition.y = 1280 * this.transitionTimer.progress - 1280;
            }
        }

        if (this.transitionIn) {
            if (!this.textTimer.isOver) {
                if (this.textIn) {
                    this.openText.alpha = this.textTimer.progress;
                } else {
                    this.openText.alpha = 1 - this.textTimer.progress;
                }
            }
        }
    }

    triggerOut() {
        this.transitionTimer.reset();
        this.transitionIn = false;
    }
}
