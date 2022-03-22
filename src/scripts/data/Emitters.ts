import {Emitter, EntityGenerator} from "@/scripts/game/Emitter";
import {Enemies} from "@/scripts/data/Enemies";
import {Vec2} from "@/scripts/engine/Vec2";
import {Bullets} from "@/scripts/data/Bullets";
import {Entities} from "@/scripts/data/Entities";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {Bullet} from "@/scripts/game/Bullet";
import {bulletPool} from "@/scripts/game/ObjectPool";
import {GameScene} from "@/scripts/game/GameScene";
import {Random} from "@/scripts/engine/Random";

export abstract class Emitters {
    static line1(entity: EntityGenerator = Enemies.sniper1): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
        return emitter;
    }

    //不停往反方向喷出会向下掉落的实体
    static fire(emitter: Emitter, entity: EntityGenerator = Bullets.default) {
        emitter.numberAtOnce = 3;
        emitter.fixedAngle = 90;
        emitter.random = true;
        emitter.duration = -1;
        emitter.period = 1;
        emitter.entity = entity;
        emitter.entityDecorator = (entity) => {
            Entities.drop(entity);
        }
        return emitter;
    }

    //三连发
    static three(entity: EntityGenerator = Bullets.default) {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
        emitter.period = 0.1;
        emitter.numberAtOnce = 1;
        emitter.duration = -1;
        const eventList: EntityEventList = new EntityEventList();
        eventList.repeatTime = -1;
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 0, () => {
            emitter.numberAtOnce = 1;
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 0.3, () => {
            emitter.numberAtOnce = 0;
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1.5, () => {

        }));
        emitter.eventList.addEvent(eventList);
        return emitter;
    }

    //定时随机移动到屏幕边缘并随机发射
    static edgeShoot(entity: EntityGenerator = Bullets.default, numberAtOnce = 1, step = 0.5,
                     repeatTime = 10) {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
        emitter.period = -1;
        emitter.numberAtOnce = 1;
        emitter.duration = -1;

        const eventList = new EntityEventList();
        eventList.repeatTime = -1;
        let currentRepeat = 0;
        eventList.addEvent(new EntityEvent(null, () => {
            if(!emitter.active)
                return;
            for (let i = 0; i < numberAtOnce; i++) {
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
                emitter.shoot();
            }
            currentRepeat++;
            if (currentRepeat >= repeatTime)
                emitter.destroy();
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= step, () => {
        }));

        emitter.eventList.addEvent(eventList);
        return emitter;
    }
}
