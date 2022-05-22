import {Scene} from "@/scripts/engine/Scene";
import {Bullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {Emitter} from "@/scripts/game/Emitter";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation, PropTween} from "@/scripts/engine/PropTransformer";
import {BulletEmitters} from "@/scripts/data/BulletEmitters";
import {Player} from "@/scripts/game/Player";
import {Enemy} from "@/scripts/game/Enemy";
import {EnemyEmitters} from "@/scripts/data/EnemyEmitters";
import {GameObject} from "@/scripts/engine/GameObject";
import {Enemies} from "@/scripts/data/Enemies";
import {Random} from "@/scripts/engine/Random";
import {PlayerUI} from "@/scripts/ui/PlayerUI";
import {GameScene} from "@/scripts/game/GameScene";
import {GameMain} from "@/scripts/engine/GameMain";
import {bulletPool} from "@/scripts/game/ObjectPool";
import {Background} from "@/scripts/game/Background";
import {Bullets} from "@/scripts/data/Bullets";
import {Emitters} from "@/scripts/data/Emitters";
import {SceneRandom} from "@/scripts/scenes/SceneRandom";
import {Scene3} from "@/scripts/scenes/Scene3";

export class Scene2 extends GameScene {
    back: Background;

    levelName = 'Stage 2';

    // events: EntityEventList = new EntityEventList();

    constructor(gameMain: GameMain, player?: Player) {
        super(gameMain, player);
        this.transition.openText.text = this.levelName;

        this.back = new Background(this, 'back_1');
        this.addObject(this.back);

        const explosionEnemy = Enemies.explosion.bind(undefined, this);

        this.events.addEvent(new EntityEvent(() => this.time >= 1, () => {
            let emitter: Emitter = Emitters.sin(explosionEnemy);
            emitter.pos = new Vec2(0, 100);
            emitter.duration = 5;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            this.addObject(emitter);

            emitter = Emitters.sin(explosionEnemy);
            emitter.pos = new Vec2(720, 200);
            emitter.duration = 5;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = 180;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 8, () => {
            const emitter: Emitter = Emitters.line1();
            emitter.pos = new Vec2(100, 1280);
            emitter.duration = 3;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = -90;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 12, () => {
            const emitter: Emitter = Emitters.line1(Enemies.fire);
            emitter.pos = new Vec2(720, 300);
            emitter.duration = 6;
            emitter.period = 2;
            emitter.numberAtOnce = 1;
            emitter.angle = 180;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 24, () => {
            const emitter: Emitter = Emitters.line1(Enemies.unDownThree);
            emitter.pos = new Vec2(0, 200);
            emitter.duration = 4;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = 0;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 28, () => {
            const emitter: Emitter = Emitters.sin(explosionEnemy);
            emitter.pos = new Vec2(720, 100);
            emitter.duration = 5;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = 120;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 32, () => {
            const emitter: Emitter = Emitters.line1();
            emitter.pos = new Vec2(620, 0);
            emitter.duration = 4;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = 90;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 34, () => {
            const emitter: Emitter = Emitters.sin(explosionEnemy);
            emitter.pos = new Vec2(0, 200);
            emitter.duration = 5;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = 60;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 38, () => {
            let emitter: Emitter = Emitters.line1(Enemies.unDownThree);
            emitter.pos = new Vec2(720, 100);
            emitter.duration = 8;
            emitter.period = 2;
            emitter.numberAtOnce = 1;
            emitter.angle = 180;
            this.addObject(emitter);

            emitter = Emitters.line1(Enemies.unDownThree);
            emitter.pos = new Vec2(0, 200);
            emitter.duration = 8;
            emitter.period = 2;
            emitter.numberAtOnce = 1;
            emitter.angle = 0;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 47, () => {
            const emitter: Emitter = Emitters.line1(Enemies.randomCircle);
            emitter.pos = new Vec2(360, 0);
            emitter.duration = 1;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = 90;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 54, () => {
            const emitter: Emitter = Emitters.line1(Enemies.lineRandom);
            emitter.pos = new Vec2(0, 200);
            emitter.duration = 4;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = 30;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 59, () => {
            const emitter: Emitter = Emitters.sin(explosionEnemy);
            emitter.pos = new Vec2(360, 0);
            emitter.duration = 5;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = 90;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 63, () => {
            const emitter: Emitter = Emitters.line1();
            emitter.pos = new Vec2(620, 1280);
            emitter.duration = 4;
            emitter.period = 1;
            emitter.numberAtOnce = 1;
            emitter.angle = -90;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 65, () => {
            const emitter: Emitter = Emitters.line1(Enemies.unDownThree);
            emitter.pos = new Vec2(0, 200);
            emitter.duration = 8;
            emitter.period = 2;
            emitter.numberAtOnce = 1;
            emitter.angle = 0;
            this.addObject(emitter);
        }));

        this.events.addEvent(new EntityEvent(() => this.time >= 74, () => {
            const emitter: Emitter = Emitters.line1(Enemies.shot);
            emitter.pos = new Vec2(0, 300);
            emitter.duration = 8;
            emitter.period = 2;
            emitter.numberAtOnce = 1;
            emitter.angle = 0;
            this.addObject(emitter);
        }));


        let boss: Enemy | undefined = undefined;
        this.events.addEvent(new EntityEvent(() => this.time >= 84, () => {
            boss = Enemies.boss2(this);
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
                // alert(`恭喜！您的分数为${Player.score}。本游戏还处于测试阶段，目前就做到这里。请等待后续更新，有什么意见欢迎提出。`);
                this.gameMain.setScene(new Scene3(this.gameMain, this.player));
            }));
        }));
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        // this.events.update(time);
    }

    createCurrentScene(): GameScene {
        return new Scene2(this.gameMain, this.player);
    }
}
