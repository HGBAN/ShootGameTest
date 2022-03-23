import {Vec2} from "@/scripts/engine/Vec2";
import {Emitter} from "@/scripts/game/Emitter";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {Player} from "@/scripts/game/Player";
import {Enemy} from "@/scripts/game/Enemy";
import {EnemyEmitters} from "@/scripts/data/EnemyEmitters";
import {GameObject} from "@/scripts/engine/GameObject";
import {Enemies} from "@/scripts/data/Enemies";
import {GameScene} from "@/scripts/game/GameScene";
import {GameMain} from "@/scripts/engine/GameMain";
import {Scene2} from "@/scripts/scenes/Scene2";
import {Random} from "@/scripts/engine/Random";
import {Background} from "@/scripts/game/Background";

export class SceneRandom extends GameScene {
    numberAtOnce = 1;
    step = 1.5;

    back: Background;

    constructor(gameMain: GameMain, player?: Player) {
        super(gameMain, player);
        this.player.elimination = 1;
        this.player.rubValue = 0;
        Player.score = 0;
        Player.rubTimes = 0;

        this.transition.openText.text = 'Stage ?';

        this.back = new Background(this, 'back_1');
        this.addObject(this.back);

        const enemies = [Enemies.lineRandom, Enemies.unDownThree,
            Enemies.explosion.bind(undefined, this), Enemies.sniper1, Enemies.shot,
            Enemies.circle2, Enemies.sin1, Enemies.fire];

        const emitter: Emitter = new Emitter(Vec2.zero, Enemies.sniper1);
        emitter.period = -1;
        emitter.numberAtOnce = 1;
        emitter.duration = -1;

        const eventList = new EntityEventList();
        eventList.repeatTime = -1;
        let currentRepeat = 0;
        eventList.addEvent(new EntityEvent(null, () => {
            if (!emitter.active)
                return;
            for (let i = 0; i < this.numberAtOnce; i++) {
                //0右，1下，2左，3上
                const type = Random.range(0, 3);
                let x: number, y: number, angle: number;
                if (type == 0) {
                    [x, y, angle] = [720, Random.range(0, 1280), Random.range(120, 240)];
                } else if (type == 1) {
                    [x, y, angle] = [Random.range(0, 720), 1280, Random.range(210, 330)];
                } else if (type == 2) {
                    [x, y, angle] = [0, Random.range(0, 1280), Random.range(-60, 60)];
                } else {
                    [x, y, angle] = [Random.range(0, 720), 0, Random.range(30, 150)];
                }
                emitter.pos = new Vec2(x, y);
                emitter.angle = angle;
                emitter.entity = enemies[Random.range(0, enemies.length - 1)];
                emitter.shoot();
            }
            currentRepeat++;
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= this.step, () => {
        }));

        emitter.eventList.addEvent(eventList);

        this.events.addEvent(new EntityEvent(() => this.player ? this.player.dead : false, () => {
            const time = this.time;
            this.events.addEvent(new EntityEvent(() => this.time - time >= 2, () => {
                alert(`您的分数为${Player.score}`);
            }));
        }));

        this.addObject(emitter);
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.events.update(time);
    }

    addObject(obj: GameObject) {
        super.addObject(obj);
    }

    createCurrentScene(): GameScene {
        return new SceneRandom(this.gameMain);
    }
}
