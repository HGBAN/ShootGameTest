import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {Player} from "@/scripts/game/Player";
import {Enemy} from "@/scripts/game/Enemy";
import {Enemies} from "@/scripts/data/Enemies";
import {GameScene} from "@/scripts/game/GameScene";
import {GameMain} from "@/scripts/engine/GameMain";
import {SceneRandom} from "@/scripts/scenes/SceneRandom";
import {Scene2} from "@/scripts/scenes/Scene2";
import {Scene3} from "@/scripts/scenes/Scene3";

export class BossScene extends GameScene {
    // back: Background;

    levelName = 'Boss Stage';

    bossType: string;

    // events: EntityEventList = new EntityEventList();

    constructor(gameMain: GameMain, bossType: string, player?: Player) {
        super(gameMain, player);
        this.bossType = bossType;
        // console.log(this.transition.openText.width)
        this.transition.openText.text = this.levelName;
        this.transition.updateTextPos();
        // console.log(this.transition.openText.width)

        if (bossType == '1') {
            let boss: Enemy | undefined;
            this.events.addEvent(new EntityEvent(() => this.time >= 2, () => {
                boss = Enemies.boss1(this);
                boss.pos = new Vec2(360, 0);
                boss.angle = 90;
                this.addObject(boss);
            }));
        } else if (bossType == '2') {
            let boss: Enemy | undefined = undefined;
            this.events.addEvent(new EntityEvent(() => this.time >= 2, () => {
                boss = Enemies.boss2(this);
                boss.pos = new Vec2(360, 0);
                boss.angle = 90;
                this.addObject(boss);
            }));
        } else if (bossType == '3') {
            let boss: Enemy | undefined = undefined;
            this.events.addEvent(new EntityEvent(() => this.time >= 2, () => {
                boss = Enemies.boss3(this);
                boss.pos = new Vec2(360, 0);
                boss.angle = 90;
                this.addObject(boss);
            }));
        }
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        // this.events.update(time);
    }

    createCurrentScene(): GameScene {
        return new BossScene(this.gameMain, this.bossType, this.player);
    }
}
