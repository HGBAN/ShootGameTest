import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {Player} from "@/scripts/game/Player";
import {Enemy} from "@/scripts/game/Enemy";
import {Enemies} from "@/scripts/data/Enemies";
import {GameScene} from "@/scripts/game/GameScene";
import {GameMain} from "@/scripts/engine/GameMain";
import {SceneRandom} from "@/scripts/scenes/SceneRandom";

export class Scene3 extends GameScene {
    // back: Background;

    levelName = 'Stage 3';

    // events: EntityEventList = new EntityEventList();

    constructor(gameMain: GameMain, player?: Player) {
        super(gameMain, player);
        this.transition.openText.text = this.levelName;
        this.transition.updateTextPos();

        let boss: Enemy | undefined = undefined;
        this.events.addEvent(new EntityEvent(() => this.time >= 2, () => {
            boss = Enemies.boss3(this);
            boss.pos = new Vec2(360, 0);
            boss.angle = 90;
            this.addObject(boss);
        }));

        this.events.addEvent(new EntityEvent(() => boss ? boss.dead : false, () => {
            const time = this.time;
            this.events.addEvent(new EntityEvent(() => this.time - time >= 2, () => {
                this.transition.triggerOut();
            }));
            this.events.addEvent(new EntityEvent(() => this.time - time >= 4, () => {
                this.gameMain.highScore = Player.score;
                this.gameMain.level = this.levelName;
                this.gameMain.rubTimes = Player.rubTimes;
                this.gameMain.updateGameRecord();
                alert(`恭喜！您的分数为${Player.score}。本游戏还处于测试阶段，目前就做到这里。请等待后续更新，有什么意见欢迎提出。`);
                this.gameMain.setScene(new SceneRandom(this.gameMain));
            }));
        }));
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        // this.events.update(time);
    }

    createCurrentScene(): GameScene {
        return new Scene3(this.gameMain, this.player);
    }
}
